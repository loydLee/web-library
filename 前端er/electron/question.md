# 遇到的问题
## electron拖拽问题

electron存在和浏览器一样拖入文件直接打开的问题

electron3.0之下版本需要手动禁用浏览器相关默认行为
```javascript
document.addEventListener("dragenter", function( event ) {
    ...
}, false);
document.addEventListener("dragover", function( event ) {
    ...
}, false);
document.addEventListener("drop", function( event ) {
    event.preventDefault();//禁止浏览器默认行为
    ...
    return false;//禁止浏览器默认行为
}, false);
document.addEventListener("dragend", function( event ) {
    ...
}, false);
```

或者通过定义mixins解决： 
```JavaScript
export default {
  mounted () {
    this.disableDragEvent()
  },
  methods: {
    disableDragEvent () {
      window.addEventListener('dragenter', this.disableDrag, false)
      window.addEventListener('dragover', this.disableDrag)
      window.addEventListener('drop', this.disableDrag)
    },
    disableDrag (e) {
      const dropzone = document.getElementById('upload-area') // 这个是可拖拽的上传区
      if (dropzone === null || !dropzone.contains(e.target)) {
        e.preventDefault()
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('dragenter', this.disableDrag, false)
    window.removeEventListener('dragover', this.disableDrag)
    window.removeEventListener('drop', this.disableDrag)
  }
}
```

## 使窗口具备桌面端拖拽移动位置的功能
```css
-webkit-app-region: drag;
```
**注意**：这样设置会导致区域的点击事件失效，解决办法：在需要点击的区域定义
```css
-webkit-app-region: no-drag;
```
或者自己编写mouse事件
