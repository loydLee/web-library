# promise

js 中异步方案演进：
callback -> promise -> generator -> async/await

## 三种状态

1、初始状态：pending
2、成功状态：fulfilled
3、失败状态：rejected

## event Loop 执行顺序

1、一开始整个脚本 script 作为一个宏任务执行
2、执行过程中，_同步任务_ 直接执行，宏任务进入宏任务队列，微任务进入微任务队列
3、当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完毕
4、执行浏览器 UI 线程的渲染工作
5、检查是否有 web worker 任务，有则执行
6、执行完本轮的宏任务，回到步骤 2，依次循环，直到宏任务和微任务队列为空

```js
微任务：
MutationObserver
Promise.then()/catch()
以 Promise 为基础开发的其他技术，例如 fetch API
V8 的垃圾回收过程
Node 独有的 pro

宏任务：
script
setTimeout
setInterval
setImmediate
I/O
UI rendering
```
