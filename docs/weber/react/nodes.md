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
