import { TypeResolutionObject } from "../../types.js";
import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import { NumberResolutionObject, CreateChainOfNumber } from "./types.js";

export class NumberValidator extends ValidatorOfType<CreateChainOfNumber> {
  createChain(
    argResolution: NumberResolutionObject = { type: "number" }
  ): CreateChainOfNumber {
    const resolution = Object.assign({}, argResolution);

    const generalMethods = this.generalMethods(resolution);

    const parseGeneralMethods = super.parseGeneralMethods(resolution);
    return {
      ...generalMethods,

      min: (val: number) => {
        resolution.min = val;
        return this.createChain(resolution);
      },
      max: (val: any) => {
        resolution.max = val;
        return this.createChain(resolution);
      },
      safeParse(val: any) {
        const callFuncsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const parse = parseGeneralMethods.type(val);
            if (parse) return;

            // if (isNaN(val) || !isFinite(val))
            //   return {
            //     success: false,
            //     raise: "ParseError: The Value Should Not Be NaN Or Infinite",
            //   };
            if (typeof val !== value)
              return {
                success: false,
                raise: "ParseError: Type Is Not Equal",
              };
          },
          min(key, value) {
            if (!value) return;
            if (val < value)
              return {
                success: false,
                raise: `ParseError: Min Length Is ${value}`,
              };
          },
          max(key, value) {
            if (!value) return;
            if (val > value)
              return {
                success: false,
                raise: `ParseError: Max Length Is ${value}`,
              };
          },
          isInteger(key, value) {
            if (!value) return;
            if (+val !== Math.floor(val))
              return {
                success: false,
                raise: "ParseError: The Number Is Must Be An Integer",
              };
          },
          typeofNum(key, value) {
            if (value === "negative" && val >= 0) {
              return {
                success: false,
                raise: "ParseError: The Number Should Be Negative",
              };
            } else if (value === "positive" && val <= 0) {
              return {
                success: false,
                raise: "ParseError: The Number Should Be Negative",
              };
            } else if (value === "nonnegative" && val < 0) {
              return {
                success: false,
                raise: "ParseError: The Number Should Be NonNegative",
              };
            } else if (value === "nonpositive" && val > 0) {
              return {
                success: false,
                raise: "ParseError: The Number Should Be NonPositive",
              };
            }
          },
        });

        if (callFuncsRes) return callFuncsRes;
        return {
          success: true,
          data: val,
        };
      },
      parse(val: any) {
        const parsed = this.safeParse(val);
        if (!parsed.success) throw new Error(parsed.raise);
        return parsed;
      },
      int: () => {
        resolution.isInteger = true;
        return this.createChain(resolution);
      },
      positive: () => {
        resolution.typeofNum = "positive";
        return this.createChain(resolution);
      },
      negative: () => {
        resolution.typeofNum = "negative";
        return this.createChain(resolution);
      },
      nonnegative: () => {
        resolution.typeofNum = "nonnegative";
        return this.createChain(resolution);
      },
      nonpositive: () => {
        resolution.typeofNum = "nonpositive";
        return this.createChain(resolution);
      },
      resolution,
    } as CreateChainOfNumber;
  }
}

const n = new NumberValidator();
n.createChain();
