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
      homePage
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
        data: "syncId=https://github.com/icepy"
      }
    };
    return syncData;
  }

  export function dataAsync(parameter: string): (dispatch: Dispatch) => void {
    return (dispatch: Dispatch) => {
      const asyncData = {
        type: CONST.ASYNC_DATA,
        payload: {
          data: "asyncId=https://icepy.me"
        }
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
    asyncId: "默认值"
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
