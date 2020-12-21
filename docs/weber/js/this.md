# this

> this 永远指向最后调用它的那个对象
>
> - 普通函数中 this 指向 this**执行**时的上下文
> - 箭头函数中 this 指向 this**定义**时的上下文

## 执行上下文

this 是和执行上下文绑定的，也就是说每个执行上下文中都有一个 this

- 全局执行上下文
- 函数执行上下文
- eval 执行上下文

### 全局执行上下文中的 this 指向 window

全局对象中调用 foo，相当于 window.foo()的调用，即指向 window
**注意**严格模式下全局对象是 undefined

### 函数执行上下文中 this

```js
this.myName = "lee";
let foo = function() {
  this.myName = "lee1";
};
foo();
console.log(window.myName); // lee1
console.log(foo.myName); // undefined
```

#### 通过 call/bind/apply 改变 this

```js
foo.call(foo);
console.log(window.myName); // lee
console.log(foo.myName); // lee1
```

### 通过对象调用方法

使用对象来调用其内部的方法，该方法的 this 指向对象本身

```js
let myObj = {
  name: "lee",
  showThis: function() {
    console.log(this.name);
  },
};
myObj.showThis(); // lee
let foo = myObj.showThis;
foo(); // undefined
```

js 里面，this 谁调用它就指向谁，通过 myObj 进行调用，此刻的 this 就指向 myObj,而 foo 只是通过 myObj 的引用进行的定义，真正执行的还是 foo，此刻的 this 还是指向 Window

### 通过构造函数中设置

```js
this.name = "lee";
let Foo = function() {
  this.name = "lee1";
};
let foo = new Foo();
console.log(foo.name); // lee1
console.log(window.name); // lee
```

new Foo()的时候，js 干了什么？

- 首先创建一个空对象 tempObj = {}。
- 接着调用 Foo.apply 方法，将 tempObj 作为 apply 方法的参数，这样当 Foo 的执行上下文创建时，它的 this 就指向 tempObj 对象。
- 然后执行 Foo 函数，此时的 Foo 函数执行上下文中的 this 指向了 tempObj 对象。
- 最后返回 tempObj 对象。

所以此时的 this 是属于 Foo 的

## 其他

嵌套函数的 this 不会从外层函数中继承
解决：
1、外层使用变量将 this 缓存起来
2、通过 es6 的箭头函数
因为箭头函数不会创建自己的执行上下文，所以箭头函数的 this 取决于它的外部函数，即指向**定义**时的上下文

普通函数中 this 指向全局对象 window,如果要让函数执行上下文的 this 指向某个对象，最好的方式是通过 call 方法进行显式调用，js 严格模式下，默认执行一个函数，函数的执行上下文中的 this 是 undefined

### React 中 this 指向解决方案

```js
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log("jsliang 2020");
  }
  handleClick2 = () => {
    console.log("jsliang 2021");
  };
  render() {
    // 四种绑定方法
    return (
      <div className="App">
        {/* 方法一：通过 constructor 中进行 bind 绑定 */}
        <button onClick={this.handleClick}>btn 1</button>

        {/* 方法二：在里边绑定 this */}
        <button onClick={this.handleClick.bind(this)}>btn 2</button>

        {/* 方法三：通过箭头函数返回事件 */}
        <button onClick={() => this.handleClick()}>btn 3</button>

        {/* 方法四：让方法变成箭头函数 */}
        <button onClick={this.handleClick2}>btn 4</button>

        {/* 额外：直接调用不需要绑定 this */}
        {this.handleClick()}
      </div>
    );
  }
}

export default App;
```
