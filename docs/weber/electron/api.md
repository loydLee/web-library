# Electron常用api
> [官方文档](https://electronjs.org/docs)

> [API手册项目](https://github.com/demopark/electron-api-demos-Zh_CN)
## 主进程
1、应用程序进程
```js
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()

win.setProgressBar(0.5)
```

2、任务栏弹出列表
```js
const { app } = require('electron')
app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])
```

3、任务栏缩略图工具栏
```js
const { BrowserWindow } = require('electron')
const path = require('path')

const win = new BrowserWindow()

win.setThumbarButtons([
  {
    tooltip: 'button1',
    icon: path.join(__dirname, 'button1.png'),
    click () { console.log('button1 clicked') }
  }, {
    tooltip: 'button2',
    icon: path.join(__dirname, 'button2.png'),
    flags: ['enabled', 'dismissonclick'],
    click () { console.log('button2 clicked.') }
  }
])

注意: 调用 BrowserWindow.setThumbarButtons 并传入空数组即可清空缩略图工具栏：

const { BrowserWindow } = require('electron')

const win = new BrowserWindow()
win.setThumbarButtons([])
```

4、本地快捷键
我们可以使用menu模块来配置快捷键，但是只有当app在处于焦点时才能够进行触发，在创建 MenuItem时必须指定一个 `accelerator` 属性。
```js
const { Menu, MenuItem } = require('electron')
const menu = new Menu()

menu.append(new MenuItem({
  label: 'Print',
  accelerator: 'CmdOrCtrl+P',
  click: () => { console.log('time to print stuff') }
}))

可以在操作系统中配置不同的组合键。

{
  accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I'
}
```

5、全局快捷键
当应用程序不处于焦点状态时，你可以使用 globalShortcut 模块来检测键盘事件
```js
const { app, globalShortcut } = require('electron')

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+X', () => {
    console.log('CommandOrControl+X is pressed')
  })
})
```

## 渲染进程
1、通知（Notification）
```js
let myNotification = new Notification('标题', {
  body: '通知正文内容'
}) // 声明并显示一个通知

myNotification.onclick = () => {
  console.log('通知被点击')
} // 通知被点击的时候执行
```

