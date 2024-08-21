# ESLint

> [eslint/eslint: Find and fix problems in your JavaScript code. (github.com)](https://github.com/eslint/eslint)

ESLint 是一个可配置的静态代码分析工具，它能够帮助开发人员发现和修复代码中的潜在问题，有效地提升代码的整洁性、一致性和质量，从而增强代码的可维护性。通过安装各种插件，ESLint 可以扩展支持多种代码类型，包括 JavaScript、TypeScript、Vue、JSX/TSX 等，满足不同开发需求。

:link:github 仓库链接：[eslint-boilerplate](https://github.com/CokeBeliever/eslint-boilerplate)

## 快速开始

**安装**

```bash
npm install --save-dev eslint @eslint/js
```

**配置文件**

在项目根目录下，创建 `eslint.config.js`，内容如下：

```js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
```

之后，你就可以在任何文件/目录上运行 ESLint，如下所示：

```
npx eslint yourfile.js
```

> :warning:运行时，可能会出现 `SyntaxError: Cannot use import statement outside a module` 错误。这是由于，在 nodejs 运行环境中，`.mjs` 文件会以 ESM 模块化语法执行、`.cjs` 文件会以 CommonJS 模块化语法执行，而 `.js` 文件则会根据 `package.json` 的 `type` 字段来决定使用哪种模块化语法。
>
> 因此，可以采用以下任意方法解决该问题：
>
> 1. 在 `package.json` 中设置 `"type": "module"` 字段；
> 2. 将 `eslint.config.js` 文件的扩展名修改为 `mjs`；
> 3. 使用 `CommonJS` 模块化语法，修改 `eslint.config.js`。

## 核心概念

> [Core Concepts - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/core-concepts/)

## 尝试一下

> 先决条件：请使用支持 SSL 的 Nodejs（`^18.18.0`、`^20.9.0` 或 `>=21.1.0`)。

### 初始化项目

```bash
mkdir eslint-boilerplate
cd eslint-boilerplate
npm init -y
git init
echo "node_modules" > .gitignore
```

**eslint**

安装：

```bash
npm install --save-dev eslint
```

在项目根目录下，创建 `eslint.config.js`，内容如下：

```bash
module.exports = [];
```

---

**ignore**

大多情况下，有些文件/目录可能不希望 ESLint 进行检查，我们可以配置忽略它们。

修改 `eslint.config.js`，内容如下：

```js
module.exports = [
  {
    // ignores 配置，忽略 build 和 dist 目录，用于替代 `.eslintignore`
    ignores: ["**/build/**", "**/dist/**", "eslint.config.js"],
  },
];
```

### JavaScript

安装：

```bash
npm install --save-dev @eslint/js
```

为了方便，我们直接使用 `@eslint/js`，它是从 `eslint` 中分离出 Javascript 特有的功能。这个插件包含两个配置：

- `recommended` - 启用 ESLint 团队推荐的规则 (替代 `"eslint:recommended"`)
- `all` - 启用所有 ESLint 规则 (替代 `"eslint:all"`)

> 有关 `recommended` 和 `all` 配置包含的具体规则，请参阅 [Rules Reference - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/rules/)

修改 `eslint.config.js`，内容如下：

```js
const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["**/build/**", "**/dist/**", "eslint.config.js"],
  },

  // javascript
  ...[
    js.configs.recommended,
    {
      rules: {
        "no-unused-vars": "warn",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.js"],
  })),
];
```

在项目根目录下，创建 `index.js`，内容如下：

```js
const name = "CokeBeliever"; // 不通过：自定义配置的 no-unused-vars 规则
console.log(age); // 不通过：recommended 的 no-undef 规则
```

测试一下，运行 `npx eslint index.js`，在终端可以看到：

```bash
  1:7   warning  'name' is assigned a value but never used  no-unused-vars
  2:1   error    'console' is not defined                   no-undef
  2:13  error    'age' is not defined                       no-undef

✖ 3 problems (2 errors, 1 warning)
```

> 在这里你可能有一个疑惑：`'console' is not defined`，虽然 console 无论是在浏览器还是 NodeJS 环境都存在，但它并不包含在 ECMAScript 规范中。
>
> 我们可以修改 `index.js`，内容如下：
>
> ```js
> const name = "CokeBeliever"; // 不通过：自定义配置的 no-unused-vars 规则
> console.log(age); // 不通过：js recommended 的 no-undef 规则
>
> Promise; // 通过：ecmaVersion 默认为 latest 不小于 6（es6），因此 ECMAScript 规范包含 Promise
> window; // 不通过：ECMAScript 规范并不包含浏览器的全局对象 window
> ```
>
> 再次运行，在终端可以看到：
>
> ```
> 1:7   warning  'name' is assigned a value but never used  no-unused-vars
> 2:1   error    'console' is not defined                   no-undef
> 2:13  error    'age' is not defined                       no-undef
> 5:1   error    'window' is not defined                    no-undef
> ```
>
> 与我们所预料的一样。
>
> 了解更多内容，请参阅 [Configure Language Options - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/configure/language-options)

为了指定代码的运行环境（解决 `console` 提示 no-undef 等问题），我们可以安装：

```bash
npm install --save-dev globals
```

这个工具用于 ESLint，它包含了不同 JavaScript 运行环境的全局标识符。

假设 `**/*.js` 文件是在浏览器环境下运行，我们可以修改 `eslint.config.js`，内容如下：

```js
const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["**/build/**", "**/dist/**", "eslint.config.js"],
  },

  // javascript
  ...[
    js.configs.recommended,
    // 自定义配置
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-unused-vars": "warn",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.js"],
  })),
];
```

再次运行，在终端可以看到：

```bash
  1:7   warning  'name' is assigned a value but never used  no-unused-vars
  2:13  error    'age' is not defined                       no-undef

✖ 2 problems (1 error, 1 warning)
```

很好，JavaScript 的 ESLint 配置生效了。

### TypeScript

安装：

```bash
npm install --save-dev typescript typescript-eslint
```

`typescript-eslint` 工具用于在 ESLint 中配置 TypeScript。

修改 `eslint.config.js`，内容如下：

```js
// ...
const ts = require("typescript-eslint");

module.exports = [
  // ...

  // typescript
  ...[
    js.configs.recommended,
    ...ts.configs.recommended,
    // 自定义配置
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-undef": "error",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.ts"],
  })),
];
```

在项目根目录下，创建 `index.ts`，内容如下：

```ts
const name = "CokeBeliever"; // 不通过：自定义配置的 @typescript-eslint/no-unused-vars 规则
const gender: any = "male"; // 不通过：ts recommended 的 @typescript-eslint/no-explicit-any 规则

console.log(gender);
console.log(age); // 不通过：js recommended 的 no-undef 规则

Promise;
window;
```

测试一下，运行 `npx eslint index.ts`，在终端可以看到：

```ts
  1:7   warning  'name' is assigned a value but never used  @typescript-eslint/no-unused-vars
  2:15  error    Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
  5:13  error    'age' is not defined                       no-undef

✖ 3 problems (2 errors, 1 warning)
```

很好，TypeScript 的 ESLint 配置生效了。

### Vue

> [Introduction | eslint-plugin-vue (vuejs.org)](https://eslint.vuejs.org/)

安装

```bash
npm install vue
npm install --save-dev eslint-plugin-vue
```

`eslint-plugin-vue` 工具用于在 ESLint 中配置 Vue。

修改 `eslint.config.js`，内容如下：

```js
// ...
const vue = require("eslint-plugin-vue");

module.exports = [
  // ...

  // vue
  ...[
    js.configs.recommended,
    ...ts.configs.recommended,
    ...vue.configs["flat/recommended"],
    // 自定义配置
    {
      languageOptions: {
        parserOptions: {
          parser: {
            // Script parser for `<script>`
            js: "espree",
            // Script parser for `<script lang="ts">`
            ts: "@typescript-eslint/parser",
          },
        },
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-undef": "error",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unused-expressions": "off",
        "vue/singleline-html-element-content-newline": "off",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.vue"],
  })),
];
```

在项目根目录下，创建 `index.vue`，内容如下：

```vue
<template>
  <h1>CokeBeliever</h1>
  <!-- 不通过：vue recommended 的 vue/valid-v-on -->
  <button @click>按钮</button>
</template>

<script lang="ts" setup>
import { defineOptions } from "vue";

defineOptions({ name: "HomePage" });

const name = "CokeBeliever"; // 不通过：自定义的 @typescript-eslint/no-unused-vars 规则
const gender: any = "male"; // 不通过：ts recommended 的 @typescript-eslint/no-explicit-any 规则

console.log(gender);
console.log(age); // 不通过：js recommended 的 no-undef 规则

Promise;
window;
</script>

<style scoped></style>
```

测试一下，运行 `npx eslint index.vue`，在终端可以看到：

```vue
4:11 error 'v-on' directives require a value or verb modifier (like 'stop' or
'prevent') vue/valid-v-on 12:7 warning 'name' is assigned a value but never used
@typescript-eslint/no-unused-vars 13:15 error Unexpected any. Specify a
different type @typescript-eslint/no-explicit-any 16:13 error 'age' is not
defined no-undef ✖ 4 problems (3 errors, 1 warning)
```

很好，Vue 的 ESLint 配置生效了。

### 优化 JavaScript + TypeScript + Vue

经过前面的过程，完整 ESLint 配置文件，如下所示：

```js
const globals = require("globals");
const js = require("@eslint/js");
const ts = require("typescript-eslint");
const vue = require("eslint-plugin-vue");

module.exports = [
  {
    ignores: ["**/build/**", "**/dist/**", "eslint.config.js"],
  },

  // javascript
  ...[
    js.configs.recommended,
    // 自定义配置
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-unused-vars": "warn",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.js"],
  })),

  // typescript
  ...[
    js.configs.recommended,
    ...ts.configs.recommended,
    // 自定义配置
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-undef": "error",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.ts"],
  })),

  // vue
  ...[
    js.configs.recommended,
    ...ts.configs.recommended,
    ...vue.configs["flat/recommended"],
    // 自定义配置
    {
      languageOptions: {
        parserOptions: {
          parser: {
            // Script parser for `<script>`
            js: "espree",
            // Script parser for `<script lang="ts">`
            ts: "@typescript-eslint/parser",
          },
        },
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-undef": "error",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unused-expressions": "off",
        "vue/singleline-html-element-content-newline": "off",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.vue"],
  })),
];
```

尽管这种配置在使用上可能没有问题，但是你可能会发现在配置完 JavaScript、TypeScript 和 Vue 后存在很多冗余重复的配置。

- TypeScript 是 JavaScript 的超集，因此，通常部分 TypeScript 的配置是可以复用 JavaScript 的配置。对于存在差异的配置，可以在 TypeScript 中进行配置覆盖。
- 在 Vue 文件中，我们知道会包含 JavaScript 或 TypeScript 代码，因此，通常部分 Vue 的配置是可以复用 JavaScript 或 TypeScript 的配置。对于存在差异的配置，可以在 Vue 中进行配置覆盖。

因此，我们可以修改 `eslint.config.js`，内容如下：

```js
const globals = require("globals");
const js = require("@eslint/js");
const ts = require("typescript-eslint");
const vue = require("eslint-plugin-vue");

module.exports = [
  {
    ignores: ["**/build/**", "**/dist/**", "eslint.config.js"],
  },

  // javascript + typescript + vue
  ...[
    js.configs.recommended,
    // 自定义配置
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        "no-unused-vars": "warn",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.js", "**/*.ts", "**/*.vue"],
  })),

  // typescript + vue
  ...[
    ...ts.configs.recommended,
    // 自定义配置
    {
      rules: {
        "no-undef": "error",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.ts", "**/*.vue"],
  })),

  // vue
  ...[
    ...vue.configs["flat/recommended"],
    // 自定义配置
    {
      languageOptions: {
        parserOptions: {
          parser: {
            // Script parser for `<script>`
            js: "espree",
            // Script parser for `<script lang="ts">`
            ts: "@typescript-eslint/parser",
          },
        },
      },
      rules: {
        "vue/singleline-html-element-content-newline": "off",
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ["**/*.vue"],
  })),
];
```

测试一下，运行 `npx eslint index.js index.ts index.vue`，在终端可以看到：

```bash
D:\eslint-boilerplate\index.js
   4:11  error    'v-on' directives require a value or verb modifier (like 'stop' or 'prevent')  vue/valid-v-on
  12:7   warning  'name' is assigned a value but never used                                      @typescript-eslint/no-unused-vars
  13:15  error    Unexpected any. Specify a different type                                       @typescript-eslint/no-explicit-any
  16:13  error    'age' is not defined                                                           no-undef

✖ 4 problems (3 errors, 1 warning)

D:\eslint-boilerplate\index.js
  1:7   warning  'name' is assigned a value but never used  no-unused-vars
  2:13  error    'age' is not defined                       no-undef

D:\eslint-boilerplate\index.ts
  1:7   warning  'name' is assigned a value but never used  @typescript-eslint/no-unused-vars
  2:15  error    Unexpected any. Specify a different type   @typescript-eslint/no-explicit-any
  5:13  error    'age' is not defined                       no-undef

D:\eslint-boilerplate\index.vue
   4:11  error    'v-on' directives require a value or verb modifier (like 'stop' or 'prevent')  vue/valid-v-on
  12:7   warning  'name' is assigned a value but never used                                      @typescript-eslint/no-unused-vars
  13:15  error    Unexpected any. Specify a different type                                       @typescript-eslint/no-explicit-any
  16:13  error    'age' is not defined                                                           no-undef

✖ 9 problems (6 errors, 3 warnings)         no-undef
```

优化后的配置，在运行结果上基本与未优化前相同。

### Prettier

> Prettier 是一个代码风格的格式化程序，而 Linter（例如：ESLint、StyleLint 等）通常不仅包含代码质量规则，还包含代码风格规则。通常将 Prettier 集成到 Linter 中，主要是它可以减少在多个不同 Linter 上的冗余代码风格配置，统一使用 Prettier 保证代码风格，而 Linter 专注于代码质量！
>
> 因此，在使用 Prettier 时，大多数 Linter 风格规则通常是不必要的，并且这些规则可能与 Prettier 冲突。接下来，我们将讨论如何集成 ESLint，并避免这些问题。

安装

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

`eslint-config-prettier` 工具用于 ESLint，它可以关闭所有不必要的、或可能与 Prettier 冲突的规则。

`eslint-plugin-prettier` 工具用于 ESLint，它可以将 Prettier 作为 ESLint 规则运行，并将差异报告为单个 ESLint 问题。

在项目根目录下，创建 `.prettierrc.json`，内容如下：

```js
{
  "semi": false,
  "singleQuote": true
}
```

修改 `eslint.config.js`，内容如下：

```js
// ...
const eslintConfigPrettier = require("eslint-config-prettier");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  // ...

  // prettier
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,

  // ...javascript、typescript、vue
];
```

测试一下，运行 `npx eslint index.js index.ts index.vue`，在终端可以看到：

```bash
D:\eslint-boilerplate\index.js
  1:7   warning  'name' is assigned a value but never used         no-unused-vars
  1:14  error    Replace `"CokeBeliever";␍` with `'CokeBeliever'`  prettier/prettier
  2:13  error    'age' is not defined                              no-undef
  2:17  error    Delete `;␍`                                       prettier/prettier
  3:1   error    Delete `␍`                                        prettier/prettier
  4:8   error    Delete `;␍`                                       prettier/prettier
  5:7   error    Replace `;` with `⏎`                              prettier/prettier
  ...
  ...
  ...

✖ 44 problems (40 errors, 4 warnings)
  35 errors and 1 warning potentially fixable with the `--fix` option.
```

我们可以看到 Prettier 已经集成到 ESLint 中，运行 `npx eslint --fix index.js index.ts index.vue` 可以修复代码风格。

#### 编辑器（VSCode）

在编写代码时，每次修改后执行命令 `npx eslint --fix` 来修复代码风格可能会比较麻烦。为了让编辑器在保存文件时自动格式化代码，可以将 Prettier 集成到编辑器中。

以下是如何在 VSCode 中集成 Prettier 的步骤：

1. 打开 VSCode 扩展市场，搜索并安装 `esbenp.prettier-vscode` 插件。

2. 在项目根目录下，创建或编辑 `.vscode/settings.json` 文件，内容如下：

   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```

在此配置中，我们直接使用 Prettier 插件进行代码格式化，而不是间接使用 ESLint 插件。这是由于 Prettier 默认就支持多种文件类型（[What is Prettier? · Prettier](https://prettier.io/docs/en/index.html)），而 ESLint 主要是针对配置的 `js`、`ts`、`vue` 文件。为了保持 ESLint 配置的简洁，同时兼并关注其他文件类型（例如 `html`、`json`、`yaml` 等）的代码风格，我们选择直接使用 Prettier 进行统一的代码格式化。

#### 扩展

##### EditorConfig

> EditorConfig 是一个用于统一代码风格的编辑器插件，功能类似于 Prettier，但支持的文件类型更广泛。虽然它的功能相对简单，但适用于所有文件类型，并提供了 Prettier 不具备的一些功能，例如：指定文件的字符编码 (`charset`)。项目通过一个 `.editorconfig` 文件和其插件，使编辑器能够读取此文件并遵循定义的样式。
>
> ```
> [*]
> # 不可配置的 Prettier 行为
> charset = utf-8
> insert_final_newline = true
> # 注意：Prettier 不会修剪模板字符串中的行尾空白，但编辑器可能会。
> # trim_trailing_whitespace = true
>
> # 当 EditorConfig 和 Prettier 同时存在时，Prettier 的配置优先。
> # 建议将下列属性仅配置在 .editorconfig 或 Prettier 配置文件中的一个，这是因为：
> # 1. 避免重复配置和可能的误导
> # 2. 当项目中存在 .editorconfig 时，Prettier 会解析该文件并将其属性转换为对应的 Prettier 配置。
> end_of_line = lf
> indent_style = space
> indent_size = 2
> ```

EditorConfig 具体属性如下：

| 属性                     | 描述                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| root                     | 指定文件是否为项目的根配置文件。<br />`true`：指定为根配置文件，编辑器不会再查找父目录中的 `.editorconfig` 文件。<br />`false`（或省略）：指定为非根配置文件，编辑器会再向上查找父目录中的 `.editorconfig` 文件，直到找到一个 `root = true` 的配置文件或达到文件系统的根目录。根据匹配的配置文件中的属性按读取顺序应用，所以较为靠近的配置文件中的属性优先级较高。 |
| charset                  | 指定文件的字符编码。常见的值包括<br /> `utf-8`：使用 UTF-8 编码。<br />`utf-16`：使用 UTF-16 编码。<br />`iso-8859-1`：使用 ISO-8859-1 编码（Latin-1）。                                                                                                                                                                                                           |
| indent_style             | 指定文件的缩进风格。<br />`space`：使用空格进行缩进。<br />`tab`：使用制表符进行缩进。                                                                                                                                                                                                                                                                             |
| indent_size              | 指定每个缩进的级别（整数）。当 `insent_style` 为 `space` 时，则指定的是空格的数量；当 `insent_style` 为 `tab` 时，则指定的是制表符的宽度。                                                                                                                                                                                                                         |
| end_of_line              | 指定文件换行符的类型。<br />`lf`：使用换行符 (`\n`)。<br />`crlf`：使用回车加换行符 (`\r\n`)。                                                                                                                                                                                                                                                                     |
| trim_trailing_whitespace | 指定是否自动删除行尾的空白字符。<br />`true`：自动删除每行末尾的空白字符。<br />`false`（或省略）：不做任何处理。                                                                                                                                                                                                                                                  |
| insert_final_newline     | 指定是否自动在末尾插入一个新行。<br />`true`：在文件的最后插入一个新行。<br />`false`（或省略）：不做任何处理。                                                                                                                                                                                                                                                    |

以在 VSCode 中集成为例：

1. 打开 VSCode 扩展市场，搜素并安装 `EditorConfig.EditorConfig` 插件。
2. 在项目根目录下，创建 `.editorconfig`，内容如下：

```
root = true

# 适用于所有文件的通用配置
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
```

### 集成

#### 编辑器

##### VSCode

将 ESLint 集成到 VSCode 中，可以使编辑器在编码过程中实时检查代码，及时发现并标记潜在问题（以红色和黄色的下划线标记错误和警告）。此外，集成 ESLint 后，你可以通过配置自动修复功能（`editor.codeActionsOnSave`），在保存文件时自动修复可修复的 Lint 问题，从而节省手动修复的时间。具体步骤如下：

1. 打开 VSCode 扩展市场，搜素并安装 `dbaeumer.vscode-eslint` 插件。

2. 在项目根目录下，创建 `.vscode/settings.json`，内容如下：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "eslint.enable": true,
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

> :warning:注意，在将 Prettier 集成到 ESLint 后，由于 VSCode 的 ESLint 插件可能无法实时检查 Prettier 的配置变更，在修改 Prettier 或 EditorConfig 配置文件后，可能需要重启编辑器或 ESLint 插件，以便 ESLint 插件能够重新加载并应用更新后的 Prettier 配置。

#### 打包工具

将 ESLint 集成到打包工具，可以让打包工具在构建过程中进行检查你的代码。具体场景包括：

- 开发过程中，ESLint 插件会在代码更改时自动进行 Lint 检查，并在终端中显示错误和警告。
- 编译过程中，ESLint 插件会在编译构建时进行 Lint 检查，确保生成的代码符合 Lint 规则。

##### webpack

安装：

```bash
npm install --save-dev eslint-webpack-plugin
```

修改 webpack 配置文件，内容如下：

```js
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  // ...
  plugins: [new ESLintPlugin(options)],
  // ...
};
```

##### vite

安装：

```bash
npm install --save-dev vite-plugin-eslint
```

修改 vite 配置文件，内容如下：

```js
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [eslint()],
});
```
