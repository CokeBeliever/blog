# Commitlint

> [conventional-changelog/commitlint: 📓 Lint commit messages (github.com)](https://github.com/conventional-changelog/commitlint)

Commitlint 是一个工具，用于规范 Git 提交消息的格式和内容。它可以帮助团队在开发过程中保持一致的提交消息风格，从而使团队可以更容易地理解提交的目的，并且更好地跟踪项目的历史。



## 快速开始

> CommitLint 通常与 Husky 一起使用。有关 Husky 的内容，请参阅 [typicode/husky: Git hooks made easy 🐶 woof! (github.com)](https://github.com/typicode/husky)。

**安装**

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```



**添加钩子**

```bash
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```



**配置文件**

在项目根目录下，创建 `.commitlintrc.json`，内容如下：

```json
{
    "extends": ["@commitlint/config-conventional"]
}
```

这样，Commitlint 就会检查提交消息是否符合常规的提交格式：

```
type(scope?): subject #scope 是可选的；支持多个 scopes（scopes 分隔符可以选择："/", "\" 和 ","）
```



## 尝试一下

**目标：git commit 时，检查提交消息是否符合 `type(scope?): subject` 提交格式**

初始化项目：

```bash
mkdir commitlint-demo
cd commitlint-demo
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

删除默认生成的 `.husky/pre-commit`：

```
rm .husky/pre-commit
```

------

**commitlint**

安装 commitlint：

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

添加钩子：

```bash
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

在项目根目录下，创建 `.commitlintrc.json`，内容如下：

```bash
{
    "extends": ["@commitlint/config-conventional"]
}
```

------

**测试一下**

提交代码：

```bash
git add .
git commit -m "test"
```

可以在终端看到：

```bash
⧗   input: test
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint    

husky - commit-msg script failed (code 1)
```

subject 和 type 可能不能为空，我们可以修改一下提交消息：

```
git commit -m 'chore: test'
```

可以看到，提交成功：

```bash
[master (root-commit) b1bac66] chore: test
 5 files changed, 1492 insertions(+)
 create mode 100644 .commitlintrc.json
 create mode 100644 .gitignore
 create mode 100644 .husky/commit-msg
 create mode 100644 package-lock.json
 create mode 100644 package.json
```



**目标：Commitlint prompt**

> [Prompt | commitlint](https://commitlint.js.org/reference/prompt.html)
>
> [@commitlint/cz-commitlint - npm (npmjs.com)](https://www.npmjs.com/package/@commitlint/cz-commitlint)

Commitlint prompt 是指与 Commitlint 相关的一种用户提示交互方式。这种提示交互方式用于指导开发人员在提交代码时遵循特定的规范和格式。例如，在提交代码时，Commitlint prompt 可能会显示一些规范或建议，以帮助开发人员编写符合要求的提交消息。

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

同时，更新 `.commitlintrc.json` 内容：

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

这样，我们就可以通过 `npm run commit` 命令，以提示交互方式来提交代码了。

```bash
git add .
npm run commit
```

轻松地完成代码提交：

```bash
> commitlint-demo@1.0.0 commit
> git-cz

cz-cli@4.3.0, @commitlint/cz-commitlint@19.2.0

? 选择您正在提交的更改类型：: chore
? 此更改的作用域是什么（例如：client 或 server） :按回车键跳过: 最多 95 个字符
 (0)
? 写一个简短的祈使时态描述变化: 最多 95 个字符
 (4) test
? 提供更改的详细说明 :按回车键跳过:

? 有什么突破性的变化吗？: No
? 此更改是否会影响任何未解决的问题？: No
[master 17b8426] chore: test
 3 files changed, 1522 insertions(+), 6 deletions(-)
```



