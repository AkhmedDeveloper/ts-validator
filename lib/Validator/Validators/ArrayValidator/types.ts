import {
  CreateChain,
  ResolutionType,
  TypeResolutionObject,
} from "../../types.js";

export interface CreateChainOfArray extends CreateChain {
  element: CreateChain;
  nonempty: () => CreateChainOfArray;
  min: (val: number) => CreateChainOfArray;
  max: (val: number) => CreateChainOfArray;
  length: (val: number) => CreateChainOfArray;
}

export interface ArrayResolutionObject extends TypeResolutionObject<"array"> {
  arrayType: CreateChain;
  isNonepty?: boolean;
  min?: number;
  max?: number;
  length?: number;
}
