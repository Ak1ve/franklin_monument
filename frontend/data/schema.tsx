import { z } from "zod";
import { MethodError, MethodResult, Route, RouteParams, standardDelete, standardGet, standardPost } from "./route";
import { NextRouter, useRouter } from "next/router";
import { ImmerHook } from "use-immer";
import { UseStateHook } from "@/utilities/api";
// Where S is a data object



export function standardRoute<S>(routes: Array<"get"|"post"|"delete"> = ["get", "post", "delete"], prepend: string = "/api/", append: string = ""): Route<S> {
    const route: Route<S> = {};
    if (routes.includes("get")) {
        route.get = standardGet(prepend, append);
    }
    if (routes.includes("post")) {
        route.post = standardPost(prepend, append);
    }
    if (routes.includes("delete")) {
        route.delete = standardDelete(prepend, append);
    }
    return route;
}

export function divyResult<S>(onSuccess: (data: S) => any, onError: (err: MethodError<S>) => any): (then: MethodResult<S>) => void {
    return (then: MethodResult<S>) => {
        if (then.success) {
            onSuccess(then.data!);
            return;
        }
        onError(then);
    }
}

export function divyResultHook<S>(stateHook: ImmerHook<S | null>, errors: UseStateHook<MethodError<S> | null>): (then: MethodResult<S>) => void {
    return divyResult((data) => {
        stateHook[1](x => data);
        errors[1](null);
    }, (err) => {
        errors[1](err)
    })
}

type GetRouteParamsType<S> = Omit<RouteParams<S>, "schema"|"path"|"query"> & {router: NextRouter, schema: ModelSchema<S>, path?: string};
export function getRouteParams<S>({ router, schema, data, onSuccess, onError, path }: GetRouteParamsType<S>): RouteParams<S> {
    return {
        path: path || router.pathname,
        query: router.query,
        schema: schema.schema,
        data: data,
        onError: onError,
        onSuccess: onSuccess
    }
}

export interface ModelSchema<S> {
    route: Route<S>
    schema: z.ZodType<S>
}

export type Data<X> = X extends ModelSchema<infer I> ? I : never;

export function createSchema<S>(schema: z.ZodType<S>, route: Route<S>): ModelSchema<S> {
    return {route, schema};
}

const cs = createSchema;
export default cs;