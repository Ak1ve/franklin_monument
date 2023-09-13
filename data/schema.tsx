import { z } from "zod";
import { MethodError, MethodResult, Route, RouteParams, standardDelete, standardGet, standardPost } from "./route";
import { NextRouter, useRouter } from "next/router";
import { ImmerHook } from "use-immer";
import { UseStateHook } from "@/utilities/api";
import { ParsedUrlQuery } from "querystring";
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
        path: path || router.asPath,
        query: router.query,
        schema: schema.schema,
        data: data,
        onError: onError,
        onSuccess: onSuccess
    }
}

export function getAPIPath<S>(params: Omit<RouteParams<S>, "schema"|"query"> & {query?: ParsedUrlQuery, schema: ModelSchema<S>}) {
    return standardGet()(getRouteParams<S>({
        router: {query: params.query || {}} as any,
        schema: params.schema,
        onSuccess: params.onSuccess,
        onError: params.onError,
        path: params.path,
    } as any) as any)
}

export interface ModelSchema<S> {
    route: Route<S>
    schema: z.ZodType<S>
    createNew: S | null
}

export type Data<X> = X extends ModelSchema<infer I> ? I : never;

export function createSchema<S>(schema: z.ZodType<S>, route: Route<S>, createNew: S | null): ModelSchema<S> {
    return {route, schema, createNew};
}

export const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
	// make sure schema is not null or undefined
	if (schema === null || schema === undefined) return [];
	// check if schema is nullable or optional
	if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional) return zodKeys(schema.unwrap());
	// check if schema is an array
	if (schema instanceof z.ZodArray) return zodKeys(schema.element);
	// check if schema is an object
	if (schema instanceof z.ZodObject) {
		// get key/value pairs from schema
		const entries = Object.entries(schema.shape);
		// loop through key/value pairs
		return entries.flatMap(([key, value]) => {
			// get nested keys
			const nested = value instanceof z.ZodType ? zodKeys(value).map(subKey => `${key}.${subKey}`) : [];
			// return nested keys
			return nested.length ? nested : key;
		});
	}
	// return empty array
	return [];
};

const cs = createSchema;
export default cs;