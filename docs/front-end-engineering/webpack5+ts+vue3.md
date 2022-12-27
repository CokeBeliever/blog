# webpack5+ts+vue3

> webpack 是一个模块打包工具。它的主要目的是捆绑 JavaScript 文件以便在浏览器中使用，但它也能够转换、捆绑或打包几乎任何资源或资产。

这是一篇使用 webpack5 对基于 TypeScript + Vue3 的 web 项目的配置。

## 初始化项目

首先，让我们去创建一个目录 `webpack5-ts-vue3-boilerplate`：

```
mkdir webpack5-ts-vue3-boilerplate
cd webpack5-ts-vue3-boilerplate
```

然后，在项目根目录中，初始化 npm，这会生成一个 `package.json` 文件：

```
npm init -y
```

最后，在项目根目录中，创建一个 `.gitignore` 文件 (让 git 忽视指定的目录或文件)，添加内容如下：

```
node_modules
dist
```

项目结构如下：

```
.
├── .gitignore
└── package.json
```

## 简单使用 webpack

安装 `webpack` 和 `webpack-cli` (在命令行上运行 `webpack` 的工具)：

```
npm install --save-dev webpack webpack-cli
```

首先，在项目根 `src` 目录中，创建 `index.js` 文件，内容如下：

```js
const name = "CokeBeliever";
console.log(name);
```

然后，在项目根目录中，创建一个 `webpack.config.js` 文件，内容如下：

```js
const path = require("path");

const PROJ_ROOT = path.resolve(__dirname);

module.exports = {
  entry: {
    main: path.resolve(PROJ_ROOT, "src/index.js"),
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(PROJ_ROOT, "dist"),
    chunkFilename: "js/[name].js",
    clean: true,
  },
};
```

运行 `npx webpack`，webpack 会根据 `webpack.config.js` 配置文件，在项目根 `dist/js` 目录中生成一个`main.bundle.js` 文件，内容如下：

```js
console.log("CokeBeliever");
```

项目结构如下：

```
├── .gitignore
├── dist
│   └── js
│       └── main.bundle.js
├── package-lock.json
├── package.json
├── src
│   └── index.js
└── webpack.config.js
```

## 创建 `index.html` 文件

> 在一个 web 应用中，不可缺少的就是 html 文件。

我们可以在项目根 `dist` 目录中，创建一个 `index.html` 文件，内容如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>webpack5+ts+vue3</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <script defer="defer" src="js/main.bundle.js"></script>
  </head>
  <body></body>
</html>
```

在浏览器打开 `index.html`，我们可以在控制台中看到输出：

```
CokeBeliever
```

> :question:能不能让 webpack 在打包时，自动帮我们引入 bundles 并生成 html 文件呢？
>
> 这是可以的。

首先，安装 `html-webpack-plugin`：

```
npm install --save-dev html-webpack-plugin
```

然后，编辑 `webpack.config.js`，添加内容如下：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5+ts+vue3",
    }),
  ],
};
```

运行 `npx webpack`，会在 `output.path` 配置项所指定的目录中，自动生成 `index.html` 文件。

在浏览器打开 `index.html`，我们可以在控制台中看到输出：

```
CokeBeliever
```

项目结构如下：

```
.
├── .gitignore
├── dist
│   ├── index.html
│   └── js
│       └── main.bundle.js
├── package-lock.json
├── package.json
├── src
│   └── index.js
└── webpack.config.js
```

## 配置开发服务器

> :question:在开发中，我们每次修改代码，都需要重新使用 webpack 打包，接着刷新浏览器吗，这种效率太低了，有没有解决办法呢？
>
> 有的。我们可以开一个 web 服务，让它来监视文件的更改，自动重新打包并更新页面。

首先，安装 `webpack-dev-server`：

```
npm install --save-dev webpack-dev-server
```

然后，编辑 `webpack.config.js`，添加内容如下：

```js
module.exports = {
  // ...
  mode: "development",
  devServer: {
    hot: true,
    open: true,
  },
};
```

运行 `npx webpack server`，会启动一个 web 服务，让它来监视文件都更改，并自动重新打包并更新页面。你可以尝试更改 `src/index.js` 的内容看看效果。

## 配置开发和生产环境

> **development (开发环境)** 和 **production (生产环境)** 这两个环境下的构建目标存在着巨大差异。在**开发环境**中，我们需要：强大的 source map 和一个有着 live reloading (实时重新加载) 或 hot module replacement (热模块替换) 能力的本地服务器。而**生产环境**目标则转移至其他方面，关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写**彼此独立的 webpack 配置**。

首先，我们在项目根 `build` 目录下创建 3 个文件：

- `webpack.common.js`：用于配置**开发环境和生产环境**通用的配置。
- `webpack.dev.js`：用于配置**开发环境**特有的配置。
- `webpack.prod.js`：用于配置**生产环境**特有的配置。

然后，安装 `webpack-merge`，用于将 `webpack.common.js` 通用配置合并到其他配置中：

```
npm install --save-dev webpack-merge
```

`webpack.common.js`，内容如下：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PROJ_ROOT = path.resolve(__dirname, "..");

module.exports = {
  entry: {
    main: path.resolve(PROJ_ROOT, "src/index.js"),
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(PROJ_ROOT, "dist"),
    chunkFilename: "js/[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5+ts+vue3",
    }),
  ],
};
```

`webpack.dev.js`，内容如下：

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    hot: true,
    open: true,
  },
});
```

`webpack.prod.js`，内容如下：

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
});
```

编辑 `package.json`，添加内容如下：

```json
{
  "scripts": {
    "serve": "webpack serve --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
  }
}
```

运行 `npm run serve`，会启动一个 web 服务，让它来监视文件都更改，自动重新打包并更新页面。

运行 `npm run build`，会执行打包，生成应用静态资源。

:warning:可以删除项目根目录下的 `webpack.config.js` 文件。

项目结构如下：

```
.
├── .gitignore
├── build
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── dist
│   ├── index.html
│   └── js
│       └── main.bundle.js
├── package-lock.json
├── package.json
└── src
    └── index.js
```

## 配置解析别名

> 为了便于模块导入和路径的可读性，一般我们会配置一些常用目录的别名。

我们配置 `@` 作为项目根 `src` 目录别名，在 `build/webpack.common.js`，添加内容如下：

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      "@": path.resolve(PROJ_ROOT, "src"),
    },
  },
};
```

## 配置解析扩展名

> 为了便于开发，一般我们会配置一些常见的扩展名。

我们配置 `.ts` 和 `.js` 文件可以省略扩展名，在 `build/webpack.common.js`，添加内容如下：

```js
module.exports = {
  //...
  resolve: {
    // ...
    extensions: [".ts", ".js"],
  },
};
```

## 配置 Browserslist

在不同的工具之间共享目标浏览器和 Node.js 版本的配置。它被用于：

- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [Babel](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
- [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env)
- [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)
- [stylelint-no-unsupported-browser-features](https://github.com/ismay/stylelint-no-unsupported-browser-features)
- [postcss-normalize](https://github.com/csstools/postcss-normalize)
- [obsolete-webpack-plugin](https://github.com/ElemeFE/obsolete-webpack-plugin)

在 `package.json` 中，添加内容如下：

```json
{
  // ...
  "browserslist": ["last 1 version", "> 1%", "not dead"]
}
```

以上的配置表示：`最后的 1 个版本或市场份额大于 1%，且未停止更新的浏览器`。这样，只要是支持 Browserslist 的工具就能够从该配置知道应该如何工作。

## 配置 CSS

> 在 web 应用中，不可避免要使用到 CSS，但一般我们会使用一些 CSS 扩展语言和工具，使我们在开发阶段可以更好的编写和组织样式。

安装 `sass`、`postcss`

```
npm install --save-dev sass postcss
```

- `Sass` 是 CSS 扩展语言，添加了嵌套规则、变量、Mixins、选择器继承等。可以使用命令行工具或构建系统的插件将其转换为格式良好的标准 CSS。
- `PostCSS` 是一个允许使用 JS 插件转换样式的工具。 这些插件可以检查 (lint) 你的 CSS，支持 CSS 变量和 Mixins，编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。

> :warning:由于 webpack 默认只能处理 JavaScript 和 JSON 文件。所以我们需要安装各种各样的 **loader** 来让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，供应用程序使用。

安装 `sass-loader`、`postcss-loader`、`css-loader`、`style-loader`

```
npm install --save-dev sass-loader postcss-loader css-loader style-loader
```

- `sass-loader` 处理 SASS/SCSS 文件，使用 Sass 加载并编译 SASS/SCSS 文件，并最终返回 CSS 文件。
- `postcss-loader` 处理 CSS 文件，使用 PostCSS 加载和编译 CSS 文件，并最终返回 CSS 文件。
- `css-loader` 处理 CSS 文件，加载和解析 CSS 文件中所引用的模块 (`@import` 和 `url()`)，并最终返回 CSS 文件。
- `style-loader` 处理 CSS 文件，加载 CSS 注入到 DOM 中。

安装 `postcss-preset-env`

```
npm install --save-dev postcss-preset-env
```

- `postcss-preset-env` 允许你将现代 CSS 转换为大多数浏览器都能理解的 CSS，根据您的目标浏览器或运行时环境确定所需的 polyfills。

编辑 `build/webpack.common.js`，添加内容如下：

```js
const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv()],
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
};
```

在项目根 `src` 目录中，创建 `index.scss` 文件，添加内容如下：

```scss
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background-color: #12345678;
}
```

修改 `src/index.js` 文件，内容如下：

```js
import "./index.scss";
```

现在 webpack 已经知道如何处理 SCSS 文件了，运行 `npx webpack server`，我们可以在页面上看到 CSS 样式。

## 配置 Vue3

安装 `vue`：

```
npm install --save vue
```

为了让 webpack 可以处理 vue 文件，我们安装 `vue-loader`：

```
npm install --save-dev vue-loader
```

在 `webpack/webpack.common.js` 中，添加配置如下：

```js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // ...
  plugins: [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
};
```

在项目根 `src` 目录下创建 `App.vue` 文件，内容如下：

```vue
<template>
  <div>
    <h1>{{ name }}</h1>
  </div>
</template>

<script setup>
const name = "CokeBeliever";
</script>

<style lang="scss" scoped>
div {
  text-align: center;
  color: blue;
}
</style>
```

修改 `src/index.js` 文件，内容如下：

```js
import "./index.scss";
import App from "./App.vue";
import { createApp } from "vue";

const app = createApp(App);
app.mount("#app");
```

注意，`app` 会挂载到 `#app`，所以我们需要有一个 `id` 为 `app` 的元素，用于挂载应用程序。

我们可以在项目根 `public` 目录中创建 `index.html` 内容如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

编辑 `build/webpack.common.js`，更新 `HtmlWebpackPlugin` 配置如下：

```js
module.exports = {
  plugins: [
    // ...
    new HtmlWebpackPlugin({
      title: "webpack5+ts+vue3",
      template: "./public/index.html",
    }),
  ],
};
```

这样 `HtmlWebpackPlugin` 会根据 `template` 属性指定的模板来生成 html。

运行 `npx webpack server`，开启你的 Vue3 之旅。

项目结构如下：

```
.
├── .gitignore
├── build
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── dist
│   ├── index.html
│   └── js
│       └── main.bundle.js
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── src
    ├── App.vue
    ├── index.js
    └── index.scss
```

## 配置资源

> 在 web 应用中，我们还可能用到图片、字体等资源。

在 webpack5 之前，通常使用：

- `raw-loader` 将文件导入为字符串
- `url-loader` 将文件作为 data URI 内联到 bundle 中
- `file-loader` 将文件发送到输出目录

在 webpack5 通过添加 4 种新的模块类型，来替换所有这些 loader：

- `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现。
- `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

编辑 `build/webpack.common.js`，添加内容如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        include: path.resolve(PROJ_ROOT, "src/assets/image"),
        type: "asset",
        generator: {
          filename: "image/[hash][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff2?)$/,
        include: path.resolve(PROJ_ROOT, "src/assets/font"),
        type: "asset/resource",
        generator: {
          filename: "font/[hash][ext]",
        },
      },
    ],
  },
};
```

在项目根 `src` 目录下，创建 `assets` 目录，并在该目录中创建 `image` 和 `font` 用于存放图片和字体资源。

我们可以在 `src/assets/image` 中，放入一张图片 `avatar.png`。

编辑 `App.vue`，内容如下：

```vue
<template>
  <div>
    <h1>{{ name }}</h1>
    <img src="@/assets/image/avatar.png" />
  </div>
</template>

<script setup>
const name = "CokeBeliever";
</script>

<style lang="scss" scoped>
div {
  text-align: center;
  color: blue;

  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
}
</style>
```

运行 `npx webpack server` 和 `npx webpack build` 试试看效果。

项目结构如下：

```
.
├── .gitignore
├── build
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── dist
│   ├── image
│   │   └── 7f184589b0667e7ef312.png
│   ├── index.html
│   └── js
│       └── main.bundle.js
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── src
    ├── App.vue
    ├── assets
    │   ├── font
    │   └── image
    │       └── avatar.png
    ├── index.js
    └── index.scss
```

## 配置 TypeScript

为了让 webpack 可以处理 TypeScript 文件，我们可以使用下列几种方式之一：

1. `ts-loader`

   这是最简单的方式，但这种方式随着项目的增大，处理时间会明显地线性增加，这是因为 `ts-loader` 会在单个进程中处理**编译**和**类型检查**。不过可以通过以下步骤来进行优化：

   1. 使用 `transpileOnly: true` 选项，让 `ts-loader` 只处理编译，但这样做将会没有类型检查。
   2. 使用 `fork-ts-checker-webpack-plugin`，在一个单独的进程中执行类型检查。

   通过上述步骤，不仅同时拥有编译和类型检查，而且还有不错的处理速度。但是，`ts-loader ` 在编译的时候会根据 `tsconfig.json` 文件的 `compilerOptions.target` 属性，将 TypeScript 编译为兼容该属性所指定的 ECMAScript 版本的 JavaScript，但它只是对语法兼容，而没有对该 ECMAScript 版本不支持的 API 进行 polyfill。例如：当 `compilerOptions.target` 设置为 `es5` 或更低时，像是箭头函数 `() => this` 将被会被编译为普通函数 `function`，而 `Promise` API 的使用则不作任何 polyfill。

   因此，在使用 `ts-loader` 将 TypeScript 编译为 JavaScript 文件之后，我们还需要 Babel 来进行 polyfill。所幸的是，从 Babel7 开始，Babel 支持了 TypeScript 编译，所以我们完全可以使用 Babel 来将 TypeScript/JavaScript 编译为目标环境兼容的 JavaScript。

2. `babel-loader`

   Babel 是一个工具链，主要用于将 ECMAScript 2015+ 代码转换为目标环境兼容的 JavaScript 代码。以下是 Babel 可以做的主要事情：

   - 转换语法
   - Polyfill 目标环境中缺少的功能
   - 源代码转换 (codemods)

   综上所述，在 webpack 中使用 `babel-loader` 来处理 TypeScript/JavaScript 文件是一个不错的选择，但是 Babel 不会进行类型检查。不过，我们可以使用 `fork-ts-checker-webpack-plugin`，来帮助我们进行类型检查。

几种方案的情况，如下表所示：

| 方案                                                 | 处理速度 | 类型检查 | 语法转换 | Polyfill |
| ---------------------------------------------------- | -------- | -------- | -------- | -------- |
| `ts-loader(编译+类型检查)`                           | 慢       | ✅       | ✅       | ❌       |
| `ts-loader(编译)` + `fork-ts-checker-webpack-plugin` | 不错     | ✅       | ✅       | ❌       |
| `babel-loader`                                       | 不错     | ❌       | ✅       | ✅       |
| `babel-loader` + `fork-ts-checker-webpack-plugin`    | 不错     | ✅       | ✅       | ✅       |

安装 `babel-loader` `@babel/core`、`@babel/preset-env`、`@babel/preset-typescript`、`@babel/plugin-transform-runtime`

```
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-typescript @babel/plugin-transform-runtime
```

安装 `@babel/runtime-corejs3`

```
npm install --save @babel/runtime-corejs3
```

- `babel-loader` 是 webpack 的一个 loader，它可以使用 Babel 来转换 JavaScript/TypeScript 文件。
- `@babel/core` 是 Babel 的核心库。
- `@babel/preset-env` 是一个智能预设，它可以将高版本的 JavaScript 语法转换为目标环境所兼容的语法。
- `@babel/preset-typescript` 是一个 TypeScript 预设，它可以将 TypeScript 转换为 JavaScript。
- `@babel/plugin-transform-runtime` 是一个 Babel 插件，它可以将所有 helpers 都引用 `@babel/runtime-corejs3` 模块，以避免编译输出中的重复，并且可以配置编译时按需引入模块化 polyfill，不污染全局作用域。
- `@babel/runtime-corejs3` 提供 helpers 和全局变量 (例如 `Promise`)、静态属性 (例如 `Array.from`)、实例属性 (例如 `[].includes`) 的模块化 polyfill。

编辑 `build/webpack.common.js`，添加内容如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.m?(t|j)s$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-typescript", { allExtensions: true }],
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
```

在项目根 `src` 目录下，将 `index.js` 重命名为 `index.ts`。

编辑 `build/webpack.common.js`，更新 `entry.main` 内容如下：

```js
module.exports = {
  entry: {
    main: path.resolve(PROJ_ROOT, "src/index.ts"),
  },
};
```

为了能在 Vue 文件中编写 TypeScript，我们需要给 `script` 标签添加 `lang="ts"` 属性。

编辑 `src/App.vue`，更新内容如下：

```vue
// ...
<script lang="ts" setup>
// ...
```

做到这里我们已经实现了方案 3，可以运行 `npx webpack serve`，看看效果。

---

接下来，我们要实现**类型检查**功能。

安装 `typescript`

```
npm install --save-dev typescript
```

在项目根目录中，创建 `tsconfig.json` 文件，内容如下：

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": false,
    "noEmit": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

在项目根 `src` 目录下，创建 `types` 目录，并在该目录中创建 `vue.d.ts` 文件，内容如下：

```ts
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

安装 `fork-ts-checker-webpack-plugin`

```
npm install --save-dev fork-ts-checker-webpack-plugin
```

编辑 `build/webpack.dev.js`，添加内容如下：

```js
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        extensions: {
          vue: {
            enabled: true,
            compiler: "@vue/compiler-sfc",
          },
        },
        diagnosticOptions: {
          syntactic: false,
          semantic: true,
          declaration: false,
          global: false,
        },
      },
    }),
  ],
};
```

项目结构如下：

```
.
├── .gitignore
├── build
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── dist
│   ├── image
│   │   └── 7f184589b0667e7ef312.png
│   ├── index.html
│   └── js
│       └── main.bundle.js
├── package-lock.json
├── package.json
├── public
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── font
│   │   └── image
│   │       └── avatar.png
│   ├── index.scss
│   ├── index.ts
│   └── types
│       └── vue.d.ts
└── tsconfig.json
```

:link:github 仓库链接：[webpack5-ts-vue3-boilerplate](https://github.com/CokeBeliever/webpack5-ts-vue3-boilerplate)
