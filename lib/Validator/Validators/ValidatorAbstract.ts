import {
  TypeResolutionObject,
  CreateChain,
  CreateChainGeneralMethods,
  DeepOmit,
} from "../types.js";

export abstract class ValidatorOfType<T extends CreateChain> {
  public abstract createChain(resolution?: TypeResolutionObject): T;

  protected generalMethods(
    resolution: TypeResolutionObject
  ): {[key: string]: () => CreateChain} {
    return {
      partial: () => {
        resolution.isPartial = true;
        return this.createChain(resolution) as any;
      },
      required: () => {
        resolution.isPartial = false;
        return this.createChain(resolution) as any;
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
