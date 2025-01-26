import { CreateChain, SafeParseRes, FailedParse } from "../../types.js";
import { callFuncsForResolutionFields } from "../../utils/callFuncsForResolutionObj.js";
import { ValidatorOfType } from "../ValidatorAbstract.js";
import {
  ObjectResolutionObject,
  isCreateChain,
  CreateChainOfObject,
  ObjectItemsType,
} from "./types.js";

export class ObjectValidator extends ValidatorOfType<CreateChainOfObject<any>> {
  public createChain<T>(
    argResolution: ObjectResolutionObject<T>
  ): CreateChainOfObject<T> {
    const resolution = Object.assign({}, argResolution);
    const generalMethods = super.generalMethods(resolution);
    const parseGeneralMethods = super.parseGeneralMethods(resolution);

    return {
      ...generalMethods,
      safeParse(val: any) {
        const callsFuncsRes = callFuncsForResolutionFields(resolution, {
          type(key, value) {
            const parse = parseGeneralMethods.type(val);
            if (parse) return;

            if (typeof val !== "object")
              return {
                success: false,
                raise: `ParseError: Type Is Not Equal`,
              };

            function checkOnStrictType(): SafeParseRes | undefined {
              if (!resolution.isStrict) return;
              for (let key in val) {
                if (key in resolution.object) continue;
                return {
                  success: false,
                  raise: `ParseError: The Object Is Strict`,
                };
              }
            }
            const strictRes = checkOnStrictType();
            if (strictRes) return strictRes;
          },
          object(key, value) {
            if (
              typeof val !== "object" ||
              typeof resolution.object !== "object"
            )
              return;

            function iterateObj<T>(
              obj: ObjectItemsType<T>,
              value: any
            ): SafeParseRes {
              for (let key in obj) {
                const objValue = obj[key] as any; // ObjectResolutionItems[string];

                // if (!value || value[key] === undefined) {
                //   return {
                //     success: false,
                //     raise: "ParseError: One Of The Field Is Not Defined",
                //     position: `Object( Key: ${key} ) `,
                //   };
                // }

                const parsed = objValue.safeParse(value[key]);
                if (!parsed.success)
                  return {
                    success: false,
                    raise: parsed.raise,
                    position: `Object( Key: ${key} ) ${
                      parsed.position ? "-> " + parsed.position : ""
                    }`,
                  };
              }
              return {
                success: true,
                data: value,
              };
            }
            return iterateObj(resolution.object, val);
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

        return parsed;
      },
      partialFields: () => {
        for (let key in resolution.object) {
          const objValue = resolution.object[key] as any; // ObjectResolutionItems[string];

          objValue.partial();
        }

        return this.createChain(resolution)
      },
      strict: () => {
        resolution.isStrict = true;
        return this.createChain(resolution);
      },
      shape: resolution.object,
      resolution,
    } as CreateChainOfObject<T>;
  }
}
