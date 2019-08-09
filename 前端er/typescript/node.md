typescript学习笔记
[TOC]

## 入门
1、全局安装
```JavaScript
npm install -g typescript
```
2、编译代码
```JavaScript
tsc greeter.ts
```

## 基础类型
1、元素类型
```JavaScript
// 布尔值
let isDone: boolean = false

//数字
注：需要注意的是，与JavaScript一样，ts里面的所有数字都是浮点数，类型为number，ts除了支持十进制和十六进制字面量，还支持ECMAscript 2015引入的二进制以及八进制字面量
let decLiteral: number = 6
let hexLiteral: number = 0xf00d
let binaryLiteral: number = 0b1010
let octalLiteral: number = 0o744

// 字符串
let name: string = 'loydLee'
name = 'loyd'
注: 支持模板字符串``
```
2、其他
```JavaScript
// 数组
方式一：在元素类型后面接上[]
let list: number [] = [1,2,3]
方式二：使用数组泛型，Array<元素类型>：
let list: Array<number> = [1,2,3]

// 元祖
解释：元祖类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同
let x: [string, number] //声明一个string,number的元祖
x = ['hello', 10] // ok
x= [10, 'hello'] // 不符合声明规范的时候，Error

console.log(x[0].substr(1)) // ok-访问已知索引的元素
console.log(x[1].substr(1)) // Error：'number' does not have 'substr'

此外访问一个越界的元素，使用联合类型替代
x[3] = 'world' // 因为字符串存在于元祖设定，因此可以赋值
console.log(x[5].toString()) // ok 元祖中类型都有toString
x[6] = boolean // Error,boolean不存在与元祖中

// 枚举
解释：enum类型是对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

默认情况下，从0开始为元素编号，我们也可以手动的指定成员的数值
enum Color {Red = 1, Green, Blue} // 手动的改成从1开始编号
let c: Color = Color.Green;

enum Color {Red = 1, Green = 2, Blue = 4} // 全部手动赋值
let c: Color = Color.Green;

使用枚举类型方便我们由枚举的值得到它的名字，比如我们知道一个值为2，但是我们不确定它映射的名字，可以进行查找
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2

// Any
解释：js的时候，我们经常会遇到这种情况：声明变量的时候还不知道这个值的类型，大多数情况下我们会声明为空字符串/数组/对象，然后实际赋值的时候就会出现跨类型赋值，这种情况下，我们并不希望类型检查器对这些值进行检查，ts提出了any
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

为何使用：在对现有代码进行改写的时候，any十分有效，对比Object, Object只是允许我们给它赋任意的值，但是不能调用上面的方法，即使你赋值的数据类型真的存在这些方法
此外，当我们只知道一部分数据类型，也有效
let list: any[] = [1, true, "free"];

list[1] = 100;

// Void
解释：void类型与any相反，它表示没有任何类型，当一个函数没有返回值的时候，返回类型为void
function warnUser(): void {
    console.log("This is my warning message");
}
注意：声明void的变量只能赋值为undefined或者null

// NUll和Undefined
默认情况下null和undefined是所有类型的子类型，我们可以把null和undefined赋值给number类型的变量（指定了strictNullChecks标记除外）

// Never
解释：never表示永远不存在的类型，eg:never类型总会抛出异常或者根本不会有返回值的函数表达式或者箭头函数表达式的返回值类型，变量也可能是never类型，当它们被永不为真的类型保护锁约束时

never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}

// Object
解释：object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型

使用object类型，就可以更好的表示像Object.create这样的API
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error

// 类型断言
1、“尖括号”语法：
let testValue: any = "this is a string"

let strLength: number = (<string>testValue).length

2、as语法：
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

## 接口