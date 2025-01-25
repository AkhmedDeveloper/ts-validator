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

export interface CreateChainGeneralMethods {
  partial: () => this & {resolution: {isPartial: true}};
  required: () => this & {resolution: {isPartial: false}};
}

export interface CreateChain extends CreateChainGeneralMethods {
  safeParse: (val?: any) => SafeParseRes;
  parse: (val: any) => SuccessParse | never;
  resolution: TypeResolutionObject;
}

export type ExtendsCreateChain<T> = T extends CreateChain ? T : never;
