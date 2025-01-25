import { CreateChain, TypeResolutionObject } from "../../types.js";

export interface BooleanResolutionObject extends TypeResolutionObject<'boolean'> {
  
}

export interface CreateChainOfBolean extends CreateChain {
  resolution: BooleanResolutionObject
}

