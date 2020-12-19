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
