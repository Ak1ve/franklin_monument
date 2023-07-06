import { z } from "zod";

// I just want to say. This is a form, uses this API route for the data, posts to THIS spot

export interface FormProps<T> {
    submit: (state: T) => any
    delete: () => any

}

export interface FormComponent<T> {
    (initialState: T, submit: (state: T) => any): JSX.Element
}

export interface FormRoute<T> {
    get?: string
    post?: string
    delete?: string
    validate?: any  // TODO
}

export default function form<T>(route: FormRoute<T>, component: FormComponent<T>): () => JSX.Element {

}

/**
 * 
 * export function ComponentThing({initalState, submit, error, delete}: FormProps<CatalogedItem>) {
 *  const hook = useImmer(initialState);
 * 
 *  submit(hook)
 * }
 * 
 * const ActualForm = form({get: "/api/route/to/get"}, ComponentThing)
 */