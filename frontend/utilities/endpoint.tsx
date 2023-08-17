import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getCacheUser, getUser, hasPermission } from "./db";
import { ModelSchema } from "@/data/schema";
import { z } from "zod";
import { authOptions } from "@/pages/api/auth/[...nextauth]";


export type Handler<D, S = any> = {
    (req: NextApiRequest, res: NextApiResponse<D | EndpointError>): Promise<S>
}


export type EndpointError = {
    type: "User" | "Permission"
    error: string
}

export type APIFunction<S> = {
    (params: S): Promise<any>
}

export type EndpointParamsBase<D> = {
    req: NextApiRequest
    res: NextApiResponse<D | EndpointError>
}

export type GetParams<D, S> = {
    ({req, res, error}: {
        req: NextApiRequest,
        res: NextApiResponse<D | EndpointError>
        error: (code: number, error: EndpointError) => any
    }): Promise<S>
}

export type Endpoint<D, S> = {
    getParams: GetParams<D, S>
    get: APIFunction<EndpointParamsBase<D> & S>
    post?: APIFunction<EndpointParamsBase<D> & S>
    delete?: APIFunction<EndpointParamsBase<D> & S>
}

async function getUserType(email: string, cacheUser: boolean): Promise<User | null> {
    if (cacheUser) {
        return await getCacheUser(email);
    }
    return await getUser(email);
}

async function delegate<D, S>(method: string, endpoint: Endpoint<D, S>, params: S & EndpointParamsBase<D>): Promise<any> {
    if (method === "POST" && endpoint.post) {
        return await endpoint.post(params);
    }
    else if (method === "GET" && endpoint.get) {
        return await endpoint.get(params);
    }
    else if (method === "DELETE" && endpoint.delete) {
        return await endpoint.delete(params);
    }
}

export function reqPerm<K extends keyof User, D>(perm: K | K[], func: APIFunction<EndpointParamsBase<D> & {user: User}>): APIFunction<EndpointParamsBase<D>  & {user: User}> {
    const permissions = typeof perm === "string" ? [perm] : perm;
    return async (params) => {
        for (const perm of permissions) {
            if (!(await hasPermission(params.user!, perm))) {
                
                params.res.status(400).json({type: "Permission", error: `User does not have permission "${perm}"`});
                return;
            }
        }
        return await func(params);
    }
}

export function userParams<D>(cacheUser?: boolean): GetParams<D, {user: User}> {
    return async ({req, res, error}) => {
        const session = await getServerSession(req, res, authOptions as any) as any;
        if (session === null) {
            return error(500, {
                type: "User",
                error: "Session not found for current user"
            });
        }
        const user = await getUserType(session.user?.email!, cacheUser || false);
        if (user === null) {
            return error(500, {
                type: "User",
                error: "Could not find required user information"
            });
        }
        return {user: user};
    }
}

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function endpoint<D, S>(point: Endpoint<D, S>): Handler<D> {
    return async (req, res) => {
        let isError = false;
        const error = (code: number, error: EndpointError) => {
            isError = true;
            res.status(code).json(error);
        };
        const innerParams = await point.getParams({req, res, error});
        if (isError) {
            return;
        }
        const params = {req, res, ...innerParams};
        return await delegate(req.method!, point, params);
    }
}