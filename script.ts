import { v } from "./lib/Validator/index.js";

const arrScheme = v.array(
  v.string()
).min(2)

console.log(arrScheme.safeParse(['1', '2']))