import { v } from "./lib/Validator/index.js";

const objScheme = v.object({
  a: v.number().max(3).partial().partial(),
  b: v.object({})
})


const tSheme = objScheme.partialFields()


const boolScheme = v.boolean().partial()
