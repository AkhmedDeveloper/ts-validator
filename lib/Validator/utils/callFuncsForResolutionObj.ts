import { SafeParseRes } from "../types";

export const callFuncsForResolutionFields = <T extends object>(
  obj: T,
  callbacks: {
    [key in keyof T]: (key: key, value: T[key]) => SafeParseRes | void;
  }
) => {
  if (!obj || !callbacks) return;
  
  for (let key in obj) {
    const callRes = callbacks[key]?.(key, obj[key]);
    if (callRes) return callRes;
  }
};
