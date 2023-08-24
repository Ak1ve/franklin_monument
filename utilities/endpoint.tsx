import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getCacheUser, getUser, hasPermission } from "./db";
import Cache from "timed-cache";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { extractProp } from "./form";
import { getOrCache } from "./api";


export type Handler<D, S = void> = {
    (req: NextApiRequest, res: NextApiResponse<D | EndpointError | { success: true }>): Promise<S>
}


export type EndpointError = {
    type: "User" | "Permission" | "Unknown"
    error: string
}

export type APIFunction<S, R = any> = {
    (params: S): Promise<R>
}

export type EndpointParamsBase<D> = {
    req: NextApiRequest
    res: NextApiResponse<D | EndpointError | { success: true }>
}

export type GetParams<D, S> = {
    ({ req, res, error }: {
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
/**
 * 
 * @param perm 
 * @param func 
 * @returns Promise.  true if user has perm
 */
export async function permOrError<K extends keyof User, D>(perm: K | K[], user: User, res: NextApiResponse<D | EndpointError>): Promise<boolean> {
    const permissions = typeof perm === "string" ? [perm] : perm;
    for (const perm of permissions) {
        if (!(await hasPermission(user!, perm))) {
            res.status(400).json({ type: "Permission", error: `User does not have permission "${perm}"` });
            return false;
        }
    }
    return true;
}

export function reqPerm<K extends keyof User, D>(perm: K | K[], func: APIFunction<EndpointParamsBase<D> & { user: User }>): APIFunction<EndpointParamsBase<D> & { user: User }> {
    //const permissions = typeof perm === "string" ? [perm] : perm;
    return async (params) => {
        // for (const perm of permissions) {
        //     if (!(await hasPermission(params.user!, perm))) {

        //         params.res.status(400).json({type: "Permission", error: `User does not have permission "${perm}"`});
        //         return;
        //     }
        // }
        const hasPerm = await permOrError(perm, params.user, params.res);
        if (hasPerm) {
            return await func(params);
        }
    }
}

// onNew: APIFunction<EndpointParamsBase<D> & S>, onId: APIFunction<EndpointParamsBase<D> & S>
export function divyQueryId<D, S>(splits: string[], ...funcs: APIFunction<EndpointParamsBase<D> & S>[]): APIFunction<EndpointParamsBase<D> & S, D> {
    return async (params) => {
        const id = params.req.query.id;
        let func = funcs[funcs.length - 1];
        splits.map((x, i) => {
            if (id === x) {
                func = funcs[i];
            }
        }) 
        return await func(params);
    }
}

export function cacheFor<D, S>(func: APIFunction<EndpointParamsBase<D> & S, D>, depencyProps: string[] = [],  time: number = 5 * 60 * 1000): APIFunction<EndpointParamsBase<D> & S, D> {
    const cache: Cache<D> = new Cache({defaultTtl: time});
    return async (props) => {
        const key = depencyProps.map(x => (extractProp(props, x))).toString();
        const val = await getOrCache(cache, key, async () => await func(props));
        props.res.status(200).json(val!);
        return val!;
    }
}

export const divyQueryNew = <D, S>(onNew: APIFunction<EndpointParamsBase<D> & S>, onId: APIFunction<EndpointParamsBase<D> & S>) =>  divyQueryId(["new"], onNew, onId);

export function userParams<D>(cacheUser?: boolean): GetParams<D, { user: User }> {
    return async ({ req, res, error }) => {
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
        return { user: user };
    }
}

export function noGetParams<D>(): GetParams<D, {}> {
    return async ({}) => {
        return {};
    }
}

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function endpoint<D, S>(point: Endpoint<D, S>): Handler<D> {
    return async (req, res) => {
        let isError = false;
        // await sleep(30000);
        const error = (code: number, error: EndpointError) => {
            isError = true;
            res.status(code).json(error);
        };
        const innerParams = await point.getParams({ req, res, error });
        if (isError) {
            return;
        }
        const params = { req, res, ...innerParams };
        try {
            await delegate(req.method!, point, params);
        } catch (err) {
            res.status(500).json({
                type: "Unknown",
                error: JSON.stringify(err)
            });
        }
    }
}