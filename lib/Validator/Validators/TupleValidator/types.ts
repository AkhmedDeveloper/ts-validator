import { CreateChain, TypeResolutionObject } from "../../types.js";

export interface CreateChainOfArray extends CreateChain {
  
}

export interface TupleResolutionObject extends TypeResolutionObject<'tuple'> {
  tuple?: CreateChain[]
}