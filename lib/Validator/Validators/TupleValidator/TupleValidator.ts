import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import { TupleResolutionObject, CreateChainOfArray } from "./types.js";

export class TupleValidator extends ValidatorOfType<CreateChainOfArray> {
  public createChain(
    argResolution: TupleResolutionObject = { type: "tuple" }
  ): CreateChainOfArray {
    const resolution = Object.assign({}, argResolution)
    const generalMethods = super.generalMethods(resolution);
    const parseGeneralMethods = super.parseGeneralMethods(resolution);

    return {
      ...generalMethods,
      safeParse(val: any) {
        const callsFuncsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const parse = parseGeneralMethods.type(val);
            if (parse) return;

            if (!Array.isArray(val))
              return {
                success: false,
                raise: "ParseError: Type Is Not Equal",
              };
          },
          tuple(key, value) {
            if (!resolution.tuple || !Array.isArray(val)) return;
            for (let i = 0; i < resolution.tuple.length; i++) {
              const resolutionItem = resolution.tuple[i];
              const parsedItem = resolutionItem.safeParse(val[i]);
              if (!parsedItem.success)
                return {
                  success: false,
                  raise: parsedItem.raise,
                  position: `Tuple( Index: ${i} ) ${
                    parsedItem.position ? "-> " + parsedItem.position : ""
                  }`,
                };
            }
          },
        });

        if (callsFuncsRes) return callsFuncsRes;
        return {
          success: true,
          data: val,
        };
      },
      parse(val: any) {
        const parsed = this.safeParse(val);
        if (!parsed.success) throw new Error(parsed.raise);

        return val;
      },
      resolution,
    };
  }
}
