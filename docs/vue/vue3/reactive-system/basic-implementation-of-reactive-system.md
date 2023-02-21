# 响应式系统的基本实现

如何让 `obj.text` 变成响应式数据呢？通过观察我们能发现两点线索：

* 当 effect 函数执行时，会触发 `obj.text` 的读取 (get) 操作；
* 当修改 `obj.text` 的值时，会触发 `obj.text` 的设置 (set) 操作；

如果我们能拦截一个对象的读取和设置操作，事情就变得简单了：

* 在读取 `obj.text` 时，将这个数据相关的函数存储起来；
* 在设置 `obj.text` 时，将这个数据相关的函数取出来执行；

现在问题的关键变成了我们如何才能拦截一个对象属性的读取和设置操作呢？在 ES6 之前，只能通过 `Object.defineProperty` 函数实现，这也是 Vue2 所采用的方式。从 ES6 开始，我们可以使用代理对象 Proxy 来实现，这也是 Vue3 所采用的方式。

我们可以根据上述思路，采用 Proxy 来实现：

```typescript
// 存储函数的 "桶"
const bucket = new Set<Function>()
// 原始数据
const data = { text: 'hello world' }
// 响应式数据
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key, receiver) {
    // 将 effect 存储起来
    bucket.add(effect)
    // 返回属性值
    return Reflect.get(target, key, receiver)
  },

  // 拦截设置操作
  set(target, key, newVal, receiver) {
    // 设置属性值
    const res = Reflect.set(target, key, newVal, receiver)
    // 如果设置操作成功，就把存储的函数取出来执行
    if (res) bucket.forEach((effectFn) => effectFn())
    // 返回设置操作是否成功
    return res
  },
})

function effect() {
  document.body.innerText = obj.text
}
```

测试一下：

```typescript
effect()

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
```

上面这段代码编译为 JavaScript 代码，并在浏览器中运行，会得到期望的结果 (1s 后 `obj.text` 会修改，effect 函数会重新执行)。

但是目前实现还存在很多缺陷，实现一个完善的响应式系统要考虑诸多细节。