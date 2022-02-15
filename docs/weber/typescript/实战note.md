# ts 实战篇

## 类型扩展

定义类型两种方式：接口(interface)和类型别名(type alias),一般情况下，设计公共 API(比如编辑一个库)的时候，使用 interface，这样可以方便使用者继承接口，在定义组件属性(props)和状态(state)的时候，建议使用 type,因为 type 的约束性更强，此外，type 不能二次编辑，而 interface 可以随时扩展

二者可以相互扩展

```js
// interface extends type alias

type PartialPointX = {
  x: number,
};

interface Point extends PartialPointX {
  y: number;
}

// type alias extends interface
interface PartialPointX {
  x: number;
}

type Point = PartialPointX & { y: number };
```

## 使用 TypeScript 支持的 JS 新特性

- 可选链?.
- 空值合并运算符

```js
const user = {
  level: 0,
};

const a = user.level || "暂无等级"; // 暂无等级
const b = user.level ?? "暂无等级"; // 0
```

## 访问修饰符

- public : 公有类型，在类里面、子类、类外面都可以访问到，如果不加任何修饰符，默认为此访问级别；
- protected : 保护类型，在类里面、子类里面可以访问，在类外部不能访问；
- private : 私有类型，只能在当前类内部访问。

## 善用类型收窄

- 类型断言
- 类型守卫
- 双重断言

*注意*tsx 语法中类型断言不可使用<>语法，只能使用 as，因为<>容易跟泛型冲突

## 枚举

*注意*普通枚举后置项目在前面内容已经有计算内容的时候无法为空

```js
enum Char {
    a = 'ss'.length,
    b // error
}

enum Char {
    a = 3,
    b //right 设置枚举初始值
}
```

## 善用高级类型

- 类型索引(keyof)
  keyof 类似于 Object.keys，用于获取一个接口中 Key 的联合类型：

```js
interface Button {
  type: string;
  text: string;
}

type ButtonKeys = keyof Button
// 等同于
type ButtonKeys = ‘type’ | 'text'
```

- 类型约束(extends)
  TypeScript 中的 extends 关键词不同于 Class 后使用 extends 的继承作用，一般在泛型内使用，主要作用是对泛型加以约束

  ```js
  type BaseType = string | number | boolean
  // 这里表示copy的参数只能是字符串，数字，布尔这几种基础类型
  function copy<T extends BaseType>(arg: T):T {
      return arg
  }

  const num = copy(123)

  const arr = copy([]) // error
  ```

  extends 经常与 keyof 一起使用，例如我们有一个 getValue 方法专门用来获取对象的值，但是这个对象并不确定，我们就可以使用 extends 和 keyof 进行约束

  ```js
  function getValue<T,K extends keyof T>(obj:T,key:K) {
      return obj[key]
  }

  const obj = {a: 1}
  const a = getValue(obj, 'a')
  const b = getValue(obj, 'b') // error

  // 当传入对象没有的key的时候，就会报错
  ```

- 类型映射(in)
  in 关键词的作用主要是做类型的映射，遍历已有接口的 key 或者是遍历联合类型，以内置的泛型 Readonly 为例，实现如下
  ```js
    type Readonly(T) = {
        readonly [P in keyof T]:T[P]
    }
  ```
