# 副作用函数

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
