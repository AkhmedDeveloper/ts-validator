import { CreateChain } from "../../types.js";
import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import { BooleanResolutionObject, CreateChainOfBolean } from "./types.js";

export class BooleanValidator extends ValidatorOfType<CreateChainOfBolean> {
  public createChain<T extends CreateChainOfBolean>(
    argResolution: BooleanResolutionObject = { type: "boolean" }
  ): T {
    const resolution = Object.assign({}, argResolution)

    const generalMethods = super.generalMethods(resolution)

    const parseFeneralMethods = super.parseGeneralMethods(resolution)
    return {
      ...generalMethods,
      safeParse(val: any) {
        
        const callFuncsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const parse = parseFeneralMethods.type(val)
            if(parse) return;

            if (typeof val !== resolution.type)
              return {
                success: false,
                raise: "ParseError: Type Is Not Equal",
              };
          },
        });
        if(callFuncsRes) return callFuncsRes
        return { success: true, data: val };
      },
      parse(val: any) {
        const parsed = this.safeParse(val);
        if (!parsed.success) throw new Error(parsed.raise);

        return parsed;
      },
    } as T;
  }
}

// ValidtorOfType -> BoolValdiator { createChain }
//                -> NumberValdiator { createChain }
//                -> StringValidator { createChain }