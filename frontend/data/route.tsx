import { Router, useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ZodTypeDef, z } from "zod"
import {cookies} from "next/headers";

export interface RouteParams<S> {
    path: string
    data?: S
    schema: z.ZodType<S>
    query: ParsedUrlQuery
    onError?: (error: MethodError<S>) => any
    onSuccess?: (success: MethodSuccess<S>) => any
}


export interface ValidationError<S> {
    type: "Validation"
    error: z.ZodError<S>
}

export interface NetworkError {
    type: "Network"
    error: Error & { info?: any, status?: string }
}

export interface MethodSuccess<S> {
    success: true
    data?: S
}

export interface MethodError<S> {
    success: false
    error: ValidationError<S> | NetworkError
}

export type MethodResult<S> = MethodSuccess<S> | MethodError<S>;

export type MethodFunction<S> = (params: RouteParams<S>) => Promise<MethodResult<S>>;

function fetcher(url: string, init?: RequestInit) {
    return fetch(url, {credentials: "include", ...init}).then(res => {
        if (!res.ok) {
            const error: Error & { info?: any, status?: any } = new Error('An error occurred while fetching the data.');
            error.info = res.json();
            error.status = res.status;
            throw error;
        }

        return res.json()
    });
}

export function getter<S>(url: string, headers?: any) {
    return fetcher(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    });
}

export function poster<S>(url: string, data: S, headers?: any) {
    return fetcher(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: JSON.stringify(data)
    });
}

export function deleter<S>(url: string, headers?: any) {
    return fetcher(url, {
        method: "DELETE",
    });
}

export function schemaParse<S>(schema: z.ZodType<S>, data: NonNullable<S>): MethodResult<S> {
    const parsed = schema.safeParse(data);
    if (parsed.success) {
        return {
            success: true,
            data: parsed.data
        }
    }
    return {
        success: false,
        error: {
            type: "Validation",
            error: parsed.error
        }
    }
}

export function networkError<S>(error: Error & { info?: any, status?: string }): MethodError<S> {
    return {
        success: false,
        error: {
            type: "Network",
            error
        }
    }
}

export function standardGet<S>(prepend: string = "/api/", append: string = ""): MethodFunction<S> {
    return ({ path, schema, onError, onSuccess }) => {
        const newPath = prepend + path + append;
        return getter(newPath).then(success => {
            let value = schemaParse(schema, success);
            if (value.success) {
                if (onSuccess !== undefined) onSuccess(value);
                return value;
            }
            if (onError !== undefined) onError(value);
            return value;
        }).catch(err => {
            err = networkError(err);
            if (onError !== undefined) onError(err);
            return err;
        });
    }
}

export function standardDelete<S>(prepend: string = "/api/", append: string = ""): MethodFunction<S> {
    return ({ path, onError, onSuccess }) => {
        const newPath = prepend + path + append;
        return deleter(newPath).then(success => {
            if (onSuccess !== undefined) onSuccess(success);
            return success;
        }).catch(err => {
            err = networkError(err);
            if (onError !== undefined) onError(err);
            return err;
        })
    }
}

export function standardPost<S>(prepend: string = "/api/", append: string = ""): MethodFunction<S> {
    return ({ path, data, schema, onError, onSuccess }) => {
        const newPath = prepend + path + append;
        const parsed = schemaParse(schema, data as NonNullable<S>);
        if (!parsed.success) {
            return new Promise(() => {throw parsed;}).catch(err => {
                if (onError !== undefined) onError(err);
                return err;
            });
        }
        return poster(newPath, parsed.data).then(success => {
            if (onSuccess !== undefined) onSuccess(success);
            return success;
        }).catch(err => {
            if (onError !== undefined) onError(err);
            return err;
        })
    }
}

// TODO MOVE ROUTE AWAY FROM SCHEMA
export interface Route<S> {
    get?: MethodFunction<S>
    post?: MethodFunction<S>
    delete?: MethodFunction<S>
}