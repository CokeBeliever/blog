# watch 的基本原理

## 实现 watch

所谓 watch，其本质就是观测一个响应式数据，当数据发生变化时通知并执行相应的回调函数。举个例子：

```typescript
watch(obj, () => {
  console.log("数据变了");
});

// 修改响应式数据的值，会导致订阅的副作用函数的执行
obj.foo++;
obj.bar++;
```

实际上，watch 的实现本质上就是利用了 effect 函数以及 `options.scheduler` 选项。

```typescript
/**
 * watch 函数
 * @param source 响应式数据
 * @param cb 回调函数
 */
function watch(source: object, cb: Function) {
  effect(
    // 调用 traverse 递归地读取
    () => traverse(source),
    {
      scheduler() {
        // 当数据变化时，调用回调函数 cb
        cb();
      },
    }
  );
}

/**
 * 遍历数据
 * @param value 数据
 * @param seen 存储已读取的数据
 */
function traverse(value: any, seen = new Set()) {
  // 如果要读取的数据是原始值，或者是函数，或者已经被读取过了，那么什么都不做
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value);
  // 暂时不考虑数组等其他结构
  // 假设 value 就是一个对象，使用 for...in 读取对象的每一个值，并递归地调用 traverse 进行处理
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
```

watch 函数除了可以观测响应式数据，还可以接收一个 getter 函数。

```typescript
watch(
  // getter 函数
  () => obj.foo,
  // 回调函数
  () => {
    console.log("obj.foo 的值变了");
  }
);
```

我们进一步完善 watch，如下代码所示：

```typescript
/**
 * watch 函数
 * @param source 响应式数据或 getter 函数
 * @param cb 回调函数
 */
function watch(source: object | (() => T), cb: Function) {
  // 定义 getter
  let getter: Function;

  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === "function") {
    getter = source;
  } else {
    // 否则按照原来的实现调用 traverse 递归地读取
    getter = () => traverse(source);
  }

  effect(() => getter(), {
    scheduler() {
      cb();
    },
  });
}
```

现在的实现还缺少一个非常重要的能力，即现在的回调函数中拿不到旧值和新值。通常我们在使用 Vue 中的 watch 函数时，能够在回调函数中得到变化前后的值：

```typescript
watch(
  () => obj.foo,
  (newValue, oldValue) => {
    console.log(newValue, oldValue);
  }
);

obj.foo++;
```

那么如何获得新值与旧值呢？可以充分利用 effect 函数的 lazy 选项，如下代码所示：

```typescript
/**
 * watch 函数
 * @param source 响应式数据或 getter 函数
 * @param cb 回调函数
 */
function watch<T>(
  source: object | (() => T),
  cb: (newValue: T, oldValue: T) => any
) {
  let getter: Function;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  // 定义旧值与新值
  let oldValue: T, newValue: T;
  // 使用 effect 订阅副作用函数时，开启 lazy 选项，并把返回值存储到 effectFn 中以便后续手动调用
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      // 在 scheduler 中重新执行副作用函数，得到的是新值
      newValue = effectFn();
      // 将旧值和新值作为回调函数的参数
      cb(newValue, oldValue);
      // 更新旧值，不然下一次会得到错误的旧值
      oldValue = newValue;
    },
  });

  // 手动调用副作用函数，拿到的值就是旧值
  oldValue = effectFn();
}
```

### 立即执行的 watch

默认情况下，一个 watch 的回调只会在响应式数据发生变化时才执行：

```typescript
// 回调函数只有在响应式数据 obj 后续发生变化时才执行
watch(obj, () => {
  console.log("变化了");
});
```

在 Vue 中可以通过选项参数 immediate 来制定回调函数是否需要立即执行：

```typescript
watch(
  obj,
  () => {
    console.log("变化了");
  },
  {
    // 回调函数会在 watch 创建时立即执行一次
    immediate: true,
  }
);
```

仔细思考就会发现，回调函数的立即执行和后续执行本质上没有任何差别，所以我们可以把 scheduler 调度函数封装为一个通用函数，分别在初始化和变更时执行它，如以下代码所示：

```typescript
// -------------------- 类型代码 --------------------
/**
 * watch options 接口
 */
interface WatchOptionsInterface {
  /** 立即执行 */
  immediate?: boolean;
}

// -------------------- 逻辑代码 --------------------
/**
 * watch 函数
 * @param source 响应式数据或 getter 函数
 * @param cb 回调函数
 * @param options 选项
 */
function watch<T>(
  source: object | (() => T),
  cb: (newValue: T, oldValue: T) => any,
  options: WatchOptionsInterface = {}
) {
  let getter: Function;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue: T, newValue: T;

  // 提取 scheduler 调度函数为一个独立的 job 函数
  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    // 使用 job 函数作为调度函数
    scheduler: job,
  });

  if (options.immediate) {
    // 当 immediate 为 true 时立即执行 job，从而触发回调函数
    job();
  } else {
    oldValue = effectFn();
  }
}
```

### 回调函数的执行时机

除了指定回调函数为立即执行之外，还可以通过其他选项参数来指定回调函数的执行时机，例如在 Vue 中使用 flush 选项来指定：

```typescript
watch(
  obj,
  () => {
    console.log("变化了");
  },
  {
    flush: "pre",
  }
);
```

flush 可取的值为三种，分别为：

- pre：回调函数在组件更新前执行，暂时先不模拟，涉及到组件的更新时机
- post：回调函数在组件更新后执行，可以将订阅函数放到一个微任务队列中，并等待 DOM 更新结束后再执行
- sync：默认情况，立即执行回调函数

我们进一步完善 watch，如下代码所示：

```typescript
/**
 * watch options 接口
 */
interface WatchOptionsInterface {
  /** 立即执行 */
  immediate?: boolean;
  /** 执行时机 */
  flush?: "pre" | "post" | "sync";
}

/**
 * watch 函数
 * @param source 响应式数据或 getter 函数
 * @param cb 回调函数
 * @param options 选项
 */
function watch<T>(
  source: object | (() => T),
  cb: (newValue: T, oldValue: T) => any,
  options: WatchOptionsInterface = {}
) {
  let getter: Function;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue: T, newValue: T;

  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      // 在调度函数中判断 flush 的值
      if (options.flush === "pre") {
        // pre: 暂时先不模拟，涉及到组件的更新时机
      } else if (options.flush === "post") {
        // post: 放到微任务队列中执行
        const p = Promise.resolve();
        p.then(job);
      } else {
        // sync: 立即执行
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}
```

### 过期的副作用

在 Vue 中，watch 函数的回调函数可以接收第三个参数 onInvalidate，它是一个函数，类似于事件监听器，我们可以使用 onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行：

```typescript
let finalData;

watch(obj, async (newValue, oldValue, onInvalidate) => {
  // 定义一个标志，代表当前副作用函数是否过期，默认为 false，代表没有过期
  let expired = false;
  // 调用 onInvalidate() 函数注册一个回调函数
  onInvalidate(() => {
    // 当过期时，将 expired 设置为 true
    expired = true;
  });

  // 发送网络请求
  const res = await fetch("/path/to/request");

  if (!expired) {
    finalData = res;
  }
});
```

如上面代码所示，在发送请求之前，我们定义了 expired 标志变量，用来标识当前副作用函数的执行是否过期；接着调用 onInvalidate 函数注册了一个过期回调，当该副作用函数的执行过期时将 expired 标志变量设置为 true；最后只有当没有过期时才采用请求结果。

我们进一步完善 watch，如下代码所示：

```typescript
/**
 * watch 函数
 * @param source 响应式数据或 getter 函数
 * @param cb 回调函数
 * @param options 选项
 */
function watch<T>(
  source: object | (() => T),
  cb: (newValue: T, oldValue: T, onInvalidate: (fn: Function) => void) => any,
  options: WatchOptionsInterface = {}
) {
  let getter: Function;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue: T, newValue: T;

  // cleanup 用来存储用户注册的过期回调
  let cleanup: Function | undefined;
  // 定义 onInvalidate 函数
  function onInvalidate(fn: Function) {
    // 将过期回调存储到 cleanup 中
    cleanup = fn;
  }

  const job = () => {
    newValue = effectFn();
    // 在调用回调函数 cb 之前，先调用过期回调
    if (cleanup) {
      cleanup();
    }
    // 将 onInvalidate 作为回调函数的第三个参数，以便用户使用
    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (options.flush === "pre") {
      } else if (options.flush === "post") {
        const p = Promise.resolve();
        p.then(job);
      } else {
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}
```
