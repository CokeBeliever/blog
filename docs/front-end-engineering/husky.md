# Husky

> [typicode/husky: Git hooks made easy 🐶 woof! (github.com)](https://github.com/typicode/husky)

Husky 是一个 Git 钩子管理工具，用于在 Git 仓库中设置预定义的操作，以在特定的 Git 事件发生时自动触发。这些事件包括 `git commit` 提交代码、`git push` 推送到远程仓库等。

Husky 使得开发者可以在这些事件发生时执行自定义的脚本或命令，以执行各种操作，例如：运行代码格式化工具、运行测试、检查代码质量等。它可以帮助团队确保在提交代码或推送到远程仓库之前执行一系列预定义的操作，以确保代码的质量和可靠性。



## 快速开始

> 注意，请在 git bash 中运行命令。

**安装**

```bash
npm install --save-dev husky
```



**初始化**

使用 `init` 命令简化了在项目中设置 Husky 的过程。它做了以下事情：

1. 在当前路径下，生成 `.husky` 目录；
2. 在 `package.json` 中，新增 `prepare` 脚本。

```bash
npx husky init
```



**添加钩子**

Husky 添加钩子就像创建文件一样。例如：

```bash
echo "npm test" > .husky/pre-commit
```

这个钩子会在进行 git commit 提交之前执行 `npm test` 命令。



## 尝试一下

**目标：git commit 时，执行 ESLint 检查代码质量**

初始化项目：

```bash
mkdir husky-demo
cd husky-demo
npm init -y
git init
echo "node_modules" > .gitignore
```

安装：

```bash
npm install --save-dev husky eslint
```

初始化 Husky：

```bash
npx husky init
```

添加钩子：

```bash
echo "npx eslint ." > .husky/pre-commit
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

在项目根目录中，创建 `index.js`，内容如下：

```js
const name = "CokeBeliever"; // 声明变量，但没有使用
```

提交代码：

```bash
git add index.js
git commit -m "test"
```

可以看到，ESLint 检查报错：

```bash
1:7  error  'name' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)

husky - pre-commit script failed (code 1)
```

这是因为 ESLint 规则配置了 "不允许未使用的声明变量"，我们可以修改 `index.js`，内容如下：

```js
const name = "CokeBeliever";
console.log(name);
```

再次，提交代码：

```bash
git add index.js
git commit -m "test"
```

检查通过，提交成功：

```
1 file changed, 2 insertions(+), 1 deletion(-)
```



