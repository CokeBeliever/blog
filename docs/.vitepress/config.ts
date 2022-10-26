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
        text: "算法和数据结构",
        collapsible: true,
        items: [],
      },
      {
        text: "安全",
        collapsible: true,
        items: [
          {
            text: "加密技术",
            link: "/security/encryption",
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
        text: "其他",
        collapsible: true,
        items: [],
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
