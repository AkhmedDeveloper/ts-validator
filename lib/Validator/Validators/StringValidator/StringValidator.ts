import { SafeParseRes } from "../../types.js";
import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import { CreateChainOfString, StringResolutionObject } from "./types.js";

export class StringValidator extends ValidatorOfType<CreateChainOfString> {
  createChain = (
    argResolution: StringResolutionObject = { type: "string" }
  ): CreateChainOfString => {
    const resolution = Object.assign({}, argResolution)
    const generalMethods = super.generalMethods(resolution);
    const parseGeneralMethods = super.parseGeneralMethods(resolution);
    return {
      ...generalMethods,
      min: (val: number) => {
        resolution.min = val;
        return this.createChain(resolution);
      },
      uppercased: () => {
        resolution.uppercased = true;
        return this.createChain(resolution);
      },
      lowercased: () => {
        resolution.lowercased = true;
        return this.createChain(resolution);
      },
      max: (val: number) => {
        resolution.max = val;
        return this.createChain(resolution);
      },
      safeParse: (val: any): SafeParseRes => {
        const callsFuncsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const parse = parseGeneralMethods.type(val);
            if (parse) return;

            if (typeof val !== resolution.type)
              return {
                success: false,
                raise: `ParseError: Type Is Not Equal`,
              };
          },
          min(key, value) {
            if (!value || !val?.length) return;
            if (val.length < value)
              return {
                success: false,
                raise: `ParseError: Min Length Is ${resolution.min}`,
              };
          },
          max(key, value) {
            if (!value || !val?.length) return;
            if (val.length > value)
              return {
                success: false,
                raise: `ParseError: Max Length Is ${value}`,
              };
          },
          uppercased(key, value) {
            if (!value || typeof val !== "string") return;
            if (val.toLowerCase() !== val)
              return {
                success: false,
                raise: `ParseError: String Is Will Be Lowercased`,
              };
          },
          lowercased(key, value) {
            if (!value || typeof val !== "string") return;
            if (val.toUpperCase() !== val)
              return {
                success: false,
                raise: `ParseError: String Is Will Be Uppercased`,
              };
          },
        });

        if (callsFuncsRes) return callsFuncsRes;
        return {
          success: true,
          data: val,
        };
      },
      parse(val: any) {
        const parseRes = this.safeParse(val);
        if (!parseRes.success) throw new Error(parseRes.raise);
        return parseRes;
      },
      resolution,
    };
  };
}
