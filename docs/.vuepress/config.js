module.exports = {
  title: 'loydLee\'s home',
  description: '我的小窝',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  plugins: [
    "vuepress-plugin-cat",
  ],
  themeConfig: {
    lastUpdated: '最近更新', // string | boolean
    nav:[ // 导航栏配置
      {text: '前端er', link: '/weber/electron/note.html' },
      {text: '其他', link: '/other/note.html'},
    ],
    sidebar: [{
      title: '前端er',
      collapsable: false,
      children: [
        {
          title: 'electron',
          children: [
            '/weber/electron/note.html',
            '/weber/electron/api.html',
            '/weber/electron/question.html'
          ]
        },
        {
          title: 'js',
          children: [
            '/weber/js/note.html',
            '/weber/js/standard.html'
          ]
        },
        {
          title: 'react',
          children: [
            '/weber/react/note.html',
            '/weber/react/react-native.html'
          ]
        },
        {
          title: 'vue',
          children: [
            '/weber/vue/note.html'
          ]
        },
        {
          title: '正则',
          children: [
            '/weber/regular/common.html'
          ]
        },
        {
          title: 'typescript',
          children: [
            '/weber/typescript/note.html'
          ]
        },
        {
          title: '其他',
          children: [
            '/weber/other/note.html'
          ]
        }
      ]
    },{
      title: '其他',
      collapsable: false,
      children: [
        '/other/note.html'
      ]
    }], // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
  }
};