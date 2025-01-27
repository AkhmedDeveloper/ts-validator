import { CreateChain, CreateChainMethods, TypeResolutionObject } from "../../types.js";

export interface CreateChainOfTuple extends CreateChain{
  resolution: TupleResolutionObject
}

export interface TupleResolutionObject extends TypeResolutionObject<'tuple'> {
  tuple?: CreateChain[]
}