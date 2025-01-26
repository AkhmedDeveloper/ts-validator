import { CreateChain, TypeResolutionObject } from "../../types.js";

export interface CreateChainOfString extends CreateChain {
  min: (val: number) => this;
  max: (val: number) => this;

  uppercased: () => this;
  lowercased: () => this;
  resolution: StringResolutionObject,
}

export interface StringResolutionObject extends TypeResolutionObject<"string"> {
  min?: number;
  max?: number;
  uppercased?: boolean;
  lowercased?: boolean;
}

/** 

{
  min: () => this
  max: () => this
  uppercased: () => this;
  lowercased: () => this;

  resolution: {
    isPartial: boolean;
    uppercased: boolean;
  }
}

**/
