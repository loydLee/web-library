# 算法与数据结构

## 数组的交集

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

## 根据数字二进制下的 1 数目排序

思路：将所有数字的二进制 1 数目存储起来，如果二进制下 1 数目相同则比较数字本身，排序使用 sort

```js
let sortByBites = function(arr) {
  const m = new Map(); //使用map对每个数字的二进制1数目进行存储 object也可以
  arr.forEach((item) => {
    let temp = item;
    let count = 0;
    while (temp) {
      temp = temp & (temp - 1);
      count++;
    }

    m.set(item, count);
  });

  return arr.sort((a, b) => {
    if (m.get(a) === m.get(b)) {
      return a - b;
    } else {
      return m.get(a) - m.get(b);
    }
  });
};
```
