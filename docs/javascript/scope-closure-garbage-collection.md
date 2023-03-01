# 作用域 + 闭包 + 垃圾回收

## 定义变量

在 JavaScript 中，定义变量的方式有 4 种：

```javascript
// 通过 var、let、const 定义变量
var num1 = 1;
let num2 = 2;
const num3 = 3;

// 通过 function 定义变量，等价于 var fn = function() {}
function fn() {}
```

可以看到，变量可以通过 var、let、const 以及 function 关键字定义。

## 执行上下文与作用域

### 执行上下文

执行上下文 (以下简称 "上下文") 的概念在 JavaScript 中是颇为重要的。上下文决定了代码可以访问哪些数据，以及它们的行为。

在 JavaScript 中，上下文可分为 3 种：

- 全局上下文：全局上下文是最外层的上下文。​​ 根据 ECMAScript 实现的宿主环境，全局上下文中的变量可能并不一样。例如：浏览器环境的全局上下文中有 window 变量，而 Node.js 环境没有。
- 函数上下文：每个函数的调用都有自己的上下文。在函数执行之前，上下文栈会推入该函数的上下文；在函数执行之后，上下文栈会弹出该函数的上下文，将控制权返还给之前的上下文。ECMAScript 程序的执行流就是通过这个上下文栈进行控制的。
- 块级上下文：每个代码块的执行都有自己的上下文，这是从 ES6 开始的概念。代码块通常指的是花括号 `{}` 内的区域，比如：if 语句、for 语句。
  - 在 ES6 之前，定义变量的方式只有 var 和 function，它们所定义的变量保存在当前上下文的变量对象中，当前上下文可以是：全局上下文、函数上下文。如果在块级上下文中定义变量，那么会保存在该上下文之外的第一个的全局或函数上下文的变量对象中。
  - 从 ES6 起，定义变量的方式新增了 let 和 const，它们所定义的变量保存在当前上下文的变量对象中，当前上下文可以是：全局上下文、函数上下文、块级上下文。

### 变量对象

每个上下文都有一个关联的变量对象 (variable object)，这个上下文中定义的所有变量都存在于这个对象上。虽然无法通过代码访问变量对象，但后台处理数据会用到它。

根据不同的上下文，变量对象可分为 3 种：

- 全局上下文的变量对象：它在代码执行期间始终存在，除非关闭网页或退出浏览器。
- 函数上下文的变量对象：它只在函数执行期间存在，除非发生闭包。它其实就是函数的活动对象 (activation object)，活动对象中最初只定义 arguments 和其他命名参数。
- 块级上下文的变量对象：它只在代码块执行期间存在，除非发生闭包。

### 作用域和作用域链

作用域 (scope) 指的是该上下文关联的变量对象。

作用链 (scope chain) 指的是该上下文到全局上下文的所有作用域的集合。

在访问变量时，会在当前上下文的作用域链中寻找，当前上下文的变量对象始终在作用域链的最前端，全局上下文的变量对象始终在作用域链的最后端，从前往后逐级寻找。如果没有找到，那么通常会报错。

通过作用域链，在内部上下文中的代码可以访问外部上下文的变量。例如：

```javascript
// 全局上下文
let color = "blue";

function fn() {
  // 函数上下文
  let anotherColor = "red";
  // 可以访问 anotherColor、color、fn
  console.log("函数上下文", anotherColor, color, fn);

  {
    // 块级上下文
    let tempColor = "green";
    // 可以访问 tempColor、anotherColor、color、fn
    console.log("块上下文", tempColor, anotherColor, color, fn);
  }
}

// 可以访问 color、fn
console.log("全局上下文", color, fn);
fn();
```

对这个例子而言，函数 fn() 的作用域链包含两个变量对象：一个是它自己的变量对象，另一个是全局上下文的变量对象。这个函数内部其实并没有定义 color，之所以能够访问到 color，是因为沿着作用域链在全局作用域中找到它。

以上代码涉及 3 个上下文：

- 全局上下文：有一个变量 color 和一个函数 fn()。
- fn() 函数上下文：有一个变量 anotherColor，在该上下文中可以访问到全局上下文中的变量和函数。
- 块级上下文：有一个变量 tempColor，在该上下文中可以访问全局和 fn() 函数上下文中的变量和函数。

此外，在内部上下文中定义的变量可覆盖外部上下文中的同名变量。例如：

```javascript
let color = "blue";

function fn() {
  let color = "red";
  console.log(color); // "red"

  {
    let color = "green";
    console.log(color); // "green"
  }
}

console.log(color); // "blue"
fn();
```

## 闭包

闭包 (closure) 指的是那些引用了另一个函数或代码块作用域的函数，通常是在嵌套函数中实现的。

代码块嵌套函数，产生闭包：

```javascript
let fn;
{
  let num1 = 1;
  fn = function () {
    console.log(`num1: ${num1}`);
  };
}
```

函数嵌套函数，产生闭包：

```javascript
function createComparisonFunction(propertyName) {
  return function (object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

let compareAges = createComparisonFunction("age");
```

在这个内部函数 (匿名函数) 被返回并在其他上下文中引用时，就产生闭包。这是因为内部函数的作用域链中包含外部函数 (createComparisonFunction) 的作用域，导致外部函数虽然已执行完毕，但是它的作用域无法被垃圾回收。

### 产生闭包

理解作用域链创建和使用的细节对理解闭包非常重要：

- 在定义函数时：
  1. 获取定义函数处上下文的作用域链；
  2. 将该作用域链保存在函数内部属性 `[[Scopes]]` 中；
- 在调用函数时：
  1. 创建函数的上下文；
  2. 复制函数内部属性 `[[Scopes]]` 来创建其作用域链；
  3. 创建函数的变量对象 (活动对象)，并推入到作用域链的最前端；(:pushpin:外部函数或代码块的变量对象其实就在创建函数作用域链上的第二个变量对象，这个作用域链一直向外串起了所有包含函数或代码块的变量对象，直到全局上下文。)

可以运行下面代码，看到函数的 `[[Scopes]]`：

```javascript
console.dir(compareAges);
```

继续上面的例子：

```javascript
// 在定义函数时：createComparisonFunction 函数的 [[Scopes]] 包含全局上下文的作用域
function createComparisonFunction(propertyName) {
  // 在定义函数时：匿名函数的 [[Socpes]] 包含 createComparisonFunction 函数和全局上下文的作用域
  return function (object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

// 在调用函数时：
// 调用 createComparisonFunction 函数返回内部函数，保存在 compareAges 变量
// compareAge 是全局上下文的变量，它在代码执行期间始终存在，而 compareAge 的 [[Scopes]] 又包含 createComparisonFunction 函数的作用域，产生闭包。
let compareAges = createComparisonFunction("age");
```

可以看到，虽然 createComparisonFunction 函数已经执行结束了，但是返回的内部函数会保存在全局上下文的 compareAge 变量，而内部函数的 `[[Scopes]]` 始终包含 createComparisonFunction 函数上下文的作用域，产生闭包。

### 消除闭包

我们知道在另一个函数或代码块内定义函数时，内部函数会把外部函数或代码块的作用域 (变量对象) 添加到自己的作用域链中。因此，只要内部函数在其他上下文存在，就会产生闭包，换句话说，消除闭包的方式就是让该内部函数在其他上下文中不存在。例如：

```javascript
function createComparisonFunction(propertyName) {
  return function (object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

// 产生闭包
let compareAges = createComparisonFunction("age");

// 调用函数
let result = compareAges(
  { name: "Nicholas", age: 47 },
  { name: "Matt", age: 32 }
);

// 消除闭包
// 解除对函数的引用，让垃圾回收程序回收返回的内部函数，这样就可以消除闭包
compareAges = null;
```

这里，返回的内部函数被保存在变量 compareAges 中。把 compareAges 设置为 null 会解除对函数的引用，从而让垃圾回收程序可以将内存释放掉。返回的内部函数被销毁了，内部函数的 `[[Scopes]]` 也就被销毁了，其他作用域 (除全局作用域之外) 也就可以销毁了。

## 垃圾回收

JavaScript 是使用垃圾回收的语言，也就是说执行环境负责在代码执行时自动管理内存。这使得开发者不需要像 C/C++ 程序员那样在编写代码的过程中时刻关注内存的分配和释放问题。

### 标记清除

JavaScript 最常用的垃圾回收策略是标记清理 (mark-and-sweep、mark-sweep)。

标记清除策略在垃圾回收程序运行的时候，会标记内存中存储的所有变量 (记住，标记方法有很多种)。然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉。在此之后再被加上标记的变量就是待删除的了，原因是任何在上下文中的变量都访问不到它们了。随后垃圾回收程序做一次内存清理，销毁带标记的所有值并收回它们的内存。

### 引用计数

另一种不常用的垃圾回收策略是引用计数 (reference counting)。

引用计数策略是对每个值都记录它被引用的次数。声明变量并给它赋一个引用值时，这个值的引用数为 1。如果同一个值又被赋给另一个变量，那么引用数加 1。类似地，如果保存对该值引用的变量被其他值给覆盖了，那么引用数减 1。当一个值的引用数为 0 时，就说明没办法再访问到这个值了，因此可以安全地收回其内存了。垃圾回收程序下次运行的时候就会释放引用数为 0 的值的内存。

引用计数最早由 Netscape Navigator 3.0 采用，但很快就遇到了严重的问题：循环引用。所谓循环引用，就是对象 A 有一个指针指向对象 B，而对象 B 也引用了对象 A。比如：

```javascript
function problem() {
  let objectA = new Object();
  let objectB = new Object();

  objectA.someOtherObject = objectB;
  objectB.anotherObject = objectA;
}
```

在这个例子中，objectA 和 objectB 通过各自的属性相互引用，意味着它们的引用数都是 2。在标记清除策略下，这不是问题，因为在函数结束后，这两个对象都不在作用域中。而在引用计数策略下，objectA 和 objectB 在函数结束后还会存在，因为它们的引用数永远不会变成 0。如果函数被多次调用，则会导致大量内存永远不会被释放。

### V8 的垃圾回收

很多浏览器和 Node.js (以下简称 "Node") 都是构建在 V8 引擎之上，这就不得不说 V8 的垃圾回收。

V8 的垃圾回收策略主要基于分代式垃圾回收机制。在自动垃圾回收的演变过程中，人们发现没有一种垃圾回收算法能够胜任所有的场景。因为在实际的应用中，对象的生存周期长短不一，不同的算法只能针对特定情况具有最好的效果。为此，统计学在垃圾回收算法的发展中产生了较大的作用，现代的垃圾回收算法中按对象的存活时间将内存的垃圾回收进行不同的分代，然后分别对不同分代的内存施以更高效的算法。

在 V8 中，主要将内存分为新生代和老生代两代。新生代中的对象为存活时间较短的对象，老生代中的对象为存活时间较长或常驻内存的对象。因此，V8 内存的整体大小就是新生代的内存空间加上老生代的内存空间。

#### Scavenge 算法

在分代的基础上，新生代中的对象主要通过 Scavenge 算法进行垃圾回收。在 Scavenge 的具体实现中，主要采用了 Cheney 算法。

Cheney 算法是一种采用复制的方式实现的垃圾回收算法。它将堆内存一分为二，每一部分空间称为 semispace。在这两个 semispace 空间中，只有一个处于使用中，另一个处于闲置状态。处于使用状态的 semispace 空间称为 From 空间，处于闲置状态的空间称为 To 空间。当我们分配对象时，先是在 From 空间中进行分配。当开始进行垃圾回收时，会检查 From 空间中的存活对象，这些存活对象将被复制到 To 空间中，而非存活对象占用的空间将会被释放。完成复制后，From 空间和 To 空间的角色发生对换。简而言之，在垃圾回收的过程中，就是通过将存活对象在两个 semispace 空间之间进行复制。

Scavenge 的缺点是只能使用堆内存中的一半，这是由划分空间和复制机制所决定的。但 Scavenge 由于只复制存活的对象，并且对于生命周期短的场景存活对象只占少部分，所以它在时间效率上有优异的表现。

由于 Scavenge 是典型的牺牲空间换取时间的算法，所以无法大规模地应用到所有的垃圾回收中。但可以发现，Scavenge 非常适合应用在新生代中，因为新生代中对象的生命周期较短，恰恰适合这个算法。

**晋升**

当一个对象经过多次复制依然存活时，它将会被认为是生命周期较长的对象。这种较长生命周期的对象随后会被移动到老生代中，采用新的算法进行管理。对象从新生代中移动到老生代中的过程称为晋升。

在单纯的 Scavenge 过程中，From 空间中的存活对象会被复制到 To 空间中去，然后对 From 空间和 To 空间进行角色对换 (又称翻转)。但在分代式垃圾回收的前提下，From 空间中的存活对象在复制到 To 空间之前需要进行检查。在一定条件下，需要将存活周期长的对象移动到老生代中，也就是完成对象晋升。

对象晋升的条件主要有两个：

- 一个是对象是否经历过 Scavenge 回收。在默认情况下，V8 的对象分配主要集中在 From 空间中。对象从 From 空间中复制到 To 空间时，会检查它的内存地址来判断这个对象是否已经经历过一次 Scavenge 回收。如果已经经历过了，会将该对象从 From 空间复制到老生代空间中，如果没有，则复制到 To 空间中。
- 一个是 To 空间的内存占用比超过限制。当要从 From 空间复制一个对象到 To 空间时，如果 To 空间已经使用了超过 25%，则这个对象直接晋升到老生代空间中。设置 25% 这个限制值的原因是当这次 Scavenge 回收完成后，这个 To 空间将变成 From 空间，接下来的内存分配将在这个空间中进行。如果占比过高，会影响后续的内存分配。

对象晋升后，将会在老生代空间中作为存活周期较长的对象来对待，接受新的回收算法处理。

#### Mark-Sweep & Mark-Compact

对于老生代中的对象，由于存活对象占较大比重，再采用 Scavenge 当方式会有两个问题：一个是存活对象较多，复制存活对象的效率将会很低；另一个问题依然是浪费一半空间的问题。这两个问题导致应对生命周期较长的对象时 Scavenge 会显得捉襟见肘。为此，V8 在老生代中主要采用了 Mark-Sweep 和 Mark-Compact 相结合的方式进行垃圾回收。

**Mark-Sweep**

Mark-Sweep 是标记清除的意思，它分为标记和清除两个阶段。与 Scavenge 相比，Mark-Sweep 并不将内存空间划分为两半，所以不存在浪费一半空间的行为。与 Scavenge 复制活着的对象不同，Mark-Sweep 在标记阶段遍历堆中的所有对象，并标记活着的对象，在随后的清除阶段中，只清除没有被标记的对象。可以看出，Scavenge 中只复制活着的对象，而 Mark-Sweep 只清理死亡对象。活对象在新生代中只占较小部分，死对象在老生代中只占较小部分，这是两种回收方式能高效处理的原因。

Mark-Sweep 最大的问题是在进行一次标记清除回收后，内存空间会出现不连续的状态。这种内存碎片会对后续的内存分配造成问题，因为很可能出现需要分配一个大对象的情况，这时所有的碎片空间都无法完成此次分配，就会提前触发垃圾回收，而这次回收是不必要的。

**Mark-Compact**

为了解决 Mark-Sweep 的内存碎片问题，Mark-Compact 被提出来。Mark-Compact 是标记整理的意思，是在 Mark-Sweep 的基础上演变而来的。它们的差别在于对象在标记为死亡后，在整理的过程中，将活着的对象往一端移动，移动完成后，直接清理掉边界外的内存。

这里将 Mark-Sweep 和 Mark-Compact 结合着介绍不仅仅是因为两种策略是递进关系，在 V8 的回收策略中两者是结合使用的。

下表是目前介绍到的 3 种主要垃圾回收算法的简单对比。

| 回收算法     | Mark-Sweep  | Mark-Compact | Scavenge          |
| ------------ | ----------- | ------------ | ----------------- |
| 速度         | 中等        | 最慢         | 最快              |
| 空间开销     | 少 (有碎片) | 少 (无碎片)  | 双倍空间 (无碎片) |
| 是否移动对象 | 否          | 是           | 是                |

从表中可以看到，在 Mark-Sweep 和 Mark-Compact 之间，由于 Mark-Compact 需要移动对象，所以它的执行速度不可能很快，所以在取舍上，V8 主要使用 Mark-Sweep，在空间不足以对从新生代中晋升过来的对象进行分配时才使用 Mark-Compact。

#### Incremental Marking

为了避免出现 JavaScript 应用逻辑与垃圾回收器看到的不一致的情况 (JavaScript 单线程的问题)，垃圾回收的 3 种基本算法都需要将应用逻辑暂停下来，待执行完垃圾回收后再恢复执行应用逻辑，这种行为被称为 "全停顿" (stop-the-world)。在 V8 点分代式垃圾回收中，一次小垃圾回收只收集新生代，由于新生代默认配置得较小，且其中存活对象通常较少，所以即使它是全停顿的影响也不大。但 V8 的老生代通常配置得较大，且存活对象较多，全堆垃圾回收 (full 垃圾回收) 的标记、清理、整理等动作造成的停顿就会比较可怕，需要设法改善。

为了降低全堆垃圾回收带来的停顿时间，V8 先从标记阶段入手，将原本要一口气停顿完成的动作改为增量标记 (incremental marking)，也就是拆分为许多小 "步进"，每做完一 "步进" 就让 JavaScript 应用逻辑执行一小会儿，垃圾回收与应用逻辑交替执行直到标记阶段完成。

V8 后续还引入了延迟清理 (lazy sweeping) 与增量式整理 (incremental compaction)，让清理与整理动作也变成增量式的。同时还计划引入并行标记与并行清除，进一步利用多核性能降低每次停顿的时间。
