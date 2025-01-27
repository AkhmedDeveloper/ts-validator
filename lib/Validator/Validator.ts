import { CreateChain, CreateChainBase, Override } from "./types.js";
import { ArrayValidator } from "./Validators/ArrayValidator/ArrayValidator.js";
import { CreateChainOfArray } from "./Validators/ArrayValidator/types.js";
import { BooleanValidator } from "./Validators/BooleanValidator/BooleanValidator.js";
import { CreateChainOfBolean } from "./Validators/BooleanValidator/types.js";
import { NumberValidator } from "./Validators/NumberValidator/NumberValidator.js";
import { CreateChainOfNumber } from "./Validators/NumberValidator/types.js";
import { ObjectValidator } from "./Validators/ObjectValidator/ObjectValidator.js";
import {
  CreateChainOfObject,
  ObjectItemsType,
  ObjectResolutionObject,
} from "./Validators/ObjectValidator/types.js";
import { StringValidator } from "./Validators/StringValidator/StringValidator.js";
import { TupleValidator } from "./Validators/TupleValidator/TupleValidator.js";
import { CreateChainOfTuple } from "./Validators/TupleValidator/types.js";
import { CreateChainOfUnion } from "./Validators/UnionValidator/types.js";
import { UnionValidator } from "./Validators/UnionValidator/UnionValidator.js";

export namespace v {
  const stringValidator = new StringValidator();
  const numberValidator = new NumberValidator();
  const booleanValidator = new BooleanValidator();
  const tupleValidator = new TupleValidator();
  const objectValidator = new ObjectValidator();
  const unionValidator = new UnionValidator();
  const arrayValidator = new ArrayValidator();

  export function string() {
    return stringValidator.createChain({ type: "string" });
  }

  export function number() {
    return numberValidator.createChain();
  }

  export function boolean() {
    return booleanValidator.createChain();
  }

  export function tuple(tuple: CreateChain[]) {
    return tupleValidator.createChain({ type: "tuple", tuple });
  }

  export function object<T>(obj: ObjectItemsType<T>) {
    return objectValidator.createChain({ type: "object", object: obj });
  }

  export function union<T extends CreateChain[]>(unions: T): T[number] {
    return unionValidator.createChain({ type: "union", unions });
  }

  export function array<T extends CreateChain>(resolutionItem: T) {
    return arrayValidator.createChain<T>({
      type: "array",
      arrayType: resolutionItem,
    });
  }

  type Partialize<T extends CreateChainBase, Type extends any> = T extends {
    resolution: { isPartial: true };
  }
    ? Type | undefined
    : Type;

  export type Infer<T extends CreateChainBase> = T extends CreateChainOfUnion
    ? T["resolution"]["unions"][keyof T["resolution"]["unions"]]
    : T extends CreateChainOfTuple
    ? T["resolution"]["tuple"]
    : T extends CreateChainOfArray<any>
    ? Infer<T["resolution"]["arrayType"]>[]
    : T["resolution"]["type"] extends "string"
    ? Partialize<T, string>
    : T extends CreateChainOfNumber
    ? Partialize<T, number>
    : T extends CreateChainOfBolean
    ? Partialize<T, boolean>
    : T extends CreateChainOfObject
    ? T extends CreateChainOfObject<T["resolution"]["object"]>
      ? Override<
          {
            [K in keyof T["resolution"]["object"]]: Infer<
              T["resolution"]["object"][K]
            >;
          },
          {
            [K in keyof T["resolution"]["object"] as T["resolution"]["object"][K]["resolution"]["isPartial"] extends true
              ? K
              : never]?: Infer<T["resolution"]["object"][K]>;
          }
        >
      : never
    : never;
}
