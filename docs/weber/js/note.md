# JS点滴

## 字符处理

### 末尾验证
```
    判断是否以指定字符串开始用startsWith，结尾用endsWith
    eg:let str = 'aaa'      console.log(str.endWith(a))-------true
```

## 缓存问题
有的时候需要禁用浏览器缓存，方法如下：

在header里面配置
 headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'YQJ-APP-USER-SESSION-ID': localStorage.getItem('YQJSESSION') || '',
        'X-APP-KEY': 'r4k5gf8wusnd72mftq96wkchp3jzg54h',
        'Yqj-User-Agent': 'web/5.2.0',
        'Cache-Control':'no-cache'
      }
      
## 移动端验证
```
    // 移动端跳转
    var OS = function() {
        var a = navigator.userAgent,
            b = /(?:Android)/.test(a),
            d = /(?:Firefox)/.test(a),
            e = /(?:Mobile)/.test(a),
            f = b && e,
            g = b && !f,
            c = /(?:iPad.*OS)/.test(a),
            h = !c && /(?:iPhone\sOS)/.test(a),
            k = c || g || /(?:PlayBook)/.test(a) || d && /(?:Tablet)/.test(a),
            a = !k && (b || h || /(?:(webOS|hpwOS)[\s\/]|BlackBerry.*Version\/|BB10.*Version\/|CriOS\/)/.test(a) || d && e);
        return {
            android: b,
            androidPad: g,
            androidPhone: f,
            ipad: c,
            iphone: h,
            tablet: k,
            phone: a
        }
    }();
    if (OS.phone || OS.ipad) {
        location.href = '//tim.qq.com/mobile/index.html?adtag=index';
    }
```

## js修改title ios失效解决方案
```
function wxSetTitle(title) {
    document.title = title;
    var mobile = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(mobile)) {
        var iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.setAttribute('src', 'loading.png');
        var iframeCallback = function() {
            setTimeout(function() {
                iframe.removeEventListener('load', iframeCallback);
                document.body.removeChild(iframe);
            }, 0);
        };
        iframe.addEventListener('load', iframeCallback);
        document.body.appendChild(iframe);
    }
}
```

## base64转文件
通过一个函数，实现base64转文件操作
```
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

## 操作canvas样式
常规情况下可以通过id、class获取canvas元素，某些特定情况下，直接通过tagname获取的canvas无法对其style等进行操作
```
    let canvas=document.getElementsByTagName('canvas').item(0)
    canvas.style.border = 'solid 1px #fff'
```

## 判断一个对象是否为空
```
Object.keys(this.client).length === 0
```

## 通过blob实现纯前端下载
```
const foo = {hello: "world"};
const blob = new Blob([JSON.stringify(foo)], {type: "text/plain"});
const fileName = `${Date.now()}.doc`;
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = fileName;
link.click();
URL.revokeObjectURL(link.href);
```

## js将时间转换为时间戳在苹果手机上为NaN
```
let stopTime = new Date('2017-08-12 23:00:00'.replace(/-/g, '/')).getTime();
```

## dom操作获取offsetTop恒为0问题
```
function pageX(elem){
  return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
}

function pageY(elem){
  return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;
}
```

## element messagebox 确认操作后滑动屏幕闪屏
通过调用实例的beforeClose-done方法显式关闭弹窗
```js
beforeClose: (action, instance, done) => {
    done()
}
```


    