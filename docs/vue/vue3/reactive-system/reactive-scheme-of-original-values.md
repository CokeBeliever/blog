# 原始值的响应式方案

原始值指的是 string、boolean、number、bigInt、symbol、undefined 和 null 等原始数据类型的值。

## 引入 ref 的概念

由于 Proxy 的代理目标不能为原始值。因此，我们没有办法直接地拦截对原始值的操作，从而实现原始值的响应式数据。例如：

```typescript
let str = "vue";
// 无法拦截对原始值的修改操作
str = "vue3";
```

对于这个问题，我们的解决方案是用一个引用值去 "包裹" 原始值。例如：

```typescript
const wrapper = {
  value: "vue",
};
// 可以使用 Proxy 代理 wrapper，间接地拦截对原始值的操作
const name = reactive(wrapper);
effect(() => {
  console.log(name.value); // vue
});
// 修改值可以触发响应
name.value = "vue3";
```

但这样做会导致一些问题：

- 用户为了创建一个原始值的响应式数据，就不得不顺带创建一个包裹对象，比较繁琐。
- 包裹对象由用户自定义，而这也就意味着不规范。用户可以随意命名，例如：`wrapper.value`、`warpper.val`。这在多人协同的开发环境下，不仅会降低代码的可读性、可维护性，还会提高用户的心智负担。

为了解决这些问题，我们可以将创建原始值的响应式数据的过程封装在一个 ref 函数中，代码如下所示：

```typescript
/**
 * 创建原始值的响应式数据
 * @param value 原始值
 */
function ref(
  value: string | number | boolean | bigint | symbol | undefined | null
) {
  // 在 ref 函数内部创建包裹对象
  const wrapper = {
    value,
  };
  // 将 wrapper 变为响应式数据
  return reactive(wrapper);
}
```

我们可以如下所示使用：

```typescript
const name = ref("vue");

effect(() => {
  console.log(name.value);
});

// 修改值可以触发响应
name.value = "vue3";
```

### 原始值的标识

目前看来 ref 和 reactive 函数实现响应式数据，似乎没有什么区别：

```typescript
const refVal1 = ref(1);
const refVal2 = reactive({ value: 1 });
```

上述代码，虽然 ref 和 reactive 都是返回一个响应式数据，但是 ref 的代理目标是原始值，而 reactive 的代理目标是引用值。因此，我们需要有一个标识，用于区分响应式数据的代理目标是原始值还是引用值。

我们可以修改 ref 函数的实现：

```typescript
/**
 * 响应式标记
 */
enum ReactiveFlags {
  // ...
  /** 代理目标是否为原始值 */
  IS_REF = "__v_isRef",
}

/**
 * 创建原始值的响应式数据
 * @param value 原始值
 */
function ref(
  value: string | number | boolean | bigint | symbol | undefined | null
) {
  const wrapper = {
    value,
  };
  // 使用 Object.defineProperty 在 wrapper 对象上定义 ReactiveFlags.IS_REF 数据属性 (不可删除、不可枚举、不可写)，它的值为 true。
  Object.defineProperty(wrapper, ReactiveFlags.IS_REF, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true,
  });
  return reactive(wrapper);
}
```

这样，我们就可以通过响应式数据的 `ReactiveFlags.IS_REF` 属性来判断代理目标是原始值还是引用值了。

## 响应丢失问题

我们来看一个响应丢失的例子：

```typescript
// 创建响应式数据
const obj = reactive({ foo: 1, bar: 2 });

// 将响应式数据展开到一个新的对象 newObj
const newObj = {
  ...obj,
};

effect(() => {
  // 在副作用函数内，读取 newObj.foo
  console.log(newObj.foo);
});

obj.foo++; // 不会触发响应
newObj.foo++; // 不会触发响应
```

上面代码，由于使用展开操作符 (`...`) 展开响应式数据到新对象导致响应丢失。

使用展开操作符展开响应式数据到新对象中，会将被展开的响应式数据中的可枚举属性的键和值，都添加到新对象中。无论被展开的响应式数据的属性是数据属性还是访问器属性，都将作为数据属性添加在新对象中。因此，都会导致响应丢失问题。

要解决响应丢失问题，我们可以通过访问器属性来访问响应式数据。通过这种间接访问响应式数据的方式，从而避免了响应丢失问题。对上面例子进行调整，如下所示：

```typescript
const obj = reactive({ foo: 1, bar: 2 });

const newObj = {
  // 访问器属性 foo
  get foo() {
    return obj.foo;
  },
  set foo(value) {
    obj.foo = value;
  },
  // 访问器属性 bar
  get bar() {
    return obj.bar;
  },
  set bar(value) {
    obj.bar = value;
  },
};

effect(() => {
  console.log(newObj.foo);
});

obj.foo++; // 会触发响应
newObj.foo++; // 会触发响应
```

虽然这样修改解决了响应丢失问题，但是这样也带来了新的问题：

- 为了避免响应丢失，我们需要手动编写访问器属性的代码，而且属性很多的时候，会有很多冗余代码；
- 失去使用扩展操作符所带来的便利。

我们先解决第一个问题，其实可以将前面手动编写的代码封装到 toRef 函数中，如下所示：

```typescript
/**
 * 创建响应式数据指定 key 的引用对象
 * @param obj 对象
 * @param key 键
 */
function toRef<T extends object, K extends keyof T>(obj: T, key: K) {
  const wrapper = {
    get value() {
      return obj[key];
    },
    set value(value) {
      obj[key] = value;
    },
  };
  // 定义 ReactiveFlags.IS_REF 属性
  Object.defineProperty(wrapper, ReactiveFlags.IS_REF, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true,
  });
  return wrapper;
}
```

我们可以如下所示使用：

```typescript
const obj = reactive({ foo: 1, bar: 2 });

const newObj = {
  foo: toRef(obj, "foo"),
  bar: toRef(obj, "bar"),
};

effect(() => {
  // 在副作用函数内，读取 newObj.foo.value
  console.log(newObj.foo.value);
});

obj.foo++; // 会触发响应
newObj.foo.value++; // 会触发响应
```

可以看到，代码变得非常简洁。

接着，我们来解决第二个问题。我们可以封装 toRefs 函数，来批量添加属性：

```typescript
/**
 * 创建响应式数据所有属性的引用对象
 * @param obj 对象
 */
function toRefs<T extends object>(obj: T) {
  const ret = {} as {
    [key in keyof T]: {
      value: T[Extract<keyof T, string>];
    };
  };
  // 使用 for...in 循环遍历对象
  for (const key in obj) {
    // 逐个调用 toRef 添加属性
    ret[key] = toRef(obj, key);
  }
  return ret;
}
```

我们可以如下所示使用：

```typescript
const obj = reactive({ foo: 1, bar: 2 });

const newObj = {
  ...toRefs(obj),
};

effect(() => {
  console.log(newObj.foo.value);
});

obj.foo++; // 会触发响应
newObj.foo.value++; // 会触发响应
```

可以看到，现在也可以使用扩展操作符来扩展响应式数据了。
