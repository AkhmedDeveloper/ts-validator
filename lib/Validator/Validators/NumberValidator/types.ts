import { CreateChain, TypeResolutionObject } from "../../types.js";

export interface NumberResolutionObject extends TypeResolutionObject<'number'> {
  min?: number;
  max?: number;
  isInteger?: boolean

  typeofNum?: 'positive' | 'negative' | 'nonnegative' | 'nonpositive'
}

export interface CreateChainOfNumber extends CreateChain {
  min: (val: number) => CreateChainOfNumber;
  max: (val: number) => CreateChainOfNumber;
  int: () => CreateChainOfNumber,

  positive: () => CreateChainOfNumber,
  negative: () => CreateChainOfNumber
  nonnegative: () => CreateChainOfNumber
  nonpositive: () => CreateChainOfNumber,
}

