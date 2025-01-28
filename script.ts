import { v } from "./lib/Validator/index.js";

const boolScheme = v.boolean();

const numScheme = v.number().min(0).max(1000).int().positive().max(1);
numScheme.parse(10);

const stringScheme = v.string().partial();
stringScheme.safeParse(2);
stringScheme.safeParse(123);

const unionScheme = v.union([v.string(), v.number()]);
unionScheme.safeParse("asd");

const tupleScheme = v.tuple([v.string(), v.number()]);
tupleScheme.safeParse([1, 2]);

const arrScheme = v.array(
  v.object({
    a: v.object({
      b: v.string(),
    }),
  })
);
const arrElement = arrScheme.element;

const objScheme = v.object({
  a: v.string().partial(),
});

type ObjSchemeType = v.Infer<typeof objScheme>;
const obj: ObjSchemeType = {
  a: "asd",
};
