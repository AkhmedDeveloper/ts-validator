## Озаглавие

`TS-Validator` - это проект, суть которой является валидации полей. Ее синтаксис похож на синтаксис `Zod`. Я ее писал для практики своих знаний на TS и я постарался сделать упор на чистый и расширяемый код.

---

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

#### Object Scheme

```typescript
const objScheme = v.object({
	username: v.string().min(2).max(12),
	age: v.number().int().positive().min(18).max(99).partial(),
	address: v.object({
		street: v.string()
	})
})
```

В данном примере мы создали схему обьекта. И также мы сразу видим сильное практическое применение данной схемы для реальных проектов.

В ней мы указали:

`username` - это строка от 2 до 12 символов

`age` - это целочисленное и позитивное число от 18 до 99. Это поле является не обязательным

`address` - вложенный обьект с полем `street`, которая должна являться строкой

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

#### Array Scheme

```typescript
const objScheme = v.object({
	field: v.string().min(1).max(10).lowercased().partial()
})

const arrScheme = v.array(objScheme).nonempty()

arrScheme.safeParse([{field: "asd"}]) // {success: true, data: [{field: "asd"}]}
arrScheme.safeParse([{}]) // {success: true, data: [{}] }
arrScheme.safeParse([]) // {success: false, raise: "ParseError: Array Should Not Be Empty" }
```

В данном примере мы обьявили Array тип, значениями которого должны являться обьекты

`.nonempty()` - массив не должен быть пустым

#### Union Scheme

```typescript
const unionScheme = v.union([v.string(), v.number()])

unionScheme.safeParse('asd') // {success: true, data: 'asd'}
unionScheme.safeParse(123) // {success: true, data: 123}
```

Здесь мы определяем Union тип. Это тип который может состоять из нескольких типов.

## Все методы типов

#### General Type

```typescript
v.type().parse() // сопоставляет тип со значение. При несоответствии выбрасывает ошибку

v.type().safeParse() // делает безопасное сопоставление значений. Либо {success: true, data: ...}. Либо {success: false, raise: ...}

v.type().partial() // делает тип не обязательным

v.type().required() // делает тип обязательным (по умолчанию)
```

В данном случае `.type()` является обобщением типа, и означает, что на ее месте может быть любой тип

Также для типов `Boolean/Union/Tuple` нету специфичных методов для их типа, поэтому они довольствуются лишь общими методами описанные выше в примере

#### String Type

```typescript

v.string().min(5) // Минимальная длина строки 5

v.string().max(10) // Максимальная длинна строки 10

v.string().lowercased() // Строка должна быть с нижнего регистра

v.string().uppercased() // Строка должна быть с верхнего регистра

```

#### Number Type

```typescript

v.number().min(5) // Минимальное число - 5

v.number().max(10) // Максимальное число - 10

v.number().int() // Целочисленно значение числа

v.number().positive() // Число больше 0

v.number().negative() // Число меньше 0

v.number().nonpositive() // Число меньше или равна 0

v.number().nonnegative() // Число больше или равна 0

```

#### Object Type

```typescript
v.object().partialFields() // Все поля становятся не обязательными

v.object().strict() // Строгая проверка полей. Не разрешается присутствие сторонних полей кроме описанных в типе

v.object().shape.fieldName // Достает схему поля fieldName

```

#### Array Type

```typescript
v.array().nonempty() // Массив не должен быть пустым

v.array().min(1) // Минимальная длина массива - 1

v.array().max(5) // Макимальная длина массива - 5

v.array().length(4) // фиксированная длина массива - 4

v.array().element // Достает схему элемента массива
```

## О системе. И о ее реализации

Самую важную роль в этом проекте играет архитектура. Без нее в таком многосвязанном проекте завязанный на типах в разных ее проявлениях, она превратиться в кусок не поддерживаемого легаси-кода. 

Реализуются паттерны DRY, в частности мы вынесли общие методы в абстрактный класс, и сделали их переиспользуемыми

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
