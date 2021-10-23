# underscore之防抖节流

> 全部开发中，避免一些频繁的事件触发

## 防抖

### 原理：事件尽管触发，但是事件触发之后n秒才会执行，在事件触发的n秒内又触发了这个事件，则以新的事件时间为准，n秒后执行，总之就是触发完事件后n秒内不会再触发事件

### 实现

```js
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```

## 节流

### 原理

持续触发事件，每隔一段时间，只执行一次事件，根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同，使用leading代表首次是否执行，trailing代表结束后是否再执行一次，两种主流的实现方式：一种是使用时间戳，另一种是设置定时器

#### 使用时间戳

当触发事件的时候，我们取出当前事件戳，然后减去之前的时间戳（一开始设为0），如果大于设置的事件周期，就执行函数，然后更新事件戳为当前事件，小于，则不执行

#### 使用定时器

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器

```js
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    };

    return throttled;
}
```
