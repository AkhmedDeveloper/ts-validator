import { v } from "./lib/Validator/index.js";

const boolScheme = v.boolean();

const numScheme = v.number().min(0).max(1000).int().positive();
console.log(numScheme.safeParse(10));

  const stringScheme = v.string().partial()

const res = stringScheme.safeParse(123)
if(res.success){
  res.data 
}


const unionScheme = v.union([v.string(), v.number()])




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



const objScheme = v.object({
  a: v.string().partial()
});

type c = v.Infer<typeof objScheme>
const h: c = {
  a: 'asd'
}




type y = typeof objScheme['resolution']['object']['a']['resolution']