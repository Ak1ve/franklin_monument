import { z } from "zod";
import { ModelSchema, divyResult, divyResultHook, getRouteParams } from "./schema";
import { ImmerHook, useImmer } from "use-immer";
import { HookProps } from "@/utilities/form";
import { MethodError, MethodSuccess } from "./route";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UseStateHook } from "@/utilities/api";
import React from "react";
import { EndpointError } from "@/utilities/endpoint";


export interface FormAction<S> {
    (then?: (success: S) => any, error?: (error: MethodError<S>["error"]) => any): any
}

export interface FormActions<S> {
    post: FormAction<S>
    delete: FormAction<S>
    get: FormAction<S>
}


/**
 * The props of function Order({HERE})
 */
export interface ComponentProps<S, E> {
    stateHook: ImmerHook<S | null>
    errors: MethodError<S>["error"] | EndpointError | null
    register: (prop: string) => HookProps<S | null>
    form: FormActions<S>
    isLoading: boolean
    formProps: FormComponentProps & E
}

/** 
 * The props you pass in to actually render the form
 * i.e. <OrderForm props={HERE} />
*/
export interface FormComponentProps {
    path?: string  // Default is current page
}

function doNothing(..._: any) { }

export function formComponent<S, E extends {} = {}>(schema: ModelSchema<S>, component: (props: ComponentProps<S, E>) => JSX.Element): (formProps: FormComponentProps & E) => JSX.Element {
    return (formProps: FormComponentProps & E) => {
        const stateHook = useImmer(null) as ImmerHook<S | null>;
        const errorHook = useState(null) as UseStateHook<MethodError<S> | null>;
        const router = useRouter();
        const path = formProps?.path;
        const [errors, setErrors] = useState(null as { [x: string]: string; } | null);
        if (errorHook[0]?.error?.type === "Validation" && errors === null) {
            const errs = {} as { [x: string]: string };
            errorHook[0]?.error.error.issues.forEach((x: any) => {
                let prop = ""
                for (let p of x.path) {
                    prop += "." + p.toString();
                }
                errs[prop.substring(1,)] = x.message;
            });
            setErrors(errs);
        }
        if (errorHook[0] === null && errors !== null && Object.keys(errors).length > 0) {
            // clear the errors!
            setErrors(null);
        };
        useEffect(() => {
            schema.route.get!(getRouteParams({ path, router, schema })).then(divyResultHook(stateHook, errorHook as any));
        }, [router.asPath]);
        let register = (prop: string) => ({
            hook: stateHook,
            prop: prop,
            errorText: errors === null ? "" : errors[prop]
        });

        const form: FormActions<S> = {
            get: (then, err) => {
                //ref.current.forceUpdate();
                schema.route.get!(getRouteParams({ path, router, schema })).then(
                    divyResult(then || doNothing, (e) => {
                        if ((e as any).info === undefined) {
                            errorHook[1](e);
                        }
                        (e as any).info?.then((x: any) => {
                            (err || doNothing)(x); errorHook[1](x);
                        });
                    })
                );
            },
            post: (then, err) => {
                //setState(!state);
                schema.route.post!(getRouteParams({ path, router, schema, data: stateHook[0]! })).then(
                    divyResult(then || doNothing, (e) => {
                        if ((e as any).info === undefined) {
                            errorHook[1](e);
                        }
                        (e as any).info?.then((x: any) => {
                            (err || doNothing)(x); errorHook[1](x);
                        });
                    })
                );
            },
            delete: (then, err) => {
                //setState(!state);
                schema.route.delete!(getRouteParams({ path, router, schema })).then(
                    divyResult(then || doNothing, (e) => {
                        if ((e as any).info === undefined) {
                            errorHook[1](e);
                        }
                        (e as any).info?.then((x: any) => {
                            (err || doNothing)(x); errorHook[1](x);
                        });
                    })
                );
            }
        }
        // set up object state
        // Actually rendered component
        return component({
            stateHook, register, form, errors: errorHook[0] as any, isLoading: stateHook[0] === null,
            formProps
        });
    };
}





/*
const form = createform(schema, (props) => {
    {basicSelect({})}
    <StandardButton onClick={props.submit} />
}

<Form onSubmit={} onDelete={} onEdit={}>
*/

/*

const ItemsForm = formComponent(Items, ({state, setState register, errors, form}) => {
    <button onClick={form.submit()}
    return <Input {...register("hello.prop.name")} />
})

*/