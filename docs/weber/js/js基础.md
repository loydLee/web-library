# js 基础拾遗

---

## null 和 undefined 的区别

- null 表示一个“无”的对象，转为数值时为 0，undefined 则是一个表示“无”的原始值，转化为数值时是 NaN
- null 表示灭有对象，也就是该处不应该有值，可用为函数参数表示该参数不是对象，也可以作为原型链的重点
- undefined 表示缺少值，本应有值只是暂未定义，即变量声明了，但是还没有赋值，调用函数时候，本应该提供的参数没有提供，对象没有赋值的属性，该属性值为 undefined，函数没有返回值时，默认返回 undefined

## 事件流

描述页面中接收事件的顺序，DOM 2 级事件流包括下面几个阶段

- 事件捕获阶段
- 处于目标阶段
- 事件冒泡阶段

在 DOM 标准事件模型中，是先捕获后冒泡。但是如果要实现先冒泡后捕获的效果，对于同一个事件，监听捕获和冒泡，分别对应相应的处理函数，监听到捕获事件，先暂缓执行，直到冒泡事件被捕获后再执行捕获之间

### addEventListener

语法：target.addEventListener(type, listener, options/useCapture)

- type:表示监听事件类型的字符串
- listener：所监听的事件触发，会接受一个事件通知对象。
- options：一个指定有关 listener 属性的可选参数对象。可选值有 capture（事件捕获阶段传播到这里触发）、once（在 listener 添加之后最多值调用一次）、passive（设置为 true 时表示 listener 永远不会调用 preventDefault()）。
- useCapture：在 DOM 树中，注册了 listener 的元素，是否要先于它下面的 EventTarget 调用该 listener。
  _ps_:第三个参数涉及到冒泡以及捕获，true 时为捕获，false 为冒泡，参数为一个对象对象 { passive: true }，针对 Safari 浏览器，禁止/开启使用滚动时候用到

### 原理

原本是网景（Netscape）和 IE 对 DOM 事件产生描述的差异，w3c 对方案进行了统一，规定将 DOM 事件分为两个阶段：当一个元素被点击。首先是事件捕获阶段，window 最先接收事件，然后一层一层向下捕获，最后由具体元素接收，之后再由具体元素一层一层往上冒泡，到 window 接收事件

- 事件冒泡：当给某个目标元素绑定了事件之后，这个事件会依次在它的父级元素中被触发（当然前提是这个父级元素也有这个同名称的事件，比如子元素和父元素都绑定了 click 事件就触发父元素的 click）
- 事件捕获：和冒泡相反，会从上层传递到下层
  **点击一个 input 依次触发**：onmouseenter -> onmousedown -> onfocus -> onmouseup -> onclick

### 阻止冒泡

- event.stopPropagation()

**并不是所有事件都有冒泡**：onblur onfocus onmouseenter onmouseleave

## typeof 和 instanceof 的区别

- typeof：对某个变量类型的检测，基本类型除了 null 之外，都能正常地显示为对应的类型，引用类型除了函数会显示为 function，其他都显示为 object。
- instanceof 主要用于检测某个构造函数的原型对象在不在某个对象的原型链上。
  ps:typeof 会对 null 显示错误是个历史 Bug，typeof null 输出的是 object，因为 JavaScript 早起版本是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以它错误判断为 object。

## 对 this 的理解

对函数来说，this 指向调用最后调用函数的对象，是函数运行时内部自动生成的一个内部对象，只能在函数内部使用，对于全局来说，this 指向 window

## js 定位相关

- _clientHeight_：表示可视区域的高度，不包含 border 和滚动条
- _offsetHeight_：表示可视区域的高度，包含了 border 和滚动条
- _scrollHeight_：表示了所有区域的高度，包含了因为滚动被隐藏的部分
- _clientTop_：表示边框 border 的厚度，在未指定的情况下一般为 0
- _scrollTop_：滚动后被隐藏的高度，获取对象相对于由 offsetParent 属性指定的父坐标（CSS 定位的元素或 body 元素）距离顶端的高度。

## 函数式编程

通过对面对对象式编程拆分，将各个功能独立出来，从而达到功能独立，易复用等目的，可以简单理解成函数式编程就是对可以抽离的功能进行抽取封装
**特点**

- 函数是一等公民
- 声明做某件事情：重要的是做什么，而不是怎么做
- 便于垃圾回收
- 数据不可变
- 无状态
- 无副作用

## 规范化

### CommonJS

- 导出：module.exports = {}、exports.xxx = 'xxx'
- 导入：require(./index.js)
- 查找方式：查找当前目录是否具有文件，没有则查找当前目录的 node*modules 文件。再没有，冒泡查询，一直往系统中的 npm 目录查找。
  *优点*
  1、所有代码在模块作用域内运行，不会污染其他文件
  2、require 得到的值是值得拷贝，即使我们引用其他 js 文件的变量，修改操作了也不会影响其他文件
  *缺陷\_
  1、应用层面，在 index.html 中做 var index = require('./index.js')操作会报错，因为它最终是后台执行的，只能是 index.js 引用 index2.js 这种方式
  2、同步加载问题，CommonJS 规范中模块是同步加载的，即在 index.js 中加载 index2.js，如果 index2.js 卡住了，会导致阻塞

### AMD-Asynchronous Module Definition

基于 CommonJS,可以采用异步方式加载模块，“异步模块定义”，async

### CMD-Common Module Definition

sea.js 推崇的规范，CMD 依赖就近，用的时候再 require

AMD 和 CMD 最大的区别是对依赖模块执行时机处理不同，但是两者皆为异步加载

### ES6 Module

- 导出
  1、export a
  2、export { a }
  3、export { a as jsliang }
  4、export default function() {}
- 导入
  1、import './index'
  2、import { a } from './index.js'
  3、import { a as jsliang } from './index.js'
  4、import \* as index from './index.js'

-特点：
1、export 命令和 import 命令可以出现在模块的任何位置，只要处于模块顶层就可以。 如果处于块级作用域内，就会报错，这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。
2、import 命令具有提升效果，会提升到整个模块的头部，首先执行。

- 和 CommonJS 区别：

1、CommonJS 模块是运行时加载，ES6 Modules 是编译时输出接口
2、CommonJS 输出是值的拷贝；ES6 Modules 输出的是值的引用，被输出模块的内部的改变会影响引用的改变
3、CommonJs 导入的模块路径可以是一个表达式，因为它使用的是 require() 方法；而 ES6 Modules 只能是字符串
4、CommonJS this 指向当前模块，ES6 Modules 的 this 指向 undefined
5、ES6 Modules 中没有这些顶层变量：arguments、require、module、exports、\_filename、\_dirname
