import { v } from "./lib/Validator/index.js";

const boolScheme = v.boolean();

const numScheme = v.number().min(0).max(1000).int().positive();
console.log(numScheme.safeParse(10));

const stringScheme = v.string().uppercased().min(2);
console.log(stringScheme.safeParse("asd"));

const unionScheme = v.union([v.string(), v.number()]);
console.log(unionScheme.safeParse("asd"));

const objScheme = v.object({
  a: v.string().lowercased(),
  b: v.object({
    z: v.array(v.boolean()),
  }),
});

const tupleScheme = v.tuple([v.string(), v.number()]);

const arrScheme = v.array(
  v.object({
    a: v.object({
      b: v.string(),
    }),
  })
);

console.log(arrScheme.safeParse([{
  a: {
    b: 123
  }
}]))
