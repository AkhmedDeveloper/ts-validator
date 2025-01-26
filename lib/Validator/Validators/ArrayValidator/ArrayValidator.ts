import { CreateChain } from "../../types.js";
import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import { ArrayResolutionObject, CreateChainOfArray } from "./types.js";

export class ArrayValidator extends ValidatorOfType<CreateChainOfArray<any>> {
  createChain<T extends CreateChain>(resolution: ArrayResolutionObject<T>): CreateChainOfArray<T> {
    const parseGeneralMethods = super.parseGeneralMethods(resolution);
    const generalMethods = super.generalMethods(resolution);
    return {
      ...generalMethods,
      parse(val: any) {
        const parsed = this.safeParse(val);

        if (!parsed.success) throw new Error(parsed.raise);
        return parsed;
      },
      safeParse(val: any) {
        const callsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const checkType = parseGeneralMethods.type(val);
            if (checkType) return;

            if (typeof val !== "object")
              return {
                success: false,
                raise: "ParseError: Type Is Not Equal",
              };
          },
          arrayType(key, value) {
            if (typeof val !== "object") return;
            for (let key in val) {
              const parsed = value.safeParse(val[key]);
              if (!parsed.success)
                return {
                  success: false,
                  raise: parsed.raise,
                  position: `Array ${
                    parsed.position ? "-> " + parsed.position : ""
                  }`,
                };
            }
          },
          isNonepty(key, value) {
            if (!value || typeof val !== "object" || !val.length) return;
            if (val.length <= 0)
              return {
                success: false,
                raise: "ParseError: Array Should Not Be Empty",
              };
          },
          min(key, value) {
            if (!value || typeof val !== "object" || !val.length) return;

            if (val.length < value)
              return {
                success: false,
                raise: `ParseError: Min Length Of Array Is ${value}`,
              };
          },
          max(key, value) {
            if (!value || typeof val !== "object" || !val.length) return;

            if (val.length > value)
              return {
                success: false,
                raise: `ParseError: Max Length Of Array Is ${value}`,
              };
          },
          length(key, value) {
            if (!value || typeof val !== "object" || !val.length) return;

            if (val.length !== value)
              return {
                success: false,
                raise: `ParseError: Length Of Array Will Be ${value}`,
              };
          },
        });

        if (callsRes) return callsRes;
        return {
          success: true,
          data: val,
        };
      },
      nonempty: () => {
        resolution.isNonepty = true;
        return this.createChain(resolution);
      },
      min: (val: number) => {
        resolution.min = val;
        return this.createChain(resolution);
      },
      max: (val: number) => {
        resolution.min = val;
        return this.createChain(resolution);
      },
      length: (val: number) => {
        resolution.min = val;
        return this.createChain(resolution);
      },
      element: resolution.arrayType,

      resolution,
    } as CreateChainOfArray<T>;
  }
}
