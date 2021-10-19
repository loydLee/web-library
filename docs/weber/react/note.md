# react 学习笔记

## JSX 语法

html 语言直接写在 javascript 语言之中，不加任何引号，这就是 jsx 的语法，它允许 html 与 javascript 的混写

jsx 的基本语法规则：遇到 html 标签（以<开头），就用 html 规则解析，遇到代码块（以{开头），就用 javascript 规则解析

## 组件开发需要注意

```
获取属性的值用的是this.props属性名，它与组件的属性一一对应，但是有一个例外，就是this.props.children，它表示组件的所有子节点
创建的组件名称首字母必须大写
为元素添加css的class时，要用className，fot属性需要写成htmlFor，因为class和for是javascript的保留字
组件类只能包含一个顶层标签
组件的style属性的设置方式也值得注意，要写成style={{width:this.state.width}}
```

## 状态(state)

- getInitialState 函数必须有返回值
- - getInitialState 函数必须有返回值，可以是 null 或者一个对象
- - 访问 state 的方法是 this.state.属性名
- - 变量用{}包裹，不需要再加双引号

## 组件的生命周期

- Mounting:已插入真实 DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实 DOM

React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数：

```js
componentWillMount()
componentDidMount()
componentWillUpdate(object nextProps, object nextState)
componentDidUpdate(object prevProps, object prevState)
componentWillUnmount()
```

此外，React 还提供两种特殊状态的处理函数

```js
componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用
```

## 获取真实的 dom 节点

组件并不是真实的 dom 节点，而是存在于内存之中的一种数据结构，叫做虚拟 dom，只有当他插入文档以后，才会变成真实的 dom,react：所有的 dom 变动，都在 dom 上发生，然后再将实际发生变动的地方，真实的反映在 dom 上

然而有时候我们需要获取真实 dom 的节点-ref 属性

例：有一个文本输入框，需要获取用户的输入，这时候必须获取真实的 dom 节点，因为虚拟 dom 拿不到用户输入，因此文本输入框必须有一个 ref 属性，然后通过 this.refs.[refName]获取这个真实的 dom 节点，但是需要注意，由于 this.refs.[refName]属性获取的是真实 dom，所以必须等到虚拟 dom 插入文档以后，才能使用这个属性，否则会报错

## 组件通信

需要注意的是，react 不同于 vue 具有父子数据双向(虽然这在 vue2 之后也不被推荐使用),react 想要与父组件通信，首先需要父组件通过 props 传递方法给子组件，当有需要的时候，子组件去调用这个方法，告知父组件子组件的状态发生改变了

## 路由

> 需要注意的是，react-router 4.x 之后，很多 api 产生了变化，而网上的实例以及大多数内容都是 4.x 之前的版本，所以涉及到一些写法需要格外注意

### 基础路由组件

- Router-主要路由组件，用来声明一个路由内容(区块？)
- Route-路由子单元，路由对象由一个个 Route 子单元构成，它的参数包含 path-路由地址(页面访问用到的地址)---这儿需要注意，如果是子路由的形式，没有用绝对路由地址的话访问到的路由地址包含其父级链接，与之相对，绝对地址访问到的 url 不包含父级地址
- Link-组件跳转用，参数 to 跟路由地址
- Redirect-重定向，参数 from、to:表示访问前者的路由地址会自动渲染后者地址的内容

### 路由路径语法

路由路径是匹配一个(或者一部分)URL 的一个字符串模式。大部分的路由路径都可以直接按照字面量理解，除了以下几个特殊的符号：

- :paramName-匹配一段位于/、?或#之后的 url。命中的部分将被作为一个参数
- ()-在它内部的内容被认为是可选的
- \*- 匹配任意字符(非贪婪的)直到命中下一个字符或者整个 url 的末尾，并创建一个 splat 参数

```
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```

> 注意：如果一个路由使用了相对路径，那么完整的路径将由它的所有祖先节点的路径和自身指定的相对路径拼接而成，使用绝对路径可以使路由匹配行为忽略嵌套关系

### 优先级

路由算法会根据定义的顺序自顶向下匹配路由，因此当拥有两个兄弟路由节点配置时,我们必须确认前一个路由不会匹配后一个路由中的路径，千万不要这么做：

```
<Route path="/comments" ... />
<Redirect from="/comments" ... />
```

### Histories

React Router 是建立在 history 之上的，简而言之，一个 history 知道如何去监听浏览器地址栏的变化，并解析这个 url 转化为 location 对象，然后 router 使用它匹配到路由，最后正确的渲染对应的组件

常见的 history 三种形式：(当然也可以使用 React Router 实现自定义的 history)

引用

```
import { browserHistory } from 'react-router'
```

使用

```
render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
)
```

- browserHistory

  Browser history 是使用 React Router 的应用推荐的 history。它使用浏览器中的 History API 用于处理 URL，创建一个像 example.com/some/path 这样真实的 URL 。

- hashHistory

      Hash history 使用 URL 中的 hash（#）部分去创建形如 example.com/#/some/path 的路由。

  > createHashHistory-Hash history 不需要服务器任何配置就可以运行,但是不推荐在实际线上环境中用到它，因为每一个 web 应用都应该渴望使用 browserHistory

- createMemoryHistory
  Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。

和另外两种 history 的一点不同是你必须创建它，这种方式便于测试。

```
const history = createMemoryHistory(location)
```

### 默认路由(IndexRoute)与 IndexLink

```
IndexRoute-参数为component：默认渲染的组件
Index Links-如果在这个 app 中使用 <Link to="/">Home</Link> , 它会一直处于激活状态，因为所有的 URL 的开头都是 / 。 这确实是个问题，因为我们仅仅希望在 Home 被渲染后，激活并链接到它。如果需要在 Home 路由被渲染后才激活的指向 / 的链接，请使用 <IndexLink to="/">Home</IndexLink>
```

### 动态路由

React Router 的路径匹配以及组件加载都是异步完成的，不仅仅允许延迟加载组件，并且可以延迟加载理由设置，在首次加载包中只需要有一个路径定义，路由会自动解析剩下的路径

Route 可以定义 getChildRoutes，getIndexRoute 和 getComponents 这几个函数。它们都是异步执行，并且只有在需要时才被调用。我们将这种方式称之为 “逐渐匹配”。 React Router 会逐渐的匹配 URL 并只加载该 URL 对应页面所需的路径配置和组件。

```
const CourseRoute = {
  path: 'course/:courseId',

  getChildRoutes(location, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./routes/Announcements'),
        require('./routes/Assignments'),
        require('./routes/Grades'),
      ])
    })
  },

  getIndexRoute(location, callback) {
    require.ensure([], function (require) {
      callback(null, require('./components/Index'))
    })
  },

  getComponents(location, callback) {
    require.ensure([], function (require) {
      callback(null, require('./components/Course'))
    })
  }
}
```

因此定义组件可以：

```
const more = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('../Component/more').default)
    },'more')
}
```

## FLUX 架构

flux 把一个应用分成四个部分：

- View:视图层
- Action(动作):视图层发出的消息(比如 mouseClick)
- Dispatcher(派发器)：用来接收 Actions、执行回调函数
- Store(数据层):用来存放应用的状态，一旦发生变动，就提醒 Views 要更新页面

FLUX 最大特点：数据单向流动

> 用户访问 View

> View 发出用户的 Action

> Dispatcher 收到 Action，要求 Store 进行相应的更新

> Store 更新后，发出一个"change"事件

> View 收到"change"事件后，更新页面

## Redux 架构

需要使用的场景-多交互，多数据源

- 用户的使用方式复杂
- 不同身份的用户有不同的使用方式(比如普通用户和管理员)
- 多个用户之间可以协作
- 与服务器大量交互，或者使用了 websocket
- view 要从多个来源获取数据

组件角度看，以下场景可以考虑使用 redux

- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

> 设计思想

- web 应用是一个状态机，视图和状态是一一对应的
- 所有的状态，保存在一个对象里面

### 基本概念

> store 保存数据的地方

Redux 提供 createStore 这个函数，用来生成 Store,createStore 函数接受另一个函数作为参数，返回新生成的 Store 对象

```
import { createStore } from 'redux';
const store = createStore(fn);
```

> State-Store 对象包含所有数据，如果想要得到某个时点的数据，对 Store 生成快照的数据集合

当前时刻的 State,可以通过 store.getState 拿到

```
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```

Redux 规定，一个 State 对应一个 View,只要 State 相同，View 就相同

> Action-State 的变化，会导致 View 的变化，但是用户接触不到 State，只能接触到 View，所以 State 的变化必须是 View 导致的，Action 就是 View 发出的通知，表示 State 应该要发生变化了

action 是一个对象，其中的 type 属性是必须的，表示 Action 的名称，其他属性可以自由设置，下面代码中，Action 的名称是 ADD_TODO，携带的信息是字符串 Learn Redux，Action 描述当前发生的事情，改变 State 的唯一办法，就是使用 Action,它会运送数据到 Store

```
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
```

> Action Creator-View 要发送多少种消息，就会有多少种 Action，Action Creator 用来生成 Action

```
const ADD_TODO = '添加 TODO';

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

const action = addTodo('Learn Redux');
```

> store.dispatch()-View 发出 Action 的唯一方法,

```
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```

结合 Action Creator

```
store.dispatch(addTodo('Learn Redux'));
```

> Reducer-Store 收到 action 以后，必须给出一个新的 State,这样 View 才会发生变化，Reducer 是一个计算的过程，但是同时，它也是一个函数，接受 Action 和当前 State 作为参数，返回一个新的 State

```
const reducer = function (state, action) {
  // ...
  return new_state;
};
```

# react 基础

## react 踩坑

Fragment

与 vue 一样，react 规定最外层保持单一元素包裹，但是使用 div 这种时候有时候会破坏布局，react16 之后增加：

```js
import { Fragment } from "react";
```

className

jsx 中 class 避免与 js 的 class 冲突修正为 className

dangerouslySetInnerHTML

```js
渲染html字段
<ul>
  {
    this.state.list.map((item,index)=>{
      return (
        <li
          key={index+item}
          onClick={this.deleteItem.bind(this,index)}
          dangerouslySetInnerHTML={{__html:item}}
        >
        </li>
      )
    })
  }
</ul>
```

label for -> htmlFor

## 父子传值

```js
// 父-子：通过组件上props直接传递，可以传递属性也可以传递方法， 传递方法的时候注意绑定this
 <div key={index}>
    <XiaojiejieItem
      content={item}
      index={index}
      deleteItem={this.deleteItem.bind(this)}
    ></XiaojiejieItem>
  </div>

// 子-父：通过props传递来的方法进行调用
handleClick() {
  this.props.deleteItem(this.props.index)
}
```

## PropTypes

开发中我们会限制 props 的类别

```js
import PropTypes from "prop-types";

// 然后在组件的下方进行引用
XiaojiejieItem.propTypes = {
  content: PropTypes.string.isRequired,
  deleteItem: PropTypes.func,
  index: PropTypes.number
};

// 默认值
XiaojiejieItem.defaultProps = {
  avname: "test"
};
```

