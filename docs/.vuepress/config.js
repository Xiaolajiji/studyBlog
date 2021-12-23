module.exports = {
  head: [
    [
      'link', // 设置 favicon.ico，注意图片放在 public 文件夹下
      { rel: 'icon', href: 'images/hero.jpg' }
    ]
  ],
  themeConfig: {
    nav: [
      // 导航栏配置
      { text: '首页', link: '/' },
      { text: '笔记', link: '/note/' },
      { text: '进阶之路', link: '/more/' }
    ],
    sidebar: {
      '/note/': [
        {
          title: '笔记',
          path: '/note/',
          collapsable: false,
          sidebarDepth: 3,
          children: ['简单使用ThreeJS', '谈谈Babel', '谈谈Webpack']
        }
      ]
    } // 侧边栏配置
  },
  base: '/studyBlog/',
  title: 'studyBlog',
  description: '个人技术博客'
}
