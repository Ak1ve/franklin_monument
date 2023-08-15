import { Dispatch, SetStateAction } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export function mapGetOr<K, V>(
  map: Map<K, V>,
  item: K,
  defaultFactory: (item?: K) => V
): V {
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
  key?: keyof V
): MapType<K, V> {
  key = key || ("id" as keyof V);
  let obj = {} as MapType<K, V>;
  arr.forEach((x) => {
    if (obj.hasOwnProperty(x[key!] as K)) {
      throw new Error(
        `Object already has key "${String(key)}": ${JSON.stringify(
          x
        )} when flattening ${arr}`
      );
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
export function unflattenMap<K extends string | number, V>(
  map: MapType<K, V>,
  isSorted: boolean = true
): Array<V> {
  const keys = Object.keys(map);
  if (isSorted) {
    keys.sort((a, b) => parseInt(a) - parseInt(b));
  }
  return keys.map((x) => map[x as keyof MapType<K, V>]);
}

export function unflattenIDMap<K extends string | number, V>(
  map: MapType<K, V>,
  isSorted: boolean = true
): Array<{ id: K; value: V }> {
  const keys = Object.keys(map);
  if (isSorted) {
    keys.sort((a, b) => parseInt(a) - parseInt(b));
  }
  return keys.map((x) => {
    return { id: x as K, value: map[x as keyof MapType<K, V>] };
  });
}

export function pool(bool: boolean) {
  return bool ? "is" : "is not";
}

export function dateRange(
  startDate: string,
  endDate: string,
  display?: "numeric" | "month"
) {
  var start = startDate.split("-");
  var end = endDate.split("-");
  var startYear = parseInt(start[0]);
  var endYear = parseInt(end[0]);
  var dates = [];

  for (var i = startYear; i <= endYear; i++) {
    var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
    var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
    for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      var month = j + 1;
      var displayMonth = month < 10 ? "0" + month : month;

      if (display === "numeric") {
        dates.push([displayMonth, i].join("-"));
      } else {
        dates.push(
          [
            {
              "01": "Jan",
              "02": "Feb",
              "03": "Mar",
              "04": "Apr",
              "05": "May",
              "06": "Jun",
              "07": "Jul",
              "08": "Aug",
              "09": "Sep",
              "10": "Oct",
              "11": "Nov",
              "12": "Dec",
            }[displayMonth],
            i,
          ].join(" ")
        );
      }
    }
  }
  return dates;
}

export type UseStateHook<T> = [T, Dispatch<SetStateAction<T>>];

// export function requiresPermission<K extends keyof User, D>(permission: K[] | K, func: APIFunction<D>): APIFunction<D> {
//   return async (req, res) => {
//     const session = await userSession(req, res);
//     if (session === null) {
//       // TODO no session!!
//       console.log("NO SESSION");
//     }

//     const perms = typeof permission === "string" ? [permission] : permission;
//     for(let p of perms) {
//       if (!(await userHasPermission(session?.user.email!, p))) {
//         // TODO not allowed!
//         console.log("Not allowed!");
//       }
//     }
//     return await func(req, res);
//   }
// }
