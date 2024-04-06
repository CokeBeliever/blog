# lint-staged

> [lint-staged/lint-staged: 🚫💩 — Run linters on git staged files (github.com)](https://github.com/lint-staged/lint-staged?tab=readme-ov-file)

lint-staged 是一个能够对 Git 暂存区文件执行脚本的工具，它通常与 Husky 一起使用。它的主要功能是针对 Git 暂存区（即将提交的文件）运行预定义的脚本，而不是对整个项目。

通常情况下，例如：对整个项目运行 ESLint（用于 JavaScript 代码检查），可能会导致检查过程较为缓慢，并且检查结果可能包含许多与即将提交的文件无关的内容。lint-staged 的优势在于它只对 Git 暂存区进行检查，这样可以提高效率并确保检查结果的相关性。



## 快速开始

> lint-staged 通常与 Husky 一起使用。有关 Husky 的内容，请参阅 [typicode/husky: Git hooks made easy 🐶 woof! (github.com)](https://github.com/typicode/husky)。

**安装**

```bash
npm install --save-dev lint-staged
```



**添加钩子**

```bash
echo "npx lint-staged" > .husky/pre-commit
```



**配置文件**

在项目根目录下，创建 `.lintstagedrc.json`，内容如下：

```json
{
  "*": "prettier --write",
  "*.js": "eslint"
}
```

这个配置表示，并行执行：

1. 对匹配 `*` 任意文件，执行 `prettier --write` 命令；
2. 对匹配 `*.js` 特定文件，执行 `eslint` 命令。



## 尝试一下

**目标：git commit 时，仅对 Git 暂存区的文件，执行 ESLint 检查代码质量、Prettier 格式化代码风格**

初始化项目：

```bash
mkdir lint-staged-demo
cd lint-staged-demo
npm init -y
git init
echo "node_modules" > .gitignore
```

**husky**

安装 husky：

```bash
npm install --save-dev husky
```

初始化 husky：

```bash
npx husky init
```

------

**lint-staged**

安装 lint-staged：

```bash
npm install --save-dev lint-staged
```

添加钩子：

```bash
echo "npx lint-staged" > .husky/pre-commit
```

在项目根目录下，创建 `.lintstagedrc.json`，内容如下：

```bash
{
  "*": "prettier --write",
  "*.js": "eslint"
}
```

------

**ESLint/Prettier**

安装 ESLint、Prettier：

```bash
npm install --save-dev eslint prettier
```

在项目根目录中，创建 `.eslintrc.json`，内容如下：

```json
{
    "env": {
        "node": true,
        "es6": true
    },
    "rules": {
        "no-unused-vars": "error"
    }
}
```

在项目根目录中，创建 `.prettierrc.json`，内容如下：

```json
{
    "printWidth": 80,
    "semi": false
}
```

**其他**

在项目根目录中，创建 `index.js`，内容如下：

```js
const name = "CokeBeliever";
```

接着，创建 `index.html`，内容如下：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CokeBeliever</title>
  </head>
  <body>
    <div><p>未格式化之前 div p 标签在同一行！未格式化之前 div p 标签在同一行！未格式化之前 div p 标签在同一行！未格式化之前 div p 标签在同一行！未格式化之前 div p 标签在同一行！</p></div>
  </body>
</html>
```

提交代码：

```bash
git add index.js index.html
git commit -m "test"
```

可以在终端看到：

```bash
1:7  error  'name' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)

husky - pre-commit script failed (code 1)
```

可以看到，虽然 Prettier 代码格式化执行成功，但 ESLint 检查报错。

这是因为 ESLint 规则配置了 "不允许未使用的声明变量"，我们可以修改 `index.js`，内容如下：

```js
const name = "CokeBeliever";
console.log(name);
```

再次，提交代码：

```bash
git add index.js index.html
git commit -m "test"
```

检查通过，提交成功，下面是 Prettier 格式化后的代码：

`index.js`

```js
const name = "CokeBeliever"
console.log(name)
```

根据配置 `semi`，自动去除尾随分号。

`index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CokeBeliever</title>
  </head>
  <body>
    <div>
      <p>
        未格式化之前 div p 标签在同一行！未格式化之前 div p
        标签在同一行！未格式化之前 div p 标签在同一行！未格式化之前 div p
        标签在同一行！未格式化之前 div p 标签在同一行！
      </p>
    </div>
  </body>
</html>
```

根据配置 `printWidth`，当单行字符数超过限制，自动换行。



