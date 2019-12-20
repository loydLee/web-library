# typescript学习笔记

## 入门
1、全局安装
```js
npm install -g typescript
```
2、编译代码
```js
tsc greeter.ts
```

## 基础类型
1、元素类型
```js
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
```js
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
*注意*：react jsx语法中只能使用第二种

## 接口
```js
interface obj {
    label: string;
}
// 声明了一个名叫obj的接口，它有一个label属性并且类型为string的对象
```
- 可选属性
```js
interface obj {
    color? : string;
    width? : number;
}
```
- 只读属性
```js
interface obj {
    readonly x: number;
    readonly y: string；
}
**注意：**ts具有ReadonlyArray<T>类型，与Array<T>相似，只是把所有的可变方法去掉，以确保数组创建后不能被修改
```
```js
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
就算把整个ReadonlyArray赋值到一个普通数组也不可以，但是可以通过类型断言进行重写：
a = ro as number[];
```
**readonly or const**
变量：const 属性：readonly

- 字符串索引签名
```js
interface obj {
    color?: string;
    width?: number;
    [propName: string]: any;
}
表示obj可以有任意数量的属性，并且只要他们不是color或者width,就无所谓他们的类型是什么
```

- 函数类型
```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}
定义一个调用签名，作为一个只有参数列表和返回值类型的函数定义，参数列表里面的每个参数都需要名字以及类型

使用：
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
```

- 索引类型
```js
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

定义StringArray接口，它具有索引签名。 这个索引签名表示了当用 number去索引StringArray时会得到string类型的返回值
```
**注意**ts支持两种索引签名：字符串和数字，我们可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型

- 类类型
```js
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

可以在接口中描述一个方法，在类里面实现它
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

- 接口继承
```js
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;

继承多个接口
interface Square extends Shape, PenStroke {
    sideLength: number;
}
```
- 混合类型
```js
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## 类
- public
typescript中成员默认为public

- private
成员不能在声明它的类的外部访问
```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.
```

- protected
protected修饰符与private的行为很相似，但是，protected的成员在派生类中仍然可以访问
```js
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 错误
```

- readonly
属性只读，只读属性必须在声明时或构造函数里被初始化。
```js
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```

- 参数属性
```js
class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

- 存取器
```js
let passcode = "secret passcode"; // passcode不对的时候提示无权限进行修改

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

- 静态属性
除开类的实例成员，类的静态成员存在于类本身而不是类的实例上，当我们需要访问它的时候，需要跟上类名
```js
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

- 抽象类
抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法。
```js
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```
注意：抽象类中的抽象方法不包含具体实现并且必须在派生类中实现，抽象方法的语法与接口方法相似，两者都是定义方法签名但不包含方法体，但是抽象方法必须包含abstract关键字并且可以包含访问修饰符

## 函数

- 为函数定义类型
```js
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };
```

- 推断类型
```js
// myAdd has the full function type
let myAdd = function(x: number, y: number): number { return x + y; };

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
// ts中传递给一个函数的参数个数必须与函数期望的参数个数一致
```

- 可选参数
在参数旁使用?实现可选参数的功能，**可选参数必须跟在必选参数后面**
```js
function buildName(firstName: string, lastName?: string) {}
```

## 声明文件

有些时候我们想要引用第三方库，eg:jQuery，在js中我们只需要简单的引入jQuery,然后就可以开启愉快的ctrl c + ctrl v了，但是，在ts中，编译器并不知道我们熟悉的$是什么玩意儿，这时候我们就需要媒婆(声明文件)出场了
```js
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```
然鹅，declare我们并没有真的去定义一个变量，我们只是全局定义了jQuery的变量类型，它仅用于编译时的变量检查而已

一般情况下，我们把声明语句放到一个单独的以.d.ts为后缀的文件中，ts会解析项目中所有的.ts文件，因此也包括所有的.d.ts文件，因此，一处定义，其他.ts文件也可以获取到相关定义。