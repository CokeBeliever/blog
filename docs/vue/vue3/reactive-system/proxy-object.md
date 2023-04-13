# 代理 Object

## Object 的基本操作

### 读取

在响应式系统中，"读取" 是一个很宽泛的概念。响应式系统应该拦截一切读取操作，以便当数据变化时能够正确地触发响应。下面列出了对一个普通对象的所有可能的读取操作：

- 访问属性：`obj.foo`
- 判断对象或原型上是否存在给定的 key：`key in obj`
- 使用 for...in 循环遍历对象：`for (const key in obj) {}`

**访问属性**

对于属性的读取，可以通过 get 拦截函数实现：

```typescript
const obj = { foo: 1 };

const p = new Proxy(obj, {
  get(target, key, receiver) {
    // 建立联系
    track(target, key);
    // 返回属性值
    return Reflect.get(target, key, receiver);
  },
});
```

**in 操作**

对于 in 操作，可以通过 has 拦截函数实现：

```typescript
const obj = { foo: 1 };

const p = new Proxy(obj, {
  has(target, key) {
    track(target, key);
    return Reflect.has(target, key);
  },
});
```

这样，当我们在副作用函数中通过 in 操作符操作响应式数据时，就能够建立依赖关系：

```typescript
effect(() => {
  "foo" in p; // 将会建立依赖关系
});
```

**for...in 循环**

对于 for...in 循环，可以通过 ownKeys 拦截函数实现：

```typescript
const obj: { foo: number; bar?: number } = { foo: 1 };
const ITERATE_KEY = Symbol();

const p = new Proxy(obj, {
  ownKeys(target) {
    // 将副作用函数与 ITERATE_KEY 关联
    track(target, ITERATE_KEY);
    return Reflect.ownKeys(target);
  },
});
```

这样，当我们在副作用函数中通过 for...in 循环遍历响应式数据时，就能够建立依赖关系：

```typescript
effect(() => {
  // for...in 循环
  for (const key in p) {
    console.log(key); // foo
  }
});
```

我们尝试为对象 p 添加新的属性 bar：

```typescript
p.bar = 2;
```

由于对象 p 原本只有 foo 属性，因此 for...in 循环只会执行一次。现在为它添加了新属性 bar，所以 for...in 循环就会由执行一次变成执行两次。也就是说，当为对象添加新属性时，会对 for...in 循环产生影响，所以需要触发与 ITERATE_KEY 相关联的副作用函数重新执行。

我们可以看一下原先 set 拦截函数的实现：

```typescript
const p = new Proxy(obj, {
  set(target, key, newVal, receiver) {
    // 设置属性值
    const res = Reflect.set(target, key, newVal, receiver);
    // 把副作用函数从桶里取出并执行
    if (res) trigger(target, key);
    return res;
  },
});
```

当为对象 p 添加新的 bar 属性时，会触发 set 拦截函数执行。此时 set 拦截函数接收到的 key 就是字符串 "bar"，因此最终调用 trigger 函数时也只触发了与 "bar" 相关联的副作用函数重新执行。但是根据前文的介绍，我们知道 for...in 循环是在副作用函数与 ITERATE_KEY 之间建立联系，这和 "bar" 一点儿关系都没有，因此当我们尝试执行 `p.bar = 2` 操作时，并不能正确地触发响应。

解决这个问题很简单，当添加属性时，我们将那些与 ITERATE_KEY 相关联的副作用函数也取出来执行就可以了：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 */
function trigger<T extends object>(target: T, key: string | symbol) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 取得与 key 相关联的副作用函数
  const effects = depsMap.get(key);
  // 取得与 ITERATE_KEY 相关联的副作用函数
  const iterateEffects = depsMap.get(ITERATE_KEY);
  const effectsToRun = new Set<EffectFnInterface>();

  // 将与 key 相关联的副作用函数添加到 effectsToRun
  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 将与 ITERATE_KEY 相关联的副作用函数也添加到 effectsToRun
  iterateEffects &&
    iterateEffects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}
```

如上面代码所示，当 trigger 函数执行时，除了把那些直接与具体操作的 key 相关联的副作用函数取出来执行外，还要把那些与 ITERATE_KEY 相关联的副作用函数取出来执行。

对于添加新的属性来说，这样做没有什么问题，但如果仅仅修改已有属性的值，这其实并不会对 for...in 循环产生影响。所以在这种情况下，我们不需要触发 ITERATE_KEY 相关联的副作用函数重新执行，否则会造成不必要的性能开销。

所以要解决上述问题，当设置属性操作发生时，就需要我们在 set 拦截函数内能够区分操作的类型，到底是添加新属性还是设置已有属性。

在 set 拦截函数中，如下代码所示：

```typescript
/**
 * 触发类型枚举
 */
enum TriggerType {
  /** 修改旧属性 */
  SET = "SET",
  /** 添加新属性 */
  ADD = "ADD",
}

const p = new Proxy(obj, {
  set(target, key, newVal, receiver) {
    // 如果属性不存在，则说明是在添加新属性，否则是设置已有属性
    const type = Object.prototype.hasOwnProperty.call(target, key)
      ? TriggerType.SET
      : TriggerType.ADD;
    // 设置属性值
    const res = Reflect.set(target, key, newVal, receiver);

    // 将 type 作为第三个参数传递给 trigger 函数
    if (res) trigger(target, key, type);

    return res;
  },
});
```

在 trigger 函数中，如下代码所示：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 * @param type 操作类型
 */
function trigger<T extends object>(
  target: T,
  key: string | symbol,
  type: TriggerType
) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 取得与 key 相关联的副作用函数
  const effects = depsMap.get(key);
  // 取得与 ITERATE_KEY 相关联的副作用函数
  const iterateEffects = depsMap.get(ITERATE_KEY);
  const effectsToRun = new Set<EffectFnInterface>();

  // 将与 key 相关联的副作用函数添加到 effectsToRun
  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 只有当操作类型为 TriggerType.ADD 时，才触发与 ITERATE_KEY 相关联的副作用函数重新执行
  if (type === TriggerType.ADD) {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}
```

测试一下：

```typescript
effect(() => {
  for (const key in p) {
    console.log(key);
  }
});

// ADD 添加：会触发与 ITERATE_KEY 相关联当副作用函数重新执行
console.log("ADD 添加：p.bar");
p.bar = 2;

// SET 修改：不会触发与 ITERATE_KEY 相关联当副作用函数重新执行
console.log("SET 修改：p.bar");
p.bar = 3;
```

可以看到，当添加新的属性 bar 时，会触发与 ITERATE_KEY 相关联当副作用函数重新执行；当修改已有属性的值，不会触发与 ITERATE_KEY 相关联当副作用函数重新执行。

### 删除

操作一个对象除了读取、添加、修改操作之外，还有删除操作。例如：

```typescript
delete p.foo;
```

对于属性的删除，可以通过 deleteProperty 拦截函数实现：

```typescript
/**
 * 触发类型枚举
 */
enum TriggerType {
  /** 修改旧属性 */
  SET = "SET",
  /** 添加新属性 */
  ADD = "ADD",
  /** 删除属性 */
  DELETE = "DELETE",
}

const p = new Proxy(obj, {
  deleteProperty(target, key) {
    // 检查被操作的属性是否是对象自己的属性
    const hadKey = Object.prototype.hasOwnProperty.call(target, key);
    // 使用 Reflect.deleteProperty 完成属性的删除
    const res = Reflect.deleteProperty(target, key);

    if (res && hadKey) {
      // 只有当被删除的属性是对象自己的属性并且成功删除时，才触发更新
      trigger(target, key, TriggerType.DELETE);
    }

    return res;
  },
});
```

由于删除操作会使得对象的键变少，它会影响 for...in 循环的次数，因此当操作类型为 "DELETE" 时，我们也应该触发那些与 ITERATE_KEY 相关联的副作用函数重新执行：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 * @param type 操作类型
 */
function trigger<T extends object>(
  target: T,
  key: string | symbol,
  type: TriggerType
) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const iterateEffects = depsMap.get(ITERATE_KEY);
  const effectsToRun = new Set<EffectFnInterface>();

  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 当操作类型为 TriggerType.ADD 或 TriggerType.DELETE 时，需要触发与 ITERATE_KEY 相关联的副作用函数重新执行
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}
```

测试一下：

```typescript
effect(() => {
  // for...in 循环
  for (const key in p) {
    console.log(key); // foo
  }
});

// ADD 添加：会触发与 ITERATE_KEY 相关联当副作用函数重新执行
console.log("ADD 添加：p.bar");
p.bar = 2;

// SET 修改：不会触发与 ITERATE_KEY 相关联当副作用函数重新执行
console.log("SET 修改：p.bar");
p.bar = 3;

// DELETE 删除：会触发与 ITERATE_KEY 相关联当副作用函数重新执行
console.log("DELETE 删除：p.bar");
delete p.bar;
```

可以看到，当删除已有属性 bar 时，会触发与 ITERATE_KEY 相关联当副作用函数重新执行。

## 合理地触发响应

### 新旧值比较

当设置的新值和旧值没有变化时，其实不应该触发订阅的副作用函数重新执行。例如：

```typescript
const obj = { foo: 1 };
const p = new Proxy(obj, {
  /* ... */
});

effect(() => {
  console.log(p.foo);
});

// 设置 p.foo 的值，但值没有变化
p.foo = 1;
```

为了满足需求，我们需要修改 set 拦截函数的代码，在调用 trigger 函数触发响应之前，需要检查值是否真的发生了变化：

```typescript
const p = new Proxy(obj, {
  set(target, key, newVal, receiver) {
    // 先获取旧值
    const oldVal = target[key];
    const type = Object.prototype.hasOwnProperty.call(target, key)
      ? TriggerType.SET
      : TriggerType.ADD;
    const res = Reflect.set(target, key, newVal, receiver);

    // 比较新值与旧值，只有当它们不全等，并且都不是 NaN 的时候才触发响应
    if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
      trigger(target, key, type);
    }

    return res;
  },
});
```

### 实现 reactive

为了方便，我们需要封装一个 reactive 函数，该函数接收一个对象作为参数，并返回为其创建的响应式数据：

```typescript
/**
 * 创建响应式数据
 * @param obj 对象
 */
function reactive<T extends object>(obj: T) {
  return new Proxy(obj, {
    /* ... */
  });
}
```

可以看到，reactive 函数只是对 Proxy 进行了一层封装。

### 原型上继承属性

想要合理地触发响应，仅仅比较新旧值还不够。来看一种从原型上继承属性的情况：

```typescript
const obj: { bar?: number } = {};
const proto = { bar: 1 };
const child = reactive(obj);
const parent = reactive(proto);
// 使用 parent 作为 child 的原型
Object.setPrototypeOf(child, parent);

effect(() => {
  console.log(child.bar); // 1
});

// 修改 child.bar 的值
child.bar = 2; // 会导致副作用函数重新执行两次
```

执行上面的代码，会发现副作用函数不仅执行了，还执行了两次，这会导致不必要的更新。

从代码中可以看出，响应式数据 child 本身并没有 bar 属性，因此访问 `child.bar` 时，值是从原型 parent 上继承而来的，而且 parent 也是响应式数据，因此在副作用函数中访问 `child.bar` 时，会导致 `child.bar` 和 `parent.bar` 都与副作用函数建立了响应式联系。

规范中说明，如果设置的属性不存在于对象上，那么会取得其原型，并调用原型的 `[[Set]]` 方法。换句话说，虽然我们操作的是 `child.bar`，但这也会导致 parent 代理对象的 set 拦截函数被执行，这就是为什么修改 `child.bar` 的值会导致副作用函数重新执行两次的原因。

两次执行的 target 和 receiver 参数值如下所示：

```typescript
// child 的 set 拦截函数
set(target, key, value, receiver) {
  // target 是原始对象 obj
  // receiver 是代理对象 child
}

// parent 的 set 拦截函数
set(target, key, value, receiver) {
  // target 是原始对象 proto
  // receiver 是代理对象 child
}
```

我们可以发现，child 和 parent 的 set 拦截函数执行时，receiver 始终都为 child。

解决方案很简单，我们可以把由 `parent.bar` 触发的那次副作用函数的重新执行屏蔽。

我们为 get 拦截函数添加一个能力，如下代码所示：

```typescript
/**
 * 响应式标记
 */
enum ReactiveFlags {
  /** 访问原始数据 */
  RAW = "__v_raw",
}

/**
 * 创建响应式数据
 * @param obj 对象
 */
function reactive<T extends object>(obj: T) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 代理对象可以通过 ReactiveFlags.RAW 属性访问原始数据
      if (key === ReactiveFlags.RAW) {
        return target;
      }

      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    // ...
  });
}
```

有了这个功能，我们就可以在 set 拦截函数中判断 receiver 是不是 target 的代理对象了：

```typescript
/**
 * 创建响应式数据
 * @param obj 对象
 */
function reactive<T extends object>(obj: T) {
  return new Proxy(obj, {
    set(target, key, newVal, receiver) {
      const oldVal = target[key];
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerType.SET
        : TriggerType.ADD;
      const res = Reflect.set(target, key, newVal, receiver);

      // target === receiver[ReactiveFlags.RAW] 说明 receiver 就是 target 的代理对象
      if (target === receiver[ReactiveFlags.RAW]) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type);
        }
      }

      return res;
    },
    // ...
  });
}
```

如上面代码所示，只有当 receiver 是 target 的代理对象时才触发更新，这样就能屏蔽由原型引起的更新，从而避免不必要的更新操作。

## 浅响应与深响应

在 Vue3 中提供了 reactive 深响应和 shallowReactive 浅响应两个函数，用来创建响应式数据。

深响应指的是只有对象的每一层属性都是响应的；浅响应指的是只有对象的第一层属性是响应的。

### reactive 深响应

我们目前实现的 reactive 是浅响应的。例如：

```typescript
const obj = reactive({ foo: { bar: 1 } });

effect(() => {
  console.log(obj.foo.bar);
});

// 修改 obj.foo.bar 的值，并不能触发响应
obj.foo.bar = 2;
```

我们发现，修改 `obj.foo.bar` 并不能触发副作用函数重新执行。这是因为在 reactive 内部实现中，get 拦截函数直接返回属性值，当属性值是一个引用数据类型时，返回的并不是一个响应式对象。因此，数据发生改变并不会导致副作用函数重新执行：

```typescript
/**
 * 创建响应式数据
 * @param obj 对象
 */
function reactive<T extends object>(obj: T) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) {
        return target;
      }

      track(target, key);
      // 当读取属性值时，直接返回结果
      return Reflect.get(target, key, receiver);
    },
    // 省略其他拦截函数
  });
}
```

要想实现深响应，可以对返回的结果进行处理：

```typescript
/**
 * 创建响应式数据
 * @param obj 对象
 */
function reactive<T extends object>(obj: T) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) {
        return target;
      }

      track(target, key);

      // 得到非响应式的结果
      const res = Reflect.get(target, key, receiver);
      if (typeof res === "object" && res !== null) {
        // 调用 reactive 将结果包装成响应式数据并返回
        return reactive(res);
      }
      return res;
    },
    // 省略其他拦截函数
  });
}
```

这就实现了 reactive 深响应。

### shallowReactive 浅响应

因为 shallowReactive 和 reactive 的实现代码很类似，为了减少冗余代码，所以我们可以封装一个 createReactive 函数：

```typescript
/**
 * 封装创建响应式数据逻辑
 * @param obj 对象
 * @param isShallow 是否为浅响应
 */
function createReactive<T extends object>(obj: T, isShallow = false): T {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) {
        return target;
      }

      track(target, key);

      const res = Reflect.get(target, key, receiver);
      // 如果是浅响应，则直接返回结果
      if (isShallow) {
        return res;
      } else {
        if (typeof res === "object" && res !== null) {
          // 调用 createReactive 将结果包装成响应式数据并返回
          return createReactive(res);
        }
        return res;
      }
    },
    // 省略其他拦截函数
  });
}
```

有了 createReact 函数后，我们就可以使用它来实现 reactive 和 shallowReactive 函数了：

```typescript
/**
 * 创建深响应式数据
 * @param obj 对象
 */
function reactive<T extends object>(obj: T) {
  return createReactive(obj);
}

/**
 * 创建浅响应式数据
 * @param obj 对象
 */
function shallowReactive<T extends object>(obj: T) {
  return createReactive(obj, true);
}
```

测试一下：

```typescript
const obj = shallowReactive({ foo: { bar: 1 } });

effect(() => {
  console.log(obj.foo.bar);
});

// obj.foo 是响应的，可以触发副作用函数重新执行
obj.foo = { bar: 2 };

// obj.foo.bar 不是响应式的，不能触发副作用函数重新执行
obj.foo.bar = 3;
```

## 深只读和浅只读

在 Vue3 中提供了 readonly 深只读和 shallowReadonly 浅只读两个函数，用来创建只读数据。

深只读指的是只有对象的每一层属性都是只读的；浅只读指的是只有对象的第一层属性是只读的。

只读本质上也是对数据对象的代理，我们可以在 createReactive 函数原有的基础上改进实现：

```typescript
/**
 * 封装创建响应式数据逻辑
 * @param obj 对象
 * @param isShallow 是否为浅响应/浅只读
 * @param isReadonly 是否只读
 */
function createReactive<T extends object>(
  obj: T,
  isShallow = false,
  isReadonly = false
): T {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) {
        return target;
      }

      // 因为只读的时候数据会始终保持不变，所以不需要建立响应式联系
      if (!isReadonly) {
        track(target, key);
      }

      const res = Reflect.get(target, key, receiver);
      if (isShallow) {
        return res;
      } else {
        if (typeof res === "object" && res !== null) {
          // 如果是深只读，则每一层属性都是只读；否则返回响应式数据
          return isReadonly && !isShallow
            ? createReactive(res, false, true)
            : createReactive(res);
        }
        return res;
      }
    },

    set(target, key, newVal, receiver) {
      //如果是只读的，则打印警告信息并返回
      if (isReadonly) {
        console.warn(`属性 ${key.toString()} 是只读的`);
        return true;
      }
      const oldVal = target[key];
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerType.SET
        : TriggerType.ADD;
      const res = Reflect.set(target, key, newVal, receiver);

      if (target === receiver[ReactiveFlags.RAW]) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type);
        }
      }

      return res;
    },

    deleteProperty(target, key) {
      //如果是只读的，则打印警告信息并返回
      if (isReadonly) {
        console.warn(`属性 ${key.toString()} 是只读的`);
        return true;
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);

      if (res && hadKey) {
        trigger(target, key, TriggerType.DELETE);
      }

      return res;
    },
    // ...
  });
}
```

上面代码主要做了几点处理：

- 只读数据不会改变，因此需要在 set 和 deleteProperty 拦截函数进行限制；
- 只读数据不会改变，因此不需要建立响应式联系；
- 深只读数据，需要限制每一层属性都应该是只读的；
- 浅只读数据，只需要限制第一层属性是只读的；

接下来，我们就可以使用它来实现 readonly 和 shallowReadonly 函数了：

```typescript
/**
 * 创建深只读数据
 * @param obj 对象
 */
function readonly<T extends object>(obj: T) {
  return createReactive(obj, false, true);
}

/**
 * 创建浅只读数据
 * @param obj 对象
 */
function shallowReadonly<T extends object>(obj: T) {
  return createReactive(obj, true, true);
}
```

测试一下：

```typescript
const obj1 = readonly({ foo: { bar: 1 } });
// 修改第一层数据，修改失败
obj1.foo = { bar: 2 };
// 修改第二层数据，修改失败
obj1.foo.bar = 3;

const obj2 = shallowReadonly({ foo: { bar: 1 } });
// 修改第一层属性的数据，修改失败
obj2.foo = { bar: 2 };
// 修改第二层属性的数据，修改成功
obj2.foo.bar = 3;
```

## 缓存代理对象

虽然我们已经基本实现创建普通对象的响应式数据，但是我们发现在读取响应式数据的引用数据类型属性值时，并不按照预期工作。例如：

```typescript
const obj = reactive({ foo: { bar: 1 } });

console.log(obj.foo.bar === obj.foo.bar); // 打印 true，符合预期
console.log(obj.foo === obj.foo); // 打印 false，不符合预期
```

问题的原因是：在实现的响应式数据的 get 拦截函数中，读取一个响应式数据的引用数据类型属性值时，其实读取的是它的代理对象，并且每次读取都是新的代理对象：

```typescript
if (typeof res === "object" && res !== null) {
  // 如果值可以被代理，则返回代理对象
  return isReadonly && !isShallow
    ? createReactive(res, false, true)
    : createReactive(res);
}
```

要想解决这个问题，我们只需要保证每次读取同一个响应式数据的引用数据类型属性值都是相同的即可。

我们需要修改实现响应式数据的代码：

```typescript
/** 定义一个 Map 实例，存储原始对象到代理对象的映射 */
const reactiveMap = new Map();

/**
 * 封装创建响应式数据逻辑
 * @param obj 对象
 * @param isShallow 是否为浅响应/浅只读
 * @param isReadonly 是否只读
 */
function createReactive<T extends object>(
  obj: T,
  isShallow = false,
  isReadonly = false
): T {
  // 优先通过原始对象 obj 寻找之前创建的代理对象，如果找到了，直接返回已有的代理对象
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;

  // 否则，创建新的代理对象
  const proxy = new Proxy(obj, {
    /* ... */
  });

  // 存储到 Map 中，避免重复创建代理对象
  reactiveMap.set(obj, proxy);

  return proxy;
}
```
