# 响应式数据

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
