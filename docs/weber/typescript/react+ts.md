# react+ts 学习笔记

## 组件

- 无状态组件
  没有状态的组件（也就是一个函数）

  ```js
  import * as React from "react";

  const TestPage: React.SFC = () => {
    return <div>this is test page.</div>;
  };

  export default TestPage;
  ```

  当需要传递 Props 的时候，定义一个 Props 接口给 props 指明类型即可

  ```js
  export interface IHeaderProps {
    localImageSrc: string;
    onLineImageSrc: string;
  }

  export const Header: React.SFC<IHeaderProps> = (props: IHeaderProps) => {
    const { localImageSrc, onLineImageSrc } = props;
    return (
      <div className={styles["header-container"]}>
        <img src={localImageSrc} />
        <img src={onLineImageSrc} />
      </div>
    );
  };
  ```

- 有状态组件
  有时候我们需要使用一个有状态的组件，例如我们操作的时候需要改变 state,我们需要给 state 定义一个接口，编写有状态组件时，需要给 React.Component 的范型传递类型

  ```js
  export interface IHomePageState {
    name: string;
  }

  class HomeComponent extends React.Component<{}, IHomePageState> {
    constructor(props: {}) {
      super(props);
      this.state = {
        name: "",
      };
    }

    public setName = () => {
      this.setState({
        name: "icepy",
      });
    }

    public render(){
      const { name } = this.state;
      return (
        <div>
          <div onClick={this.setName}> set name </div>
          <div>{name}</div>
        </div>
      )
    }
  }
  ```

- Props&State 组件
  既有 Props 又有 State 的时候，我们需要同时定义，React.Component 第一个参数是 Props 的类型

  ```js
  export interface IHomePageState {
    name: string;
  }

  export interface IHomePageProps {
    home: string;
  }

  class HomeComponent extends React.Component<IHomePageProps, IHomePageState> {
    constructor(props: IHomePageProps) {
      super(props);
      this.state = {
        name: "",
      };
    }

    public setName = () => {
      this.setState({
        name: "icepy",
      });
    }

    public render(){
      const { name } = this.state;
      const { home } = this.props;
      return (
        <div>
          <div onClick={this.setName}> set name </div>
          <div>{name} {home}</div>
        </div>
      )
    }
  }
  ```

- Router 组件
  使用 react-router-dom 路由库的时候，在类型安全上，我们需要为 Props 继承上 React-Router 的 Props,这样才能编译通过

  ```js
  import { RouteComponentProps } from "react-router-dom";

  export interface IHomePageProps extends RouteComponentProps<any>{
    home: string;
  }

  export interface IHomePageProps {
    home: string;
  }

  class HomeComponent extends React.Component<IHomePageProps, IHomePageState> {
    constructor(props: IHomePageProps) {
      super(props);
      this.state = {
        name: "",
      };
    }

    public setName = () => {
      this.setState({
        name: "icepy",
      });
    }

    public render(){
      const { name } = this.state;
      const { home } = this.props;
      return (
        <div>
          <div onClick={this.setName}> set name </div>
          <div>{name} {home}</div>
        </div>
      )
    }
  }
  ```

- 类组件
  类组件的定义形式有两种：React.Component<P, S={}> 和 React.PureComponent<P, S={} SS={}>，它们都是泛型接口，接收两个参数，第一个是 props 类型的定义，第二个是 state 类型的定义，这两个参数都不是必须的，没有时可以省略

```ts
interface IProps {
  name: string;
}

interface IState {
  count: number;
}

class App extends React.Component<IProps, IState> {
  state = {
    count: 0,
  };

  render() {
    return (
      <div>
        {this.state.count}
        {this.props.name}
      </div>
    );
  }
}

export default App;

class App extends React.PureComponent<IProps, IState> {}

// React.PureComponent是有第三个参数的，它表示getSnapshotBeforeUpdate的返回值。
```

PureComponent 与 Component 的区别

主要区别是 PureComponent 中的 shouldComponentUpdate 是由自身进行处理的，不需要我们进习惯处理，因此它可以在一定程度上提升性能

- React.FC
  使用 React.FC 声明函数组件和普通声明的区别如下：
  - React.FC 显式地定义了返回类型，其他方式是隐式推导的；
  - React.FC 对静态属性：displayName、propTypes、defaultProps 提供了类型检查和自动补全；
  - React.FC 为 children 提供了隐式的类型（ReactElement | null）。

## 状态管理

- 页面级别的 reducers
  使用 Redux 管理我们的数据流的时候，页面级别的 Reducers，即关联在页面容器组件里的 Action,通过这些 Action 和 Props 的结合，方便管理数据流，这些 Action 会分为 同步 Action 和 异步 Action，这也是我们为什么会用到 redux-thunk 的原因。
  为类型安全定义接口

  ```js
  import { Dispatch } from "redux";
  import { RouteComponentProps } from "react-router-dom";

  export interface IHomePageActionsProps {
    dataSync: () => void;
    dataAsync: (parameter: string) => (dispatch: Dispatch) => void;
  }

  export interface IHomePageProps
    extends RouteComponentProps<any>,
      IHomePageActionsProps {
    homePage: IHomePageStoreState;
  }

  export interface IHomePageStoreState {
    syncId: string;
    asyncId: string;
  }

  // global dir
  export interface IStoreState {
    homePage: IHomePageStoreState;
  }
  ```

  然后定义一个 mapStateToProps 函数

  ```js
  const mapStateToProps = (state: IStoreState) => {
    const { homePage } = state;
    return {
      homePage,
    };
  };
  ```

  分别定义 Action 和 Reducers

  ```js
  // action
  import * as CONST from "./constants";
  import { Dispatch } from "redux";

  export function dataSync() {
    const syncData = {
      type: CONST.SYNC_DATA,
      payload: {
        data: "syncId=https://github.com/icepy",
      },
    };
    return syncData;
  }

  export function dataAsync(parameter: string): (dispatch: Dispatch) => void {
    return (dispatch: Dispatch) => {
      const asyncData = {
        type: CONST.ASYNC_DATA,
        payload: {
          data: "asyncId=https://icepy.me",
        },
      };
      setTimeout(() => {
        dispatch(asyncData);
      }, 2000);
    };
  }

  // reducers
  import { IAction } from "@/global/types";
  import * as CONST from "./constants";
  import * as TYPES from "./types";

  const initState: TYPES.IHomePageStoreState = {
    syncId: "默认值",
    asyncId: "默认值",
  };

  export function homeReducers(
    state = initState,
    action: IAction
  ): TYPES.IHomePageStoreState {
    const { type, payload } = action;
    switch (type) {
      case CONST.SYNC_DATA:
        return { ...state, syncId: payload.data };
      case CONST.ASYNC_DATA:
        return { ...state, asyncId: payload.data };
      default:
        return { ...state };
    }
  }
  ```

  在 Store 中 引入我们的 reducers，因为我们已经为 state 定义了类型，因此我们可以很方便的关联上，并且知道哪里有错误：

  ```js
  import { createStore, applyMiddleware, combineReducers, compose } from "redux";
  import thunk from "redux-thunk";
  import { homeReducers } from "@/pages/Home/flow/homeReducers";

  /* eslint-disable no-underscore-dangle, no-undef */
  const composeEnhancers = (window as any) && (window as any).REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
  const reducer = combineReducers({
    homePage: homeReducers,
  });

  export const configureStore = () => createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk)),
  );
  ```

  最后，我们使用 connect 函数将这些关联起来：

  ```js
  class HomeComponent extends React.Component<TYPES.IHomePageProps, TYPES.IHomePageState> {
    ... 省略 可自行访问 [WLM-TypeScript-React-Starter] 项目
  }

  export const HomePage = connect(mapStateToProps, actions)(HomeComponent);
  ```

  - Global 级别的 Reducers
    global 顾名思义，这是一种可以全局访问的 reducers ，我们要做的事情也和页面级别 reducers 非常类似，定义好 state 的接口，然后将 global 在 Store 中配置正确，如：

  ```js
  import { createStore, applyMiddleware, combineReducers, compose } from "redux";
  import thunk from "redux-thunk";
  import { homeReducers } from "@/pages/Home/flow/homeReducers";
  import { globalReducers } from "./reducers";

  /* eslint-disable no-underscore-dangle, no-undef */
  const composeEnhancers = (window as any) && (window as any).REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
  const reducer = combineReducers({
    global: globalReducers,
    homePage: homeReducers,
  });

  export const configureStore = () => createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk)),
  );
  ```

  当我们需要访问 global 时，有两种方式：

  1、在 mapStateToProps 函数中将 global 返回给页面级别的 Props
  2、随意的调用 global 中的 Action ，只是需要手动的将 dispatch 函数传递给这些 Action

  ```js
  import * as React from "react";
  import { Dispatch } from "redux";
  import { connect } from "react-redux";
  import { HashRouter as Router, Route, NavLink } from "react-router-dom";
  import { IStoreState } from "./global/types";
  import * as globalActions from "./global/actions";
  import { HomePage } from "./pages/Home";
  import { TestPage } from "./pages/TestPage";
  import "./style.less";

  interface IAppComponentProps {
    dispatch: Dispatch;
  }

  class AppComponent extends React.Component<IAppComponentProps> {
    constructor(props: IAppComponentProps) {
      super(props);
      globalActions.setGlobalSyncId(this.props.dispatch);
    }

    public render() {
      return (
        <Router >
          <div>
            <div className="nav-container">
              <NavLink to="/" >Home Page</NavLink>
              <NavLink to="/test">Test Page</NavLink>
            </div>
            <Route exact={true} path="/" component={HomePage} />
            <Route path="/test" component={TestPage} />
          </div>
        </Router>
      );
    }
  }

  const mapStateToProps = (state: IStoreState) => {
    const { global } = state;
    return {
      global,
    };
  };

  export const App = connect(mapStateToProps)(AppComponent);
  ```

## Event 事件对象类型

常见的 Event 事件对象类型：

- ClipboardEvent<T = Element> 剪贴板事件对象
- DragEvent<T = Element> 拖拽事件对象
- ChangeEvent<T = Element> Change 事件对象
- KeyboardEvent<T = Element> 键盘事件对象
- MouseEvent<T = Element> 鼠标事件对象
- TouchEvent<T = Element> 触摸事件对象
- WheelEvent<T = Element> 滚轮事件对象
- AnimationEvent<T = Element> 动画事件对象
- TransitionEvent<T = Element> 过渡事件对象

## React Hooks

- useState
  如果初始值为 null，需要显式地声明 state 的类型
  const [count, setCount] = useState<number | null>(null);

  如果 state 是一个对象，想要初始化一个控对象，可以使用断言来处理
  const [user, setUser] = React.useState<IUser>({} as IUser);

- useEffect
  useEffect 的主要作用就是处理副作用，它的第一个参数是一个函数，表示要清除副作用的操作，第二个参数是一组值，当这组值改变时，第一个参数的函数才会执行

- useRef
  使用 useRef，访问一个可变的引用对象，将初始值传递给 useRef，用于初始化可变对象公开的当前属性，使用 useRef 的时候，需要给其指定类型

  ```ts
  const nameInput = React.useRef<HTMLInputElement>(null);

  //当useRef的初始值为null时

  nameInput.current.innerText = "hello world";
  // 这种情况ref.current是只读的，对其赋值会报错

  // 如果需要useRef的值直接可变，就需要在泛型参数中包含“｜null”
  const nameInput = React.useRef<HTMLInputElement | null>(null);
  nameInput.current?.innerText = "hello world";
  ```

- useCallback
  useCallback 接收一个回调函数和一个依赖数组，只有当依赖数组中的值发生变化时才会重新执行回调函数

  ```ts
  const add = (a: number, b: number) => a + b;

  const memoizedCallback = useCallback(
    (a) => {
      add(a, b);
    },
    [b]
  );
  ```

- useMemo
  useMemo 和 useCallback 是非常类似的，但是它返回的是一个值，而不是函数。所以在定义 useMemo 时需要定义返回值的类型：

```ts
let a = 1;
setTimeout(() => {
  a += 1;
}, 1000);

const calculatedValue = useMemo<number>(() => a ** 2, [a]);
```

- useContext
  useContext 需要提供一个上下文对象，并返回所提供的上下文的值，当提供者更新上下文对象时，引用这些上下文对象的组件就会重新渲染：

```ts
const ColorContext = React.createContext({ color: "green" });

const Welcome = () => {
  const { color } = useContext(ColorContext);
  return <div style={{ color }}>hello world</div>;
};
```

在使用 useContext 时，会自动推断出提供的上下文对象的类型，所以并不需要我们手动设置 context 的类型。当前，我们也可以使用泛型来设置 context 的类型：

```ts
interface IColor {
  color: string;
}

const ColorContext = React.createContext<IColor>({ color: "green" });
```

- useReducer

```ts
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

```ts
const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
};

const Counter = () => {
  const initialState = { count: 0 };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
};
```
