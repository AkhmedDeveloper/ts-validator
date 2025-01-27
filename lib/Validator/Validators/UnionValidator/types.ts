import {
  CreateChain,
  CreateChainMethods,
  TypeResolutionObject,
} from "../../types.js";

export interface UnionResolutionObject extends TypeResolutionObject<"union"> {
  unions: CreateChain[];
}

export interface CreateChainOfUnion extends CreateChain {
  resolution: UnionResolutionObject;
}
