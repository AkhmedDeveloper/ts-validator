import { v } from "./lib/Validator/index.js";

const boolScheme = v.boolean();

const numScheme = v.number().min(0).max(1000).int().positive();
console.log(numScheme.safeParse(10));

const stringScheme = v.string().uppercased().min(2);

const unionScheme = v.union([v.string(), v.number()]);


const objScheme = v.object({
  a: v.string().partial(),
  b: v.object({
    name: v.string()
  })
});
objScheme.shape.a['resolution']

const tupleScheme = v.tuple([v.string(), v.number()]);


const arrScheme = v.array(
  v.object({
    a: v.object({
      b: v.string(),
    }),
  })
);
arrScheme.element

console.log(stringScheme);
// unionScheme['resolution']['unions']
type c = v.Infer<typeof objScheme>
const h: c = {
  b: 'asd',
}


type y = typeof objScheme['resolution']['object']['a']['resolution']