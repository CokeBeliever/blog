# 解决硬编码副作用函数

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
