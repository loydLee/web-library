
[TOC]

# react native

## 环境搭建
```
    环境变量：
        java-
            新建JAVA_HOME    C:\lee\java\jdk
            新建CLASSPATH    .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;
            path中新建       %JAVA_HOME%\bin
        android
            新建ANDROID_HOME    C:\lee\AndroidSdk
            path中新建       %ANDROID_HOME%\tools
                             %ANDROID_HOME%\platform-tools
```
## 使用flexbox布局
- flexDirection： 水平轴(row)，竖直轴(column)

- Justify Content：
- - flex-start：靠近主轴的起始端
- - flex-end：靠近主轴的莫尾端
- - center:居中
- - space-around：均匀分布-两侧无留白
- - space-between：均匀分布-两侧留白

- alignItems：
- - flex-start：靠近主轴的起始端
- - flex-end：靠近主轴的莫尾端
- - center:居中
- - stretch：拉伸，使用的时候子元素在次轴方向上不能有固定的尺寸

## 网络请求
```
 getMoviesFromApiAsync() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }
```

# react

## react的生命周期
- 组件的生命周期可分为三个状态
```
Mounting:已插入真实dom
Updating:正在被重新渲染
Unmounting:已移出真实dom
```
- 生命周期的方法有：
```
onentWillMount--染前调用，在客户端也在服务端
       
componentDidMount--在第一次渲染后调用，只在客户端。之后组件已经生成了对应的dom结构，可以通过this.getDOMNode()来进行访问。如果想和其他javascript框架一起使用，可以在这个方法中调用setTimeout,setInterval或者发送AJAX请求等操作(防止异步操作阻塞ui)

componentWillReceiveProps--在组件接收到一个新的prop时被调用，这个方法初始化render时不会被调用

shouldComponentUpdate--返回一个布尔值，在组件接收到新的props或者state时被调用，在初始化或者使用forceUpdate时不会被调用，可以在确认不需要更新组件时使用

componentWillUpdate--在组件接收到新的props或者state但还没有render时被调用，在初始化时不会被调用

componentDidUpdate--在组件更新完成后立即调用，在初始化时不会被调用

componentWillUnmount--在组件从dom中移除的时候立刻被调用



  
```
