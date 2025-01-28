import { v } from "./Validator.js";

export type ObjectType = {
  [key: string | number]: any;
};

export type PrimitiveType = "string" | "number" | "boolean";
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
export type SuccessParse<T> = {
  success: true;
  data: T;
};
export type SafeParseRes<SuccessType> = SuccessParse<SuccessType> | FailedParse;

export type Override<T, U> = Omit<T, keyof U> & U;

export type GetKeysInRow<T, N extends string | undefined = undefined> = {
  [key in keyof T]: T[key] extends object
    ? GetKeysInRow<T[key], `${key & string}`>
    : N extends string
    ? `${N}.${key & string}`
    : `${key & string}`;
}[keyof T];


export interface CreateChainPartialed<T extends TypeResolutionObject> extends CreateChain {
  resolution: Omit<T, 'isPartial'> & { isPartial: true };
}
export interface CreateChainRequired<T extends TypeResolutionObject> extends CreateChain {
  resolution: Omit<T, 'isPartial'> & { isPartial: false };
}

export interface CreateChainBase<T extends CreateChain = CreateChain> {
  resolution: TypeResolutionObject;
  partial: (this: T) => Omit<this, 'resolution'> & CreateChainPartialed<this['resolution']>;
  required: (this: T) => Omit<this, 'resolution'> & CreateChainRequired<this['resolution']>;
}

export interface CreateChainMethods<T extends CreateChainBase | false = false> {
  safeParse: (
    val?: any
  ) => SafeParseRes<T extends CreateChainBase ? v.Infer<T> : any>;
  parse: (
    val: any
  ) => SuccessParse<T extends CreateChainBase ? v.Infer<T> : any> | never;
}

export interface CreateChain<T extends CreateChainBase | false = false>
  extends CreateChainBase,
    CreateChainMethods<T> {}

export type ExtendsCreateChain<T> = T extends CreateChain ? T : never;
