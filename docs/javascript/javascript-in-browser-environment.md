# 在浏览器环境中的 JavaScript

在浏览器环境中，完整的 JavaScript 实现包含以下几个部分：

- 核心 (ECMAScript)：由 ECMA-262 定义并提供核心功能。
- 文档对象模型 (DOM)：提供与页面内容交互的方法和接口。
- 浏览器对象模型 (BOM)：提供与浏览器交互的方法和接口。

## ECMAScript

ECMAScript 只是对实现这个规范描述的所有方面的一门语言的称呼。比如 JavaScript 实现了 ECMAScript。

ECMAScript 并不局限于浏览器，浏览器只是 ECMAScript 实现可能存在的一种宿主环境 (host environment)。宿主环境提供 ECMAScript 的基准实现和与环境自身交互必需的扩展。扩展 (比如 DOM) 使用 ECMAScript 核心类型和语法，提供特定于环境的额外功能。其他宿主环境还有服务器端 JavaScript 平台 Node.js。

## DOM

文档对象模型 (DOM，Document Object Model) 是一个应用编程接口 (API)，用于支持访问和操作页面内容，即在 HTML 中使用扩展的 XML。DOM 将整个页面抽象为一组分层节点。HTML 或 XML 页面的每个组成部分都是一种节点，包含不同的数据。

使用 DOM API，可以轻松地删除、添加、替换、修改节点。

## BOM

浏览器对象模型 (BOM) 是一个应用编程接口 (API)，用于支持访问和操作浏览器的窗口，人们通常会把任何特定于浏览器的扩展都归在 BOM 的范畴内。

使用 BOM API，开发者可以操控浏览器显示页面之外的部分。而 BOM 真正独一无二的地方，当然也是问题最多的地方，就是它是唯一一个没有相关标准的 JavaScript 实现。HTML5 改变了这个局面，这个版本的 HTML 以正式规范的形式涵盖了尽可能多的 BOM 特性。
