# 前端规范建议

1、input 输入框使用 trim()

```js
// bad
let searchContent = form.search.value;

// good
let searchContent = form.search.value.trim();
```

2、使用 location 跳转前需要先转义

```js
// bad
window.location.href = url;

// good
window.location.href = encodeURIComponent(url);
```
