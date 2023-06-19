import { StandardCheckbox, StandardCheckboxProps, StandardDatepicker, StandardDatepickerProps, StandardInput, StandardInputProps, StandardSelect, StandardSelectProps, StandardTextArea, StandardTextAreaProps } from "@/components/Inputs";
import { GroupOption, SelectValue, Option } from "react-tailwindcss-select/dist/components/type";
import { Draft, produce } from "immer";
import { ImmerHook, Updater } from "use-immer";
import { ValueOf } from "next/dist/shared/lib/constants";
import { getSelectValue, normalizeSelectValue } from "./select";

function navigatePropString<T>(obj: T, property: keyof T | string, callback: (obj: any, lastProp: string) => any) {
    let newObj: any = obj;
    let props = (property as string).split(".");
    const lastProp = props.pop();
    for (const prop of props) {
        newObj = newObj[prop];
    }
    return callback(newObj, lastProp as string);
}


const extractProp = (state: any, prop: any) => navigatePropString(state, prop, (state: any, lastProp: string) => state[lastProp]);

function updateProp<S>(updater: Updater<S>, property: keyof S | string, value: any) {
    updater((draft: Draft<S>) => {
        navigatePropString(draft as S, property, (obj: any, lastProp: string) => {
            obj[lastProp] = value;
        });
    });
}


interface ElementFunc<P> {
    <S>(props: P, hook: ImmerHook<S>, property?: keyof S | string): JSX.Element;
}

function basicGenerate<S, P extends React.HTMLProps<HTMLElement>>(
    generator: (props: P, updater: Updater<S>, prop: keyof S | string, value: any) => JSX.Element
): ElementFunc<P> {
    return (props, hook, property) => {
        const [state, updater] = hook;
        const prop = (property || props.id) as keyof S;
        let value = extractProp(state, prop);
        return generator(props, updater as any, prop, value);
    };
}

export const basicInput: ElementFunc<StandardInputProps> =
    basicGenerate((props, updater, prop, value) => {
        return (
            <StandardInput {...props} value={value !== null ? value : ""} onChange={(x) => { updateProp(updater, prop, (x.target as HTMLInputElement).value) }} />
        );
    });

/**
 * NOTE: Select does not take `GroupOption` values!!
 */
export const basicSelect: ElementFunc<Omit<StandardSelectProps, "onChange" | "value">> =
    basicGenerate((props, updater, prop, value) => {
        return (
            // getSelectValue(props.options as Array<Option>, value)
            <StandardSelect {...props} onChange={(x) => { updateProp(updater, prop, normalizeSelectValue(x)) }} value={getSelectValue(props.options as Option[], value, props.isMultiple)} />
        );
    });

export const basicCheckbox: ElementFunc<Omit<StandardCheckboxProps, "value">> =
    basicGenerate((props, updater, prop, value) => {
        return (
            <StandardCheckbox {...props} onChange={(x) => updateProp(updater, prop, !value)} />
        );
    });

export const basicDatepicker: ElementFunc<Omit<StandardDatepickerProps, "value" | "onChange">> =
    basicGenerate((props, updater, prop, value) => {
        return (
            <StandardDatepicker {...props} value={value !== null ? value : ""} onChange={(x: any) => updateProp(updater, prop, x.target.value)} />
        );
    });

export const basicTextArea: ElementFunc<Omit<StandardTextAreaProps, "onChange">> =
    basicGenerate((props, updater, prop, value) => {
        return (
            <StandardTextArea {...props} value={value !== null ? value : ""} onChange={(x) => updateProp(updater, prop, (x.target as HTMLInputElement).value)} />
        );
    });

