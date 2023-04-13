# 代理 Set 和 Map

:pushpin:为了避免陈述冗余，本篇中的 Set 指的是 Set 和 WeakSet 的统称；Map 指的是 Map 和 WeakMap 的统称，除非特殊说明。

在 JavaScript 中，集合类型 Set 和 Map，它们与普通对象类型的操作会存在一些不同，下面总结了所有集合类型的属性和方法：

| 属性和方法 | Set                                            | Map                                  |
| ---------- | ---------------------------------------------- | ------------------------------------ |
| size       | 返回 Set 中元素的数量                          | 返回 Map 中键值对的数量              |
| clear()    | 清空 Set                                       | 清空 Map                             |
| delete()   | 删除指定的元素                                 | 删除指定的键值对                     |
| has()      | 判断 Set 是否存在指定的元素                    | 判断 Map 是否存在指定键值对          |
| keys()     | 返回一个迭代器对象，迭代元素，等价于 values()  | 返回一个迭代器对象，迭代键值对的键   |
| values()   | 返回一个迭代器对象，迭代元素，等价于 keys()    | 返回一个迭代器对象，迭代键值对的值   |
| entries()  | 返回一个迭代器对象，迭代元素，`[value, value]` | 返回一个迭代器对象，迭代键值对的数组 |
| forEach()  | 遍历所有元素                                   | 遍历所有键值对                       |
| add()      | 添加指定的元素                                 | undefined                            |
| set()      | undefined                                      | 添加指定的键值对                     |
| get()      | undefined                                      | 获取指定的键值对                     |

可以看到，这两种集合类型非常相似，主要差异在于 Set 可以使用 `add()` 方法来设置数据，而 Map 可以使用 `set()` 方法来设置数据，并且 Map 可以使用 `get()` 方法读取数据。

## 如何代理 Set 和 Map

由于集合类型与普通对象类型的操作会存在一些不同。因此，在实现中，我们会把代理处理器 (ProxyHandler) 进行分开实现：

- 基础类型处理器 baseHandler：用于普通对象和数组类型的代理处理器
- 集合类型处理器 collectionHandler：用于集合类型的代理处理器

我们将之前实现的普通对象和数组类型的 ProxyHandler 保存在 `handlers.baseHandler` 中，而将目前要实现的集合类型的 ProxyHandler 保存在 `handlers.collectionHandler` 中，调整代码如下所示：

```typescript
/**
 * 目标类型
 */
const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2,
}

/**
 * 获取 target 的原始类型
 * @param target 对象
 */
function toRawType(target: object) {
  // 从字符串 "[object RawType]" 中提取 "RawType"
  return Object.prototype.toString.call(target).slice(8, -1);
}

/**
 * 从原始类型到 targetType 的映射
 * @param rawType 原始类型
 */
function targetTypeMap(rawType: string) {
  switch (rawType) {
    case "Object":
    case "Array":
      return TargetType.COMMON;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return TargetType.COLLECTION;
    default:
      return TargetType.INVALID;
  }
}

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

  const targetType = targetTypeMap(toRawType(obj));
  // 如果 targetType 是 TargetType.INVALID，则不实现响应式，只对特定的值类型实现响应式
  if (targetType === TargetType.INVALID) {
    return obj;
  }

  const handlers: { [key: string]: ProxyHandler<T> } = {
    /** 基础类型处理器 */
    baseHandler: {
      /* ... */
    },
    /** 集合类型处理器 */
    collectionHandler: {},
  };

  const proxy = new Proxy(
    obj,
    targetType === TargetType.COLLECTION
      ? handlers.collectionHandler
      : handlers.baseHandler
  );

  reactiveMap.set(obj, proxy);

  return proxy;
}
```

接下来，我们主要是实现集合类型的代理处理器 `handlers.collectionHandler`。

## 读取 size 属性和方法的代理

### size 属性

来看一段代码，下面代码代理集合类型并读取其 size 属性：

```typescript
const s = new Set([1, 2, 3]);
const p = reactive(s);

console.log(p.size); // 报错 TypeError: Method get Set.prototype.size called on incompatible receiver #<Set>
```

可以看到，运行报错。根据规范可知，size 是一个只读的访问器属性，在读取 size 时，其实会调用 size 访问器属性的 get() 函数，函数内部在调用时通过 this 读取内部槽 `[[SetData]]`。如果直接代理集合类型，那么 size 访问器属性的 get() 函数的 this 其实指向的是代理对象，而代理对象不具有内部槽 `[[SetData]]`，导致报错。

因此，解决这个问题也很简单，我们需要在 ProxyHandler 的 get 拦截函数中指定由原始对象来读取 size 属性，如下所示：

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
  // ...

  const handlers: { [key: string]: ProxyHandler<T> } = {
    /** 基础类型处理器 */
    baseHandler: {
      /* ... */
    },
    /** 集合类型处理器 */
    collectionHandler: {
      get(target, key, receiver) {
        // 如果读取的是 ReactiveFlags.RAW 属性，则返回原始数据对象 target
        if (key === ReactiveFlags.RAW) {
          return target;
        }

        // 如果读取的是 size 属性，那么由 target 原始对象读取返回
        if (key === "size") {
          return Reflect.get(target, key, target);
        }

        // 读取的是其他属性，由 receiver 代理对象读取返回
        return Reflect.get(target, key, receiver);
      },
    },
  };

  // ...
}
```

### 方法

来看一段代码，下面代码代理集合类型并调用其 delete() 方法：

```typescript
const s = new Set([1, 2, 3]);
const p = reactive(s);

console.log(p.delete(1)); // 报错 TypeError: Method Set.prototype.delete called on incompatible receiver #<Set>
```

可以看到，运行报错。这是什么问题呢？我们可以将 `p.delete(1)` 语句分为两个步骤来看：

1. 读取 `p.delete`，会被 get 拦截函数拦截，读取的是集合类型的方法，由代理对象读取返回；
2. 调用 delete() 方法，由于上一步骤中读取 delete 在 get 拦截函数中由代理对象读取返回，因此，方法执行时其内部的 this 会指向代理对象，导致报错。

因此，解决这个问题也很简单，我们需要在 get 拦截函数中指定由原始对象作为方法执行时内部的 this，如下所示：

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
  // ...

  const handlers: { [key: string]: ProxyHandler<T> } = {
    /** 基础类型处理器 */
    baseHandler: {
      /* ... */
    },
    /** 集合类型处理器 */
    collectionHandler: {
      get(target, key, receiver) {
        if (key === ReactiveFlags.RAW) {
          return target;
        }

        if (key === "size") {
          return Reflect.get(target, key, target);
        }

        // 如果读取的是方法，那么由 bind 绑定原始对象返回
        if (typeof target[key] === "function") {
          return target[key].bind(target);
        }

        return Reflect.get(target, key, receiver);
      },
    },
  };

  // ...
}
```

## 实现响应式数据

实现集合类型对象的响应式数据与普通对象的思路大致相同，主要是：当读取数据时，调用 track 函数建立属性与副作用函数的响应式联系；当设置操作时，调用 trigger 函数触发属性与其关联的副作用函数重新执行。因此，我们有必要对一些属性和方法的操作类型进行分类，如下表所示：

| 操作类型 | Set                                                                                                                  | Map                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 读取操作 | 读取 size 属性<br />调用读取方法：has()<br />调用遍历方法：forEach()<br />调用迭代器方法 keys()、values()、entries() | 读取 size 属性<br />调用读取方法：has()、get()<br />调用遍历方法：forEach()<br />调用迭代器方法：keys()、values()、entries()、forEach() |
| 设置操作 | 调用删除方法：clear()、delete()<br />调用设置方法：add()                                                             | 调用删除方法：clear()、delete()<br />调用设置方法：set()                                                                                |

### size 属性

集合类型的 size 属性是一个只读的访问器属性。因此，size 属性只有读取操作，我们只需要在读取 size 属性时，建立响应式联系。来看一个例子：

```typescript
const p = reactive(new Set([1, 2, 3]));

effect(() => {
  // 在副作用函数内读取 size 属性
  console.log(p.size);
});
```

上面代码中，在副作用函数中读取 `p.size` 属性，会触发代理对象的 get 拦截函数，我们可以在 get 拦截函数中调用 track 建立响应式联系：

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
  // ...

  const handlers: { [key: string]: ProxyHandler<T> } = {
    /** 基础类型处理器 */
    baseHandler: {
      /* ... */
    },
    /** 集合类型处理器 */
    collectionHandler: {
      get(target, key, receiver) {
        if (key === ReactiveFlags.RAW) {
          return target;
        }

        if (key === "size") {
          // 调用 track 函数建立响应式联系
          track(target, ITERATE_KEY);
          return Reflect.get(target, key, target);
        }

        if (typeof target[key] === "function") {
          return target[key].bind(target);
        }

        return Reflect.get(target, key, receiver);
      },
    },
  };

  // ...
}
```

如果 size 属性值改变了，那么就意味着集合类型中数据元素数量改变了，需要触发它们关联的副作用函数重新执行；同样地，如果遍历或迭代集合类型中数据元素数量改变了，那么就意味着 size 属性值改变了，需要触发它们关联的副作用函数重新执行。因此，在实现中，我们会将 size 属性与遍历或迭代的副作用函数的响应式联系都关联在 ITERATE_KEY 上。

### 方法

集合类型的方法有些是读取操作，有些是设置操作。无论是读取操作还是设置操作的方法，我们都需要在调用方法时，做一些额外的工作 (例如：track 函数建立响应式联系、trigger 函数触发响应)。因此，我们需要重写原生方法的实现。我们调整一下代码：

```typescript
/** 定义重写集合类型的原生方法 */
const mutableInstrumentations = {};

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
  // ...

  const handlers: { [key: string]: ProxyHandler<T> } = {
    /** 基础类型处理器 */
    baseHandler: {
      /* ... */
    },
    /** 集合类型处理器 */
    collectionHandler: {
      get(target, key, receiver) {
        if (key === ReactiveFlags.RAW) {
          return target;
        }

        if (key === "size") {
          track(target, ITERATE_KEY);
          return Reflect.get(target, key, target);
        }

        // 如果 mutableInstrumentations 对象中存在这个属性
        if (mutableInstrumentations.hasOwnProperty(key)) {
          // 返回定义在 mutableInstrumentations 对象下的方法
          return Reflect.get(mutableInstrumentations, key, receiver);
        }

        return Reflect.get(target, key, receiver);
      },
    },
  };

  // ...
}
```

#### 读取方法

##### has() 方法

该集合类型方法是一个读取操作的方法。因此，当该方法调用时，应该调用 track 建立读取的 key 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  has(key) {
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 调用 track 函数建立响应式联系
    track(target, key);
    return target.has(key);
  },
};
```

##### get() 方法

该集合类型方法是一个读取操作的方法，也是 Map 特有的方法。因此，当该方法调用时，应该调用 track 建立读取的 key 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  get(key) {
    // wrap 函数用来把可代理对象转换为响应式数据
    const wrap = (val) =>
      typeof val === "object" && val !== null ? reactive(val) : val;
    // 获取原始数据对象
    const target: Map<any, any> = this[ReactiveFlags.RAW];
    // 建立响应式联系
    track(target, key);
    // 返回调用 wrap 函数包装的结果
    return wrap(target.get(key));
  },
};
```

由于该方法可能会返回一个可代理对象，因此，我们在实现中会将可代理对象转换为响应式数据，这里默认实现了深响应。

#### 遍历方法

##### forEach() 方法

该集合类型方法是一个读取操作的方法。因此，当该方法调用时，应该调用 track 建立 ITERATE_KEY 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  forEach(callback, thisArg) {
    // wrap 函数用来把可代理对象转换为响应式数据
    const wrap = (val) =>
      typeof val === "object" && val !== null ? reactive(val) : val;
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 与 ITERATE_KEY 建立响应式联系
    track(target, ITERATE_KEY);
    // 通过原始数据对象调用 forEach 方法，并把 callback 和 thisArg 传递过去
    target.forEach((value, key) => {
      // 手动调用 callback，用 wrap 函数包裹 value 和 key 后再传给 callback，这样就实现了深响应
      callback.call(thisArg, wrap(value), wrap(key), this);
    });
  },
};
```

由于该方法可能会返回一个可代理对象，因此，我们在实现中会将可代理对象转换为响应式数据，这里默认实现了深响应。

#### 设置方法

##### add() 方法

该集合类型方法是一个设置操作的方法，也是 Set 特有的方法。因此，当该方法调用时，应该调用 trigger 触发副作用函数重新执行，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  add(key) {
    // this 仍然指向的是代理对象，通过 ReactiveFlags.RAW 属性获取原始数据对象
    const target: Set<any> = this[ReactiveFlags.RAW];
    // 先判断 key 是否已经存在
    const had = target.has(key);
    // 通过原始数据对象执行 add 方法删除具体的值
    const res = target.add(key);
    // 只有在值不存在的情况下，才需要触发响应
    if (!had) {
      // 调用 trigger 函数触发响应，并指定操作类型为 TriggerType.ADD
      trigger(target, key, TriggerType.ADD);
    }
    // 返回操作结果
    return res;
  },
};
```

##### set() 方法

该集合类型方法是一个设置操作的方法，也是 Map 特有的方法。因此，当该方法调用时，应该调用 trigger 触发副作用函数重新执行，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  set(key, value) {
    // 获取原始数据对象
    const target: Map<any, any> = this[ReactiveFlags.RAW];
    // 判断设置的 key 是否存在
    const had = target.has(key);
    // 获取旧值
    const oldValue = target.get(key);
    // 设置新值
    target.set(key, value);

    // 如果不存在，则说明是 TriggerType.ADD 类型的操作，否则说明是 TriggerType.SET 类型的操作
    if (!had) {
      trigger(target, key, TriggerType.ADD);
    }
    // 代码运行到这里，说明是 TriggerType.SET 类型的操作，如果新旧值不相同，则触发响应
    else if (oldValue !== value || (oldValue === oldValue && value === value)) {
      trigger(target, key, TriggerType.SET, value, oldValue);
    }
  },
};
```

##### delete() 方法

该集合类型方法是一个设置操作的方法。因此，当该方法调用时，应该调用 trigger 触发副作用函数重新执行，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  delete(key) {
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 判断 key 是否存在
    const had = target.has(key);
    const res = target.delete(key);
    // 只有在值存在的情况下，才需要触发响应
    if (had) {
      // 调用 trigger 函数触发响应，并指定操作类型为 TriggerType.DELETE
      trigger(target, key, TriggerType.DELETE);
    }
    return res;
  },
};
```

##### clear() 方法

该集合类型方法是一个设置操作的方法。因此，当该方法调用时，应该调用 trigger 触发副作用函数重新执行，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  clear() {
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 获取清除之前的 size 值
    const oldSize = target.size;
    target.clear();
    // 只有在 oldSize > 0 的情况下，才需要触发响应
    if (oldSize > 0) {
      // 调用 trigger 函数触发响应，并指定操作类型为 TriggerType.DELETE
      trigger(target, ITERATE_KEY, TriggerType.DELETE);
    }
  },
};
```

#### 迭代器方法

因为集合类型的实例是可迭代对象，所以它支持使用 `for...of`、扩展操作符等迭代器方式来迭代。

集合类型的迭代器方法有：

- `[Symbol.iterator]()`：默认的迭代器方法，对于 Set，每次迭代返回的值为 `value`；对于 Map，每次迭代返回的值为 `[key, value]`。
- keys()：对于 Set，每次迭代返回的值为 `value`；对于 Map，每次迭代返回的值为 `key`。
- values()：对于 Set，每次迭代返回的值为 `value`；对于 Map，每次迭代返回的值为 `value`。
- entries()：对于 Set，每次迭代返回的值为 `[value, value]`；对于 Map，每次迭代返回的值为 `[key, value]`。

##### `[Symbol.iterator]()` 方法

该集合类型方法是一个读取操作的方法。因此，当该方法调用时，应该调用 track 建立 ITERATE_KEY 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  [Symbol.iterator]() {
    // wrap 函数用来把可代理对象转换为响应式数据
    const wrap = (val) =>
      typeof val === "object" && val !== null ? reactive(val) : val;
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 获取原始类型
    const rawType = toRawType(target);
    // 获取原始默认迭代器
    const itr = target[Symbol.iterator]();

    // 调用 track 函数建立响应式联系
    track(target, ITERATE_KEY);

    // 返回自定义迭代器
    return {
      next() {
        // 调用迭代器的 next 方法获取 value 和 done
        const { value, done } = itr.next();

        // Set 和 WeakSet
        if (rawType === "Set" || rawType === "WeakSet") {
          return {
            value: wrap(value),
            done,
          };
        }
        // Map 和 WeakMap
        else {
          return {
            // 如果 value 不是 undefined，则对其进行包装
            value: value ? [wrap(value[0]), wrap(value[1])] : value,
            done,
          };
        }
      },
    };
  },
};
```

由于迭代器迭代时可能会返回一个可代理对象，因此，我们在实现中会将可代理对象转换为响应式数据，这里默认实现了深响应。

##### keys() 方法

该集合类型方法是一个读取操作的方法。因此，当该方法调用时，应该调用 track 建立 ITERATE_KEY 或 MAP_KEY_ITERATE_KEY 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  keys() {
    // wrap 函数用来把可代理对象转换为响应式数据
    const wrap = (val) =>
      typeof val === "object" && val !== null ? reactive(val) : val;
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 获取原始类型
    const rawType = toRawType(target);
    // 获取原始 keys 迭代器
    const itr = target.keys();

    // 调用 track 函数建立响应式联系
    track(
      target,
      rawType === "Set" || rawType === "WeakSet"
        ? ITERATE_KEY
        : MAP_KEY_ITERATE_KEY
    );

    // 返回自定义迭代器
    return {
      next() {
        // 调用迭代器的 next 方法获取 value 和 done
        const { value, done } = itr.next();

        return {
          value: wrap(value),
          done,
        };
      },
      // 实现可迭代协议
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};
```

注意，如果是 Set 集合，我们会建立 ITERATE_KEY 与副作用函数的响应式联系；如果是 Map，我们会建立 MAP_KEY_ITERATE_KEY 与副作用函数的响应式联系。这是为了避免不必要的副作用函数重新执行，对于 Map 来说，他有 key 和 value 两个数据域，只有在当操作类型是新增或删除的设置操作时，才需要触发 keys() 相关的副作用函数重新执行。

##### values() 方法

该集合类型方法是一个读取操作的方法。因此，当该方法调用时，应该调用 track 建立 ITERATE_KEY 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  values() {
    // wrap 函数用来把可代理对象转换为响应式数据
    const wrap = (val) =>
      typeof val === "object" && val !== null ? reactive(val) : val;
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 获取原始 valuse 迭代器
    const itr = target.values();

    // 调用 track 函数建立响应式联系
    track(target, ITERATE_KEY);

    // 返回自定义迭代器
    return {
      next() {
        // 调用迭代器的 next 方法获取 value 和 done
        const { value, done } = itr.next();

        return {
          value: wrap(value),
          done,
        };
      },
      // 实现可迭代协议
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};
```

##### entries() 方法

该集合类型方法是一个读取操作的方法。因此，当该方法调用时，应该调用 track 建立 ITERATE_KEY 与副作用函数的响应式联系，重写原生方法的实现如下所示：

```typescript
const mutableInstrumentations = {
  // ...
  entries() {
    // wrap 函数用来把可代理对象转换为响应式数据
    const wrap = (val) =>
      typeof val === "object" && val !== null ? reactive(val) : val;
    // 获取原始数据对象
    const target: Set<any> | Map<any, any> = this[ReactiveFlags.RAW];
    // 获取原始 entries 迭代器
    const itr = target.entries();

    // 调用 track 函数建立响应式联系
    track(target, ITERATE_KEY);

    // 返回自定义迭代器
    return {
      next() {
        // 调用迭代器的 next 方法获取 value 和 done
        const { value, done } = itr.next();

        return {
          // 如果 value 不是 undefined，则对其 key 和 value 进行包装
          value: value ? [wrap(value[0]), wrap(value[1])] : value,
          done,
        };
      },
      // 实现可迭代协议
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};
```

### trigger 函数

对于 Map 来说，由于 Map 有 key 和 value 数据域，我们需要让 trigger 做一些额外的工作，主要是：

- Map 的新增或删除类型的设置操作：触发 ITEATE_KEY 和 MAP_KEY_ITERATE_KEY 相关联的副作用函数重新执行；
- Map 的修改类型的设置操作：触发 ITEATE_KEY 相关联的副作用函数重新执行；避免触发 MAP_KEY_ITERATE_KEY (keys() 迭代器方法) 相关联的副作用函数重新执行；

```typescript
/** 用于建立 Map 或 WeakMap 类型与 keys() 迭代器方法相关联的副作用函数的响应式联系 */
const MAP_KEY_ITERATE_KEY = Symbol();

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
    (Array.isArray(target) && key === "length" && newVal < oldVal) ||
    // 如果触发类型为 TriggerType.SET 且 target 是 Map 或 WeakMap 类型时，那么触发相关联的副作用函数重新执行
    (type === TriggerType.SET &&
      (toRawType(target) === "Map" || toRawType(target) === "WeakMap"))
  ) {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (
    // 如果触发类型为 TriggerType.ADD 或 TriggerType.DELETE 且 target 是 Map 或 WeakMap 类型时，那么触发 MAP_KEY_ITERATE_KEY 相关联的副作用函数重新执行
    (type === TriggerType.ADD || type === TriggerType.DELETE) &&
    (toRawType(target) === "Map" || toRawType(target) === "WeakMap")
  ) {
    const mapKeyIterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY);

    mapKeyIterateEffects &&
      mapKeyIterateEffects.forEach((effectFn) => {
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
