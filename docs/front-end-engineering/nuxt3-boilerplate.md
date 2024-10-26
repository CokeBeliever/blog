# Nuxt3 Boilerplate

> Nuxt 是一个基于 Vue.js 的 Web 全栈框架，它支持服务端渲染（SSR）、客户端渲染（CSR）、静态网站生成（SSG），可以用它来构建多种类型的应用。

这是一篇是记录 Nuxt3 项目样板的配置过程。

🔗github 仓库链接：[nuxt3-boilerplate](https://github.com/CokeBeliever/nuxt3-boilerplate)

## 快速开始

打开终端，运行以下命令：

```bash
npx nuxi@latest init <project-name>
```

> 你可能会看到像下面这样的报错：
>
> ```
> ERROR  Error: Failed to download template from registry: Failed to download https://raw.githubusercontent.com/nuxt/starter/templates/templates/v3.json: TypeError: fetch failed
> ```
>
> 原因是 `https://raw.githubusercontent.com/nuxt/starter/templates/templates/v3.json` 访问失败了。你可以选择：
>
> - "改善" 本地网络环境，并重新执行命令；
> - 直接从 `https://codeload.github.com/nuxt/starter/tar.gz/refs/heads/v3` 下载并解压 tar 包；
> - 直接从 github 仓库 [nuxt/starter: Create a new Nuxt project, module, layer or start from a theme with our collection of starters. (github.com)](https://github.com/nuxt/starter) 获取。

在 VSCode 中打开你的项目文件夹：

```
code <project-name>
```

安装依赖项：

```bash
npm install
```

## 尝试一下

> 先决条件：Node.js `^18.0.0`。
>
> :warning:下面演示的命令，请在 bash 执行（在 window powershell 执行可能会存在问题）。

### 初始化项目

```bash
npx nuxi@latest init nuxt3-boilerplate
cd nuxt3-boilerplate
git init
npm install
```

或

```bash
git clone git@github.com:nuxt/starter.git nuxt3-boilerplate
cd nuxt3-boilerplate
git checkout -b v3 origin/v3
rm -rf .git
git init
npm install
```

### TypeScript

> Nuxt 3 是支持 TypeScript 的框架，它能够确保你在编码时获得准确的类型信息。

添加自定义的配置，修改 `tsconfig.json` 内容如下：

```json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "noImplicitAny": false
  }
}
```

### ESLint

安装：

```bash
npm install --save-dev @nuxt/eslint eslint
```

修改 `nuxt.config.ts` 内容如下：

```typescript
export default defineNuxtConfig({
  // ...
  modules: ["@nuxt/eslint"],
});
```

在项目根目录下，创建 `eslint.config.mjs`，内容如下：

```js
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt();
```

以在 VSCode 中集成为例：

1. 打开 VSCode 扩展市场，搜素并安装 `dbaeumer.vscode-eslint` 插件。

2. 在项目根目录下，创建 `.vscode/settings.json`，内容如下：

   ```json
   {
     "eslint.enable": true,
     "eslint.useFlatConfig": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit"
     }
   }
   ```

#### Prettier

安装：

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

在项目根目录下，创建 `.prettierrc.json`，内容如下：

```json
{
  "semi": false,
  "singleQuote": true
}
```

修改 `eslint.config.mjs`，内容如下：

```js
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt(
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,

  // 自定义配置
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
```

以在 VSCode 中集成为例：

1. 打开 VSCode 扩展市场，搜索并安装 `esbenp.prettier-vscode` 插件。

2. 在项目根目录下，修改 `.vscode/settings.json` 文件，内容如下：

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

**prettier + tailwind**

安装：

```bash
npm install --save-dev prettier-plugin-tailwindcss
```

同时，更新 `.prettierrc.json` 内容：

```json
{
  // ...
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### EditorConfig

以在 VSCode 中集成为例：

1. 打开 VSCode 扩展市场，搜素并安装 `EditorConfig.EditorConfig` 插件。
2. 在项目根目录下，创建 `.editorconfig`，内容如下：

```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
```

### Husky

安装：

```bash
npm install --save-dev husky
```

初始化：

```bash
npx husky init
```

### Lint-Staged

> 为了在代码提交之前，仅对 Git 暂存区的文件执行 ESLint 检查，我们需要安装配置 Lint-Staged。

安装：

```bash
npm install --save-dev lint-staged
```

添加 pre-commit 钩子：

```bash
echo "npx lint-staged" > .husky/pre-commit
```

在项目根目录下，创建 `.lintstagedrc.json`，内容如下：

```json
{
  "*.{js,ts,vue}": "eslint"
}
```

### CommitLint

> 为了在代码提交之时，对 Git Message 执行 CommitLint 检查，我们需要安装配置 CommitLint。

安装：

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

添加 commit-msg 钩子：

```bash
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

在项目根目录下，创建 `.commitlintrc.json`，内容如下：

```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

格式化，并提交代码：

```bash
npx prettier -w .
git add .
git commit -m "test"
```

> 你可能会看到像下面这样的报错：
>
> ```
> ✖ eslint:
>
> Oops! Something went wrong! :(
>
> ESLint: 9.12.0
>
> Error [ERR_MODULE_NOT_FOUND]: Cannot find module
> ```
>
> 原因是 `eslint.config.mjs` 中引入了 `import withNuxt from './.nuxt/eslint.config.mjs'`，但该文件不存在，因此报错。这时需要启动项目 `npm run dev`，让 Nuxt 自动生成该文件。

可以在终端看到：

```
⧗   input: test
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg script failed (code 1)
```

很好，CommitLint 生效了。subject 和 type 不能为空，我们可以修改一下提交消息：

```bash
git commit -m 'chore: test'
```

可以看到，提交成功。

#### 交互式提交

> 为了在代码提交之时，能够以用户提示交互方式来输入并生成符合 CommitLint 规范的 Git Message，我们需要进一步安装配置 CommitLint。

安装：

```bash
npm install --save-dev @commitlint/cz-commitlint commitizen inquirer@9
```

在 `package.json`，增加内容如下：

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

同时，修改 `.commitlintrc.json` 内容如下：

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "scope-enum": [2, "always"]
  },
  "prompt": {
    "settings": {
      "enableMultipleScopes": false,
      "scopeEnumSeparator": ","
    },
    "messages": {
      "skip": ":按回车键跳过",
      "max": "最多 %d 个字符",
      "min": "最少 %d 个字符",
      "emptyWarning": "不能为空",
      "upperLimitWarning": "高于限制",
      "lowerLimitWarning": "低于限制"
    },
    "questions": {
      "type": {
        "description": "选择您正在提交的更改类型：",
        "enum": {
          "feat": {
            "description": "一个新功能",
            "title": "功能",
            "emoji": "✨"
          },
          "fix": {
            "description": "一个 bug 修复",
            "title": "Bug 修复",
            "emoji": "🐛"
          },
          "docs": {
            "description": "仅修改文档",
            "title": "文档",
            "emoji": "📚"
          },
          "style": {
            "description": "不影响代码含义的更改（空格、格式、缺少分号等）",
            "title": "样式",
            "emoji": "💎"
          },
          "refactor": {
            "description": "既不修复 bug 也不添加功能的代码更改",
            "title": "代码重构",
            "emoji": "📦"
          },
          "perf": {
            "description": "提高性能的代码更改",
            "title": "性能改进",
            "emoji": "🚀"
          },
          "test": {
            "description": "添加缺失的测试或更正现有的测试",
            "title": "测试",
            "emoji": "🚨"
          },
          "build": {
            "description": "影响构建系统或外部依赖关系的更改（例如：gulp、broccoli、npm）",
            "title": "构建",
            "emoji": "🛠"
          },
          "ci": {
            "description": "更改我们的 CI 配置文件和脚本（例如：Travis、Circle、BrowserStack、SauceLabs）",
            "title": "持续集成",
            "emoji": "⚙️"
          },
          "chore": {
            "description": "其他不修改 src 或测试文件的更改",
            "title": "日常事务",
            "emoji": "♻️"
          },
          "revert": {
            "description": "还原以前的提交",
            "title": "还原",
            "emoji": "🗑"
          }
        }
      },
      "scope": {
        "description": "此更改的作用域是什么（例如：client 或 server）"
      },
      "subject": {
        "description": "写一个简短的祈使时态描述变化"
      },
      "body": {
        "description": "提供更改的详细说明"
      },
      "isBreaking": {
        "description": "有什么突破性的变化吗？"
      },
      "breakingBody": {
        "description": "BREAKING CHANGE commit 需要一个主体。请输入 commit 本身的较长描述"
      },
      "breaking": {
        "description": "描述突破性的变化"
      },
      "isIssueAffected": {
        "description": "此更改是否会影响任何未解决的问题？"
      },
      "issuesBody": {
        "description": "如果问题已解决，则提交需要一个主体。请输入提交本身的较长描述"
      },
      "issues": {
        "description": "添加问题涉及（例如：\"fix #123\"、\"re #123\"。）"
      }
    }
  }
}
```

这样，我们就可以通过提示交互方式来提交代码了。

```bash
git add .
npm run commit
```

### 环境配置

> 为了在项目启动之时，区分不同环境的运行配置，我们需要定义相应的环境配置文件。根据需求，我们可以将其划分为 "开发环境" 和 "生产环境"。

在项目根目录下，创建 `.env.development`，内容如下：

```
# ========== 私有的，server 可见 ==========
PORT=3001
# ========== 公共的，server 和 client 都可见 ==========
# 环境标识
NODE_ENV=development
# 客户端标识
CLIENT_ID=sso-portal
# SSO 基础地址
SSO_BASE_URL=http://localhost:3000
```

在项目根目录下，创建 `.env.production`，内容如下：

```
# ========== 私有的，server 可见 ==========
PORT=3001
# ========== 公共的，server 和 client 都可见 ==========
# 环境标识
NODE_ENV=production
# 客户端标识
CLIENT_ID=sso-portal
# SSO 基础地址
SSO_BASE_URL=http://172.20.0.4:3000
```

在项目根目录下，创建 `.env.example`，内容如下：

```
# ========== 私有的，server 可见 ==========
PORT=
# ========== 公共的，server 和 client 都可见 ==========
# 环境标识
NODE_ENV=
# 客户端标识
CLIENT_ID=
# SSO 基础地址
SSO_BASE_URL=
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
const PROCESS_ENV = process.env;

export default defineNuxtConfig({
  // ...
  runtimeConfig: {
    port: PROCESS_ENV.PORT,
    public: {
      clientId: PROCESS_ENV.CLIENT_ID,
    },
  },
  devServer: {
    port: Number(PROCESS_ENV.PORT),
  },
});
```

#### pm2

> 在 "生产环境" 中，我们可能会使用 PM2 来管理和监控 Node.js 应用程序。PM2 可以帮助我们自动重启应用、负载均衡、记录日志以及提供进程管理功能，确保应用在生产环境中的稳定运行。

安装：

```bash
npm install --save-dev pm2 dotenv-cli dotenv
```

在项目根目录下，创建 `ecosystem.config.cjs`，内容如下：

```js
const dotenv = require("dotenv");
const processEnv = {};

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
  processEnv,
});

module.exports = {
  apps: [
    {
      name: "nuxt3-boilerplate",
      script: "./.output/server/index.mjs",
      instances: 1,
      exec_mode: "cluster",
      out_file: "/dev/null",
      error_file: "/dev/null",
      env: processEnv,
    },
  ],
};
```

修改 `package.json` 内容如下：

```json
{
  // ...
  "scripts": {
    "postinstall": "nuxt prepare",
    "prepare": "husky",
    "commit": "git-cz",
    "build:prod": "nuxt build --dotenv .env.production",
    "start:dev": "nuxt dev --dotenv .env.development",
    "pm2:prod": "npm run build:prod && npm run pm2:prod:stop && npm run pm2:prod:delete && npm run pm2:prod:start",
    "pm2:prod:start": "dotenv -e .env.production -- pm2-runtime start ecosystem.config.cjs",
    "pm2:prod:stop": "dotenv -e .env.production -- pm2 stop ecosystem.config.cjs",
    "pm2:prod:delete": "dotenv -e .env.production -- pm2 delete ecosystem.config.cjs"
  }
  // ...
}
```

### Docker

在项目根目录下，创建 `.dockerignore`，内容如下：

```
node_modules/
.vscode/
.output
.data
.nuxt
.nitro
.cache
dist
```

在项目根目录下，创建 `Dockerfile`，内容如下：

```
FROM node:18

WORKDIR /app
COPY . .

RUN npm config set registry https://registry.npmmirror.com
RUN npm install --force

EXPOSE 3001

CMD npm run pm2:prod
```

### 网页头部

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  app: {
    head: {
      titleTemplate: "Nuxt3 Boilerplate - %s",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "zh-CN" },
      meta: [{ name: "description", content: "Nuxt3 Boilerplate" }],
      link: [],
      script: [],
    },
  },
  // ...
});
```

### 状态管理

安装：

```bash
npm install pinia @pinia/nuxt
npm install --save-dev @pinia-plugin-persistedstate/nuxt
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  modules: [
    // ...
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  // ...
});
```

在项目根目录下，创建 `stores/user.ts`，内容如下：

```typescript
import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore(
  "user",
  () => {
    const accessToken = ref("");
    const refreshToken = ref("");
    const tokenType = ref("");
    const user = ref<any>(null);
    const username = ref("");
    const email = ref("");
    const mobile = ref("");
    const isLogin = computed(() => Boolean(accessToken.value));
    const permissionCodeMap = computed(() => {
      return Object.fromEntries(
        (user.value?.permissionCodes ?? []).map((item) => [item, true])
      );
    });

    const login = (data) => {
      accessToken.value = data.access_token;
      refreshToken.value = data.refresh_token;
      tokenType.value = data.token_type;
    };

    const logout = () => {
      accessToken.value = "";
      refreshToken.value = "";
      tokenType.value = "";
      user.value = null;
    };

    return {
      accessToken,
      refreshToken,
      tokenType,
      user,
      username,
      email,
      mobile,
      isLogin,
      permissionCodeMap,
      login,
      logout,
    };
  },
  {
    persist: {
      paths: [
        "accessToken",
        "refreshToken",
        "tokenType",
        "username",
        "email",
        "mobile",
      ],
    },
  }
);
```

在项目根目录下，创建 `stores/index.ts`，内容如下：

```typescript
export { default as useUserStore } from "./user";
```

### 日期时间

安装：

```bash
npm install dayjs-nuxt
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  modules: [
    // ...
    "dayjs-nuxt",
  ],
  dayjs: {
    locales: ["zh-cn", "en"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "zh-cn",
    defaultTimezone: "UTC+8",
  },
  // ...
});
```

### 主题样式

在项目根目录下，创建 `configs/theme.ts`，内容如下：

```ts
export const namespace = "cb";

export const defaultTheme = {
  primary: {
    color: {
      "50": "rgb(254, 161, 132)",
      "75": "rgb(253, 114, 70)",
      "100": "rgb(252, 67, 8)",
      "50a": "rgba(252, 67, 8, 0.5)",
      "75a": "rgba(252, 67, 8, 0.75)",
    },
  },
  black: {
    color: {
      "50": "rgb(159, 153, 153)",
      "75": "rgb(110, 101, 101)",
      "100": "rgb(62, 50, 50)",
      "50a": "rgba(62, 50, 50, 0.5)",
      "75a": "rgba(62, 50, 50, 0.75)",
    },
  },
  white: {
    color: {
      "50": "rgb(255, 255, 255)",
      "75": "rgb(255, 255, 255)",
      "100": "rgb(255 255 255)",
      "50a": "rgba(255, 255, 255, 0.5)",
      "75a": "rgba(255, 255, 255, 0.75)",
    },
  },
  gray: {
    color: {
      "50": "rgb(250, 250, 250)",
      "75": "rgb(248, 248, 248)",
      "100": "rgb(245 245 245)",
      "50a": "rgba(245, 245, 245, 0.5)",
      "75a": "rgba(245, 245, 245, 0.75)",
    },
  },
};
```

### Tailwind + Iconify

安装：

```bash
npm install @iconify/json
npm install --save-dev @nuxtjs/tailwindcss @iconify/tailwind
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  modules: [
    // ...
    "@nuxtjs/tailwindcss",
  ],
  // ...
});
```

在项目根目录下，创建 `tailwind.config.ts`，内容如下：

```typescript
import type { Config } from 'tailwindcss'
import { namespace, defaultTheme } from './configs/theme'
import { addDynamicIconSelectors } from '@iconify/tailwind'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        [`${namespace}-primary`]: defaultTheme.primary.color['100'],
        [`${namespace}-primary-50`]: defaultTheme.primary.color['50'],
        [`${namespace}-primary-75`]: defaultTheme.primary.color['75'],
        [`${namespace}-primary-50a`]: defaultTheme.primary.color['50a'],
        [`${namespace}-primary-75a`]: defaultTheme.primary.color['75a'],
        [`${namespace}-white`]: defaultTheme.white.color['100'],
        [`${namespace}-white-50`]: defaultTheme.white.color['50'],
        [`${namespace}-white-75`]: defaultTheme.white.color['75'],
        [`${namespace}-white-50a`]: defaultTheme.white.color['50a'],
        [`${namespace}-white-75a`]: defaultTheme.white.color['75a'],
        [`${namespace}-black`]: defaultTheme.black.color['100'],
        [`${namespace}-black-50`]: defaultTheme.black.color['50'],
        [`${namespace}-black-75`]: defaultTheme.black.color['75'],
        [`${namespace}-black-50a`]: defaultTheme.black.color['50a'],
        [`${namespace}-black-75a`]: defaultTheme.black.color['75a'],
        [`${namespace}-gray`]: defaultTheme.gray.color['100'],
        [`${namespace}-gray-50`]: defaultTheme.gray.color['50'],
        [`${namespace}-gray-75`]: defaultTheme.gray.color['75'],
        [`${namespace}-gray-50a`]: defaultTheme.gray.color['50a'],
        [`${namespace}-gray-75a`]: defaultTheme.gray.color['75a'],
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
} satisfies Config
```

### 错误页面

在项目根目录下，创建 `error.vue`，内容如下：

```vue
<template>
  <div class="flex h-screen w-screen flex-col items-center justify-center">
    <h2 class="text-8xl font-bold text-cb-primary">{{ error.statusCode }}</h2>
    <span class="mt-2 text-cb-black-75">哎呀，出错了，请稍后再试</span>
    <button
      class="mt-2 rounded border border-cb-primary bg-cb-white px-4 py-2 text-cb-primary hover:bg-cb-primary hover:text-white"
      @click="onClickBackHomeBtn"
    >
      回到首页
    </button>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "错误" });

const props = defineProps<{
  error: {
    url: string;
    statusCode: number;
    statusMessage: string;
    message: string;
    description: string;
    data: any;
  };
}>();

const onClickBackHomeBtn = () => {
  clearError({ redirect: "/" });
};
</script>
```

### 布局

> 布局是页面的包装

在项目根目录下，创建 `layouts/default.vue`，内容如下：

```vue
<template>
  <div class="min-w-screen flex min-h-screen flex-row flex-nowrap">
    <div class="flex-1">
      <div class="flex min-h-full flex-col flex-nowrap space-y-10 p-10">
        <header>
          <h2 class="text-2xl font-bold text-cb-primary">CokeBeliever</h2>
        </header>
        <main class="w-full min-w-[240px] max-w-[400px] flex-1 self-center">
          <p class="text-2xl font-bold">欢迎来到，Nuxt3 Boilerplate</p>
          <slot></slot>
        </main>
        <footer>
          <div class="text-xs">版权所有 © 2024 CokeBeliever 保留所有权利。</div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
```

### Swiper

安装：

```bash
npm install nuxt-swiper
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  modules: [
    // ...
    "nuxt-swiper",
  ],
  // ...
});
```

你可以自定义一些样式。

在项目根目录下，创建 `assets/css/swiper.css`，内容如下：

```css
:root {
  --swiper-theme-color: var(--primary-color) !important;
  --swiper-pagination-bullet-width: 10px;
  --swiper-pagination-bullet-height: 10px;
  --swiper-pagination-bullet-border-radius: 50%;
  --swiper-pagination-bullet-inactive-color: var(--swiper-theme-color);
  --swiper-pagination-bullet-inactive-opacity: 0.4;
  --swiper-pagination-bullet-opacity: 1;
}
```

在项目根目录下，创建 `assets/css/index.css`，内容如下：

```css
:root {
  --primary-color: rgb(252, 67, 8);
}
```

### UI 组件库

安装：

```bash
npm install @ant-design-vue/nuxt
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  modules: [
    // ...
    "@ant-design-vue/nuxt",
  ],
  antd: {
    extractStyle: true,
  },
  // ...
});
```

修改 `app.vue`，内容如下：

```vue
<template>
  <a-extract-style>
    <a-config-provider
      :locale="zhCN"
      :theme="{
        token: {
          colorPrimary,
        },
      }"
    >
      <a-style-provider hash-priority="high">
        <NuxtLoadingIndicator :color="colorPrimary" :throttle="0" />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </a-style-provider>
    </a-config-provider>
  </a-extract-style>
</template>

<script lang="ts" setup>
import { defaultTheme } from "@/configs/theme";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "~/assets/css/index.css";
import "~/assets/css/swiper.css";

const colorPrimary = defaultTheme.primary.color["100"];
</script>
```

在项目根目录下，创建 `pages/index.vue`，内容如下：

```vue
<template>
  <div class="mt-10">
    <div class="flex items-center text-5xl font-bold">
      <span class="icon-[ant-design--home-outlined]"></span>
      <h2>首页</h2>
    </div>

    <p class="mt-8 h-8 text-center font-bold leading-8">
      {{ userStore.user?.username ?? "" }}
    </p>

    <a-button
      class="mt-8 w-full"
      type="primary"
      ghost
      @click="onClickLogoutBtn"
    >
      登出
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores";

useHead({ title: "首页" });

const userStore = useUserStore();

const onClickLogoutBtn = () => {
  userStore.logout();
  navigateTo(`/login${location.search}`);
};
</script>
```

在项目根目录下，创建 `pages/login.vue`，内容如下：

```vue
<template>
  <div class="mt-10">
    <div class="flex items-center text-5xl font-bold">
      <span class="icon-[ant-design--login-outlined]"></span>
      <h2>登录</h2>
    </div>

    <a-button class="mt-8 w-full" type="primary" @click="onClickLoginBtn">
      登录
    </a-button>
    <div class="mt-6">
      <span>还没有账户？</span>
      <NuxtLink class="text-cb-primary" to="/register">注册</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores";

useHead({ title: "登录" });

const userStore = useUserStore();

const onClickLoginBtn = () => {
  userStore.login({
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzI5OTU1NzM2LCJleHAiOjE3Mjk5NTkzMzZ9.xV_0nOhGPAsMdwBsm0kuHIR1KTOCaUs-FvJr2K0CDCc",
    refresh_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzI5OTU1NzM2LCJleHAiOjE3Mjk5NjIxMzZ9.ulEOTkDxtGMXeUEgZ99ZXQD8Cjs4gx1ZecdHKvrBCCY",
    expires_in: 3600,
    token_type: "Bearer",
  });
  navigateTo("/");
};
</script>
```

在项目根目录下，创建 `pages/register.vue`，内容如下：

```vue
<template>
  <div class="mt-10">
    <div class="flex items-center text-5xl font-bold">
      <span class="icon-[ant-design--user-outlined]"></span>
      <h2>注册</h2>
    </div>

    <a-button class="mt-8 w-full" type="primary" @click="navigateTo('/login')">
      注册
    </a-button>
    <div class="mt-6">
      <span>已有账号？</span>
      <NuxtLink class="text-cb-primary" to="/login">登录</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "注册" });
</script>
```

### 过渡效果

> 在页面和布局之间应用过渡效果。

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  app: {
    // ...
    pageTransition: { name: "page", mode: "out-in" },
  },
  // ...
});
```

修改 `app.vue` 内容如下：

```vue
// ...
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
```

### 封装请求

安装：

```typescript
npm install consola
```

在项目根目录下，创建 `utils/request.ts`，内容如下：

```typescript
import { useDayjs } from "#dayjs";
import { consola } from "consola";
import { message as $message } from "ant-design-vue";
import { useUserStore } from "@/stores";

const dayjs = useDayjs();

interface IRequestOptions {
  /** 请求 URL */
  url: string;
  /** 请求基础 URL */
  baseURL?: string;
  /** 请求头 */
  headers?: object;
  /** 请求查询参数 */
  query?: object;
  /** 请求体 */
  body?: object;
}

interface ICreateRequestApiOptions {
  /** 基础 URL */
  baseURL?: string;
  /** 请求拦截器列表 */
  requestInterceptors?: ((config: any) => any)[];
}

/**
 * 创建请求
 * @param method 请求方式
 * @param createRequestApiOptions 选项
 */
function createRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  createRequestApiOptions: ICreateRequestApiOptions
) {
  return function <T = any>(requestOptions: IRequestOptions) {
    return new Promise<{
      code: number;
      message: string;
      data: T;
    }>((resolve, reject) => {
      const START_TIME = Date.now();
      const isClient = import.meta.client;
      const userStore = useUserStore();
      const { url, baseURL, body, query, headers } = requestOptions;
      let fetchOptions = {
        baseURL: baseURL || createRequestApiOptions.baseURL,
        url,
        method,
        body,
        query,
        headers: {
          Authorization: `${userStore.tokenType} ${userStore.accessToken}`,
          ...headers,
        },
      };

      // 执行请求拦截器列表
      if (createRequestApiOptions.requestInterceptors) {
        for (const fn of createRequestApiOptions.requestInterceptors) {
          fetchOptions = fn(fetchOptions);
        }
      }

      const sendHttpRequest = () => {
        const { url, ...options } = fetchOptions;
        const { baseURL } = options;

        return $fetch<{
          code: number;
          message: string;
          data: T;
        }>(url, options)
          .then((res) => {
            const { code, message } = res;
            const log = `${method} ${baseURL}${url} ${code} "${dayjs().format(
              "YYYY-MM-DD HH:mm:ss"
            )}" ${Date.now() - START_TIME}ms ${message}`;

            if (code === 200) {
              consola.success(log);
              resolve(res);
            } else if (code === 401 || code === 403) {
              consola.warn(log);

              if (isClient) {
                $message.warn(message);
              }

              if (code === 401) {
                if (isClient) {
                  userStore.logout();
                  navigateTo("/login");
                }
              }

              reject(res);
            } else {
              consola.error(log);

              if (isClient) {
                $message.error(message);
              }

              reject(res);
            }
          })
          .catch((error) => {
            consola.fail(
              `${method} ${baseURL}${url} - "${dayjs().format(
                "YYYY-MM-DD HH:mm:ss"
              )}" ${Date.now() - START_TIME}ms ${error}`
            );

            if (isClient) {
              $message.error(error.message);
            }

            reject(error);
          });
      };

      sendHttpRequest();
    });
  };
}

/**
 * 创建请求 api
 * @param options 创建请求 API 选项
 */
export default function createRequestApi(options: ICreateRequestApiOptions) {
  return {
    get: createRequest("GET", options),
    post: createRequest("POST", options),
    patch: createRequest("PATCH", options),
    delete: createRequest("DELETE", options),
  };
}
```

在项目根目录下，创建 `utils/request-sso.ts`，内容如下：

```typescript
import createRequestApi from "./request";

export default createRequestApi({
  baseURL: "/api-sso",
});
```

修改 `nuxt.config.ts` 内容如下：

```typescript
// ...
export default defineNuxtConfig({
  // ...
  nitro: {
    routeRules: {
      "/api-sso/**": {
        proxy: `${PROCESS_ENV.SSO_BASE_URL}/**`,
      },
    },
  },
  // ...
});
```

在项目根目录下，创建 `apis/sso.ts`，内容如下：

```typescript
import utilsRequestSso from "@/utils/request-sso";

export const getAuthProfile = (query = {}) => {
  // return utilsRequestSso.get({
  //   url: '/auth/profile',
  //   query,
  // })

  return Promise.resolve({
    code: 200,
    data: {
      id: "5",
      username: "read-only1",
      mobile: "18028592716",
      email: "811258684@qq.com",
      name: "游客1",
      sex: "MALE",
      enabled: true,
      birthday: "2024-10-11 00:00:00",
      createdAt: "2024-10-10 14:54:49",
      updatedAt: "2024-10-10 15:03:04",
      permissionCodes: [],
    },
    message: "操作成功",
  });
};
```

### 中间件

> Nuxt 提供了中间件来在导航到特定路由之前运行代码。

#### 路由认证

在项目根目录下，创建 `middleware/auth.global.ts`，内容如下：

```typescript
import type { RouteRecordName } from "#vue-router";
import { useUserStore } from "@/stores";
import * as apisSso from "@/apis/sso";

/** 无需登录的路由名称列表 */
const publicRouteNameList: RouteRecordName[] = [
  "login",
  "register",
  "forgot-pwd",
];

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const qsIndex = from.fullPath.indexOf("?");
  const qs = qsIndex !== -1 ? from.fullPath.slice(qsIndex) : "";

  if (userStore.isLogin) {
    if (to.name === "login") {
      return navigateTo(`/${qs}`);
    }

    if (!userStore.user) {
      try {
        const res = await apisSso.getAuthProfile();
        userStore.user = res.data;
      } catch (error) {
        console.error("middleware auth error", error);
        userStore.logout();
        return navigateTo(`/login${qs}`);
      }
    }
  } else {
    if (!publicRouteNameList.includes(to.name)) {
      return navigateTo(`/login${qs}`);
    }
  }
});
```
