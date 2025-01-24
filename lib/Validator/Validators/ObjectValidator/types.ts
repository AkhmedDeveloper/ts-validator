import { CreateChain, TypeResolutionObject } from "../../types.js"

export type ObjectResolutionItems<T extends object> = {
  [key in keyof T]: CreateChain
}
export interface ObjectResolutionObject<T extends object> extends TypeResolutionObject<'object'> {
  object: ObjectResolutionItems<T>
  isStrict?:boolean;
}

export function isCreateChain(obj: any): obj is CreateChain {
  return obj?.resolution ? true : false
}

export interface CreateChainOfObject<T extends object> extends CreateChain {
  partialFields: () => CreateChain
  strict: () => CreateChain
  shape: ObjectResolutionItems<T>
}