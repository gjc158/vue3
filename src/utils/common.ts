/**
 * 是否是对象
 * @param obj 传递的参数
 * @returns boolean true/false
 */
export function isObject(obj: any): boolean {
  return obj && typeof obj === "object";
}
import { IdefaultObject } from "./server/type";
// 类型字典
export let whichType = (data: any) => {
  let dist: IdefaultObject = {
    "[object Array]": "array",
    "[object Object]": "object",
    "[object Number]": "number",
    "[object Function]": "function",
    "[object String]": "string",
    "[object Null]": "null",
    "[object Undefined]": "undefined",
  };

  return dist[Object.prototype.toString.call(data)];
};