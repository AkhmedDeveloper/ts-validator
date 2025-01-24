## Озаглавие

`TS-Validator` - это проект, суть которой является валидации полей. Ее синтаксис похож на синтаксис `Zod`. Я ее писал для практики своих знаний на TS и я постарался сделать упор на чистый и расширяемый код.

---

## О системе. И о ее реализации

Для начала у нас есть точка входа, основной класс названный `Validator`. Дальше для удобства я вынес каждую в подкатегорию (string, number и т.д.) в отдельный класс который наследуется от абстрактного класса ValidatorAbstract который повелевает классам подкатегорий реализовывать общие методы (parse, safeParse), и также содержит уже реализованные методы (partial, required). А дальше каждый класс подкатегорий реализовывает свою логику парсинга данных (parse, safeParse), а также реализовывает уникальные методы для своей подкатегории (Для number например: positive, min)

Логика обработки для `Object/Array/Union`, отличается от логики обработки примитивов. Так для `Object` мы должны задать произвольный ключ, и обязательно для ключа должны передать экземпляр Validator класса. А дальше при вызове `parse/safeParse` методов для схемы у нас пробегает по всем ключам и вызывает `safeParse` метод для каждого поля.

```typescript
const scheme = v.object({
	innerObj: v.object({
		field: v.string().lowercased().min(2)
	})
})

scheme.safeParse()
```

Таким образом, если мы создадим обьект внутри обьекта в схеме, то цепочек вызовов `safeParse` у нас будет 3.
`safeParse` (явный вызов с кода) `->` `safeParse` (вложенный обьект) `->` `safeParse` (для поля field)
Примерно такая же реализация присутствует в Array/Union типах

Благодаря такой архитектуре мы можем создавать сколь угодно вложенные обьекты или массивы.

## Примеры реализаций схем разных типов

#### Boolean Scheme

```typescript
const boolScheme = v.boolean()

boolScheme.safeParse(true) // {success: true, data: true}
```

Это буквально самый простой тип для создания схемы.
Тип Boolean не содержит каких-то уникальных методов, поэтому разбирать мы ее не будем

#### Number Scheme

```typescript
const numScheme = v.number().int().positive()

numScheme.safeParse(10) // {success: true, data: 10}
numScheme.safeParse(10.2) // {success: false, raise: 'ParseError: The Number Is Must Be An Integer'}
```

В данном примере мы создаем схему типа number.
`.int()` - число должно быть без плачающей точки
`.positive()` - число должно быть больше 0

#### String Scheme

```typescript
const strScheme = v.string().lowercased()

strScheme.safeParse('asd') // {success: true, data: 'asd'}
strScheme.safeParse('ASD') // {success: false, raise: 'ParseError: String Is Will Be Lowercased'}
```

Схема валидации строки

`.lowercased()` - строка с нижнего регистра

#### Tuple Scheme

```typescript
const tupleScheme = v.tuple([v.string(), v.number()])

tupleScheme.safeParse(['asd', 123]) // {success: true, data: ['asd', 123]}
tupleScheme.safeParse(['asd', '123']) // {success: false, raise: 'ParseError: Type Is Not Equal', position: 'Tuple( Index: 1 ) '}
```

Здесь мы сталкаваемся со сложными типами. В данном случае `tuple` типом.

`Tuple` - это массивы в которых мы знаем кол-во значений и их типы.

Для сложных типов `safeParse` при ошибке также выдает их позиции, что очень удобно при отладке кода и нахождению ошибок

#### Array Scheme

```typescript
const arrScheme = v.array(v.string())

arrScheme.safeParse(['a', 's', 'd']) // {success: true, data: ['a', 's', 'd']}
```

Простая схема валидации массива

#### Object Scheme

```typescript
const objScheme = v.object({
	username: v.string().min(2).max(12),
	age: v.number().int().positive().min(18).max(99).partial()
	address: v.object({
		street: v.string()
	})
})
```

В данном примере мы создали схему обьекта. И также мы сразу видим сильное практическое применение данной схемы для реальных проектов.

В ней мы указали:
	1) `username` - это строка от 2 до 12 символов
	2) `age` - это целочисленное и позитивное число от 18 до 99. Это поле является не обязательным
	3) `address` - вложенный обьект с полем `street`, которая должна являться строкой


##### Получение подсхем

```typescript
objScheme.shape.username
```

Такой записью мы можем достать подсхему (в данном случае username), и можем ее использовать отдельно для других нужд


##### Строгие поля

```typescript
const strictObjScheme = objScheme.strict()
```

Метод `.strict()` делает поля строгими. При парсинге нам выдаст ошибку если у нас есть лишние поля


##### Partial поля

Метод `.partialFields()` от метода `.partial()` отличается тем, что делает не сам обьект не обязательным, а все его поля.
