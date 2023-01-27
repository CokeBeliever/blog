# 在 HTML 中使用 CSS

在 HTML 中使用 CSS 有多种方式。

## `<link>` 标签

通过 `<link>` 标签引入的外部样式表 (external stylesheet)。如下所示：

```html
<link rel="stylesheet" type="text/css" href="sheet1.css" media="all" />
```

为了正确加载外部样式表，link 标签必须放在 head 标签中，不能放在其他标签中。

**属性**

- rel 属性："relation" (关系) 的简称，这里指定的关系是 stylesheet。

- type 属性：值始终为 text/css，说明通过 `<link>` 标签加载的数据类型。

- href 属性：值为样式表的 URL，可以是绝对地址，也可以是相对地址。

- media 属性：值为一个或多个媒体描述符 (media descriptor)，指明媒体的类型和具有的功能。多个媒体描述符以逗号分开。例如，可以像下面这样 link 针对屏幕媒体和投影媒体的样式表：

```html
<link
  rel="stylesheet"
  type="text/css"
  href="visual-sheet.css"
  media="screen, projection"
/>
```

## `<style>` 标签

通过 `<style>` 标签编写的嵌入式样式表 (embedded stylesheet)。`<style>` 标签内即可以直接编写应用到当前 HTML 的样式规则，也可以编写 @import 指令引入外部样式表。

```html
<style type="text/css">
  @import url(sheet2.css);

  body {
    color: red;
  }
</style>
```

注意，`<style>` 标签应该始终设定 type 属性，对于 CSS 文档来说，值是 "text/css"。

## @import 指令

@import 指令用于从样式表中引入样式表。如下所示：

```css
@import url(sheet2.css);
@import url(blueworld.css);
@import url(zany.css);
```

这几个外部样式表都会加载并应用到当前 HTML 中。

@import 指令也可以设置引入的样式表应用于何种媒体。方法是在样式表的 URL 后面提供媒体描述符：

```css
@import url(sheet2.css) all;
@import url(blueworld.css) screen;
@import url(zany.css) projection, print;
```

注意，CSS 规范要求样式表中的 @import 指令必须在所有样式规则前面。遵循规范的用户代理会忽略放在样式规则后面的 @import 指令。

## style 属性

如果只想为单个标签提供少量样式，可以使用标签的 style 属性编写行内样式。如下所示：

```html
<p style="color: gray;">行内样式</p>
```

注意，style 属性的值只能是一系列规则声明，而不能包含整个样式表。因此，不能在 style 属性中使用 @import 指令，也不能有完整的规则。style 属性的值只能是样式规则花括号之间的那一部分。
