# `.env` 文件

`.env` 是一个用于存储环境变量的文件，通常用于存储应用程序的配置信息。这些配置信息包括：

- 数据库 URL
- 密钥
- 一些不应该直接在代码中写入的配置信息。

通过使用 `.env` 文件，我们可以将这些敏感信息从代码中分离出来，从而提高应用程序的安全性和可维护性。

下面是一个 `.env` 文件的示例：

```
DATABASE_URL=mysql://username:password@localhost:3306/database_name
JWT_SECRET=CokeBeliever
```

在应用程序运行启动时，应用程序会读取 `.env` 文件中的配置信息，并将其设置为环境变量，从而使其在整个应用程序中都可以使用。

## 环境

在现代应用程序的生命周期中，通常需要涉及多个独立的环境。这些环境包括：

- **开发环境**：开发人员在本地计算机上进行编码和调试的环境；
- **测试环境**：用于模拟最终用户交互并测试应用程序的环境；
- **生产环境**：最终用户将要使用的环境。

根据定义，环境变量是特定于环境的。例如，在不同的环境下我们需要访问不同的数据库 URL。因此，我们需要使用多个不同的 `.env` 文件。可以根据规范或个人喜好创建不同的 `.env` 文件，例如：`.env.dev`、`.env.test`、`.env.prod` 等等。这样做的好处是，我们可以根据需要在不同的环境中自由地切换，而不必担心不同环境之间的冲突。

## 不要在 Git 中存储 `.env` 文件

由于 `.env` 文件可能会包含敏感信息，例如：数据库用户名和密码、密钥。因此，为了确保敏感信息的安全，你不应该将 `.env` 文件提交到 Git 存储库或任何其他版本控制系统。

你应该是始终需要将 `.env` 添加到 `.gitignore` 中的忽略文件列表，如下所示：

```
.env
.env.*
```

### 问题

> 尽管不要在 Git 中存储 `.env` 文件可以避免敏感信息泄露，但这也会带来新的问题。

在使用 `.env` 文件与其他开发人员共享环境变量时，可能会导致一些麻烦。例如，如果其中一个团队成员更改了 `.env` 文件中的某些环境变量，那么他将需要通知所有的开发人员并让他们在自己的 `.env` 文件中更改相应的环境变量，否则其他开发成员可能会遇到问题，因为他们的本地环境与其他人的环境不同。这不可避免会产生极大的沟通和协调成本，特别是在团队规模较大时。

尽管存在问题，但是目前没有默认解决方案。

### 解决方案

**`.env.example` 文件**

一种简单的解决方案是创建一个示例的 `.env.example` 文件，并将其存储在 Git 中。该示例文件包含了 `.env` 文件所有环境变量名称，但不包含具体的环境变量值。这样，每个开发人员都可以了解应用程序所需的环境变量。

如果你不想手动复制文件，可以使用以下命令从终端生成文件：

```
sed 's/=.*/=/' .env > .env.example
```

**其他**

其他解决方案，例如：dotenv-vault。

## `.env` 文件格式

`.env` 文件是一个行分隔的文本文件，每一行表示一个环境变量。按照惯例，变量名称由以下划线分隔的大写单词组成。变量名称和变量值之间由 `=` 分隔。例如：

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=myuser
DATABASE_PASSWORD=mypass
```

`.env` 文件支持单行注释，注释以 `#` 开头。例如：

```
# 这是注释
DATABASE_HOST=localhost # 这是注释
DATABASE_PORT=5432
```

## 使用

每种编程语言和开发框架都有自己的处理 `.env` 文件的方法。下面就以 JavaScript 的 Node.js 运行时为示例。

首先，创建一个项目目录：

```
mkdir env-demo
cd ./env-demo
```

创建 `package.json` 文件：

```
npm init -y
```

初始化 Git 仓库：

```
git init
```

在项目的根目录下创建一个 `.gitignore` 文件：

```
.env
.env.*
```

在项目的根目录下创建一个 `.env` 文件：

```
S3_BUCKET=YOURS3BUCKET
SECRET_KEY=YOURSECRETKEYGOESHERE
```

这样，我们准备工作就已经做好了。

### 在应用程序中读取

安装 `dotenv`，它可以**在应用程序中**将环境变量从 `.env` 文件加载到 `process.env` 中。

```
npm i dotenv
```

创建 `index.js` 文件：

```js
require("dotenv").config();
console.log(process.env);
```

运行 `node index.js` 可以看到，我们可以在应用程序中读取 `.env` 文件配置的环境变量：

```
{
	// ...
  S3_BUCKET: 'YOURS3BUCKET',
  SECRET_KEY: 'YOURSECRETKEYGOESHERE'
}
```

**自定义读取**

我们也可以自定义读取配置文件。

创建 `.env.dev` 文件：

```
NODE_ENV=dev
```

创建 `.env.prod` 文件：

```
NODE_ENV=prod
```

修改 `index.js` 内容：

```js
require("dotenv").config({ path: ".env.dev" });
// require('dotenv').config({ path: '.env.prod' });
console.log(process.env);
```

运行 `node index.js` 可以看到，我们可以在应用程序中读取 `.env.dev` 或 `.env.prod` 文件配置的环境变量：

### 在命令行中读取

安装 `dotenv-cli`，它可以**在命令行中**将环境变量从 `.env` 文件加载到 `process.env` 中。

```
npm i dotenv-cli --save-dev
```

修改 `index.js` 内容：

```js
console.log(process.env);
```

运行 `npx dotenv node index.js` 可以看到，我们可以在应用程序中读取 `.env` 文件配置的环境变量：

```
{
	// ...
  S3_BUCKET: 'YOURS3BUCKET',
  SECRET_KEY: 'YOURSECRETKEYGOESHERE'
}
```

**自定义读取**

我们也可以自定义读取配置文件。

为了方便，我们修改 `package.json` 文件 `scripts` 部分：

```json
{
  "scripts": {
    "dev": "dotenv -e .env.dev node index.js",
    "prod": "dotenv -e .env.prod node index.js"
  }
}
```

运行 `npm run dev` 或 `npm run prod` 可以看到，我们可以在应用程序中读取 `.env.dev` 或 `.env.prod` 文件配置的环境变量。
