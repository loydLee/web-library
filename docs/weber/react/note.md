# react学习笔记

## JSX语法

html语言直接写在javascript语言之中，不加任何引号，这就是jsx的语法，它允许html与javascript的混写

jsx的基本语法规则：遇到html标签（以<开头），就用html规则解析，遇到代码块（以{开头），就用javascript规则解析

## 组件开发需要注意
```
获取属性的值用的是this.props属性名，它与组件的属性一一对应，但是有一个例外，就是this.props.children，它表示组件的所有子节点
创建的组件名称首字母必须大写
为元素添加css的class时，要用className，fot属性需要写成htmlFor，因为class和for是javascript的保留字
组件类只能包含一个顶层标签
组件的style属性的设置方式也值得注意，要写成style={{width:this.state.width}}
```

## 状态(state)
- getInitialState函数必须有返回值
- - getInitialState函数必须有返回值，可以是null或者一个对象
- - 访问state的方法是this.state.属性名
- - 变量用{}包裹，不需要再加双引号

## 组件的生命周期
- Mounting:已插入真实DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实DOM

React为每个状态都提供了两种处理函数，will函数在进入状态之前调用，did函数在进入状态之后调用，三种状态共计五种处理函数：
```
componentWillMount()
componentDidMount()
componentWillUpdate(object nextProps, object nextState)
componentDidUpdate(object prevProps, object prevState)
componentWillUnmount()
```
此外，React还提供两种特殊状态的处理函数
```
componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用
```

## 获取真实的dom节点
组件并不是真实的dom节点，而是存在于内存之中的一种数据结构，叫做虚拟dom，只有当他插入文档以后，才会变成真实的dom,react：所有的dom变动，都在dom上发生，然后再将实际发生变动的地方，真实的反映在dom上

然而有时候我们需要获取真实dom的节点-ref属性

例：有一个文本输入框，需要获取用户的输入，这时候必须获取真实的dom节点，因为虚拟dom拿不到用户输入，因此文本输入框必须有一个ref属性，然后通过this.refs.[refName]获取这个真实的dom节点，但是需要注意，由于this.refs.[refName]属性获取的是真实dom，所以必须等到虚拟dom插入文档以后，才能使用这个属性，否则会报错

## 组件通信
需要注意的是，react不同于vue具有父子数据双向(虽然这在vue2之后也不被推荐使用),react想要与父组件通信，首先需要父组件通过props传递方法给子组件，当有需要的时候，子组件去调用这个方法，告知父组件子组件的状态发生改变了

## 路由
> 需要注意的是，react-router 4.x之后，很多api产生了变化，而网上的实例以及大多数内容都是4.x之前的版本，所以涉及到一些写法需要格外注意

### 基础路由组件

- Router-主要路由组件，用来声明一个路由内容(区块？)
- Route-路由子单元，路由对象由一个个Route子单元构成，它的参数包含path-路由地址(页面访问用到的地址)---这儿需要注意，如果是子路由的形式，没有用绝对路由地址的话访问到的路由地址包含其父级链接，与之相对，绝对地址访问到的url不包含父级地址
- Link-组件跳转用，参数to跟路由地址
- Redirect-重定向，参数from、to:表示访问前者的路由地址会自动渲染后者地址的内容

### 路由路径语法

路由路径是匹配一个(或者一部分)URL的一个字符串模式。大部分的路由路径都可以直接按照字面量理解，除了以下几个特殊的符号：
- :paramName-匹配一段位于/、?或#之后的url。命中的部分将被作为一个参数
- ()-在它内部的内容被认为是可选的
- *- 匹配任意字符(非贪婪的)直到命中下一个字符或者整个url的末尾，并创建一个splat参数
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

React Router是建立在history之上的，简而言之，一个history知道如何去监听浏览器地址栏的变化，并解析这个url转化为location对象，然后router使用它匹配到路由，最后正确的渲染对应的组件

常见的history三种形式：(当然也可以使用React Router实现自定义的history)

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

    Browser history 是使用 React Router 的应用推荐的 history。它使用浏览器中的 History API 用于处理 URL，创建一个像example.com/some/path这样真实的 URL 。

- hashHistory

    Hash history 使用 URL 中的 hash（#）部分去创建形如 example.com/#/some/path 的路由。
> createHashHistory-Hash history 不需要服务器任何配置就可以运行,但是不推荐在实际线上环境中用到它，因为每一个web应用都应该渴望使用browserHistory

- createMemoryHistory
Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。

和另外两种history的一点不同是你必须创建它，这种方式便于测试。
```
const history = createMemoryHistory(location)
```

### 默认路由(IndexRoute)与IndexLink
```
IndexRoute-参数为component：默认渲染的组件
Index Links-如果在这个 app 中使用 <Link to="/">Home</Link> , 它会一直处于激活状态，因为所有的 URL 的开头都是 / 。 这确实是个问题，因为我们仅仅希望在 Home 被渲染后，激活并链接到它。如果需要在 Home 路由被渲染后才激活的指向 / 的链接，请使用 <IndexLink to="/">Home</IndexLink>
```

### 动态路由
React Router的路径匹配以及组件加载都是异步完成的，不仅仅允许延迟加载组件，并且可以延迟加载理由设置，在首次加载包中只需要有一个路径定义，路由会自动解析剩下的路径

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

## FLUX架构
flux把一个应用分成四个部分：
- View:视图层
- Action(动作):视图层发出的消息(比如mouseClick)
- Dispatcher(派发器)：用来接收Actions、执行回调函数
- Store(数据层):用来存放应用的状态，一旦发生变动，就提醒Views要更新页面

FLUX最大特点：数据单向流动
> 用户访问 View

> View 发出用户的 Action

> Dispatcher 收到 Action，要求 Store 进行相应的更新

> Store 更新后，发出一个"change"事件

> View 收到"change"事件后，更新页面

## Redux架构

需要使用的场景-多交互，多数据源
- 用户的使用方式复杂
- 不同身份的用户有不同的使用方式(比如普通用户和管理员)
- 多个用户之间可以协作
- 与服务器大量交互，或者使用了websocket
- view要从多个来源获取数据

组件角度看，以下场景可以考虑使用redux
- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

> 设计思想
- web应用是一个状态机，视图和状态是一一对应的
- 所有的状态，保存在一个对象里面

### 基本概念
> store 保存数据的地方

Redux 提供createStore这个函数，用来生成 Store,createStore函数接受另一个函数作为参数，返回新生成的Store对象
```
import { createStore } from 'redux';
const store = createStore(fn);
```
> State-Store对象包含所有数据，如果想要得到某个时点的数据，对Store生成快照的数据集合

当前时刻的State,可以通过store.getState拿到
```
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```
Redux规定，一个State对应一个View,只要State相同，View就相同

> Action-State的变化，会导致View的变化，但是用户接触不到State，只能接触到View，所以State的变化必须是View导致的，Action就是View发出的通知，表示State应该要发生变化了

action是一个对象，其中的type属性是必须的，表示Action的名称，其他属性可以自由设置，下面代码中，Action的名称是ADD_TODO，携带的信息是字符串Learn Redux，Action描述当前发生的事情，改变State的唯一办法，就是使用Action,它会运送数据到Store
```
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
```
> Action Creator-View要发送多少种消息，就会有多少种Action，Action Creator用来生成Action

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

> store.dispatch()-View发出Action的唯一方法,

```
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```
结合Action Creator
```
store.dispatch(addTodo('Learn Redux'));
```

> Reducer-Store收到action以后，必须给出一个新的State,这样View才会发生变化，Reducer是一个计算的过程，但是同时，它也是一个函数，接受Action和当前State作为参数，返回一个新的State

```
const reducer = function (state, action) {
  // ...
  return new_state;
};
```