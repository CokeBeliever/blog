# 响应式系统的基本原理

Vue 是一个 MVVM (Model-View-ViewModel) 框架，它最标志性的功能就是其低侵入性的响应式系统，组件状态 (Model) 都是由响应式的 JavaScript 对象组成的。当更改它们时，视图 (View) 会随即自动更新。

## 副作用函数

**函数副作用 (side effect of function)** 指的是函数内部与外部互动，从而一定程度改变了系统环境。例如：

- 读取外部数据
- 修改外部数据

会产生副作用的函数我们称为**副作用函数**。例如：

```typescript
function effect() {
  document.body.innerText = "hello vue3";
}
```

如上面的代码所示，effect 函数修改外部数据 `document.body.innerText`，所以它是一个副作用函数。

## 响应式数据

**响应式数据 (reactive data)** 指的是当数据修改后，一些依赖于这个数据的副作用函数可以自动重新执行，像这样的数据称响应式数据。

来看下面一个例子：

```typescript
const obj = { text: "hello world" };
function effect() {
  document.body.innerText = obj.text;
}
effect();
```

如上面的代码所示，调用 effect 函数会设置 body 元素的 innerText 属性的值为 `obj.text`。

接下来，我们会修改 `obj.text` 的值。我们希望当值修改后，effect 函数自动重新执行，从而达到更新视图的目标，如果能实现这个目标，那么 `obj.text` 就是响应式数据。

```js
obj.text = "hello vue3";
```

很明显，目前 `obj.text` 是一个普通数据，当我们修改它的值时，除了值本身发生变化之外，不会有任何其他反应。

## 响应式系统的基本实现

如何让 `obj.text` 变成响应式数据呢？通过观察我们能发现两点线索：

- 当 effect 函数执行时，会触发 `obj.text` 的读取 (get) 操作；
- 当修改 `obj.text` 的值时，会触发 `obj.text` 的设置 (set) 操作；

如果我们能拦截一个对象的读取和设置操作，事情就变得简单了：

- 在读取 `obj.text` 时，将这个数据相关的函数存储起来；
- 在设置 `obj.text` 时，将这个数据相关的函数取出来执行；

现在问题的关键变成了我们如何才能拦截一个对象属性的读取和设置操作呢？在 ES6 之前，只能通过 `Object.defineProperty` 函数实现，这也是 Vue2 所采用的方式。从 ES6 开始，我们可以使用代理对象 Proxy 来实现，这也是 Vue3 所采用的方式。

我们可以根据上述思路，采用 Proxy 来实现：

```typescript
// 存储函数的 "桶"
const bucket = new Set<Function>();
// 原始数据
const data = { text: "hello world" };
// 响应式数据
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key, receiver) {
    // 将 effect 存储起来
    bucket.add(effect);
    // 返回属性值
    return Reflect.get(target, key, receiver);
  },

  // 拦截设置操作
  set(target, key, newVal, receiver) {
    // 设置属性值
    const res = Reflect.set(target, key, newVal, receiver);
    // 如果设置操作成功，就把存储的函数取出来执行
    if (res) bucket.forEach((effectFn) => effectFn());
    // 返回设置操作是否成功
    return res;
  },
});

function effect() {
  document.body.innerText = obj.text;
}
```

测试一下：

```typescript
effect();

setTimeout(() => {
  obj.text = "hello vue3";
}, 1000);
```

上面这段代码编译为 JavaScript 代码，并在浏览器中运行，会得到期望的结果 (1s 后 `obj.text` 会修改，effect 函数会重新执行)。

但是目前实现还存在很多缺陷，实现一个完善的响应式系统要考虑诸多细节。

## 解决硬编码副作用函数的问题

在读取操作中，我们直接通过名字 (effect) 来获取想存储的副作用函数，这种硬编码 effect 副作用函数的方式很不灵活，一旦其他副作用函数的名字不叫 effect，那么这段代码将不能正确工作了。

我们可以声明一个全局变量 activeEffect 来存储需要订阅的副作用函数，effect 函数用于订阅副作用函数。如下面代码所示：

```typescript
const bucket = new Set<Function>();
// 用一个全局变量存储需要订阅的副作用函数
let activeEffect: Function | undefined;
const data = { text: "hello world" };
const obj = new Proxy(data, {
  get(target, key, receiver) {
    // 如果存在需要订阅的副作用函数，就将副作用函数存储起来
    if (activeEffect) bucket.add(activeEffect);
    return Reflect.get(target, key, receiver);
  },

  set(target, key, newVal, receiver) {
    const res = Reflect.set(target, key, newVal, receiver);
    if (res) bucket.forEach((effectFn) => effectFn());
    return res;
  },
});

/**
 * 订阅副作用函数
 * @param fn 副作用函数
 */
function effect(fn: Function) {
  activeEffect = fn;
  // 调用函数，让函数订阅在它所依赖的响应式数据上
  fn();
}
```

测试一下：

```typescript
// 订阅一个匿名函数
effect(() => {
  document.body.innerText = obj.text;
});

setTimeout(() => {
  obj.text = "hello vue3";
}, 1000);
```

可以看到，响应式系统仍然正常执行。当 effect 函数执行时，首先会把匿名函数 fn 赋值给全局变量 activeEffect。接着执行需要订阅的匿名函数 fn，这将会触发响应式数据 `obj.text` 的读取操作，进而触发代理对象 Proxy 的 get 拦截函数。因为此时匿名函数 fn 保存在全局变量 activeEffect 上，所以在 get 拦截函数中只需收集变量 activeEffect 的值，这样响应系统就不依赖副作用函数的名字了。

## 解决存储副作用函数数据结构的问题

如果我们对目前的这个响应系统稍加测试，会存在问题。例如，在响应式数据 obj 上设置一个不存在的属性时：

```typescript
effect(() => {
  console.log("effect run"); // 会执行两次
  document.body.innerText = obj.text;
});

setTimeout(() => {
  // 订阅的副作用函数中并没有读取 notExist 属性的值
  obj.notExist = "hello vue3";
}, 1000);
```

订阅的副作用函数会被执行两次：

- 第一次执行是没问题的，响应式数据正在收集订阅的副作用函数。
- 第二次执行是有问题的，虽然我们修改了 `obj.notExist` 数据，但是订阅的副作用函数中其实并没有依赖于这个数据 (没有读取 `obj.notExist`)，我们不希望订阅的副作用函数重新执行。

导致该问题的根本原因是，我们没有在订阅的副作用函数与被操作的目标属性之间建立明确的联系。例如，当读取属性时，无论读取的是哪一个属性，其实都一样，都会把订阅的副作用函数收集到 "桶 (bucket)" 中；当设置属性时，无论设置的是哪一个属性，也都会把 "桶" 中订阅的副作用函数重新执行。订阅的副作用函数与被操作的属性之间没有明确的联系。

解决方法很简单，只需要在订阅的副作用函数与被操作的属性之间建立联系即可，这就需要我们重新设计 "桶" 的数据结构，而不能简单地使用一个 Set 类型的数据结构。

我们可以设计 "桶" 的数据结构如下：

```typescript
/**
 * 存储副作用函数的 "桶"
 * bucket
 * ├── obj-1 (响应式数据 object 类型)
 * │   └── key-1 (属性 string 或 symbol 类型)
 * │       │── fn-1 (副作用函数 Function 类型)
 * │       └── fn-2
 * └── obj-2
 *     └── key-2
 *         └── fn-1
 */
const bucket = new WeakMap<object, Map<string | symbol, Set<Function>>>();
```

封装 track 函数。在 get 拦截函数内调用，在响应式数据的指定属性上订阅副作用函数，如下面代码所示：

```typescript
/**
 * 在 get 拦截函数内调用，在响应式数据的指定属性上订阅副作用函数
 * @param target 响应式数据
 * @param key 属性
 */
function track<T extends object>(target: T, key: string | symbol) {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) bucket.set(target, (depsMap = new Map()));
  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));
  deps.add(activeEffect);
}
```

封装 trigger 函数。在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数，如下面代码所示：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 */
function trigger<T extends object>(target: T, key: string | symbol) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach((effectFn) => effectFn());
}
```

然后修改 get 和 set 拦截器代码：

```typescript
const data: { text: string; notExist?: any } = { text: "hello world" };
const obj = new Proxy(data, {
  get(target, key, receiver) {
    track(target, key);
    return Reflect.get(target, key, receiver);
  },

  set(target, key, newVal, receiver) {
    const res = Reflect.set(target, key, newVal, receiver);
    if (res) trigger(target, key);
    return res;
  },
});
```

重新执行本节开头的测试，执行结果和我们期望的一样：修改 `obj.notExist` 并不会导致订阅的副作用函数重新执行。

## 解决分支切换的问题

我们需要明确分支切换的定义，如下面的代码所示：

```typescript
const data = { ok: true, text: "hello world" };
const obj = new Proxy(data, {
  /* ... */
});

effect(() => {
  document.body.innerText = obj.ok ? obj.text : "not";
});
```

在副作用函数内部，存在一个三元表达式，根据字段 `obj.ok` 值的不同会执行不同的代码分支。当字段 `obj.ok` 的值发生变化时，代码执行的分支会跟着变化，这就是所谓的分支切换。

分支切换可能会产生遗留的订阅函数。拿上面这段代码来说，字段 `obj.ok` 的初始值为 true，这时会读取字段 `obj.text` 的值，所以当副作用函数执行时会触发字段 `obj.ok` 和 `obj.text` 这两个属性的读取操作，此时订阅的副作用函数与响应式数据之间建立的联系如下所示：

```
bucket
└── obj
    │── ok
    │   └── effectFn
    └── text
        └── effectFn
```

当 `obj.ok` 的值修改为 false，会触发订阅的副作用函数重新执行，由于此时 `obj.text` 不会被读取，只会触发字段 `obj.ok` 的读取操作，所以理想情况下副作用函数 effectFn 不应该被 `obj.text` 所对应的依赖集合收集订阅。副作用函数与响应式数据之间建立的联系如下所示：

```
bucket
└── obj
    └── ok
        └── effectFn
```

解决这个问题可以在每次副作用函数重新执行时，先把它从所有与之关联的依赖集合中删除，然后再触发副作用函数重新执行。当副作用函数执行完毕后，会重新建立新的副作用函数与响应式数据之间的联系。

要将一个副作用函数从所有与之关联的依赖集合中删除，就需要明确知道哪些依赖集合中包含它，因此我们需要重新设计副作用函数，如下面的代码所示：

```typescript
// -------------------- 类型代码 --------------------
/**
 * 副作用函数接口
 */
interface EffectFnInterface {
  (): any;
  /** 依赖副作用函数的集合列表 */
  depsList: Set<EffectFnInterface>[];
}

// -------------------- 逻辑代码 --------------------
const bucket = new WeakMap<
  object,
  Map<string | symbol, Set<EffectFnInterface>>
>();
let activeEffect: EffectFnInterface | undefined;

/**
 * 订阅副作用函数
 * @param fn 副作用函数
 */
function effect(fn: Function) {
  // 创建副作用函数
  const effectFn: EffectFnInterface = () => {
    // 每次副作用函数重新执行时，先删除所有与该副作用函数关联的依赖集合
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };
  // effectFn.depsList 用来存储所有与该副作用函数关联的依赖集合
  effectFn.depsList = [];
  // 执行副作用函数
  effectFn();
}

/**
 * 删除所有与该副作用函数关联的依赖集合
 * @param effectFn 副作用函数
 */
function cleanup(effectFn: EffectFnInterface) {
  for (const deps of effectFn.depsList) {
    // 将 effectFn 从依赖集合中删除
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.depsList 数组
  effectFn.depsList.length = 0;
}
```

在 effect 内部我们定义了新的 effectFn 函数，并为其添加了 `effectFn.depsList` 属性，该属性是一个数组，用来存储所有与该副作用函数相关联的依赖集合。

修改 `track` 函数：

```typescript
function track<T extends object>(target: T, key: string | symbol) {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) bucket.set(target, (depsMap = new Map()));
  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));
  deps.add(activeEffect);
  // 将其添加到 activeEffect.depsList 数组中
  activeEffect.depsList.push(deps);
}
```

修改 `trigger` 函数：

```typescript
function trigger<T extends object>(target: T, key: string | symbol) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  // 避免无限循环，缓存并执行要重新执行的订阅函数
  const effectsToRun = new Set(effects);
  effectsToRun.forEach((effectFn) => effectFn());
}
```

测试一下：

```typescript
const data = { ok: true, text: "hello world" };
const obj = new Proxy(data, {
  /* ... */
});

effect(function effectFn() {
  console.log("effectFn run");
  document.body.innerText = obj.ok ? obj.text : "not";
});

obj.text = "hello vue3"; // 打印 'effectFn run'

// 修改 obj.ok 为 false
obj.ok = false; // 打印 'effectFn run'

// obj.ok 为 false 时，修改 obj.text 订阅的副作用函数不会重新执行
setTimeout(() => {
  obj.ok = false; // 不打印 'effectFn run'
}, 1000);
```

可以看到，当 `obj.ok` 修改为 false 后，修改 `obj.text` 后，订阅的副作用函数不会重新执行，这正是我们希望的。

## 解决嵌套 effect 的问题

effect 函数是可以发生嵌套的，如下面代码所示：

```typescript
effect(function effectFn1() {
  effect(function effectFn2() {
    /* ... */
  });
  /* ... */
});
```

在上面这段代码中，因为 effectFn1 内部嵌套了 effectFn2，所以 effectFn1 的执行会导致 effectFn2 的执行，但是 effectFn2 的执行并不会导致 effectFn1 的执行。实际上 Vue 的渲染函数就是在一个 effect 中执行的。

例如，在一个 effect 中执行 Foo 组件的渲染函数：

```tsx
// Bar 组件
const Bar = {
  render() {
    /* ... */
  },
};

// Foo 组件渲染了 Bar 组件
const Foo = {
  render() {
    return <Bar />; // jsx 语法
  },
};

effect(() => {
  Foo.render();
});
```

它相当于：

```typescript
effect(() => {
  Foo.render();
  effect(() => {
    Bar.render();
  });
});
```

上面的例子说明了为什么 effect 要设计成可嵌套的。但是，我们目前所实现的响应式系统并不支持 effect 嵌套，我们可以测试一下：

```typescript
const data = { foo: true, bar: true };
const obj = new Proxy(data, {
  /* ... */
});

effect(function effectFn1() {
  console.log("effectFn1 执行");
  effect(function effectFn2() {
    console.log("effectFn2 执行");
    // 在 effectFn2 中读取 obj.bar 属性
    obj.bar;
  });
  // 在 effectFn1 中读取 obj.foo 属性
  obj.foo;
});

// 修改 obj.foo 值，希望重新执行 effectFn1 和 effectFn2
setTimeout(() => {
  obj.foo = !obj.foo;
}, 1000);
```

控制台输出：

```
'effectFn2 执行'
```

我们发现 effectFn1 并没有重新执行，只有 effectFn2 重新执行了，这显然不符合预期。

问题其实在于我们实现的 effect 函数和 activeEffect 上：我们用全局变量 activeEffect 来存储通过 effect 函数的订阅函数，这意味着同一时刻 activeEffect 所存储的订阅函数只能有一个。当订阅函数发生嵌套时，内层订阅函数的执行会覆盖 activeEffect 的值，并且永远不会恢复到原来的值。这时如果再有响应式数据进行依赖收集，即使这个响应式数据是在外层订阅函数中读取的，它们收集到的订阅函数也都全是内层订阅函数，这就是问题所在。

解决这个问题我们需要一个副作用函数栈 effectStack，在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执行完毕后将其从栈中弹出，并始终让 activeEffect 指向栈顶的副作用函数。这样就能做到一个响应式数据只会收集直接读取其值的副作用函数，而不会出现互相影响的情况，如以下代码所示：

```typescript
// effect 栈
const effectStack: EffectFnInterface[] = [];

/**
 * 订阅副作用函数
 * @param fn 副作用函数
 */
function effect(fn: Function) {
  const effectFn: EffectFnInterface = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // 当调用订阅的副作用函数之前，将当前 effectFn 压入栈中
    effectStack.push(effectFn);
    fn();
    // 在当前订阅的副作用函数执行完毕后，将当前 effectFn 弹出栈
    effectStack.pop();
    // activeEffect 指向栈顶
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.depsList = [];
  effectFn();
}
```

测试一下：

```typescript
const data = { foo: true, bar: true };
const obj = new Proxy(data, {
  /* ... */
});

effect(function effectFn1() {
  console.log("effectFn1 执行");
  effect(function effectFn2() {
    console.log("effectFn2 执行");
    // 在 effectFn2 中读取 obj.bar 属性
    obj.bar;
  });
  // 在 effectFn1 中读取 obj.foo 属性
  obj.foo;
});

// 修改 obj.foo 值，希望重新执行 effectFn1 和 effectFn2
setTimeout(() => {
  obj.foo = !obj.foo;
}, 1000);
```

当修改 `obj.foo` 时，先执行 effectFn1 后接着执行 effectFn2，符合我们的预期。

## 解决无限递归循环的问题

目前实现的响应式系统会导致无限递归循环，如下面代码所示：

```typescript
const data = { foo: 1 };
const obj = new Proxy(data, {
  /* ... */
});

effect(() => (obj.foo = obj.foo + 1));
```

在这个语句中，既会读取 `obj.foo` 的值，又会设置 `obj.foo` 的值，而这就是导致问题的根本原因。首先读取 `obj.foo` 的值，会触发 track 操作，将当前订阅的副作用函数收集到 "桶" 中，接着将其加 1 后再赋值给 `obj.foo`，此时会触发 trigger 操作，即把 "桶" 中的订阅的副作用函数重新执行。但问题是该副作用函数正在执行中，还没有执行完毕，就要开始下一次的执行。这样会导致无限递归地调用自己，于是就产生了栈溢出。

解决办法并不难。通过分析这个问题我们能够发现，读取和设置操作是在同一个副作用函数内进行的。此时无论是 track 时收集订阅的副作用函数，还是 trigger 时要触发执行订阅的副作用函数，都是 activeEffect。基于此，我们可以在 trigger 动作发生时增加守卫条件：**如果 trigger 触发执行的订阅函数与当前正在执行的订阅函数相同，则不触发执行**，如以下代码所示：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 */
function trigger<T extends object>(target: T, key: string | symbol) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects);
  effectsToRun.forEach((effectFn) => {
    // 如果 trigger 触发执行的副作用函数与当前正在订阅的副作用函数不同，才触发执行
    if (effectFn !== activeEffect) {
      effectFn();
    }
  });
}
```
