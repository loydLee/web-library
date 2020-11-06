# 算法与数据结构

## 每日一题

### 数组的交集

给定数组，求交集

```js
es5:
let b = a.filter(function(v) {
  return b.indexOf(v) > -1
})

es6

let b = a.filter(x => b.has(x))
```

拓展：并、补、差

```js
并;
let c = Array.from(new Set([...a, ...b]));
补;
let c = [...a.filter((x) => !b.has(x)), ...b.filter((x) => !a.has(x))];
差;
let c = a.filter((x) => !b.has(x));
```
