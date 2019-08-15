# vue2过程遇到的问题
[TOC]

## router配置
```
    export default new Router({
      routes: [{
        path: '/',
        name: 'Hello',
        component: Hello,
        children: [{
          path: 'test',
          name: 'test',
          component: test
        }]
      }
    ]
})
```

## 组件传值
父子：
```
    静态：父子传递的时候，如果只需要传递一个静态的字符串之类的内容，不需要加：
    动态：如果父子传值的时候，传递的是data里面的一个动态值，就需要加上：；其次，			              
    这种情况下，如果父组件里面的内容产生了改变，子组件接收到的内容也会发生变化
    注意：㘝需要传递一个number不能使用静态的方式，因为会被处理成字符串，此时需要
    使用v-bind
      ● prop 作为初始值传入后，子组件想把它当作局部数据来用:
    解决方式：  定义一个局部变量，并用 prop 的值初始化它：
    props: ['initialCounter'],
    data: function () {
      return { counter: this.initialCounter }
    }
      ● prop 作为初始值传入，由子组件处理成其它数据输出。
    解决方式：  定义一个计算属性，处理 prop 的值并返回：
    props: ['size'],
    computed: {
      normalizedSize: function () {
        return this.size.trim().toLowerCase()
      }
    }
    注意：在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。
```
子-父：自定义事件
```
    使用 $on(eventName) 监听事件
    使用 $emit(eventName) 触发事件
    做法一：子组件触发自身内部内容的时候，通过$emit报告上去，父组价通过绑定在子组件上的on...联动触发自身事件
    做法二：父组件绑定数据的时候加上sync修饰符，子组件修改数据的时候通过this.$emit('update:value',newvalue)显式地报告上去
```

## vue-router params与query区别、
```
最表面的区别在于：params在url上显示的为直接的value值
http://localhost:8080/goods/list/online/5997a550b0e2bb1403537a3e/check/true\
而query在url显示的是key+value的形式
http://localhost:8080/goods/template/view?templateId=5997ae3db54ee41447257625

其次params需要在路由的时候进行注册，这样我们才知道this.$route.params.???来取得对应的值，而query不需要进行显式注册，因为我们能够在url里面看到直接的key值，根据这个值，我们便能对应拿到想要的数据    

编写方式：
params:
this.$router.push({name: 'goodsOnline', params: {productId: row._id, operate: 'check', hasBiz: row.hasBiz}})
query:
this.$router.push({name: 'goodsTemplateView', query: {templateId: id}})
```

## webpack打包过程，导致字体图标缺失
http://blog.csdn.net/xiaoermingn/article/details/53543001


## div需要添加失去焦点触发事件问题
点击内部元素也触发了blur事件解决方案（vue），可以在vue里面通过jquery为document全局设定click事件对想要收起的元素进行隐藏，然后在vue内容对需要排除在click事件之外的元素添加带有stop(阻止冒泡)的方法

## 全局函数注册
https://segmentfault.com/q/1010000007031477


## vue项目使用sass
```
安装：
 npm install node-sass --save-dev
 npm install sass-loader --save-dev
```

## el-input-number @change
需要注意的是：@change事件中去获取v-model的值  获取到的是改变前的值

## props传递拿不到数据问题
有的时候，我们通过组件传值的方式向子组件传递参数，这时候在各大生命周期里面，以及计算属性中获取值可能出现undefined的情况，因为此时数据还没传递进来，可以在组件上加v-if进行解决

## 通过对象的形式控制元素背景图
```
元素上通过:style=""绑定一个对象
对象内部书写方式： backgroundImage: `url('${defaultPortrait}')`
```

## watch立即执行的问题：
```
handler可以是一个具名函数，也可以是一个匿名函数，根据场景决定
匿名函数场景：
watch: {
    currentView: {
      handler(val) {
        if (val === 'childrenAds') {
          this.init()
        }
      },
      immediate: true
    }
}

```

## 组件按需加载
```
 childrenAds: resolve => { require(['./childrenAds'], resolve) }
```

## vue动态修改路由参数
```
import merge from 'webpack-merge'；
 
修改原有参数        
this.$router.push({
    query:merge(this.$route.query,{'maxPrice':'630'})
})
 
新增一个参数：
this.$router.push({
    query:merge(this.$route.query,{'addParams':'我是新增的一个参数，哈哈哈哈'})
})
 
替换所有参数：
 this.$router.push({
    query:merge({},{'maxPrice':'630'})
})
```

## vue-lazyload 特殊情况下改变全局配置的error图
```
<img v-lazy="{src: item.baby.head_img, error: defaultBabyHead}">
```
- 注意：其中用到的***defaultBabyHead***需要在data里面注册，否则无效
关于vue-lazyload其他内容见[：gihub](https://github.com/hilongjw/vue-lazyload/)
