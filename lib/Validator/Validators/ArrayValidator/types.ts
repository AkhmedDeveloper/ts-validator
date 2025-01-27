import {
  CreateChain,
  CreateChainMethods,
  ResolutionType,
  SafeParseRes,
  TypeResolutionObject,
} from "../../types.js";
import { v } from "../../Validator.js";

export interface CreateChainOfArray<T extends CreateChain> extends CreateChain {
  element: T;
  nonempty: () => this;
  min: (val: number) => this;
  max: (val: number) => this;
  length: (val: number) => this;
  resolution: ArrayResolutionObject<T>

}

export interface ArrayResolutionObject<T extends CreateChain> extends TypeResolutionObject<"array"> {
  arrayType: T;
  isNonepty?: boolean;
  min?: number;
  max?: number;
  length?: number;
}
