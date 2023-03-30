import { defineConfig } from "vitepress";
import markdownItMathjax3 from "markdown-it-mathjax3";

export default defineConfig({
  title: "CokeBeliever 的博客",
  description: "一个博客网站",
  lang: "zh-CN",
  base: "/blog",
  themeConfig: {
    logo: "/logo.svg",
    outline: "deep",
    nav: [],
    sidebar: [
      {
        text: "JavaScript",
        collapsible: true,
        items: [
          {
            text: "在浏览器环境中的 JavaScript",
            link: "/javascript/javascript-in-browser-environment",
          },
          {
            text: "在 HTML 中使用 JavaScript",
            link: "/javascript/use-javascript-in-html",
          },
          {
            text: "数据类型",
            link: "/javascript/data-type",
          },
          {
            text: "迭代器和生成器",
            link: "/javascript/iterator-and-generator",
          },
          {
            text: "JavaScript 对象",
            link: "/javascript/javascript-object",
          },
          {
            text: "继承",
            link: "/javascript/inherit",
          },
          {
            text: "作用域 + 闭包 + 垃圾回收",
            link: "/javascript/scope-closure-garbage-collection",
          },
          {
            text: "异步编程",
            link: "/javascript/asynchronous-programming",
          },
        ],
      },
      {
        text: "CSS",
        collapsible: true,
        items: [
          {
            text: "在 HTML 中使用 CSS",
            link: "/css/use-css-in-html",
          },
          {
            text: "CSS 规则的结构",
            link: "/css/structure-of-css-rules",
          },
          {
            text: "CSS 选择符",
            link: "/css/css-selector",
          },
          {
            text: "CSS 规则的特性",
            link: "/css/features-of-css-rules",
          },
          {
            text: "弹性盒布局",
            link: "/css/flex-box-layout",
          },
          // {
          //   text: "栅格布局",
          //   link: "/css/grid-layout",
          // },
        ],
      },
      {
        text: "Vue",
        collapsible: true,
        items: [
          {
            text: "Vue3",
            items: [
              {
                text: "响应式系统",
                items: [
                  {
                    text: "响应式系统的基本原理",
                    link: "/vue/vue3/reactive-system/basic-principles-of-reactive-system",
                  },
                  {
                    text: "计算属性的基本原理",
                    link: "/vue/vue3/reactive-system/basic-principles-of-computed",
                  },
                  {
                    text: "watch 的基本原理",
                    link: "/vue/vue3/reactive-system/basic-principles-of-watch",
                  },
                  {
                    text: "代理 Object",
                    link: "/vue/vue3/reactive-system/proxy-object",
                  },
                  {
                    text: "代理 Array",
                    link: "/vue/vue3/reactive-system/proxy-array",
                  },
                ],
              },
              {
                text: "渲染器",
                items: [
                  {
                    text: "渲染器的设计",
                    link: "/vue/vue3/renderer/design-of-renderer",
                  },
                  {
                    text: "渲染器的基本实现",
                    link: "/vue/vue3/renderer/basic-implementation-of-renderer",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        text: "算法和数据结构",
        collapsible: true,
        items: [
          { text: "前言", link: "/algorithm-and-data-structure/preface" },
          {
            text: "数据结构",
            link: "/algorithm-and-data-structure/data-structure/index",
            items: [
              {
                text: "链表",
                link: "/algorithm-and-data-structure/data-structure/linked-list",
              },
              {
                text: "栈",
                link: "/algorithm-and-data-structure/data-structure/stack",
              },
              {
                text: "队列",
                link: "/algorithm-and-data-structure/data-structure/queue",
              },
              {
                text: "树",
                link: "/algorithm-and-data-structure/data-structure/tree/index",
                items: [
                  {
                    text: "二叉树",
                    link: "/algorithm-and-data-structure/data-structure/tree/binary-tree",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        text: "前端工程化",
        collapsible: true,
        items: [
          {
            text: "webpack5+ts+vue3",
            link: "/front-end-engineering/webpack5+ts+vue3",
          },
        ],
      },
      {
        text: "计算机网络",
        collapsible: true,
        items: [
          {
            text: "HTTP 报文",
            link: "/computer-network/http-message",
          },
          {
            text: "HTTP 缓存",
            link: "/computer-network/http-cache",
          },
        ],
      },
      {
        text: "安全",
        collapsible: true,
        items: [
          {
            text: "加密技术",
            link: "/security/encryption",
          },
          {
            text: "消息摘要",
            link: "/security/message-digest",
          },
          {
            text: "数字签名",
            link: "/security/digital-signature",
          },
        ],
      },
      {
        text: "软件工程",
        collapsible: true,
        items: [
          {
            text: "软件工程概述",
            link: "/software-engineering/software-engineering-overview",
          },
          {
            text: "软件过程模型",
            link: "/software-engineering/software-process-model",
          },
          {
            text: "结构化开发方法",
            link: "/software-engineering/structured-development-method",
          },
          {
            text: "系统分析与设计",
            link: "/software-engineering/system-analysis-and-design",
          },
        ],
      },
      {
        text: "数据库",
        collapsible: true,
        items: [
          { text: "E-R 模型", link: "/database/entity-relationship-model" },
        ],
      },
      {
        text: "面向对象",
        collapsible: true,
        items: [
          {
            text: "面向对象的基本概念",
            link: "/object-oriented/basic-concept-of-object-oriented",
          },
          {
            text: "面向对象程序设计",
            link: "/object-oriented/object-oriented-programming",
          },
          {
            text: "UML",
            link: "/object-oriented/uml",
          },
        ],
      },
      {
        text: "语言",
        collapsible: true,
        items: [
          {
            text: "程序设计语言概述",
            link: "/language/overview-programming-language",
          },
          {
            text: "语言处理程序",
            link: "/language/language-processor",
            items: [
              {
                text: "汇编程序基本原理",
                link: "/language/fundamentals-of-assembler",
              },
              {
                text: "编译程序基本原理",
                link: "/language/fundamentals-of-compiler",
              },
            ],
          },
        ],
      },
      {
        text: "其他",
        collapsible: true,
        items: [
          {
            text: "模块",
            link: "/other/module",
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/CokeBeliever" }],
    editLink: {
      pattern: "https://github.com/CokeBeliever/blog/edit/master/docs/:path",
      text: "在 GitHub 编辑此页",
    },
  },
  markdown: {
    config: (md) => {
      md.use(markdownItMathjax3);
    },
  },
});
