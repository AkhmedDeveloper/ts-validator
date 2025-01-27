import {
  CreateChain,
  CreateChainMethods,
  SafeParseRes,
  TypeResolutionObject,
} from "../../types.js";
import { v } from "../../Validator.js";

export interface CreateChainOfString extends CreateChain<CreateChainOfString>{
  min: (val: number) => this;
  max: (val: number) => this;

  uppercased: () => this;
  lowercased: () => this;
  resolution: StringResolutionObject;
}

export interface StringResolutionObject extends TypeResolutionObject<"string"> {
  min?: number;
  max?: number;
  uppercased?: boolean;
  lowercased?: boolean;
}
