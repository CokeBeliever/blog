# 模块

在其他高级语言中，Java 有类文件，Python 有 import 机制，Ruby 有 require，PHP 有 include 和 require。在 ECMAScript 2015 以前，JavaScript 并没有标准模块规范，它通过 `<script>` 标签引入代码的方式显得杂乱无章，语言自身毫无组织和约束能力。人们不得不用命名空间等方式人为地约束代码，以求达到安全和易用的目的。

## CommonJS

由于 Node 使用的是 JavaScript 语言，所以存在上述缺陷。为了弥补当时 JavaScript 没有标准模块规范的缺陷，Node 实现了 CommonJS 模块规范，以达到像 Python、Ruby 和 Java 具备开发大型应用的基础能力。

### CommonJS 的使用

CommonJS 对模块的定义主要分为：

- 模块引用
- 模块定义
- 模块标识

#### 模块引用

模块引用的示例代码如下：

```js
var math = require("math");
```

在 CommonJS 规范中，存在 require() 方法，这个方法接受模块标识，以此引入一个模块的 API 到当前上下文。

#### 模块定义

在模块中，上下文提供 require() 方法来引入外部模块。另一方面，上下文提供了 exports 对象用于导出当前模块的方法或者变量，并且它是唯一导出的出口。

在模块中，还存在一个 module 对象，它代表模块自身，而 exports 是 module 的属性。在 Node 中，一个文件就是一个模块，将方法挂载在 exports 对象上作为属性即可定义导出：

```js
// math.js
exports.add = function (num1, num2) {
  return num1 + num2;
};
```

在另一个文件中，我们通过 require() 方法引入模块后，就能调用定义的属性或方法了：

```js
// program.js
const math = require("./math");

math.add(1, 2);
```

#### 模块标识

模块标识其实就是传递给 require() 方法的参数，它必须是符合小驼峰命名的字符串，或者已 `.`、`..` 开头的相对路径、或者绝对路径。它可以没有文件后缀，如：`.js`、`.json`、`.node`。

### Node 的 CommonJS 实现

Node 在实现中并非完全按照 CommonJS 模块规范实现，而是对其进行了一定的取舍，同时也增加了少许自身需要的特性。

在 Node 中引入模块，需要经历如下 3 个步骤：

- 路径分析
- 文件定位
- 编译执行

在 Node 中，模块分为两类：

- 核心模块：Node 提供的模块。核心模块部分在 Node 源代码的编译过程中，编译进了二进制执行文件。在 Node 进程启动时，部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在路径分析中优先判断，所以它的加载速度是最快的。
- 文件模块：用户编写的模块。文件模块则是在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。

#### 优先从缓存加载

Node 对引入过的模块都会进行缓存，从缓存加载的优化策略使得二次引入时不需要路径分析、文件定位和编译执行的过程，大大提高了再次加载模块时的效率。

无论是核心模块还是文件模块，require() 方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。

#### 路径分析

路径分析是对模块标识的分析，因为模块标识有几种形式，所以对于不同的模块标识，模块的路径分析会有所不同。

require() 方法接受一个模块标识作为参数。在 Node 实现中，正是基于这样一个模块标识进行模块查找的。

模块标识在 Node 中主要分为以下几类：

- 核心模块标识：如 http、fs、path 等。
- 路径形式的文件模块标识：以 `.` 或 `..` 开始的相对路径或以 `/` 开始的绝对路径。
- 非路径形式的文件模块标识：如自定义的 connect 模块。

##### 核心模块

核心模块的优先级仅次于缓存加载，它在 Node 的源代码编译过程中已经编译为二进制代码，其加载过程最快。

如果试图加载一个与核心模块标识相同的非路径形式的文件模块，那么加载的是核心模块。想要成功加载非路径形式的文件模块，必须选择一个与核心模块不同的模块标识或者换用路径的方式。

##### 路径形式的文件模块

以 `.`、`..` 和 `/` 开始的模块标识，这里都被当做文件模块来处理。在路径分析时，require() 方法会将路径转为真实路径，并以真实路径作为索引，将编译执行后的结果存放到缓存中，以使二次加载时更快。

由于路径形式的文件模块标识给 Node 指明了确切的文件位置，所以在查找过程中可以节约大量时间，路径形式的文件模块加载速度慢于核心模块。

##### 非路径形式的文件模块

非路径形式的文件模块可能是一个文件或者包的形式。这类模块的查找最费时，也是所有方式中最慢的一种。

模块路径 `module.paths` 是 Node 在定位非路径形式的文件模块的具体文件时制定的查找策略，具体表现为一个路径组成的数组。关于这个路径的生成规则，如下所示：

```js
console.log(module.paths);
[
  "/home/jackson/research/node_modules",
  "/home/jackson/node_modules",
  "/home/node_modules",
  "/node_modules",
];
```

可以看出，模块路径的生成规则如下所示：

- 当前文件目录下的 `node_modules` 目录。
- 父目录下的 `node_modules` 目录。
- 父目录的父目录下的 `node_modules` 目录。
- 沿路径向上逐级递归，直到根目录下的 `node_modules` 目录。

在加载的过程中，Node 会逐个尝试模块路径中的路径，直到找到目标文件为止。可以看出，当前文件的路径越深，模块查找耗时会越多，所以说非路径形式的文件模块的加载速度是最慢的。

#### 文件定位

不同形式的模块标识，路径分析的结果会有所不同：

- 核心模块标识：模块
- 路径形式的文件模块标识：带/不带扩展名的文件或目录
- 非路径形式的文件模块标识：目录

对于核心模块标识，因为可以直接得到模块，所以核心模块在 require() 时不需要文件定位和编译执行步骤。

对于文件模块标识，因为仅路径分析可能还不无法定位具体的文件，所以文件模块在 require() 时需要文件定位和编译执行步骤。

##### 文件扩展名分析

require() 在分析模块标识的过程中，会出现模块标识中不包含文件扩展名的情况。CommonJS 模块规范也允许在模块标识中不包含文件扩展名，这种情况下，Node 会按 `.js`、`.json`、`.node` 的次序补足扩展名，依次尝试。

在尝试的过程中，需要调用 fs 模块同步阻塞式地判断文件是否存在。因为 Node 是单线程的，所以这里可能是一个会引起性能问题的地方，一般建议仅省略 `.js` 的扩展名，这样可以在性能和便利之间保持平衡。

##### 目录分析

require() 在分析模块标识的过程中，通过分析文件扩展名之后，可能没有查找到对应文件，表示模块标识是一个目录，这在引入非路径形式的文件模块时逐个模块路径进行查找时经常会出现，此时 Node 会将目录当做一个包来处理。

在这个过程中，Node 对 CommonJS 包规范进行了一定程度的支持。

- 首先，Node 在当前目录下会查找 `package.json` (CommonJS 包规范定义的包描述文件)，通过 `JSON.parse()` 解析出包描述对象，从中取出 `main` 属性指定的文件名进行定位。如果文件名缺少扩展名，将会进入扩展名分析的步骤。
- 而如果 `main` 属性指定的文件名错误，或者压根没有 `package.json` 文件，Node 会将 `index` 当做默认文件，然后依次查找 `index.js`、`index.json`、`index.node`。
- 如果在目录分析的过程中没有定位成功任何文件，则非路径形式的文件模块进入下一个模块路径进行查找。如果模块路径数组都被遍历完毕，依然没有查找到目标文件，则会抛出查找失败的异常。

#### 编译执行

在 Node 中，每个文件模块都是一个对象，它的定义如下：

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

编译和执行是引入文件模块的最后一个阶段。定位到具体的文件后，Node 会新建一个模块对象，然后根据路径载入并编译。对于不同的文件扩展名，其载入方法也有所不同，具体如下所示：

- `.js` 文件：通过 fs 模块同步读取文件后编译执行。
- `.node` 文件：这是用 C/C++ 编写的扩展文件，通过 `dlopen()` 方法加载最后编译生成的文件。
- `.json` 文件。通过 fs 模块同步读取文件后，用 `JSON.parse()` 解析返回结果。
- 其余扩展名文件。它们都被当做 `.js` 文件载入。

每一个编译成功的模块都会将其文件路径作为索引缓存在 `Module._cache` 对象上，以提高二次引入的性能。

根据不同的文件扩展名，Node 会调用不同的读取方式，如 `.json` 文件的调用如下：

```js
// Native extension for .json
Module._extensions[".json"] = function (module, filename) {
  var content = NativeModule.require("fs").readFileSync(filename, "utf8");
  try {
    module.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + ": " + err.message;
    throw err;
  }
};
```

其中，`Module._extensions` 会被赋值给 require() 的 `extensions` 属性，所以通过在代码中访问 `require.extensions` 可以知道系统中已有的扩展加载方式。

```js
console.log(require.extensions);
{ '.js': [Function], '.json': [Function], '.node': [Function] }
```

如果想对自定义的扩展名进行特殊加载，可以通过类似 `require.extensions['.ext']` 的方式实现。

##### JavaScript 模块的编译执行

同到 CommonJS 模块规范，我们知道每个模块文件中存在着 require、exports、module 这 3 个变量，但是它们在模块文件中并没有定义，那么从何而来呢？甚至在 Node 的 API 文档中，我们知道每个模块中还有 `__filename`、`__dirname` 这两个变量的存在，它们又是从何而来的呢？如果我们直接定义模块的过程放诸在浏览器端，会存在污染全局变量的情况。

事实上，在编译的过程中，Node 对获取的 JavaScript 文件内容进行了头尾包装。在头部添加了 `(function (exports, require, module, \__filename, __dirname) {\n`，在尾部添加了 `\n});`。一个正常的 JavaScript 文件会被包装成如下的样子：

```js
(function (exports, require, module, __filename, __dirname) {
    var math = require('math');
    export.area = function (radius) {
        require Math.PI * radius * radius;
    }
});
```

这个每个模块文件之间都进行了作用域隔离。包装之后的代码会通过 vm 原生模块的 `runInThisContext()` 方法执行（类似 eval，只是具有明确上下文，不污染全局），返回一个具体的 function 对象。最后，将当前模块对象的 exports 属性、require 方法、module（模块对象自身），以及在文件定位中得到的 `__filename` 完整文件路径和 `__dirname` 文件目录作为参数传递给这个函数执行。

这就是这些变量并没有定义在每个模块文件中却存在的原因。在执行之后，模块的 exports 属性被返回给了调用方。exports 属性上的任何方法和属性都可以被外部调用到，但是在模块中的其余变量或属性则不可直接被调用。

##### C/C++ 模块的编译执行

实际上，`.node` 的模块文件并不需要编译，因为它是编写 C/C++ 模块之后编译生成的，所以这里只有加载和执行的过程。

Node 调用 `process.dlopen()` 方法进行加载和执行。在执行的过程中，模块的 exports 对象与 `.node` 模块产生联系，然后返回给调用者。

##### JSON 文件的编译执行

`.json` 文件的编译是 3 种编译方式中最简单的。Node 利用 fs 模块同步读取 JSON 文件的内容之后，调用 `JSON.parse()` 方法得到对象，然后将它赋给模块对象的 exports，以供外部调用。

JSON 文件在用作项目的配置文件时比较有用。如果你定义了一个 JSON 文件作为配置，那就不必调用 fs 模块去异步读取和解析，直接调用 require() 引入即可。此外，你还可以享受到模块缓存的便利，并且二次引入时也没有性能影响。
