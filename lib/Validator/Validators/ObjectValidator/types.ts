import {
  CreateChain,
  ExtendsCreateChain,
  TypeResolutionObject,
} from "../../types.js";

export type ObjectItemsType<T> = {
  [K in keyof T]: T[K] extends CreateChain ? T[K] : never;

}

export interface ObjectResolutionObject<T>
  extends TypeResolutionObject<"object"> {
  object: ObjectItemsType<T>
  isStrict?: boolean;
}

export function isCreateChain(obj: any): obj is CreateChain {
  return obj?.resolution ? true : false;
}

export interface CreateChainOfObject<T = {}>
  extends CreateChain {
  shape: ObjectItemsType<T>
  resolution: ObjectResolutionObject<T>;

  partialFields: () => this;
  strict: () => this;
}
