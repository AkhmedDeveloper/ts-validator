import {
  TypeResolutionObject,
  CreateChain,
  CreateChainPartialed,
  CreateChainRequired,
  CreateChainBase,
} from "../types.js";

export abstract class ValidatorOfType<T extends CreateChain> {
  public abstract createChain(resolution?: T["resolution"]): T;

  protected generalMethods(resolution: T["resolution"]): CreateChainBase {
    return {
      partial: <T>() => {
        resolution.isPartial = true;
        return this.createChain(resolution) as unknown as T
      },
      required: <T>() => {
        resolution.isPartial = false;
        return this.createChain(resolution) as unknown as T
      },
      resolution,
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
