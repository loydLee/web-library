# 事件循环（event loop）

事件循环，指浏览器或者 Node 的一种解决 JavaScript 中单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理

JavaScript 从 script 开始读取，然后不断循环，从 “任务队列” 中读取执行事件的过程，就是 事件循环（Event Loop）。

浏览器内核：
浏览器内核是多线程的，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：

- GUI 渲染线程：解析 HTML、CSS 等。在 JavaScript 引擎线程运行脚本期间，GUI 渲染线程处于挂起状态，也就是被 “冻结” 了。
- JavaScript 引擎线程：负责处理 JavaScript 脚本。
- 定时触发器线程：setTimeout、setInterval 等。事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待 JS 引擎线程执行。
- 事件触发线程：负责将准备好的事件交给 JS 引擎执行。
- 异步 http 请求线程：负责执行异步请求之类函数的线程，例如 Promise.then()、ajax 等。

## 执行过程

1、一开始整个脚本 script 作为一个宏任务执行
2、执行过程中，同步代码 直接执行，宏任务 进入宏任务队列，微任务 进入微任务队列。
3、当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完毕。
4、执行浏览器 UI 线程的渲染工作。
5、检查是否有 Web Worker 任务，有则执行。
6、执行完本轮的宏任务，回到步骤 2，依次循环，直到宏任务和微任务队列为空。

### 宏任务

- script
- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

### 微任务

- MutationObserver
- Promise.then()/catch()
- 以 Promise 为基础开发的其他技术，例如 fetch API
- V8 的垃圾回收过程
- Node 独有的 process.nextTick

## requestAnimationFrame

window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。

该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

### 使用原因

setTimeout 实现动画效果，在某些机器上出现卡顿，抖动现象，原因：
1、setTimeout 的执行事件并不是确定的。它属于宏任务队列，只有当主线程上的任务执行完毕后，才会调用队列中的任务判断是否开始执行。
2、刷新频率受屏幕分辨率和屏幕尺寸影响，因此不同设备的刷新频率不同，而 setTimeout 只能固定一个时间间隔刷新。
而 requestAnimationFrame 在微执行完微任务后执行浏览器 UI 线程渲染工作的时候执行，不会等待宏任务队列的排队，因此也就不会导致卡顿问题

## Web Worker

在 HTML5 的新规范中，实现了 Web Worker 来引入 JavaScript 的 “多线程” 技术，他的能力让我们可以在页面主运行的 JavaScript 线程中加载运行另外单独的一个或者多个 JavaScript 线程。

> 注意：JavaScript 本质上还是单线程的，Web Worker 只是浏览器（宿主环境）提供的一个得力 API。

执行顺序：

1、先执行 script 中同步任务
2、再执行 script 中微任务
3、然后执行 UI 线程的渲染工作（这里在代码中没有体现，感兴趣的可以试试添加 rAF）
4、接着才执行 Web Worker 里面内容
5、再来是 index.html 中的宏任务
6、最后才是 Web Worker 文件中的宏任务
