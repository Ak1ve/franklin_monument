import { Dispatch, SetStateAction } from "react";



export function mapGetOr<K, V>(map: Map<K, V>, item: K, defaultFactory: (item?: K) => V): V {
    if (!map.has(item)) {
        map.set(item, defaultFactory(item));
    }
    return map.get(item) as V;
}

export type MapType<K extends string | number | symbol, V> = {
    [key in K]: V;
};
/**
 * Turns an array of objects into a map. 
 * for example [{id: 1, age:2}, {id: 2, age:3}] =>
 * {1: {id:1, age:2}, 2: {id:2, age:3}}
 * @param arr 
 * @param key should generally be id
 * @returns 
 */
export function flattenArray<K extends string | number, V extends object>(
    arr: Array<V>,
    key?: keyof V): MapType<K, V> {
    key = key || "id" as keyof V;
    let obj = {} as MapType<K, V>;
    arr.forEach(x => {
        if (obj.hasOwnProperty(x[key!] as K)) {
            throw new Error(`Object already has key "${String(key)}": ${JSON.stringify(x)} when flattening ${arr}`);
        }
        obj[x[key!] as K] = x;
    });
    return obj;
}

/**
 * The opposite of flattenArray.  Converts into an array of objects
 * for example {1: {id:1, age:2}, 2: {id:2, age:3}} => [{id: 1, age:2}, {id: 2, age:3}]
 * @param map 
 * @param isSorted sort based on keys
 * @returns 
 */
export function unflattenMap<K extends string | number, V>(map: MapType<K, V>, isSorted: boolean = true): Array<V> {
    const keys = Object.keys(map);
    if (isSorted) {
        keys.sort((a, b) => parseInt(a) - parseInt(b));
    }
    return keys.map(x => map[x as keyof MapType<K, V>]);
}

export function unflattenIDMap<K extends string | number, V>(
    map: MapType<K, V>, isSorted: boolean = true): Array<{ id: K, value: V }> {
    const keys = Object.keys(map);
    if (isSorted) {
        keys.sort((a, b) => parseInt(a) - parseInt(b));
    }
    return keys.map(x => {
        return { id: x as K, value: map[x as keyof MapType<K, V>] };
    });
}

export function pool(bool: boolean) {
    return bool ? "is" : "is not";
}

export type UseStateHook<T> = [T, Dispatch<SetStateAction<T>>];
