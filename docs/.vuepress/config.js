module.exports = {
  title: "loydLee's home",
  description: "我的小窝",
  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    ["link", { rel: "icon", href: "/favicon.jpg" }] // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: "/", // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  plugins: ["vuepress-plugin-cat"],
  themeConfig: {
    lastUpdated: "最近更新", // string | boolean
    nav: [
      // 导航栏配置
      { text: "前端er", link: "/weber/electron/note.html" },
      { text: "其他", link: "/other/note.html" }
    ],
    sidebar: [
      {
        title: "前端er",
        collapsable: false,
        children: [
          {
            title: "algorithm",
            children: ["/weber/algorithm/note.html"]
          },
          {
            title: 'css',
            children: ["/weber/css/那些不知道的css.html"]
          },
          {
            title: "electron",
            children: [
              "/weber/electron/note.html",
              "/weber/electron/api.html",
              "/weber/electron/question.html"
            ]
          },
          {
            title: "git",
            children: ["/weber/git/note.html"]
          },
          {
            title: "js",
            children: [
              "/weber/js/闭包柯里化.html",
              "/weber/js/变量.html",
              "/weber/js/词法作用域和动态作用域.html",
              "/weber/js/原型与原型链.html",
              "/weber/js/这一次彻底弄懂JSONstringify.html",
              "/weber/js/eventLoop.html",
              "/weber/js/js黑科技.html",
              "/weber/js/js基础.html",
              "/weber/js/js执行上下文栈.html",
              "/weber/js/promise.html",
              "/weber/js/this.html",
              "/weber/js/手动实现系列.html",
            ]
          },
          {
            title: "react",
            children: [
              "/weber/react/note.html",
              "/weber/react/react-native.html"
            ]
          },
          {
            title: "vue",
            children: [
              "/weber/vue/note.html",
              "/weber/vue/vue3.html"]
          },
          {
            title: "正则",
            children: ["/weber/regular/common.html"]
          },
          {
            title: "typescript",
            children: [
              "/weber/typescript/note.html",
              "/weber/typescript/react+ts.html"
            ]
          },
          {
            title: "其他",
            children: [
              "/weber/other/note.html",
              "/weber/other/基于飞冰的微前端实践.html",
              "/weber/other/基于qiankun的微前端实践.html"
            ]
          }
        ]
      },
      {
        title: "其他",
        collapsable: false,
        children: ["/other/note.html"]
      }
    ], // 侧边栏配置
    sidebarDepth: 2 // 侧边栏显示2级
  }
};
