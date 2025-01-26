import { CreateChainOfArray } from "./Validators/ArrayValidator/types.js";
import { CreateChainOfBolean } from "./Validators/BooleanValidator/types.js";
import { CreateChainOfNumber } from "./Validators/NumberValidator/types.js";
import {
  CreateChainOfObject,
  ObjectResolutionObject,
} from "./Validators/ObjectValidator/types.js";
import { CreateChainOfString } from "./Validators/StringValidator/types.js";
import { CreateChainOfTuple } from "./Validators/TupleValidator/types.js";
import { CreateChainOfUnion } from "./Validators/UnionValidator/types.js";

export type PrimitiveType = "string" | "number" | "boolean";

export type ObjectType = {
  [key: string | number]: any;
};

export type ComplexType = "object" | "array";
export type CustomComplexType = "union" | "tuple";
export type ResolutionType = PrimitiveType | ComplexType | CustomComplexType;

export interface TypeResolutionObject<
  T extends ResolutionType = ResolutionType
> {
  type: T;
  isPartial?: boolean;
}

export type ErrorStrings =
  | "Type Is Not Equal"
  | `Min Length Is ${number}`
  | `Max Length Is ${number}`
  | `String Is Will Be Lowercased`
  | `String Is Will Be Uppercased`;

export type FailedParse = {
  success: false;
  raise: `ParseError: ${string}`;
  position?: string;
};
export type SuccessParse = {
  success: true;
  data: any;
};
export type SafeParseRes = SuccessParse | FailedParse;

export type Override<T, U> = Omit<T, keyof U> & U;

export type GetKeysInRow<T, N extends string | undefined = undefined> = {
  [key in keyof T]: T[key] extends object
    ? GetKeysInRow<T[key], `${key & string}`>
    : N extends string
    ? `${N}.${key & string}`
    : `${key & string}`;
}[keyof T];

type IncrementDepth<T extends any[]> = [...T, any];
export type MaxDepth = 3;
// Основной тип DeepOmit с проверкой глубины
export type DeepOmit<
  T extends object,
  K extends string,
  BaseKey extends string | undefined = undefined,
  Depth extends any[] = []
> = Depth["length"] extends MaxDepth
  ? T
  : BaseKey extends string
  ? {
      [key in keyof T as `${BaseKey}.${key & string}` extends K
        ? never
        : key]: T[key] extends { [key: string]: Exclude<unknown, Function> }
        ? DeepOmit<
            T[key],
            K,
            `${BaseKey & string}.${key & string}`,
            IncrementDepth<Depth>
          >
        : T[key];
    }
  : {
      [key in keyof T as key extends K ? never : key]: T[key] extends {
        [key: string]: Exclude<unknown, Function>;
      }
        ? DeepOmit<T[key], K, key & string, IncrementDepth<Depth>> // Увеличиваем глубину
        : T[key];
    };

export interface  CreateChainGeneralMethods {
  partial: () => DeepOmit<this, "resolution.isPartial"> & {
    resolution: { isPartial: true };
  };
  required: () => DeepOmit<this, "resolution.isPartial"> & {
    resolution: { isPartial: false };
  };
}

export function isPartial(
  resolution: TypeResolutionObject
): resolution is TypeResolutionObject & { isPartial: true } {
  return resolution.isPartial ? true : false;
}

export interface CreateChain extends CreateChainGeneralMethods {
  safeParse: (val?: any) => SafeParseRes;
  parse: (val: any) => SuccessParse | never;
  resolution: TypeResolutionObject;
}

export type ExtendsCreateChain<T> = T extends CreateChain ? T : never;
