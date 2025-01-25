import { TypeResolutionObject, CreateChain } from "../../types.js";
import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import { CreateChainOfUnion, UnionResolutionObject } from "./types.js";

export class UnionValidator extends ValidatorOfType<CreateChainOfUnion> {
  createChain(argResolution: UnionResolutionObject): CreateChainOfUnion {
    const resolution = Object.assign({}, argResolution)
    const generalMethods = super.generalMethods(resolution);
    const parseGeneralMethods = super.parseGeneralMethods(resolution);
    return {
      ...generalMethods,
      parse(val: any) {
        const parsed = this.safeParse(val);
        if (!parsed.success) throw new Error(parsed.raise);
        return parsed;
      },
      safeParse(val: any) {
        const callsFuncsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const parse = parseGeneralMethods.type(val);
            if (parse) return;

            if (!Array.isArray(resolution.unions))
              return {
                success: false,
                raise: "ParseError: Type Is Not Equal",
              };
          },
          unions(key, value) {
            const findSuccessUnion = resolution.unions.find(
              (unionItem) => unionItem.safeParse(val).success
            );
            if (!findSuccessUnion)
              return {
                success: false,
                raise: "ParseError: Unable to identify union",
              };
          },
        });

        return {
          success: true,
          data: val,
        };
      },
      resolution,
    };
  }
}
