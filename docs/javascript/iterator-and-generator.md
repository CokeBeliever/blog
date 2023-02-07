# 迭代器和生成器

## 历史

**ECMAScript 3**

在 ECMAScript 3，如果想要迭代对象，就必须知道该对象内部的数据结构。例如，迭代数组对象，使用者必须知道数组对象存在一个 length 属性，它记录了数组对象中元素的数量，这个属性在迭代时会使用到。对于数组这种常见数据类型来说可能还可以接受，但是对于一些少见的或自定义的数据类型来说，必须先知道其内部的数据结构，才能进行迭代，这种现状并不理想。来看下面的例子：

```js
let collection = ["foo", "bar", "baz"];

for (let index = 0; index < collection.length; ++index) {
  console.log(index, collection[index]);
}
// 0 'foo'
// 1 'bar'
// 2 'baz'
```

每次迭代数组对象都需要编写类似上面的代码，虽然这种方式具有较高的灵活性和普适性，但是具有较低的易用性和可维护性，而且迭代需要知道数据结构。

**ECMAScript 5**

在 ECMAScript 5，数组新增了 Array.prototype.forEach() 方法，用于迭代数组：

```js
let collection = ["foo", "bar", "baz"];

collection.forEach((item, index) => console.log(index, item));
// 0 'foo'
// 1 'bar'
// 2 'baz'
```

每次迭代数组对象只需要调用 `forEach()` 方法，虽然这种方式具有较高的易用性和可维护性，而且迭代不需要知道数据结构，但是具有较低的灵活性和普适性。

- 较低的灵活性，无法提前终止迭代。例如，无法通过 `break`、`continue`、`return` 或 `throw` 等语句来控制当前上下文的程序流；
- 较低的普适性，只适用于数组类型，回调结构也比较笨拙。

**ECMAScript 6**

在 ECMAScript 6，为了兼并灵活性、易用性、可维护性、和普适性，新增了两个高级特性：迭代器模式和生成器。使用这两个特性，能够更清晰、高效、方便地实现迭代。

ECMAScript 6 还提供了 `for-of` 等原生语言特性，用来 "消费" 迭代器提供的逻辑，使得我们无需关注数据类型内部的数据结构，就可以简单的迭代，而且语法简单：

```js
let arr = [1, 2, 3];
for (let item of arr) {
  console.log(item);
}
// 1
// 2
// 3
```

综上所述，可以总结出下面的表格：

| 迭代方式     | 灵活性             | 易用性             | 可维护性           | 普适性             | 迭代要知道数据结构吗 |
| ------------ | ------------------ | ------------------ | ------------------ | ------------------ | -------------------- |
| for 循环     | :star::star::star: | :star:             | :star:             | :star::star::star: | YES                  |
| forEach 方法 | :star:             | :star::star::star: | :star::star::star: | :star:             | NO                   |
| for-of 循环  | :star::star:       | :star::star::star: | :star::star::star: | :star::star::star: | NO                   |

## 迭代器模式

迭代器模式描述了一个方案，即可以把有些数据结构称为 "可迭代对象"。

### 可迭代 (Iterable) 接口

在 ECMAScript 6 规范描述了 "可迭代对象"，即可迭代对象必须实现可迭代 (Iterable) 接口。实现可迭代接口必须暴露一个属性作为 "默认迭代器"，而且这个属性必须使用特殊的 `Symbol.iterator` 作为键，属性的值必须引用一个迭代器工厂函数，调用这个函数必须返回一个新的迭代器 (Iterator)。

用 TypeScript 描述 Iterable 接口，如下所示：

```typescript
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}
```

很多内置数据类型都实现了 Iterable 接口，例如：

- String 字符串
- Array 数组
- Map 映射
- Set 集合
- NodeList 等 DOM 集合类型

```js
let str = "abc";
let arr = ["a", "b", "c"];
let map = new Map().set("a", 1).set("b", 2).set("c", 3);
let set = new Set().add("a").add("b").add("c");
let els = document.querySelectorAll("div");

// 这些类型都实现了迭代器工厂函数
console.log(str[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log(arr[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log(map[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log(set[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log(els[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }

// 调用这个函数会生成一个迭代器
console.log(str[Symbol.iterator]()); // StringIterator {}
console.log(arr[Symbol.iterator]()); // Array Iterator {}
console.log(map[Symbol.iterator]()); // MapIterator {}
console.log(set[Symbol.iterator]()); // SetIterator {}
console.log(els[Symbol.iterator]()); // Array Iterator {}
```

实际写代码过程中，很多时候并不需要显式地调用可迭代对象的迭代器工厂函数来创建迭代器。从 ECMAScript 6 起提供了很多支持接收可迭代对象或迭代器的原生语言特性：

- for-of 循环
- 数组解构
- 扩展操作符
- Array.from()
- 创建 Set 集合
- 创建 Map 映射
- Promise.all() 接收由 Promise 组成的可迭代对象
- Promise.race() 接收由 Promise 组成的可迭代对象
- `yield*` 操作符，在生成器中使用

这些原生语言特性会在底层调用可迭代对象的迭代器工厂函数来创建一个迭代器，从而进行迭代可迭代对象：

```js
let arr = ["foo", "bar", "baz"];

// for-of 循环
for (let el of arr) {
  console.log(el);
}
// foo
// bar
// baz

// 数组解构
let [a, b, c] = arr;
console.log(a, b, c); // foo, bar, baz

// 扩展操作符
let arr2 = [...arr];
console.log(arr2); // ['foo', 'bar', 'baz']

// Array.from()
let arr3 = Array.from(arr);
console.log(arr3); // ['foo', 'bar', 'baz']

// Set 构造函数
let set = new Set(arr);
console.log(set); // Set(3) { 'foo', 'bar', 'baz' }

// Map 构造函数
let pairs = arr.map((x, i) => [x, i]);
console.log(pairs); // [['foo', 0], ['bar', 1], ['baz', 2]]
let map = new Map(pairs);
console.log(map); // Map(3) { 'foo' => 0, 'bar' => 1, 'baz' => 2 }
```

### 迭代器 (Iterator) 接口

迭代器 (Iterator) 是按需创建的一次性对象，用于迭代与其关联的可迭代对象。

用 TypeScript 描述 iterator 接口，如下所示：

```typescript
/**
 * 迭代器结果接口
 */
interface IteratorResult<T> {
	done: boolean;
  value?: T | undefined;
}

/**
 * 迭代器接口
 */
interface Iterator<T> {
  /** 获取下一个迭代器结果 **/
  next(): IteratorResult<T>;
  /** 提前终止迭代器 **/
  return()?: IteratorResult<T>;
}
```

**next() 方法**

必需的 next() 方法用于在可迭代对象中迭代数据。每次成功调用 next()，都会返回一个 IteratorResult 对象。IteratorResult 包含两个属性：done 和 value。done 是一个布尔值，表示是否还可以再次调用 next() 取得下一个值；value 包含可迭代对象的下一个值，当 done 为 `true` 时，value 为 `undefined`。可以通过以下简单的数组来演示：

```js
// 可迭代对象
let arr = ["foo", "bar"];

// 迭代器工厂函数
console.log(arr[Symbol.iterator]); // f values() { [native code] }

// 迭代器
let iter = arr[Symbol.iterator]();
console.log(iter); // ArrayIterator {}

// 迭代执行
console.log(iter.next()); // { done: false, value: 'foo' }
console.log(iter.next()); // { done: false, value: 'bar' }
console.log(iter.next()); // { done: true, value: undefined }
console.log(iter.next()); // { done: true, value: undefined }
```

**return() 方法**

可选的 return() 方法用于在迭代器提前关闭时执行的逻辑。原生语言特性在发现还有更多元素可以迭代，但不会继续迭代时，会自动调用 return() 方法。可能的情况包括：

- for-of 循环通过 `break`、`continue`、`return` 或 `throw` 提前退出；
- 解构操作并未 "消费" 所有值。

return() 方法返回一个有效的 IteratorResult 对象。简单情况下，可以只返回 `{ done: true }`。

来看一个计数器的例子，如下所示：

```js
class Counter {
  constructor(limit) {
    this.limit = limit;
  }

  [Symbol.iterator]() {
    let count = 1,
      limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true };
        }
      },

      return() {
        console.log("Exiting early");
        return { done: true };
      },
    };
  }
}

let counter = new Counter(5);

for (let i of counter) {
  if (i > 2) break;
  console.log(i);
}
// 1
// 2
// Exiting early
```

## 生成器 (generator)

生成器是 ECMAScript 6 新增的一个极为灵活的结构，拥有在一个函数块内暂停和恢复代码执行的能力。这种新能力具有深远的影响。比如，使用生成器可以自定义迭代器和实现协程。

### 生成器基础

生成器 (generator) 是由生成器函数 (生成器工厂函数) 返回的对象。在函数名称前面加一个星号 (`*`) 表示它是一个生成器函数。

除了箭头函数，只要是可以定义函数的地方，就可以定义生成器函数。如下所示：

```js
// 生成器函数声明
function* generatorFn() {}

// 生成器函数表达式
let generatorFn = function* () {};

// 作为对象字面量方法的生成器函数
let foo = {
  *generatorFn() {},
};

// 作为类实例方法的生成器函数
class Foo {
  *generatorFn() {}
}

// 作为类静态方法的生成器函数
class Bar {
  static *generatorFn() {}
}
```

标识生成器函数的星号不受两侧空格的影响：

```js
// 等价的生成器函数：
function* generatorFnA() {}
function* generatorFnB() {}
function* generatorFnC() {}

// 等价的生成器方法
class Foo {
  *generatorFnD() {}

  *generatorFnE() {}
}
```

调用生成器函数会产生一个生成器对象。生成器对象一开始处于暂停执行 (suspended) 的状态。与迭代器相似，**生成器对象也实现了 Iterator 接口**，因此具有 next() 方法。调用这个方法会让生成器开始或恢复执行。

```js
function* generatorFn() {}

const g = generatorFn();

console.log(g); // generatorFn {<suspended>}
console.log(g.next); // f next() { [native code] }
```

next() 方法的返回值类似于迭代器，有一个 done 属性和一个 value 属性。函数体为空的生成器函数中间不会停留，调用一次 next() 就会让生成器到达 `done: true` 状态。

```js
function* generatorFn() {}

let generatorObject = generatorFn();

console.log(generatorObject); // generatorFn { <suspended> }
console.log(generatorObject.next()); // { done: true, value: undefined }
```

value 属性是生成器函数的返回值，默认值为 `undefined`，可以通过生成器函数的返回值指定：

```js
function* generatorFn() {
  return "foo";
}

let generatorObject = generatorFn();

console.log(generatorObject); // generatorFn { <suspended> }
console.log(generatorObject.next()); // { done: true, value: 'foo' }
```

生成器函数只会在初次调用 next() 方法后开始执行，如下所示：

```js
function* generatorFn() {
  console.log("foobar");
}

// 初次调用生成器函数并不会打印日志
let generatorObject = generatorFn();

generatorObject.next(); // foobar
```

**生成器对象实现了 Iterable 接口**，它们默认的迭代器是自引用的：

```js
function* generatorFn() {}

console.log(generatorFn);
// f* generatorFn() {}
console.log(generatorFn()[Symbol.iterator]);
// f [Symbol.iterator]( ) { native code }
console.log(generatorFn());
// generatorFn ( <suspended> )
console.log(generatorFn()[Symbol.iterator]());
// generatorFn { <suspended> }

const g = generatorFn();

console.log(g === g[Symbol.iterator]());
// true
```

### 通过 yield 中断执行

yield 关键字可以让生成器停止和开始执行，也是生成器最有用的地方。生成器函数在遇到 yield 关键字之前会正常执行。遇到这个关键字后，执行会停止，函数作用域的状态会被保留。停止执行的生成器函数只能通过在生成器对象上调用 next() 方法来恢复执行：

```js
function* generatorFn() {
  yield;
}

let generatorObject = generatorFn();

console.log(generatorObject.next()); // { done: false, value: undefined }
console.log(generatorObject.next()); // { done: true, value: undefined }
```

此时的 yield 关键字有点像函数的中间返回语句，它生成的值会出现在 next() 方法返回的对象的 value 属性。

通过 yield 关键字退出的生成器函数会处在 `done: false` 状态；通过 return 关键字退出的生成器函数会处于 `done: true` 状态。

```js
function* generatorFn() {
  yield "foo";
  yield "bar";
  return "baz";
}

let generatorObject = generatorFn();

console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next()); // { done: false, value: 'bar' }
console.log(generatorObject.next()); // { done: true, value: 'baz' }
```

#### 生成器对象作为可迭代对象

因为生成器对象实现了 Iterable 接口和 Iterator 接口，所以它可以在支持接收可迭代对象或迭代器的原生语言特性中使用：

```js
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}

for (const x of generatorFn()) {
  console.log(x);
}
// 1
// 2
// 3
```

#### yield 可迭代对象

可以使用星号增强 yield 的行为，让它能够迭代一个可迭代对象，从而一次产出一个值：

```js
// 等价的 generatorFn
// function* generatorFn() {
//    for (const x of [1, 2, 3]) {
//        yield x;
//    }
// }

function* generatorFn() {
  yield* [1, 2, 3];
}

let generatorObject = generatorFn();

for (const x of generatorObject) {
  console.log(x);
}
// 1
// 2
// 3
```

与生成器函数的星号类似，yield 星号两侧的空格不影响其行为：

```js
function* generatorFn() {
  yield* [1, 2];
  yield* [3, 4];
  yield* [5, 6];
}

for (const x of generatorFn()) {
  console.log(x);
}
// 1
// 2
// 3
// 4
// 5
// 6
```

### 生成器对象作为默认迭代器

因为调用生成器函数会返回一个生成器对象，而且生成器对象实现了 Iterable 接口，所以生成器函数格外适合作为默认迭代器。下面是一个简单的例子：

```js
class Foo {
  constructor() {
    this.values = [1, 2, 3];
  }
  *[Symbol.iterator]() {
    yield* this.values;
  }
}

const f = new Foo();
for (const x of f) {
  console.log(x);
}
// 1
// 2
// 3
```
