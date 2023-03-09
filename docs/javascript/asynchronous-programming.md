# 异步编程

同步行为和异步行为的对立统一是计算机科学的一个基本概念。特别是在 JavaScript 这种单线程事件循环模型中，同步操作与异步操作更是代码所要依赖的核心机制。

## 同步与异步

### 同步

同步行为对应内存中顺序执行的处理器指令。每条指令都会严格按照它们出现的顺序来执行 (后面的指令总是在前面的指令完成后才会执行)。这样的执行流程容易分析程序在执行到代码任意位置时的状态 (比如变量的值)。

同步操作的例子可以是执行一次简单的数学计算：

```javascript
let x = 1;
x = x + 2;
console.log(x); // 3
```

在程序执行的每一步，都可以推断出程序的状态。

### 异步

异步行为类似于系统中断，即当前进程外部的实体可以触发代码执行。异步操作经常是必要的，因为强制进程等待一个长时间的操作通常是不可行的。如果代码要访问一些高延迟的资源，比如向服务器发送请求并等待响应，那么就会出现长时间的进程等待。

异步操作的例子可以是在定时器回调中执行一次简单的数学计算：

```javascript
let x = 1;
setTimeout(() => (x = x + 2), 1000);
console.log(x); // 1
```

这段程序最终与同步代码执行的任务一样，都是把两个数加在一起，但这一次执行线程不知道 x 值何时会改变，因为这取决于回调何时从消息队列出列并执行。如果程序后续需要这个值，那么异步执行的函数需要在更新 x 的值以后通知其他代码，否则就只管继续执行，不必等待这个结果了。

## ES6 之前的异步编程模式

在早期的 JavaScript 中，只能定义回调函数来表明异步操作完成。

### 异步返回值

异步操作完成后，可能会得到一个有用的返回值。常见的策略是给异步操作提供一个回调函数，在这个回调函数中包含要使用异步返回值的代码，而返回值会作为回调函数的参数传递。如下面代码所示：

```javascript
function double(value, callback) {
  setTimeout(() => callback(value * 2), 1000);
}

double(3, (x) => console.log(`I was given: ${x}`));
// I was given: 6 (大约 1000 毫秒之后)
```

### 失败处理

异步操作也有可能会失败，所以失败处理在回调模式中也要考虑，因此自然就出现了成功回调和失败回调：

```javascript
function double(value, success, failure) {
  setTimeout(() => {
    try {
      if (typeof value !== "number") {
        throw "Must provide number as first argument";
      }
      success(2 * value);
    } catch (e) {
      failure(e);
    }
  }, 1000);
}
const successCallback = (x) => console.log(`Success: ${x}`);
const failureCallback = (e) => console.log(`Failure: ${e}`);

double(3, successCallback, failureCallback);
double("b", successCallback, failureCallback);

// Success: 6 (大约 1000 毫秒之后)
// Failure: Must provide number as first argument (大约 1000 毫秒之后)
```

### 嵌套异步回调

在这种回调模式下，如果一个异步操作的返回值又依赖另一个异步操作的返回值，那么回调的情况还会进一步变复杂。在实际的代码中，这就要求嵌套回调：

```javascript
function double(value, success, failure) {
  setTimeout(() => {
    try {
      if (typeof value !== "number") {
        throw "Must provide number as first argument";
      }
      success(2 * value);
    } catch (e) {
      failure(e);
    }
  }, 1000);
}
const successCallback = (x) => double(x, (y) => console.log(`Success: ${y}`));
const failureCallback = (e) => console.log(`Failure: ${e}`);

double(3, successCallback, failureCallback);

// Success: 12 (大约 1000 毫秒之后)
```

显然，随着代码越来越复杂，通常需要深度嵌套的回调函数 (俗称 "回调地狱") 来解决。而嵌套回调的代码维护起来就是噩梦。

## ES6 之后的异步编程模式

### Promise

ECMAScript 6 增加了对 Promise/A+ 规范的完善支持，即 Promise 类型。一经推出，Promise 就成为了主导性的异步编程机制。

#### 创建 Promise 实例

可以通过 new 操作符来创建一个 Promise 实例，并且需要传入执行器 (executor) 函数作为参数，这个执行器函数会立即执行。

```javascript
let p = new Promise(() => {});
```

#### Promise 状态

Promise 实例是一个有状态的对象，可能处于如下 3 种状态之一：

- pending (待定)
- fulfilled (兑现)
- rejected (拒绝)

pending 是 Promise 的最初始状态，在该状态下，Promise 可以落定为代表成功的 fulfilled 状态，或者代表失败的 rejected 状态。

需要注意：

- 无论落定为哪种状态都是不可逆的。只要从 pending 转换为 fulfilled 或 rejected，Promise 的状态就不能再改变了。
- Promise 不一定会脱离 pending 状态。
- Promise 的状态是私有的，不能在外部直接修改。

#### 落定 Promise 状态

由于 Promise 的状态是私有的，所以只能在内部进行操作 (Promise 的 executor 执行器函数中)。

执行器函数主要有两项职责：

- 初始化 Promise 的异步行为。
- 落定 Promise 状态。

落定 Promise 状态是通过调用它的两个函数参数实现的：

- 调用 resolve() 会把状态落定为 fulfilled 兑现。
- 调用 reject() 会把状态落定为 rejected 拒绝，并会抛出错误。

```javascript
let p1 = new Promise((resolve, reject) => resolve());
console.log(p1); // Promise <fulfilled>

let p2 = new Promise((resolve, reject) => reject());
console.log(p2); // Promise <rejected>
// Uncaught error (in promise)
```

在这个例子中，并没有什么异步操作，因为在初始化 Promise 时，执行器函数已经改变了每个 Promise 的状态。这里的关键在于，**执行器函数是同步执行的**，执行器函数是 Promise 实例的初始化程序。

无论 resolve() 和 reject() 中的哪个被调用，**落定后的状态都是不可逆的**。继续修改状态会静默失败，如下所示：

```javascript
let p = new Promise((resolve, reject) => {
  resolve();
  reject(); // 没有效果
});
console.log(p); // Promise <fulfilled>
```

#### Promise 静态方法

**Promise.resolve()**

`Promise.resolve()` 可以创建一个 fulfilled 状态的 Promise。下面两种创建 Promise 实例的方式其实是一样的：

```javascript
let p1 = new Promise((resolve, reject) => resolve());
let p2 = Promise.resolve();
```

该方法接收一个可选的参数 (解决值)：

```javascript
console.log(Promise.resolve());
// Promise <fulfilled>: undefined

console.log(Promise.resolve(3));
// Promise <fulfilled>: 3
```

如果传入的参数本身是一个 Promise，那它的行为就类似于一个空包装。因此，该方法可以说是一个幂等方法：

```javascript
let p = Promise.resolve(7);
console.log(p === Promise.resolve(p)); // true
console.log(p === Promise.resolve(Promise.resolve(p))); // true
```

**Promise.reject()**

`Promise.reject()` 可以创建一个 rejected 状态的 Promise。下面两种创建 Promise 实例的方式其实是一样的：

```javascript
let p1 = new Promise((resolve, reject) => reject());
let p2 = Promise.reject();
```

该方法接收一个可选的参数 (拒绝理由)：

```javascript
let p = Promise.reject(3);
console.log(p); // Promise <rejected>: 3
```

`Promise.reject()` 并没有照搬 `Promise.resolve()` 的幂等逻辑。如果给它传一个 Promise 对象，则这个 Promise 会成为它返回的拒绝理由：

```javascript
console.log(Promise.reject(Promise.resolve()));
// Promise <rejected>: Promise <fulfilled>
```

#### Promise 实例方法

**Promise.prototype.then()**

`Promise.prototype.then()` 是为 Promise 实例添加处理程序的主要方法。

该方法接收两个可选的参数：onResolved 处理程序和 onRejected 处理程序。如果提供的话，则会在 Promise 分别进入 "fulfilled" 和 "rejected" 状态时执行。因为 Promise 只能转换一次最终状态，所以这两个操作一定是互斥的。

该方法返回一个新的 Promise 实例，如下所示：

```javascript
let p1 = new Promise(() => {});
let p2 = p1.then();
console.log(p1); // Promise <pending>
console.log(p2); // Promise <pending>
console.log(p1 === p2); // false
```

这个新的 Promise 实例的结果值 (fulfilled 状态的解决值或 rejected 状态的拒绝理由) 是基于 onResolved 或 onRejected 处理程序的 return 值构建：

- 如果没有提供相应的处理程序，则新的 Promise 实例为 `Promise.resolve()` 包装调用 then() 方法的 Promise 实例的结果值。
- 如果没有显式的 return 语句，则新等 Promise 实例为 `Promise.resolve()` 包装默认的 reutrn 值 undefined。
- 如果有显式的 return 值，则新的 Promise 实例为 `Promise.resolve()` 包装这个值。

```javascript
let p1 = Promise.resolve("foo");
// 没有提供 onResolve 处理程序
let p2 = p1.then();
setTimeout(console.log, 0, p2); // Promise <fulfilled>: foo

// 这些都一样
let p3 = p1.then(() => undefined);
let p4 = p1.then(() => {});
let p5 = p1.then(() => Promise.resolve());

setTimeout(console.log, 0, p3); // Promise <fulfilled>: undefined
setTimeout(console.log, 0, p4); // Promise <fulfilled>: undefined
setTimeout(console.log, 0, p5); // Promise <fulfilled>: undefined

// 这些都一样
let p6 = p1.then(() => "bar");
let p7 = p1.then(() => Promise.resolve("bar"));

setTimeout(console.log, 0, p6); // Promise <fulfilled>: bar
setTimeout(console.log, 0, p7); // Promise <fulfilled>: bar

// Promise.resolve() 幂等性
let p8 = p1.then(() => new Promise(() => {}));
let p9 = p1.then(() => Promise.reject());
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p8); // Promise <pending>
setTimeout(console.log, 0, p9); // Promise <rejected>: undefined
```

**Promise.prototype.catch()**

`Promise.prototype.catch()` 方法用于给 Promise 添加拒绝处理程序。这个方法只接收一个参数：onRejected 处理程序。

事实上，这个方法就是一个语法糖，调用它就相当于调用 `Promise.prototype.then(null, onRejected)`。所以，该方法会返回一个新的 Promise 实例。

**Promise.prototype.finally()**

`Promise.prototype.finally()` 方法用于给 Promise 添加 onFinally 处理程序，这个处理程序在 Promise 落定为 fulfilled 或 rejected 状态时都会执行。该方法可以避免 onResolved 和 onRejected 处理程序中出现冗余代码。但 onFinally 处理程序没有办法知道 Promise 的状态是 fulfilled 还是 rejected。该方法会返回一个新的 Promise 实例。

#### Promise 特性

##### 非重入 Promise 的方法

当 Promise 进入落定状态时，与该状态相关的处理程序仅仅会被排期，而非立即执行。跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之前先执行。即使 Promise 一开始就是与附加处理程序关联的状态，执行顺序也是这样的。

这个特性由 JavaScript 运行时保证，被称为 "非重入" (non-reentrancy) 特性。下面的例子演示了这个特性：

```javascript
// 创建解决的 Promise
let p = Promise.resolve();

// 添加解决处理程序
// 直觉上，这个处理程序会等 Promise 一解决就执行
p.then(() => console.log("onResolved handler"));

// 同步输出，证明 then() 已经返回
console.log("then() returns");

// 实际的输出：
// then() returns
// onResolved handler
```

##### 邻近处理程序的执行顺序

如果给 Promise 添加了多个处理程序，当 Promise 状态变化时，相关处理程序会按照添加它们的顺序依次执行。无论是 then()、catch() 还是 finally() 添加的处理程序都是如此。

```javascript
let p1 = Promise.resolve();
let p2 = Promise.reject();

p1.then(() => console.log(1));
p1.then(() => console.log(2));

p2.catch(() => console.log(3));
p2.catch(() => console.log(4));

p1.finally(() => console.log(5));
p1.finally(() => console.log(6));

// 1
// 2
// 3
// 4
// 5
// 6
```

##### 传递解决值和拒绝理由

到了落定状态后，如果是 fulfilled 状态会提供其解决值；如果是 rejected 状态会提供其拒绝理由，解决值或拒绝理由会给到相应状态的处理程序。

在执行函数中，解决值和拒绝理由是分别作为 resolve() 和 reject() 的唯一参数传递。然后，这些值又会传给他们各自的处理程序，作为 onResolved 或 onRejected 处理程序接收的唯一参数。下面的例子展示了上述传递过程：

```javascript
let p1 = new Promise((resolve, reject) => resolve("foo"));
p1.then((value) => console.log(value)); // foo

let p2 = new Promise((resolve, reject) => reject("bar"));
p2.catch((reason) => console.log(reason)); // bar
```

`Promise.resolve()` 和 `Promise.reject()` 在被调用时就会接收解决值和拒绝理由。同样地，它们返回的 Promsie 也会像执行器函数一样把这些值传给 onResolved 或 onRejected 处理程序：

```javascript
let p1 = Promise.resolve("foo");
p1.then((value) => console.log(value)); // foo

let p2 = Promise.reject("bar");
p2.catch((reason) => console.log(reason)); // bar
```

##### rejected 状态的 Promise 与错误处理

rejected 状态的 Promise 类似于 throw 表达式，它们都代表一种程序状态，即需要中断或者特殊处理。

在 Promise 的执行函数或处理程序中，如果抛出错误会导致 Promise 落定为 rejected 状态，并且抛出的错误值会成为 Promise 的拒绝理由。例如：

```javascript
let p1 = new Promise((resolve, reject) => reject(Error("foo")));
let p2 = new Promise((resolve, reject) => {
  throw Error("foo");
});
let p3 = Promise.resolve().then(() => {
  throw Error("foo");
});
let p4 = Promise.reject(Error("foo"));

setTimeout(console.log, 0, p1); // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p2); // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p3); // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p4); // Promise <rejected>: Error: foo

// Uncaught (in promise) Error: foo
// Uncaught (in promise) Error: foo
// Uncaught (in promise) Error: foo
// Uncaught (in promise) Error: foo
```

在上述例子中，无论是在执行函数还是在处理程序中抛出错误，都不会阻止 JavaScript 运行时继续执行同步指令。这是因为：

- 在执行函数中抛出错误，内部其实做了 `try/catch` 处理。在 catch 语句块中，会把抛出的错误值作为 reject() 的参数调用，同时将错误放进消息队列中异步抛出。
- 在处理程序中抛出错误，错误实际上是从消息队列中异步抛出的。

正因为如此，异步错误只能通过异步的 onRejected 处理程序捕获，不能通过同步的 `try/catch` 捕获：

```javascript
// 正确
Promise.reject(Error("foo")).catch((e) => {});

// 不正确
try {
  Promise.reject(Error("foo"));
} catch (e) {}
```

### 异步函数

异步函数，也称为 "async/await" (语法关键字)，是 ES6 Promise 模式在 ECMAScript 函数中的应用。async/await 是 ES8 规范新增的。这个特性从行为和语法上都增强了 JavaScript，让以同步方式写的代码能够异步执行。

#### Promise 异步编程模式的缺陷

下面来看一个最简单的例子，这个 Promise 在超时之后会落定为 fulfilled：

```javascript
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
```

如果其他代码要使用这个结果值，则需要写一个 onResolved 处理程序：

```javascript
p.then((x) => console.log(x)); // 3
```

这其实并不好，因为必须把逻辑连贯的代码拆分到 Promise 的处理程序中。

#### 异步函数

ES8 的 async/await 关键字旨在解决异步结构组织代码的问题。

##### async

async 关键字用于声明异步函数。这个关键字可以用在函数声明、函数表达式、箭头函数和方法上：

```javascript
async function foo() {}
let bar = async function () {};
let baz = async () => {};
class Qux {
  async qux() {}
}
```

异步函数的 return 值会被 `Promise.resolve()` 包装成一个 Promise 对象，即异步函数始终返回 Promise 对象。例如：

```javascript
async function foo() {
  console.log(1);
  return 3;
}

// 给返回的 Promise 添加一个 onResolved 处理程序
foo().then(console.log);

console.log(2);

// 1
// 2
// 3
```

异步函数与 Promise 一样，在异步函数中抛出错误会返回 rejected 状态的 Promise：

```javascript
async function foo() {
  console.log(1);
  throw 3;
}

// 给返回的 Promise 添加一个 onRejected 处理程序
foo().catch(console.log);
console.log(2);

// 1
// 2
// 3
```

##### await

因为异步函数主要针对不会马上完成的任务，所以自然需要一种暂停和恢复执行的能力。使用 await 关键字可以暂停异步函数代码的执行，等待 Promise 落定状态。

使用 Promise 异步编程模式：

```javascript
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
p.then((x) => console.log(x)); // 3
```

使用 async/await 可以写成这样：

```javascript
async function foo() {
  let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
  console.log(await p); // 3
}

foo();
```

await 关键字会暂停执行异步函数后面的代码，让出 JavaScript 运行时的执行线程。这个行为与生成器函数中的 yield 关键字是一样的。

await 关键字和 Promise 执行器函数/`Promise.prototype.then()` 方法类似，await 的目标有以下几类：

- 实现 thenable 接口的对象，比如 Promise：
  - pending 状态的 Promise 实例，等待落定。
  - fulfilled 状态的 Promise 实例，它的解决值就是等待的结果值，同时恢复暂停的运行时。
  - rejected 状态的 Promise 实例，它的拒绝理由就是等待的结果值，同时恢复暂停的运行时，并同步抛出错误 (拒绝理由)。
- 其他常规的值，比如：原始值、普通对象。这个值就是等待的结果值，同时恢复暂停的运行时。
- 抛出错误的同步操作，比如：`await function() {throw 3;}()`，抛出的错误值就是等待的结果，同时恢复暂停的运行时，并同步抛出错误值。

下面的代码演示了这些情况：

```javascript
// await 一个原始值
async function foo() {
  console.log(await "foo"); // foo
}
foo();

// await 一个没有实现 thenable 接口的对象
async function bar() {
  console.log(await ["bar"]); // ['bar']
}
bar();

// await 一个实现了 thenable 接口的非 Promise 对象
async function baz() {
  const thenable = {
    then(callback) {
      callback("baz");
    },
  };
  console.log(await thenable); // baz
}
baz();

// await 一个 fulfilled 状态的 Promise
async function qux() {
  console.log(await Promise.resolve("qux")); // qux
}
qux();
```

await 抛出错误的同步操作，如果异步函数不进行 `try/catch` 处理，就会返回 rejected 状态的 Promise，抛出的错误值作为其拒绝理由：

```javascript
async function foo() {
  console.log(1);
  // await 一个抛出错误的同步操作
  await (function () {
    throw 3;
  })();
  console.log(4); // 这行代码不会执行
}

// 给返回的 Promise 添加一个 onRejected 处理程序
foo().catch(console.log);
console.log(2);

// 1
// 2
// 3
```

await 一个 rejected 状态的 Promise 实例，如果异步函数不进行 `try/catch` 处理，就会返回新的 rejected 状态的 Promise，await 目标的拒绝理由会作为其拒绝理由：

```javascript
async function foo() {
  console.log(1);
  // await 一个 rejected 状态的 Promise 实例
  await Promise.reject(3);
  console.log(4); // 这行代码不会执行
}

// 给返回的 Promise 添加一个 onRejected 处理程序
foo().catch(console.log);
console.log(2);

// 1
// 2
// 3
```

**停止和恢复执行**

async/await 中，真正起到控制执行时停止和恢复执行是 await。

async 关键字不会影响程序的执行顺序。例如：

```javascript
async function foo() {
  console.log(2);
}

console.log(1);
foo();
console.log(3);

// 1
// 2
// 3
```

JavaScript 运行时在碰到 await 关键字时，会记录在哪里暂停执行。等待 await 右边的值可用了，JavaScript 运行时会向消息队列中推送一个任务，这个任务会恢复异步函数的执行。因此，即使 await 后面跟着一个立即可用的值，函数的其余部分也会被异步求值。下面的例子演示了这一点：

```javascript
async function foo() {
  console.log(2);
  console.log(await Promise.resolve(6));
  console.log(7);
}

async function bar() {
  console.log(4);
  console.log(await 8);
  console.log(9);
}

console.log(1);
foo();
console.log(3);
bar();
console.log(5);

// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
```
