# 代理 Array

在 JavaScript 中，数组是一个特殊的对象，它与普通对象的操作会存在一些不同，下面总结了所有对数组元素或属性的读取和设置操作。

- 在 "读取" 操作：
  - 通过索引访问数组元素：`arr[0]`
  - 访问数组的长度：`arr.length`
  - 把数组作为对象，使用 `for...in` 循环遍历
  - 使用 `for...of` 迭代遍历数组
  - 数组的原型方法，如 concat/join/every/some/find/findIndex/includes 等，以及其他所有不改变数组的原型方法
- 在 "设置" 操作：
  - 通过索引修改数组元素值：`arr[1] = 3`
  - 修改数组长度：`arr.length = 0`
  - 数组的栈方法：push/pop/shift/unshift
  - 修改原数组的原型方法：splice/fill/sort 等

## 数组的索引与 length

**通过索引操作数据元素**

通过索引操作数据元素时，代理对象的 get/set 拦截函数也会执行，因此我们不需要做任何额外的工作，就能够让数组索引的读取和设置操作是响应式的了。例如：

```typescript
const arr = reactive(["foo"]);

effect(() => {
  console.log(arr[0]);
});

arr[0] = "bar"; // 能够触发响应
```

但通过索引设置数组的元素值与设置对象的属性值仍然存在根本上的不同，这是因为数组对象的 `[[Set]]` 内部方法所依赖的 `[[DefineOwnProperty]]` 内部方法不同于常规对象。规范中说明，如果设置的索引值大于数组当前的长度，那么要更新数组的 length 属性。所以当通过索引设置元素时，可能会隐式地修改 length 的属性值。因此在触发响应时，也应该触发与 length 属性相关联的副作用函数重新执行，如下面的代码所示：

```typescript
const arr = reactive(["foo"]); // 数组的原长度为 1

effect(() => {
  console.log(arr.length); // 1
});

// 设置索引 1 的值，会导致数组的长度变为 2
arr[1] = "bar"; // 能够触发响应
```

在这段代码中，数组的原长度为 1，并且在副作用函数中访问了 length 属性。然后设置数组索引为 1 的元素值，这会导致数组的长度变为 2，因此应该触发副作用函数重新执行。

**通过 length 操作数据元素**

同样的，修改数组的 length 属性也会隐式地影响数组元素，例如：

```typescript
const arr = reactive(["foo"]);

effect(() => {
  // 访问数组的第 0 个元素
  console.log(arr[0]);
});

// 将数组的长度修改为 0，会导致索引在 0 以及之后的元素都被删除，因此应该触发响应
arr.length = 0;
```

在这段代码中，数组的原长度为 1，并且在副作用函数中访问了索引为 0 的元素。然后设置数组 length 属性为 0，这会导致索引在 0 以及之后的元素都被删除，因此应该触发副作用函数重新执行。

当然并非所有对 length 属性的修改都会影响数组中的已有元素，如果我们将 length 属性设置为 100，这并不会影响索引在 100 之前的元素，只有那些索引值大于或等于新的 length 属性值的元素才需要触发响应。

**实现**

为了实现目标，我们需要修改 set 拦截函数，如下面的代码所示：

```typescript
/**
 * key 是否为索引
 * @param key 属性键
 */
const isIndex = (key: string | symbol): boolean => {
  if (typeof key === "symbol") return false;
  const index = Number(key);
  return Number.isInteger(index) && index >= 0;
};

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
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;

  const proxy = new Proxy(obj, {
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性 ${key.toString()} 是只读的`);
        return true;
      }
      const oldVal = target[key];
      // 判断是在添加新的属性，还是设置已有属性
      let type = TriggerType.SET;

      {
        // 如果代理目标是数组并且 key 是索引时，则检测被设置的索引值是否小于数组长度判断
        if (Array.isArray(target) && isIndex(key)) {
          type =
            Number(key) < target.length ? TriggerType.SET : TriggerType.ADD;
        }
        // 其他情况，则根据属性是否存在进行判断
        else {
          type = Object.prototype.hasOwnProperty.call(target, key)
            ? TriggerType.SET
            : TriggerType.ADD;
        }
      }

      const res = Reflect.set(target, key, newVal, receiver);

      if (target === receiver[ReactiveFlags.raw]) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          // 增加第四个参数，即触发响应的新值
          trigger(target, key, type, newVal);
        }
      }

      return res;
    },
    // ，，，
  });

  reactiveMap.set(obj, proxy);

  return proxy;
}
```

同时，我们也需要在 trigger 函数中正确地触发数组对象的 length 属性和索引相关联的副作用函数重新执行：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 * @param type 操作类型
 * @param newVal 新值
 */
function trigger<T extends object>(
  target: T,
  key: string | symbol,
  type: TriggerType,
  newVal?: any
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

  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  // 当目标对象是数组时
  if (Array.isArray(target)) {
    // 当操作类型为 ADD 并且 key 是索引时，应该取出并执行那些与 length 属性相关联的副作用函数
    if (type === TriggerType.ADD && isIndex(key)) {
      // 取出与 length 相关联的副作用函数
      const lengthEffects = depsMap.get("length");
      // 将这些副作用函数添加到 effectsToRun 中，待执行
      lengthEffects &&
        lengthEffects.forEach((effectFn) => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
    }

    // 修改数组的 length 属性时，应该取出并执行那些大于或等于新 length 值的索引属性相关联的副作用函数
    if (key === "length") {
      depsMap.forEach((effects, key) => {
        if (isIndex(key) && Number(key) >= newVal) {
          effects.forEach((effectFn) => {
            if (effectFn !== activeEffect) {
              effectsToRun.add(effectFn);
            }
          });
        }
      });
    }
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

## 遍历数组

**for...in**

因为数组也是对象，所以数组同样可以使用 for...in 循环遍历。因此数组的遍历同样可以使用 ownKeys 拦截函数进行拦截，但是数组与普通对象在影响 for...in 遍历结果的操作会有所不同：

- 添加新元素或属性：`arr[100] = 'bar'`、`arr['key1'] = 'foo'`
- 修改数组长度：`arr.length = 0`

在数组上添加新元素或属性与普通对象大致相同，因此我们不需要做任何额外的工作。主要区别是在修改数组长度，修改数组的 length 属性也会隐式地影响数组元素，所以需要触发相应的副作用函数重新执行。

**实现**

为了实现目标，我们需要修改 set 拦截函数，如下面的代码所示：

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
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;

  const proxy = new Proxy(obj, {
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性 ${key.toString()} 是只读的`);
        return true;
      }
      const oldVal = target[key];
      let type = TriggerType.SET;

      {
        if (Array.isArray(target) && isIndex(key)) {
          type =
            Number(key) < target.length ? TriggerType.SET : TriggerType.ADD;
        } else {
          type = Object.prototype.hasOwnProperty.call(target, key)
            ? TriggerType.SET
            : TriggerType.ADD;
        }
      }

      const res = Reflect.set(target, key, newVal, receiver);

      if (target === receiver[ReactiveFlags.raw]) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          // 增加第五个参数，即触发响应的旧值
          trigger(target, key, type, newVal, oldVal);
        }
      }

      return res;
    },
    // ...
  });

  reactiveMap.set(obj, proxy);

  return proxy;
}
```

同时，我们需要在 trigger 函数中正确地触发数组对象的 ITERATE_KEY 相关联的副作用函数重新执行：

```typescript
/**
 * 在 set 拦截函数内调用，在响应式数据的指定属性上触发所订阅的副作用函数
 * @param target 响应式数据
 * @param key 属性
 * @param type 操作类型
 * @param newVal 新值
 * @param oldVal 旧值
 */
function trigger<T extends object>(
  target: T,
  key: string | symbol,
  type: TriggerType,
  newVal?: any,
  oldVal?: any
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

  if (
    type === TriggerType.ADD ||
    type === TriggerType.DELETE ||
    // 修改数组的 length 属性且新值比旧值小时，应该取出并执行与迭代相关联的副作用函数
    (Array.isArray(target) && key === "length" && newVal < oldVal)
  ) {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (Array.isArray(target)) {
    if (type === TriggerType.ADD && isIndex(key)) {
      const lengthEffects = depsMap.get("length");
      lengthEffects &&
        lengthEffects.forEach((effectFn) => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
    }

    if (key === "length") {
      depsMap.forEach((effects, key) => {
        if (isIndex(key) && Number(key) >= newVal) {
          effects.forEach((effectFn) => {
            if (effectFn !== activeEffect) {
              effectsToRun.add(effectFn);
            }
          });
        }
      });
    }
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
const arr = reactive(["foo", "bar"]);

effect(() => {
  for (const key in arr) {
    console.log(key);
  }
  console.log("副作用函数执行结束");
});

arr[2] = "baz"; // 可以触发响应
arr["key1"] = "qux"; // 可以触发响应
arr.length = 1; // 可以触发响应
```

可以看到，可以正确地触发响应。

**迭代器方式**

因为数组对象是可迭代对象，所以数组支持使用 for...of、扩展操作符等迭代器方式来遍历数组。

通过迭代器方式来遍历数组，其实会先创建数组迭代器。规范中说明，创建数组迭代器会读取数组的 length 属性，因此在副作用函数中使用迭代器方式来遍历数组，其实会把副作用函数订阅在 length 属性上，当 length 属性修改时，使用迭代器方式来遍历数组的副作用函数会重新执行。因此，可以在不增加任何代码的情况下，我们也能够让数组的迭代器方法正确地工作。

测试一下：

```typescript
const arr = reactive(["foo", "bar"]);

effect(() => {
  for (const val of arr) {
    console.log(val);
  }
  console.log("副作用函数执行结束");
});

arr[2] = "baz"; // 可以触发响应
arr["key1"] = "qux"; // 不会触发响应
arr.length = 1; // 可以触发响应
```

可以看到，可以正确地触发响应。

## 数组的查找方法

很多数组的方法内部其实都依赖了对象的基本语义。所以大多数情况下，我们不需要做特殊处理即可让这些方法按预期工作。例如：

```typescript
const arr = reactive([1, 2]);

effect(() => {
  console.log(arr.includes(1));
});

arr[0] = 3; // 副作用函数重新执行，并打印 false
```

但是，我们发现 includes 在识别引用数据类型时，并不按照预期工作。例如：

```typescript
const obj = {};
const arr = reactive([obj]);

console.log(arr.includes(obj)); // 打印 false，不符合预期
```

规范中说明，includes 方法内部会通过索引读取数组元素的值，因此 includes 和 `arr[0]` 读取数组元素的方式是一样的。

问题的原因是：我们在实现的响应式数据的 get 拦截函数中，读取一个响应式数据的引用数据类型属性值时，其实获取的是它的代理对象。因此，代理对象和原始对象进行比较，结果自然为 false。

要想解决这个问题，我们需要保证在使用数组的查找方法时，只有当代理对象和原始对象调用的查找方法都没找到时，才说明真的没找到。

为了解决问题，我们需要重写数组的查找方法，并修改实现 get 拦截函数的代码：

```typescript
/** 定义重写数组的原生方法 */
const arrayInstrumentations = {};
["includes", "indexOf", "lastIndexOf"].forEach((method) => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    // this 是代理对象，先在代理对象中查找，将结果存储到 res 中
    let res = originMethod.apply(this, args);

    if (res === false || res < 0) {
      // res 为 false || res < 0 说明没找到，通过 this[ReactiveFlags.raw] 拿到原始数组，再去其中查找，并更新 res 值
      res = originMethod.apply(this[ReactiveFlags.raw], args);
    }
    // 返回最终结果
    return res;
  };
});

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
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.raw) {
        return target;
      }

      if (!isReadonly) {
        track(target, key);
      }

      // 如果操作的目标对象是数组，并且 key 存在于 arrayInstrumentations 上，
      // 那么返回定义在 arrayInstrumentations 上的值
      if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      const res = Reflect.get(target, key, receiver);
      if (isShallow) {
        return res;
      } else {
        if (typeof res === "object" && res !== null) {
          return isReadonly && !isShallow
            ? createReactive(res, false, true)
            : createReactive(res);
        }
        return res;
      }
    },
    // ...
  });

  reactiveMap.set(obj, proxy);

  return proxy;
}
```

## 隐式修改数组长度的原型方法

规范中说明，数组的栈方法：push/pop/shift/unshift 和修改原数组的原型方法：splice，它们不仅会隐式地读取数组 length 属性，还会设置数组 length 属性。这会导致两个独立的副作用函数互相影响。例如：

```typescript
const arr: number[] = reactive([])

// 第一个副作用函数
effect(() => {
  arr.push(1);
});

// 第二个副作用函数
effect(() => {
  arr.push(2);
});
```

上述代码，在第一个副作用函数执行时，第一个副作用函数会被订阅在 length 属性上，在第二个副作用函数执行时，第二个副作用函数会被订阅在 length 属性上，同时又因为设置数组 length 属性，又会导致订阅的第一个副作用函数重新执行，在第一个副作用函数重新执行时，同时又因为设置数组 length 属性，又会导致订阅的第二个副作用函数重新执行，一直持续执行，最终会得到栈溢出错误。

这些数组方法在语义上是修改操作，而非读取操作，所以应该避免建立响应联系，从而避免这样的问题。

我们可以重写数组的原生方法：

```typescript
/** 一个标记变量，代表是否进行追踪。默认值为 true，即允许追踪 */
let shouldTrack = true;
["push", "pop", "shift", "unshift", "splice"].forEach((method) => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    // 在调用原生方法之前，禁止追踪
    shouldTrack = false;
    const res = originMethod.apply(this, args);
    // 在调用原生方法之后，恢复追踪
    shouldTrack = true;
    return res;
  };
});
```

同时，我们需要修改 track 函数：

```typescript
/**
 * 在 get 拦截函数内调用，在响应式数据的指定属性上订阅副作用函数
 * @param target 响应式数据
 * @param key 属性
 */
function track<T extends object>(target: T, key: string | symbol) {
  // 当禁止追踪时，直接返回
  if (!activeEffect || !shouldTrack) return;
  let depsMap = bucket.get(target);
  if (!depsMap) bucket.set(target, (depsMap = new Map()));
  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));
  deps.add(activeEffect);
  activeEffect.depsList.push(deps);
}
```
