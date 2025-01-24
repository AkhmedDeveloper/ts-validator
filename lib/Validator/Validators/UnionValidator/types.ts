import { CreateChain, TypeResolutionObject } from "../../types.js";

export interface UnionResolutionObject extends TypeResolutionObject<'union'> {
  unions: CreateChain[]
}