import { CreateChain, TypeResolutionObject } from "../../types.js";

export interface CreateChainOfString extends CreateChain {
  min: (val: number) => CreateChainOfString;
  max: (val: number) => CreateChainOfString;

  uppercased: () => CreateChainOfString;
  lowercased: () => CreateChainOfString;
  resolution: StringResolutionObject,
}

export interface StringResolutionObject extends TypeResolutionObject<"string"> {
  min?: number;
  max?: number;
  uppercased?: boolean;
  lowercased?: boolean;
}
