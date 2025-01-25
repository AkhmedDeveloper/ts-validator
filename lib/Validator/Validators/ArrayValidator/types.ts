import {
  CreateChain,
  ResolutionType,
  TypeResolutionObject,
} from "../../types.js";

export interface CreateChainOfArray<T extends CreateChain> extends CreateChain {
  element: T;
  nonempty: () => CreateChainOfArray<T>;
  min: (val: number) => CreateChainOfArray<T>;
  max: (val: number) => CreateChainOfArray<T>;
  length: (val: number) => CreateChainOfArray<T>;
  resolution: ArrayResolutionObject<T>
}

export interface ArrayResolutionObject<T extends CreateChain> extends TypeResolutionObject<"array"> {
  arrayType: T;
  isNonepty?: boolean;
  min?: number;
  max?: number;
  length?: number;
}
