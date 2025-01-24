import { CreateChain } from "./types.js";
import { ArrayValidator } from "./Validators/ArrayValidator/ArrayValidator.js";
import { BooleanValidator } from "./Validators/BooleanValidator/BooleanValidator.js";
import { NumberValidator } from "./Validators/NumberValidator/NumberValidator.js";
import { ObjectValidator } from "./Validators/ObjectValidator/ObjectValidator.js";
import { ObjectResolutionObject } from "./Validators/ObjectValidator/types.js";
import { StringValidator } from "./Validators/StringValidator/StringValidator.js";
import { TupleValidator } from "./Validators/TupleValidator/TupleValidator.js";
import { UnionValidator } from "./Validators/UnionValidator/UnionValidator.js";

const stringValidator = new StringValidator();
const numberValidator = new NumberValidator();
const booleanValidator = new BooleanValidator();
const tupleValidator = new TupleValidator();
const objectValidator = new ObjectValidator();
const unionValidator = new UnionValidator();
const arrayValidator = new ArrayValidator();

class Validator {
  string() {
    // this.changeCurrentTypeResolution({ type: "string" });

    return stringValidator.createChain();
  }

  number() {
    return numberValidator.createChain();
  }

  boolean() {
    return booleanValidator.createChain();
  }

  tuple(tuple: CreateChain[]) {
    return tupleValidator.createChain({ type: "tuple", tuple });
  }

  object<T extends object>(obj: ObjectResolutionObject<T>["object"]) {
    return objectValidator.createChain({ type: "object", object: obj });
  }

  union(unions: CreateChain[]) {
    return unionValidator.createChain({ type: "union", unions });
  }

  array(resolutionItem: CreateChain) {
    return arrayValidator.createChain({
      type: "array",
      arrayType: resolutionItem,
    });
  }
}

export const v = new Validator();
