# JS 点滴

## 字符处理

### 末尾验证

```js
    判断是否以指定字符串开始用startsWith，结尾用endsWith
    eg:let str = 'aaa'      console.log(str.endWith(a))-------true
```

## 缓存问题

有的时候需要禁用浏览器缓存，方法如下：

在 header 里面配置
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
'YQJ-APP-USER-SESSION-ID': localStorage.getItem('YQJSESSION') || '',
'X-APP-KEY': 'r4k5gf8wusnd72mftq96wkchp3jzg54h',
'Yqj-User-Agent': 'web/5.2.0',
'Cache-Control':'no-cache'
}

## 移动端验证

```js
// 移动端跳转
var OS = (function() {
  var a = navigator.userAgent,
    b = /(?:Android)/.test(a),
    d = /(?:Firefox)/.test(a),
    e = /(?:Mobile)/.test(a),
    f = b && e,
    g = b && !f,
    c = /(?:iPad.*OS)/.test(a),
    h = !c && /(?:iPhone\sOS)/.test(a),
    k = c || g || /(?:PlayBook)/.test(a) || (d && /(?:Tablet)/.test(a)),
    a =
      !k &&
      (b ||
        h ||
        /(?:(webOS|hpwOS)[\s\/]|BlackBerry.*Version\/|BB10.*Version\/|CriOS\/)/.test(
          a
        ) ||
        (d && e));
  return {
    android: b,
    androidPad: g,
    androidPhone: f,
    ipad: c,
    iphone: h,
    tablet: k,
    phone: a,
  };
})();
if (OS.phone || OS.ipad) {
  location.href = "//tim.qq.com/mobile/index.html?adtag=index";
}
```

## js 修改 title ios 失效解决方案

```js
function wxSetTitle(title) {
  document.title = title;
  var mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    iframe.setAttribute("src", "loading.png");
    var iframeCallback = function() {
      setTimeout(function() {
        iframe.removeEventListener("load", iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener("load", iframeCallback);
    document.body.appendChild(iframe);
  }
}
```

## base64 转文件

通过一个函数，实现 base64 转文件操作

```js
dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime
    });
}
```

## 操作 canvas 样式

常规情况下可以通过 id、class 获取 canvas 元素，某些特定情况下，直接通过 tagname 获取的 canvas 无法对其 style 等进行操作

```js
let canvas = document.getElementsByTagName("canvas").item(0);
canvas.style.border = "solid 1px #fff";
```

## 判断一个对象是否为空

```js
Object.keys(this.client).length === 0;
```

## 通过 blob 实现纯前端下载

```js
const foo = { hello: "world" };
const blob = new Blob([JSON.stringify(foo)], { type: "text/plain" });
const fileName = `${Date.now()}.doc`;
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = fileName;
link.click();
URL.revokeObjectURL(link.href);
```

## js 将时间转换为时间戳在苹果手机上为 NaN

```js
let stopTime = new Date("2017-08-12 23:00:00".replace(/-/g, "/")).getTime();
```

## dom 操作获取 offsetTop 恒为 0 问题

```js
function pageX(elem) {
  return elem.offsetParent
    ? elem.offsetLeft + pageX(elem.offsetParent)
    : elem.offsetLeft;
}

function pageY(elem) {
  return elem.offsetParent
    ? elem.offsetTop + pageY(elem.offsetParent)
    : elem.offsetTop;
}
```

## element messagebox 确认操作后滑动屏幕闪屏

通过调用实例的 beforeClose-done 方法显式关闭弹窗

```js
beforeClose: (action, instance, done) => {
  done();
};
```

## 图片与 base64 的爱恩情仇

1、图片文件转 base64

```js
let reader = new FileReader();
reader.readAsDataURL(source);
reader.onload = (e) => {
  resolve(e.target.result);
};
```

2、图片地址转 base64

- canvas 的方式

```js
let img = new Image();
img.src = source + "?v=" + Math.random();
img.crossOrigin = "*";

img.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let ext =
    img.width > maxWidth
      ? "jpeg"
      : source.substring(source.lastIndexOf(".") + 1).toLowerCase();
  resolve(canvas.toDataURL(`image/${ext}`));
  // 注意这个地方处理成jpeg是针对像素特别大的图片，jpeg质量小容量大比较适合这种场景，但是这样会改变filetype不做常用
};
```

- 网络请求的方式

```js
// 先使用ajax拉取图片资源，然后将返回值类型修改为blob，利用二进制转base64
// 但是这种方式弊端在于，如果图片资源地址有跨域限制会失效
axios.get(source, { responseType: "blob" }).then((res) => {
  let reader = new FileReader();
  reader.readAsDataURL(res.data);
  reader.onload = (e) => {
    resolve(e.target.result);
  };
});
```
