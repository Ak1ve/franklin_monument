import { Option } from "react-tailwindcss-select/dist/components/type";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";

/**
 * This function normalizes select values to convert them all the selct values to the values of Option.value.  Used for SENDING data
 * @param value value to be converted
 * @returns converted values
 */
export function normalizeSelectValue(value: SelectValue): string[] {
    if (value === null) {
        return [];
    }
    if (Array.isArray(value)) {
        return value.map(x => x.value);
    }
    return [value.value];
}

/**
 * Returns the option which has the same .value as `value`.  Used for RENDERING from fetched data
 * @param options to be searched through
 * @param value id/value in which options should be found
 * @returns `Option` with value:`value`
 */
export function getSelectValue(options: Array<Option>, value: string | string[], isMultiple: boolean | undefined): Option | Option[] | null {
    if (Array.isArray(value)) {
        const filtered = options.filter(x => value.includes(x.value));
        return isMultiple || false ? filtered : filtered[0];
    }
    const find = options.find(x => x.value === value);
    if (find === undefined) {
        return isMultiple || false ? [] : null; 
    }
    return isMultiple || false ? [find] : find;
}