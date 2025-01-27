import { CreateChain, CreateChainMethods, TypeResolutionObject } from "../../types.js";

export interface NumberResolutionObject extends TypeResolutionObject<"number"> {
  min?: number;
  max?: number;
  isInteger?: boolean;

  typeofNum?: "positive" | "negative" | "nonnegative" | "nonpositive";
}

export interface CreateChainOfNumber extends CreateChain<CreateChainOfNumber> {
  min: (val: number) => this;
  max: (val: number) => this;
  int: () => this;

  positive: () => this;
  negative: () => this;
  nonnegative: () => this;
  nonpositive: () => this;

  

  resolution: NumberResolutionObject;
}


