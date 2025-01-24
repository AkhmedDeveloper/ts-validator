import {
  TypeResolutionObject,
  CreateChain,
  CreateChainGeneralMethods,
} from "../types.js";

export abstract class ValidatorOfType<T extends CreateChain> {
  public abstract createChain(resolution?: TypeResolutionObject): T;

  protected generalMethods(resolution: TypeResolutionObject): {
    partial: () => T;
    required: () => T;
  } {
    return {
      partial: () => {
        resolution.isPartial = true;
        return this.createChain(resolution);
      },
      required: () => {
        resolution.isPartial = false;
        return this.createChain(resolution);
      },
    };
  }

  parseGeneralMethods(resolution: TypeResolutionObject) {
    return {
      type(val: any) {
        if (resolution.isPartial === true && val === undefined) return true;
      },
    };
  }
}
