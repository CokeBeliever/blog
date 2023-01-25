# 数据类型

JavaScript 数据类型可分为两种：

- 原始数据类型，有 undefined、null、boolean、number、string 和 symbol。

- 引用数据类型，有 Object、Array、Date 等和自定义引用数据类型。

因此，变量存储的值有两种，它们有以下特点：

- 原始数据类型的值：数据所占空间大小固定，存储在栈内存上。变量包含的是相应值的本身。从一个变量到另一个变量复制值会创建该值的第二个副本。
- 引用数据类型的值 (常称为对象，比如 Array 对象、Date 对象)：数据所占空间大小不固定，存储在堆内存上。变量包含的是指向相应值的一个指针，而不是值本身。从一个变量到另一个变量复制值只会复制指针，因此这两个变量都指向同一个对象。

## 确定数据类型

因为 JavaScript 的类型系统是松散的，所以需要有一些方式来确定任意变量的数据类型。

### typeof 操作符

对一个值使用 typeof 操作符会返回下列字符串之一：

- "undefined" 表示值未定义；
- "boolean" 表示值为布尔值；
- "string" 表示值为字符串；
- "number" 表示值为数值；
- "object" 表示值为非函数引用数据类型或 null；
- "function" 表示值为函数引用数据类型；
- "symbol" 表示值为符号；

来看下面的例子：

```js
let v1 = undefined;
console.log(typeof v1); // "undefined"

let v2 = true;
console.log(typeof v2); // "boolean"

let v3 = "";
console.log(typeof v3); // "string"

let v4 = 1;
console.log(typeof v4); // "number"

let v5 = Symbol();
console.log(typeof v5); // "symbol"

let v6 = null;
console.log(typeof v6); // "object"
// 确定是否为 null
console.log(typeof v6 === "object" && v6 === null); // true

let v7 = {};
let v8 = [];
let v9 = new Date();
console.log(typeof v7); // "object"
console.log(typeof v8); // "object"
console.log(typeof v9); // "object"

let v10 = function () {};
let v11 = () => {};
console.log(typeof v10); // "function"
console.log(typeof v11); // "function"
```

可以看出，typeof 操作符可以确定原始数据类型 (null 可以使用 typeof 操作符和 `===` 全等操作符确定) 和函数引用数据类型，但是无法确定非函数引用数据类型的具体类型 (比如 Array、Date 等)，这是因为 typeof 操作符对于非函数引用数据类型都返回 "object"。

### instanceof 操作符

虽然 typeof 操作符对原始数据类型的确定很有帮助，但是它对非函数引用数据类型的确定却用处不大。我们通常不关心一个值是不是引用数据类型的值，而是想知道它具体是什么引用数据类型的值。

为了解决这个问题，可以使用 ECMAScript 提供的 instanceof 操作符，语法如下：

```js
variable instanceof constructor;
```

如果变量是给定引用数据类型的实例 (由其原型链决定)，则 instanceof 操作符返回 `true`。来看下面的例子：

```js
let person = [];
let colors = [];
let pattern = /js/;
console.log(person instanceof Object); // 变量 person 是 Object 的实例吗？	true
console.log(colors instanceof Array); // 变量 colors 是 Array 的实例吗？	true
console.log(pattern instanceof RegExp); // 变量 pattern 是 RegExp 的实例吗？true

let num = 1;
let bol = true;
let str = "";
console.log(num instanceof Object); // 变量 num 是 Object 的实例吗？false
console.log(bol instanceof Object); // 变量 bol 是 Object 的实例吗？false
console.log(str instanceof Object); // 变量 str 是 Object 的实例吗？false

class CustomDataType {}
let cdt = new CustomDataType();
console.log(cdt instanceof Object); // 变量 cdt 是 Object 的实例吗？true
console.log(cdt instanceof CustomDataType); // 变量 cdt 是 CustomDataType 的实例吗？true
```

因为所有的引用数据类型的值都是 Object 的实例，所以通过 instanceof 操作符检测任何引用数据类型的值和 Object 构造函数都会返回 `true`。类似地，如果用 instanceof 检测原始数据类型的值，则始终会返回 `false`，因为原始数据类型的值不是对象。

### Array.isArray()

虽然 instanceof 操作符对引用数据类型的确定很有用，但是 instanceof 是基于原型链判断的，所以需要保证同一个全局执行上下文。如果网页里有多个 iframe，则可能涉及多个不同的全局执行上下文，因此就会有多个不同版本的 Array 构造函数。如果要把数组对象从一个 iframe 传给另一个 iframe，则一个 iframe 内数组的构造函数将有别于在另一个 iframe 内数组的构造函数。

```js
let iframeEl = document.createElement("iframe");
document.body.appendChild(iframeEl);
let iframeArr = new iframeEl.contentWindow.Array();
console.log(iframeArr instanceof Array); // 变量 iframeArr 是 Array 的实例吗？false
```

为了解决这个问题，可以使用 ECMAScript 提供的 Array.isArray()。这个方法的目的就是确定一个值是否为数组类型，而不用管它是在哪个全局执行上下文中创建的。来看下面例子：

```js
let arr = [];
let str = "";
let date = new Date();

console.log(Array.isArray(arr)); // true
console.log(Array.isArray(str)); // false
console.log(Array.isArray(date)); // false

let iframeEl = document.createElement("iframe");
document.body.appendChild(iframeEl);
let iframeArr = new iframeEl.contentWindow.Array();
console.log(Array.isArray(iframeArr)); // 变量 iframeArr 是 Array 类型吗？true
```

### Object.prototype.toString()

虽然，Array.isArray() 可以跨全局执行上下文的确定数组类型，但是很多内置引用数据类型并没有像数组一样拥有这样的方法，跨全局执行上下文的确定数据类型还是没有解决。

为了解决这个问题，可以使用 ECMAScript 提供的 Object.prototype.toString()。这个方法在类型相同的情况下，在所有全局执行上下文都会返回一致的字符串，而不用管值是在哪个全局执行上下文中创建的。来看下面例子：

```js
let v1 = undefined;
console.log(Object.prototype.toString.call(v1)); // "[object Undefined]"

let v2 = true;
console.log(Object.prototype.toString.call(v2)); // "[object Boolean]"

let v3 = "";
console.log(Object.prototype.toString.call(v3)); // "[object String]"

let v4 = 1;
console.log(Object.prototype.toString.call(v4)); // "[object Number]"

let v5 = Symbol();
console.log(Object.prototype.toString.call(v5)); // "[object Symbol]"

let v6 = null;
console.log(Object.prototype.toString.call(v6)); // "[object Null]"

let v7 = {};
let v8 = [];
console.log(Object.prototype.toString.call(v7)); // "[object Object]"
console.log(Object.prototype.toString.call(v8)); // "[object Array]"

let iframeEl = document.createElement("iframe");
document.body.appendChild(iframeEl);
let v9 = new iframeEl.contentWindow.Array();
console.log(Object.prototype.toString.call(v9)); // "[object Array]"

let v10 = function () {};
console.log(Object.prototype.toString.call(v10)); // "[object Function]"
```

需要注意的是，对于 Number、String、Boolean 的原始数据类型和引用数据类型，通过该方法都返回相同的值。所以对于判断原始数据类型，我们始终建议使用 typeof 操作符：

```js
let numSrc = 1; // 原始数据类型
let numRef = new Number(1); // 引用数据类型
console.log(Object.prototype.toString.call(numSrc)); // "[object Number]"
console.log(Object.prototype.toString.call(numRef)); // "[object Number]"
```

对于自定义引用数据类型，可以通过 Symbol.toStringTag 属性来设置该方法返回的标志：

```js
class CustomDataType {
  [Symbol.toStringTag] = "CokeBeliever";
}

console.log(Object.prototype.toString.call(new CustomDataType())); // "[object CokeBeliever]"
```

### 总结

综上所述，我们可以通过表格来整理一下：

| 方式                        | 确定原始数据类型 | 确定引用数据类型 | 确定跨全局执行上下文引用数据类型 | 确定自定义引用数据类型 |
| --------------------------- | ---------------- | ---------------- | -------------------------------- | ---------------------- |
| typeof 操作符               | ✅               | ❌               | ❌                               | ❌                     |
| instanceof 操作符           | ❌               | ✅               | ❌                               | ✅                     |
| Array.isArray()             | ❌               | ✅ (仅数组)      | ✅ (仅数组)                      | ❌                     |
| Object.prototype.toString() | ❌               | ✅               | ✅                               | ✅                     |

- typeof 操作符，适用于确定原始数据类型。

- instanceof 操作符，适用于确定引用数据类型 (包括自定义引用数据类型)，但是不适用于在跨全局执行上下文引用数据类型的确定。
- Array.isArray()，适用于确定数组类型。
- Object.prototype.toString()，适用于确定引用数据类型 (包括自定义引用数据类型)。
