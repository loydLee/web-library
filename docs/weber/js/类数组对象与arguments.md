# 类数组对象和arguments

## 概念

> 拥有一个length属性和若干索引属性的对象

```js
var array = ['name','age','sex']

var arrayLike = {
  0: 'name',
  1: 'sex',
  2: 'age',
  length: 3
}
```

类数组对象可以像数组一样通过下标进行读写，查看长度以及遍历，但是说到底不是数组，因此无法使用数组的方法

但是并不是说类数组对象就完全无法使用数组方法

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

Array.prototype.join.call(arrayLike, '&'); // name&age&sex

Array.prototype.slice.call(arrayLike, 0); // ["name", "age", "sex"] 
// slice可以做到类数组转数组

Array.prototype.map.call(arrayLike, function(item){
    return item.toUpperCase();
}); 
// ["NAME", "AGE", "SEX"]
```

## 类数组转化为数组

除了上面提到的类数组对象通过call的方式调用数组方法能够把类数组转化为数组方法外：

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
// 1. slice
Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"] 
// 2. splice
Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"] 
// 3. ES6 Array.from
Array.from(arrayLike); // ["name", "age", "sex"] 
// 4. apply
Array.prototype.concat.apply([], arrayLike)
```

## Arguments对象

Arguments对象定义在函数体中，包括函数的参数和其他属性，在函数体中，Arguments指代该函数的Arguments对象，打印Arguments除了看到类数组的索引属性和length属性之外，还有一个callee属性

### length

Arguments对象length属性，表示实参的长度

### callee

Arguments对象callee属性，通过它可以调用函数自身

```js
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) 
    }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

### arguments 和对应参数的绑定

传入的参数，实参和arguments 的值会共享，当没有传入的时候，实参和arguments 值不会共享（非严格模式下），除此之外，严格模式下，是从哪和arguments 不会共享

#### 将参数从一个函数传递到另一个函数

```js
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
   console.log(a, b, c);
}

foo(1, 2, 3)
```
