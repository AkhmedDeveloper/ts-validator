import { ValidatorOfType } from "./Validators/ValidatorAbstract";

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
  partial: () => this;
  required: () => this;
}

export interface CreateChain extends CreateChainGeneralMethods {
  safeParse: (val?: any) => SafeParseRes;
  parse: (val: any) => SuccessParse | never;
  resolution: TypeResolutionObject;
  
}

// CreateChain -> CreateChainGeneralMethods -> CreateChainOfNumber 