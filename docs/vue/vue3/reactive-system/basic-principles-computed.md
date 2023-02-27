# 计算属性的基本原理

## 实现调度执行

可调度性是响应式系统非常重要的特性。

可调度性指的是当 trigger 动作触发订阅的副作用函数重新执行时，有能力决定副作用函数执行的时机、次数以及方式。

### 执行方式

首先来看一下，如何决定副作用函数的执行方式，以下面的代码为例：

```typescript
const data = { foo: 1 };
const obj = new Proxy(data, {
  /* ... */
});

effect(() => {
  console.log(obj.foo);
});

obj.foo++;

console.log("结束了");
```

这段代码的输出结果如下：

```
1
2
'结束了'
```

现在假设需求有变，输出顺序需要调整为：

```
1
'结束了'
2
```

我们可以为 effect 函数设计一个选项参数 options，允许用户指定调度器：

```typescript
// -------------------- 类型代码 --------------------
/**
 * 副作用函数接口
 */
interface EffectFnInterface {
  (): any;
  /** 依赖副作用函数的集合列表 */
  depsList: Set<EffectFnInterface>[];
  /** 副作用函数的选项 */
  options: EffectOptionsInterface;
}

/**
 * effect options 接口
 */
interface EffectOptionsInterface {
  /** 调度函数 */
  scheduler?: (effectFn: EffectFnInterface) => any;
}

// -------------------- 逻辑代码 --------------------
/**
 * 副作用副作用函数
 * @param fn 副作用函数
 * @param options 选项
 */
function effect(fn: Function, options: EffectOptionsInterface = {}) {
  const effectFn: EffectFnInterface = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  // 将 options 挂载到 effectFn 上
  effectFn.options = options;
  effectFn.depsList = [];
  effectFn();
}
```

有了调度函数，我们在 trigger 函数中触发订阅的副作用函数重新执行时，就可以直接调用用户传递的调度函数，从而把控制权交给用户：

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
    if (effectFn !== activeEffect) {
      // 如果一个副作用函数存在调度函数，则调用该调度函数，并将副作用函数作为参数传递
      if (effectFn.options.scheduler) {
        effectFn.options.scheduler(effectFn);
      } else {
        effectFn();
      }
    }
  });
}
```

测试一下：

```typescript
effect(
  () => {
    console.log(obj.foo);
  },
  // options
  {
    // 调度函数 scheduler 是一个函数
    scheduler(effectFn) {
      // 将订阅的副作用函数放到宏任务队列中执行
      setTimeout(effectFn);
    },
  }
);

obj.foo++;

console.log("结束了");
```

控制台输出为：

```
1
'结束了'
2
```

### 执行次数

除了控制订阅函数的执行顺序，通过调度函数还可以做到控制它的执行次数，这一点也尤为重要。我们思考如下例子：

```typescript
const data = { foo: 1 };
const obj = new Proxy(data, {
  /* ... */
});

effect(() => {
  console.log(obj.foo);
});

obj.foo++;
obj.foo++;
```

这段代码的输出结果如下：

```
1
2
3
```

由输出可知，字段 `obj.foo` 的值一定会从 1 自增到 3，2 只是它的过渡状态。如果我们只关心最终结果而不关心过程，那么执行三次打印操作是多余的，我们期望的打印结果是：

```
1
3
```

其中不包含过渡状态，基于调度函数我们可以很容易地实现此功能：

```typescript
// 定义一个任务队列
const jobQueue = new Set<EffectFnInterface>();
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve();
// 一个标志代表是否正在刷新队列
let isFlushing = false;
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return;
  // 设置为 true，代表正在刷新
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach((job) => job());
  }).finally(() => {
    // 结束后重置 isFlushing
    isFlushing = false;
  });
}

effect(
  () => {
    console.log(obj.foo);
  },
  {
    scheduler(effectFn) {
      // 每次调度时，将副作用函数添加到 jobQueue 队列中
      jobQueue.add(effectFn);
      // 调用 flushjob 刷新队列
      flushJob();
    },
  }
);

obj.foo++;
obj.foo++;
```

控制台输出为：

```
1
3
```

## 实现计算属性 computed 与懒执行 lazy

### 懒执行 lazy

目前我们所实现的 effect 函数会立即执行传递给它的函数。例如：

```typescript
effect(
  // 这个函数会立即执行
  () => {
    console.log(obj.foo);
  }
);
```

但在有些场景下，我们并不希望它立即执行，而是希望它在需要的时候才执行，并且可以返回执行的结果。例如计算属性 computed。这时我们可以通过在 options 中添加 lazy 属性来达到目的，如下面的代码所示：

```typescript
/**
 * effect options 接口
 */
interface EffectOptionsInterface {
  /** 调度函数 */
  scheduler?: (effectFn: EffectFnInterface) => any;
  /** 懒执行 */
  lazy?: boolean;
}

effect(
  () => {
    console.log(obj.foo);
  },
  // options
  {
    lazy: true,
  }
);
```

修改 effect 函数的代码实现：

```typescript
/**
 * 副作用副作用函数
 * @param fn 副作用函数
 * @param options 选项
 */
function effect(fn: Function, options: EffectOptionsInterface = {}) {
  const effectFn: EffectFnInterface = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 将 fn 的执行结果缓存到 res 中
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    // 返回 fn 的执行结果
    return res;
  };
  effectFn.options = options;
  effectFn.depsList = [];
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    effectFn();
  }
  // 将副作用函数作为返回值返回
  return effectFn;
}
```

通过上面代码，我们实现了让副作用函数不立即执行的功能，并且在手动执行时可以返回用户订阅的副作用函数的执行结果。

### 计算属性 computed

计算属性 computed 是 Vue 中一个非常重要并且非常有特色的能力。

现在我们已经实现了订阅懒执行的副作用函数，并且能够拿到订阅的副作用函数的执行结果，接下来就可以实现计算属性了，如下面代码所示：

```typescript
/**
 * 计算属性
 * @param getter 获取器函数
 */
function computed<T>(getter: () => T): { readonly value: T } {
  // 把 getter 作为订阅的副作用函数，创建一个 lazy 的 effectFn
  const effectFn = effect(getter, {
    lazy: true,
  });

  const obj = {
    // 当读取 value 时才执行 effectFn
    get value() {
      return effectFn();
    },
  };

  return obj;
}
```

测试一下：

```typescript
const data = { foo: 1, bar: 2 };
const obj = new Proxy(data, {
  /* ... */
});

const sumRes = computed(() => {
  console.log("run");
  return obj.foo + obj.bar;
});

console.log(sumRes.value);
console.log(sumRes.value);
console.log(sumRes.value);
```

可以看到它能够正确地工作，不过现在我们实现的计算属性只能做到懒计算，也就是说，只有当你真正读取 `sumRes.value` 的值时，它才会进行计算并得到值。但是还做不到对值进行缓存，即假如我们多次访问 `sumRes.value` 的值，会导致 effectFn 进行多次计算，即使 `obj.foo` 和 `obj.bar` 的值本身并没有变化。

为了解决这个问题，就需要我们在实现 computed 函数时，添加对值进行缓存的功能，如下代码所示：

```typescript
/**
 * 计算属性
 * @param getter 获取器函数
 */
function computed<T>(getter: () => T): { readonly value: T } {
  // value 用来缓存上一次计算的值
  let value: T;
  // dirty 标志，用来标识是否需要重新计算，为 true 则意味着 "脏"，需要计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    // 添加调度函数，在调度函数中将 dirty 重置为 true
    scheduler() {
      dirty = true;
    },
  });

  const obj = {
    get value() {
      // 只有 "脏" 时才计算值，并将得到的值缓存到 value 中
      if (dirty) {
        value = effectFn();
        // 将 dirty 设置为 false，下一次访问直接使用缓存在 value 中的值
        dirty = false;
      }
      return value;
    },
  };

  return obj;
}
```

现在，我们设计的计算属性以及趋近于完美了，但还有一个缺陷，它体现在当我们在另外一个 effect 中读取计算属性的值时：

```typescript
const sumRes = computed(() => obj.foo + obj.bar);

effect(() => {
  // 在该订阅函数中读取 sumRes.value
  console.log(sumRes.value);
});

// 修改 obj.foo 的值
obj.foo++;
```

尝试运行上面这段代码，会发现修改 `obj.foo` 的值并不会触发订阅函数的渲染，主要的原因是 `sumRes.value` 并不是响应式数据。

解决办法很简单，当读取计算属性的值时，我们可以手动调用 track 函数进行追踪了；当计算属性依赖的响应式数据发生变化时，我们可以手动调用 trigger 函数触发响应：

```typescript
/**
 * 计算属性
 * @param getter 获取器函数
 */
function computed<T>(getter: () => T): { readonly value: T } {
  let value: T;
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true;
      // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
      trigger(obj, "value");
    },
  });

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      // 当读取 value 时，手动调用 track 函数进行追踪
      track(obj, "value");
      return value;
    },
  };

  return obj;
}
```

现在通过 computed 函数创建的对象也是一个响应式数据了。
