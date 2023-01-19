# 在 HTML 中使用 JavaScript

在 HTML 中使用 JavaScript 是使用 `<script>` 标签。

## `<script>` 标签

使用 `<script>` 标签的方式有两种：

- 行内 script：通过它在 HTML 中嵌入 JavaScript 代码。
- 外部 script：通过它在 HTML 中引用 JavaScript 文件。

不管是哪种方式，如果它们没有使用 defer 和 async 属性，浏览器都会按照 `<script>` 标签在页面中出现的顺序依次解释它们。默认情况下，第二个 `<script>` 标签的代码必须在第一个 `<script>` 标签的代码解释完毕才能开始解释，第三个则必须等第二个解释完，以此类推。

默认情况下，HTML 在解释 `<script>` 标签时，会阻塞后续的代码。特别是在外部 script 时，阻塞时间会包含下载文件的时间。

行内 script，如下所示：

```html
<script>
  console.log("行内 script");
</script>
```

外部 script，如下所示：

```html
<script src="example.js"></script>
```

## 页面渲染的问题

过去，所有 `<script>` 标签都被放在页面的 `<head>` 标签内，这种做法的主要目的是把外部的 CSS 和 JavaScript 文件都集中放到一起。不过，这样做也就意味着必须把所有 JavaScript 代码都下载、解析和解释完成后，才能开始渲染页面（页面在浏览器解析到 `<body>` 的起始标签时开始渲染）。

对于需要很多 JavaScript 的页面，这会导致页面渲染的明显延迟，在此期间浏览器窗口完全空白。主要有下面几种方式可以解决这个问题：

- 将所有 JavaScript 引入放在 `<body>` 标签中的页面内容后面。
- 推迟执行 script。
- 异步执行 script。

这样一来，页面会在处理 JavaScript 代码之前完全渲染页面。用户会感觉页面加载更快了，因为浏览器显示空白页面的时间短了。

### 推迟执行 script

HTML 4.01 为 `<script>` 标签定义了一个叫 defer 的属性，只对外部 script 有效。这个属性表示 `<script>` 在执行的时候不会改变页面的结构。因此，这个 `<script>` 完全可以在整个页面解析完之后再运行。在 `<script>` 标签上设置 defer 属性，会告诉浏览器应该立即开始下载，但执行应该延迟：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example HTML Page</title>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
  </head>
  <body>
    <!-- 这里是页面内容 -->
  </body>
</html>
```

虽然这个例子中的 `<script>` 标签包含在页面的 `<head>` 中，但它们会在浏览器解析到结束的 `</html>` 标签后才会执行。

HTML5 规范要求 `<script>` 应该按照它们出现的顺序执行，因此第一个推迟的 `<script>` 会在第二个推迟的 `<script>` 之前执行，而且两者都会在 DOMContentLoaded 事件之前执行。

### 异步执行 script

HTML5 为 `<script>` 标签定义了 async 属性。从改变 `<script>` 处理方式上看，async 属性与 defer 类似。当然，它们两者也都只适用于外部 script，都会告诉浏览器立即开始下载。不过，与 defer 不同的是，标记为 async 的 `<script>` 并不保证能按照他们出现的次序执行。

给 `<script>` 添加 async 属性的目的是告诉浏览器，不必等 `<script>` 下载和执行完后再加载页面，同样也不必等到该异步 `<script>` 下载和执行后再加载其他 `<script>` 。正因为如此，异步 `<script>` 不应该在加载期间修改 DOM。

异步 `<script>` 保证会在页面的 load 事件前执行，但可能会在 DOMContentLoaded 之前或之后。
