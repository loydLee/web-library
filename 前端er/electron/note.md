# electron学习笔记
[TOC]

## mian进程
- app模块

app模块是electron应用的骨架。它掌管着整个应用的生命周期钩子，以及很多其他事件钩子,app常用生命周期钩子如下：
```
will-finish-launching 在应用完成基本启动进程之后触发
ready 当electron完成初始化后触发
window-all-closed 所有窗口都关闭的时候触发，在windows和linux里，所有窗口都退出的时候通常是应用退出的时候
before-quit 退出应用之前的时候触发
will-quit 即将退出应用的时候触发
quit 应用退出的时候触发
```
**注意**：我们常在ready的时候执行创建窗口，创建应用菜单，创建应用快捷键等初始化操作，而在will-quit以及quit的时候执行一些清空操作，eg:解绑快捷键

- BrowserWindow

**常用配置**
```JavaScript
let window

function createWindow () {
  window = new BrowserWindow({
    height: 900, // 高
    width: 400, // 宽
    show: false, // 创建后是否显示
    frame: false, // 是否创建frameless窗口
    fullscreenable: false, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    backgroundColor: '#fff' // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'xxx' // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    transparent: true, // 是否是透明窗口（仅macOS）
    vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    webPreferences: {
      backgroundThrottling: false // 当页面被置于非激活窗口的时候是否停止动画和计时器
    }
    // ... 以及其他可选配置
  })

  window.loadURL(url)

  window.on('closed', () => { window = null })
}
```

**frame选项**默认为true,false情况下创建一个没有顶部工具栏、没有border的窗口。这个也是我们在windows系统下自定义顶部栏的基础。

**常用钩子**
```
closed 当窗口被关闭的时候
focus 当窗口被激活的时候
show 当窗口展示的时候
hide 当窗口被隐藏的时候
maxmize 当窗口最大化时
minimize 当窗口最小化时
```

**实用方法**
```
BrowserWindow.getFocusedWindow() [静态方法]获取激活的窗口
win.close() [实例方法，下同]关闭窗口
win.focus() 激活窗口
win.show() 显示窗口
win.hide() 隐藏窗口
win.maximize() 最大化窗口
win.minimize() 最小化窗口
win.restore() 从最小化窗口恢复
```

- Tray(图标组件)

需要注意的是，windows和macOS里，图标的大小都是16*16px。macOS下顶部栏的图标通常都是走黑白路线，所以可以为两种系统分别准备不同的图标

- menu

## render进程
**使用路由hash模式**

## titlebar实现
因为默认的tilebar样式一般不会符合我们的设计，所以很多时候我们会自定义这一部分内容
```
titleBarStyle: 'hidden'
```
不过在平时的使用中，我们要注意，一般我们鼠标按住titlebar的时候是可以拖动窗口的。但是如果我们在不加可拖拽的属性之前，我们自己写的titlebar是不具备这样的特性的。要加上这个特性也很简单：
```css
.handle-bar {
  -webkit-app-region no-drag
}
```

## drag&drop的避免
通常我们用Chrome的时候，有个特性是比如你往Chrome里拖入一个pdf，它就会自动用内置的pdf阅读器打开。你往Chrome里拖入一张图片，它就会打开这张图片。由于我们的electron应用的BrowserWindow其实内部也是一个浏览器，所以这样的特性依然存在。而这也是很多人没有注意的地方。也就是当你开发完一个electron应用之后，往里拖入一张图片，一个pdf等等，如果不是一个可拖拽区域（比如PicGo的上传区），那么它就不应该打开这张图、这个pdf，而是将其排除在外。

所以我们将在全局监听drag和drop事件，当用户拖入一个文件但是又不是拖入可拖拽区域的时候，应该将其屏蔽掉。因为所有的页面都应该要有这样的特性，因此合理使用vue的mixin很重要
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

## 进程间通信
electron里的不同进程间的通信是通过ipcMain和ipcRenderer来实现的。其中ipcMain是在main进程里使用的，而ipcRenderer是在renderer进程里使用的。
> 官网的例子

```JavaScript
// In main process.
const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})
```

```JavaScript
// In renderer process (web page).
const {ipcRenderer} = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

其中ipcMain只有监听来自ipcRenderer的某个事件后才能返回给ipcRenderer值。而ipcRenderer既可以收，也可以发。

ipcMain无法主动发消息给ipcRenderer，使用webContents

###  webContents

webContents其实是BrowserWindow实例的一个属性。也就是如果我们需要在main进程里给某个窗口某个页面发送消息，则必须通过win.webContents.send()方法来发送。

代码如下：
```JavaScript
// In main process
let win = new BrowserWindow({...})
win.webContents.send('img-files', imgs)


// In renderer process
ipcRenderer.on('img-files', (event, files) => {
  console.log(files)
})

```

## js数据库
### lowdb
- 初始化

**注意**：lowdb每次调用数据的时候需要显示调用其read方法，保证各个进程获取到的数据一致性

***tips***：为了操作fs更方便，不妨安装一个[fs-extra](https://github.com/jprichardson/node-fs-extra)。

创建一个datastore.js文件：
```JavaScript
/**
 * lowdb 设置
*/

import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
  global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
}

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData') + '/hdCloud' // 定义存储地址根路径

if (!fs.pathExistsSync(STORE_PATH)) { // 是否存在根路径，不存在则创建
  fs.mkdirpSync(STORE_PATH)
}

const scheme = Datastore(new FileSync(path.join(STORE_PATH, '/hdScheme.json'))) // 创建数据库文件
const config = Datastore(new FileSync(path.join(STORE_PATH, '/hdConfig.json')))

scheme._.mixin(LodashId)
config._.mixin(LodashId) // 使用lodashId为每一个新增的记录生成随机数组成的id

const db = {
  scheme,
  config
}

if (!db.config.has('formualList').value()) { // 如果不存在根节点创建
  db.config.set('formualList', []).write()
}

if (!db.config.has('templateList').value()) {
  db.config.set('templateList', []).write()
}

export default db

```
- 基本操作

创建：主要通过set()或者defaults()方法。其中defaults()专门针对空JSON文件进行初始化。（不过用set也是可以实现类似的，如上一小节说到的初始化）
```JavaScript
db.defaults({ posts: [], user: {}, count: 0 })
  .write() // 一定要显式调用write方法将数据存入JSON
```
**注意任何写的操作，都必须显式的使用write()方法来保存。**

**获取数据库**
```javascript
// 获取数据库
getDB () {
    db[this.dbName].read()
    return db[this.dbName].get(this.tableName) // 放回当前实例方便链式调用其他方法
}
```

**读取**：
```JavaScript
getList () {
    return this.getDB().value()
}
```
> 还可以用lodash的一些方法来查询你的JSON。

```JavaScript
// 根据字段查找
db.get('posts')
  .find({ id: 1 })
  .value()
getInfoByInfo (info) { // {id: 1}
    return this.getDB().find(info).value()
}
  
// 根据Id查找
getInfoById (id) {
    return this.getDB().getById(id).value()
}
```
**注意任何读的操作，都必须显式使用value()方法来获取值。**

**新增**：
```JavaScript
// 针对对象就用赋值，针对数组就用push()或者insert()（lowdb-id提供的方法）
// 添加信息
addInfo (info) {
    this.getDB()
      .insert(info)
      .write()
    return this // 一般新增完毕会返回更新后数据，因此返回实例
}


**更新**：更新的时候我们可以根据不同的结构来更新

// 针对对象可以直接用set()来更新：
db.set('user.name', 'typicode') // 通过set方法来对对象操作
  .write()
  
// 也可以：
db.set('user', {
  name: 'typicode'
}).write()

// 针对原有的数据进行更新的可以用update。
db.update('count', n => n + 1) // update方法使用已存在的值来操作
  .write()
```
// 针对对象可以使用assign写入
```javascript
// 更新信息
updateInfo (info) {
    this.getDB()
      .getById(info.id)
      .assign(info)
      .write()
    return this
}
```

删除:
```JavaScript
// 根据字段进行查找删除
db.get('posts')
  .remove({ title: 'low!' })
  .write()
  
// 可以通过unset来删除一个属性：
db.unset('user.name')
  .write()
  
// 也可以通过lodash-id提供的removeById()来删除指定id的项：
deleteInfoById (id) {
    this.getDB()
      .removeById(id)
      .write()
    return this
}
```

## 跨平台兼容措施

主要的工具是通过process.platform来判断不同的平台。当前可能的值有：
```
‘aix’
‘darwin’--macOs
‘freebsd’
‘linux’
‘openbsd’
‘sunos’
‘win32’--windows
```

## excle操作
我们使用node-xlsx插件进行相关操作

- 写入：

```JavaScript
const buffer = xlsx.build(this.list)
const _path = path.join(__dirname, '.', 'result.xlsx')
fs.writeFile(_path, buffer, function (err) {
    if (err) {
      throw err
    }
console.log('Write to xls has finished')
})
```

- 读取：

```JavaScript
const _path = path.join(__dirname, '.', 'result.xlsx')
// 读xlsx
var obj = xlsx.parse(_path)
console.log(JSON.stringify(obj, null, 2))
```

**注意**：node-xlsx对于excle里面的行列合并采用的是填空的方式处理

## 使用node api
electron同时在主进程和渲染进程中对node.js暴露了所有的接口，需要注意：

- 所有在node中可以使用的api，在electron中依旧可以使用，例如:

```JavaScript
const fs = require('fs')

const root = fs.readdirSync('/')

// 这会打印出磁盘根级别的所有文件
// 同时包含'/'和'C:\'。
console.log(root)
```

读取：
```JavaScript
const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData') + '/hdCloud/scheme' // 定义根路径

if (!fs.pathExistsSync(STORE_PATH)) { // 没有则创建
  fs.mkdirpSync(STORE_PATH)
}

schemeModule.readFile = function (fileName) {
  return new Promise((resolve, reject) => {
    const _path = path.join(STORE_PATH, '.', `${fileName}.json`)
    if (!fs.pathExistsSync(_path)) {
      fs.writeFile(_path, JSON.stringify({}))
      resolve({})
    } else {
      fs.readFile(_path, 'utf8', (err, data) => {
        if (!err) {
          resolve(JSON.parse(data))
        } else {
          reject(err)
        }
      })
    }
  })
}
```
写入：
```JavaScript
schemeModule.writeFile = function (file, fileName) {
  const _path = path.join(STORE_PATH, '.', `${fileName}.json`)
  fs.writeFile(_path, JSON.stringify(file), function (err) {
    if (!err) return '写入成功'
  })
}
```

## 利用electron-builder打包
```JavaScript
"build": {
    "productName": "HDcalculator", // 打包出来的软件名
    "appId": "huidian.calculator.com", // appid
    "directories": { // 打包输出地址
      "output": "dist"
    },
    "files": [ // 打包排除的文件
      "dist/electron/**/*",
      "node_modules/",
      "package.json"
    ],
    "nsis": { // 生成安装包的相关配置
      "oneClick": false, // 是否一键安装
      "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
      "allowToChangeInstallationDirectory": true, // 允许修改安装目录
      "installerIcon": "build/icons/icon.ico", // 安装图标
      "uninstallerIcon": "build/icons/icon.ico", //卸载图标
      "installerHeaderIcon": "build/icons/icon.ico", // 安装时头部图标
      "createDesktopShortcut": true, // 创建桌面图标
      "createStartMenuShortcut": true, // 创建开始菜单图标
      "shortcutName": "HDcalculator" // 图标名称
    },
    "dmg": {
      "contents": [
        {
          "x": 410,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        },
        {
          "x": 130,
          "y": 150,
          "type": "file"
        }
      ]
    },
    "mac": {
      "icon": "build/icons/icon.icns" // mac下的图标
    },
    "win": {
      "icon": "build/icons/icon.ico",
      "target": [
        {
          "target": "nsis", // 打包对象
          "arch": [
            "ia32"
          ]
        }
      ]
    },
    "linux": {
      "icon": "build/icons" // linux下的图标
    }
  }
```
script设置：
```JavaScript
"build:package": "node .electron-vue/build-builder.js && electron-builder --win", // 指定打包windows环境 前面那一段很重要  不加的话会出现打包app打开白屏的情况
```