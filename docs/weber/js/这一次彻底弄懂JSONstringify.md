# 这一次，彻底弄懂JSON.stringify

## 问题
```js
let signInfo = [
  {
    fieldId: 539,
    value: undefined
  },
  {
    fieldId: 540,
    value: undefined
  },
  {
    fieldId: 546,
    value: undefined
  },
]
```
JSON.stringify之后的值是什么呢？？？
答案：
```
[
  {
    "fieldId": 539
  },
  {
    "fieldId": 540
  },
  {
    "fieldId": 546
  }
]
```
## 原因
可以发现，经过JSON.stringify之后的数据，缺少了value,key

具体原因是因为undefined,任意的函数以及symbol值出现在非数组对象的属性值中的时候，在序列化的过程中会被忽略掉

## 语法：
JSON.stringify(value[, replacer [, space]])

value:将要被序列化的值

replacer(可选)：
- 如果该阐述是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理
- 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的JSON字符串中
- 如果该参数为null或者未提供，则对象所有的属性 都会被序列化

space(可选)：
- 制定缩进用的空白字符串，用户梅花输入（pretty-print）
- 如果参数是个数字，它代表有多少的空格，上限为10
- 该值若小于1，则没有空格
- 如果该参数为字符串（当字符串长度>10，取前10个字符），该字符串将被作为空格
- 如果该参数没有提供（或者为null,则没有空格

## 需要注意的特性

特性一：

```js
// 1. 对象中存在这三种值会被忽略
console.log(JSON.stringify({
  name: 'loydlee',
  sex: 'boy',
  // 函数会被忽略
  showName () {
    console.log('loydlee')
  },
  // undefined会被忽略
  age: undefined,
  // Symbol会被忽略
  symbolName: Symbol('loydlee')
}))
// '{"name":"loydlee","sex":"boy"}'

// 2. 数组中存在着三种值会被转化为null
console.log(JSON.stringify([
  'loydlee',
  'boy',
  // 函数会被转化为null
  function showName () {
    console.log('loydlee')
  },
  //undefined会被转化为null
  undefined,
  //Symbol会被转化为null
  Symbol('loydlee')
]))
// '["loydlee","boy",null,null,null]'

// 3.单独转换会返回undefined
console.log(JSON.stringify(
  function showName () {
    console.log('loydlee')
  }
)) // undefined
console.log(JSON.stringify(undefined)) // undefined
console.log(JSON.stringify(Symbol('loydlee'))) // undefined
```

特性二：

布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
```js
console.log(JSON.stringify([new Number(1), new String("loydlee"), new Boolean(false)]))
// '[1,"loydlee",false]'
```

特性三：

所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
```js
console.log(JSON.stringify({
  name: Symbol('loydlee'),
}))
// '{}'
console.log(JSON.stringify({
  [ Symbol('loydlee') ]: 'loydlee',
}, (key, value) => {
  if (typeof key === 'symbol') {
    return value
  }
}))
// undefined
```

特性四：

NaN 和 Infinity 格式的数值及 null 都会被当做 null。
```js
console.log(JSON.stringify({
  age: NaN,
  age2: Infinity,
  name: null
}))
// '{"age":null,"age2":null,"name":null}'
```

特性五：

转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
```js
const toJSONObj = {
  name: 'loydlee',
  toJSON () {
    return 'JSON.stringify'
  }
}

console.log(JSON.stringify(toJSONObj))
// "JSON.stringify"
```

特性六：

Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
```js
const d = new Date()

console.log(d.toJSON()) // 2021-10-05T14:01:23.932Z
console.log(JSON.stringify(d)) // "2021-10-05T14:01:23.932Z"
```js

特性七：

对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
```js
let cyclicObj = {
  name: 'loydlee',
}

cyclicObj.obj = cyclicObj

console.log(JSON.stringify(cyclicObj))
// Converting circular structure to JSON
```

特性八：

其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
```js
let enumerableObj = {}

Object.defineProperties(enumerableObj, {
  name: {
    value: 'loydlee',
    enumerable: true
  },
  sex: {
    value: 'boy',
    enumerable: false
  },
})

console.log(JSON.stringify(enumerableObj))
// '{"name":"loydlee"}'
```

特性九：

当尝试去转换 BigInt 类型的值会抛出错误
```js
const alsoHuge = BigInt(9007199254740991)

console.log(JSON.stringify(alsoHuge))
// TypeError: Do not know how to serialize a BigInt

作者：前端胖头鱼
链接：https://juejin.cn/post/7017588385615200270
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

##  手写一个JSON.stringify
```js
const jsonstringify = (data) => {
  // 确认一个对象是否存在循环引用
  const isCyclic = (obj) => {
  // 使用Set数据类型来存储已经检测过的对象
  let stackSet = new Set()
  let detected = false

  const detect = (obj) => {
    // 不是对象类型的话，可以直接跳过
    if (obj && typeof obj != 'object') {
      return
    }
    // 当要检查的对象已经存在于stackSet中时，表示存在循环引用
    if (stackSet.has(obj)) {
      return detected = true
    }
    // 将当前obj存如stackSet
    stackSet.add(obj)

    for (let key in obj) {
      // 对obj下的属性进行挨个检测
      if (obj.hasOwnProperty(key)) {
        detect(obj[key])
      }
    }
    // 平级检测完成之后，将当前对象删除，防止误判
    /*
      例如：对象的属性指向同一引用，如果不删除的话，会被认为是循环引用
      let tempObj = {
        name: 'loydlee'
      }
      let obj4 = {
        obj1: tempObj,
        obj2: tempObj
      }
    */
    stackSet.delete(obj)
  }

  detect(obj)

  return detected
}

  // 特性七:
  // 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
  if (isCyclic(data)) {
    throw new TypeError('Converting circular structure to JSON')
  }

  // 特性九:
  // 当尝试去转换 BigInt 类型的值会抛出错误
  if (typeof data === 'bigint') {
    throw new TypeError('Do not know how to serialize a BigInt')
  }

  const type = typeof data
  const commonKeys1 = ['undefined', 'function', 'symbol']
  const getType = (s) => {
    return Object.prototype.toString.call(s).replace(/\[object (.*?)\]/, '$1').toLowerCase()
  }

  // 非对象
  if (type !== 'object' || data === null) {
    let result = data
    // 特性四：
    // NaN 和 Infinity 格式的数值及 null 都会被当做 null。
    if ([NaN, Infinity, null].includes(data)) {
      result = 'null'
      // 特性一：
      // `undefined`、`任意的函数`以及`symbol值`被`单独转换`时，会返回 undefined
    } else if (commonKeys1.includes(type)) {
      // 直接得到undefined，并不是一个字符串'undefined'
      return undefined
    } else if (type === 'string') {
      result = '"' + data + '"'
    }

    return String(result)
  } else if (type === 'object') {
    // 特性五:
    // 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化
    // 特性六:
    // Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
    if (typeof data.toJSON === 'function') {
      return jsonstringify(data.toJSON())
    } else if (Array.isArray(data)) {
      let result = data.map((it) => {
        // 特性一:
        // `undefined`、`任意的函数`以及`symbol值`出现在`数组`中时会被转换成 `null`
        return commonKeys1.includes(typeof it) ? 'null' : jsonstringify(it)
      })

      return `[${result}]`.replace(/'/g, '"')
    } else {
      // 特性二：
      // 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
      if (['boolean', 'number'].includes(getType(data))) {
        return String(data)
      } else if (getType(data) === 'string') {
        return '"' + data + '"'
      } else {
        let result = []
        // 特性八
        // 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
        Object.keys(data).forEach((key) => {
          // 特性三:
          // 所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
          if (typeof key !== 'symbol') {
            const value = data[key]
            // 特性一
            // `undefined`、`任意的函数`以及`symbol值`，出现在`非数组对象`的属性值中时在序列化过程中会被忽略
            if (!commonKeys1.includes(typeof value)) {
              result.push(`"${key}":${jsonstringify(value)}`)
            }
          }
        })

        return `{${result}}`.replace(/'/, '"')
      }
    }
  }
}
```