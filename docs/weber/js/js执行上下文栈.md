# js执行上下文栈

## 可执行代码

全局代码，函数代码，eval代码

执行一个函数的时候，进行准备工作，这个准备工作就是执行上下文（execution context）
也就是说：遇到函数执行的时候，就会创建一个执行上下文，对于每个执行上下文，有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

```js
var a = [1];
function f(a){
a[100] = 3
a = [1,2,3];>
}
f(a)
console.log(a);
```

输出一个长度为101的数组，且第一个元素是1，最后一个元素是3，因为js函数传参都是按值传递，a本来指向数组的指针（值），当函数调用传入a建立了一个新指针指向a,也就是a(函数)->a->数组，当我们在函数内部修改a的时候，因为共享一个地址，因此修改的是外层的数组，但是当我们在函数内部对a重新赋值的时候，就将a(函数)重新指向了一个新的数组，这时候再去改变它对外层就没有影响了

## 全局上下文

> 全局对象是预定义的对象，作为JavaScript的全局函数和全局属性的占位符，通过使用全局对象，可以访问素有其他所有预定义的对象、函数和属性
> 在顶层JavaScript中，可以用关键字this引用全局对象，因为全局对象是作用域链的头，这也就意味着所有非限定性的变量和函数名都会作为该对象的属性来查询
> eg:当JavaScript代码引用parseInt()函数时，它引用的是全局对象的parseInt属性，全局对象是作用域链的头，意味着在顶层JavaScript代码中声明的所有变量都将成为全局对象的属性
**全局上下文中的变量对象就是全局对象**

## 函数上下文

在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。

活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object 呐，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

- 全局上下文的变量对象初始化是全局对象

- 函数上下文的变量对象初始化只包括 Arguments 对象

- 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值

- 在代码执行阶段，会再次修改变量对象的属性值

## 执行上下文

执行上下文的代码会分为两个阶段进行处理，分析和执行：
1、进入执行上下文
2、代码执行

**进入执行上下文**
进入执行上下文的时候，这个时候还没有执行代码
变量对象包括：

1、函数的所有形参 (如果是函数上下文)
由名称和对应值组成的一个变量对象的属性被创建
没有实参，属性值设为 undefined

2、函数声明
由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
如果变量对象已经存在相同名称的属性，则完全替换这个属性

3、变量声明
由名称和对应值（undefined）组成一个变量对象的属性被创建；
如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);

在进入执行上下文后，这时候的AO是：
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

**代码执行**
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
当代码执行完后，这时候的AO是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

## 作用域链

查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级（词法层面上的父级）执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象，这样由多个执行上下文的变量对象构成的链表就焦作作用于链

### 函数创建

函数的作用域在函数定义的时候就决定了
因为函数有一个内部属性[[scope]],当函数创建的时候，就会保存所有父变量对象到其中，可以理解[[scope]]就是所有父变量对象的层级链，但是需要注意，[[scope]]并不代表完整的作用域链

```js
function foo() {
    function bar() {
        ...
    }
}

函数创建时，各自的[[scope]]为：

foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

### 函数激活

当函数激活时，进入函数上下文，创建VO/AO后，就会将活动对象添加到作用链的前端，这个时候执行上下文的作用域链称之为Scope

```js
Scope = [AO].concat([[Scope]]);
```

## 执行上下文栈和执行上下文的变化过程

```js
var scope = "global scope";
function checkScope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkScope();
```

```js
1、执行全局代码，创建全局执行上下文，全局上下文呗压入执行上下文栈
ECStack = [
    globalContext
];

2、全局上下文初始化
globalContext = {
    VO: [global],
    Scope: [globalContext.VO],
    this: globalContext.VO
}

初始化的同时，checkScope 函数被创建，保存作用域链到函数的内部属性[[scope]]
checkScope.[[scope]] = [
  globalContext.VO
];

3、执行checkScope函数，创建checkScope函数执行上下文，checkScope函数执行上下文被压入执行上下文栈
ECStack = [
    checkScopeContext,
    globalContext
];

4、checkScope函数执行上下文初始化：
1.复制函数 [[scope]] 属性创建作用域链，
2.用 arguments 创建活动对象，
3.初始化活动对象，即加入形参、函数声明、变量声明，
4.将活动对象压入 checkScope 作用域链顶端。

同时 f 函数被创建，保存作用域链到 f 函数的内部属性[[scope]]
checkScopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope: undefined,
        f: reference to function f(){}
    },
    Scope: [AO, globalContext.VO],
    this: undefined
}

5、执行 f 函数，创建 f 函数执行上下文，f 函数执行上下文被压入执行上下文栈
ECStack = [
    fContext,
    checkScopeContext,
    globalContext
];

6、f函数执行上下文，以下步骤和第4步相同
1. 复制函数 [[scope]] 属性创建作用域链
2. 用 arguments 创建活动对象
3. 初始化活动对象，即加入形参、函数声明、变量声明
4. 将活动对象压入 f 作用域链顶端
fContext = {
    AO: {
        arguments: {
            length: 0
        }
    },
    Scope: [AO, checkScopeContext.AO, globalContext.VO],
    this: undefined
}

7、f 函数执行，沿着作用域链查找 scope 值，返回 scope 值

8、f 函数执行完毕，f 函数上下文从执行上下文栈中弹出
ECStack = [
    checkScopeContext,
    globalContext
];

9、checkScope 函数执行完毕，checkScope 执行上下文从执行上下文栈中弹出
ECStack = [
    globalContext
];
```

## 总结执行上下文的类型：

- 全局执行上下文：
  这是默认或者说是基础的上下文，任何不在函数内部的代码都在全局上下文中，他会执行两件事：创建一个全局的windows对象(浏览器的情况下)，并且设置this的值等于这个全局对象，一个程序中只会有一个全局执行上下文
- 函数执行上下文
  每当一个函数被调用时，都会为该函数创建一个新的上下文，每个函数都有它自己的执行上下文，不过是在函数被调用时创建的，函数上下文可以有任意多个，每当一个新的执行上下文被创建，它就会按定义的顺序执行一系列步骤
- Eval函数执行上下文
  执行在eval函数内部的代码也会有它属于自己的执行上下文，但 由于javascript开发者并不经常使用eval，所以不讨论
