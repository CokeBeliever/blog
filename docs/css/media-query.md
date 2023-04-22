# 媒体查询

通过媒体查询 (media query) 机制，我们可以对样式表或样式规则做出限制，只应用于特定的媒体 (例如：屏幕、印刷品等)，以及符合特定条件的媒体。在这个机制中，可以使用媒体描述符定义限制条件。

## 简单的媒体查询

### HTML

在 HTML 中，可以设置样式表应用于哪些媒体。

#### `<link>` 标签

通过 `<link>` 标签引入外部样式表，可以设置 media 属性指定样式表应用于哪些媒体。例如：

```html
<link
  rel="stylesheet"
  type="text/css"
  media="screen, speech"
  href="visual.css"
/>
```

#### `<style>` 标签

通过 `<style>` 标签编写的嵌入式样式表，可以设置 media 属性指定样式表应用于哪些媒体。例如：

```html
<style type="text/css" media="screen, speech">
  body {
    font-family: sans-serif;
  }
</style>
```

### CSS

在 CSS 中，可以设置样式表或样式规则应用于哪些媒体。

#### @import 指令

@import 指令引入外部样式表，可以在 url() 后面指定样式表应用于哪些媒体。例如：

```css
@import url(visual.css) screen, speech;
@import url(article-print.css) print;
```

#### @media 指令

我们可以在 @media 指令后面指定样式规则应用于哪些媒体。这种方式可以在同一个样式表中为多种媒体定义样式。例如：

```css
<style type="text/css">
    body {background: white; color: black;}

    @media screen, speech {
        body {font-family: sans-serif;}
        h1 {margin-top: 1em;}
    }

    @meida print {
        body {font-family: serif;}
        h1 {margin-top: 2em; border-bottom: 1px solid silver;}
    }
</style>
```

## 复杂的媒体查询

媒体查询除了可以根据媒体类型应用样式之外，它还可以根据媒体特性应用样式。例如：显示器尺寸、色彩深度等。

因此，媒体查询中可以使用一些逻辑关键字，用于编写复杂的媒体查询。例如：

```css
<link href="print-color.css" type="text/css" media="print and (color)" rel="stylesheet">

<style type="text/css" media="print and (color)">
	body {font-family: sans-serif;}
</style>

@import url(print-color.css) print and (color);

<style type="text/css">
	@media print and (color) {
		body {font-family: sans-serif;}
	}
</style>
```

上面的几种方式，都是在所用的媒体是打印、是彩色的，同时满足这几个条件时才应用指定的样式。

## 媒体查询中的逻辑关键字

在媒体查询中有两个逻辑关键字可用：

- `and`：用于连接媒体类型与媒体特性描述符、或者连接两个媒体特性描述符的关键字。当每个部分的结果都为 true 时，整个媒体查询的结果才为 true。

  例如，`screen and (color) and (orientation: landscape) and (min-device-width: 800px)` 的意思是：所用的媒体是屏幕、是彩色的、是横向放置的，而且设备的显示屏宽度至少为 800 像素，同时满足这几个条件时才应用指定的样式。

- `not`：用于对整个媒体查询的结果取反的关键字。注意，`not` 关键字只能在媒体查询的开头使用。

  例如，`not (color) and (orientation: landscape) and (min-device-width: 800px)` 的意思是：所用的媒体是彩色的、是横向放置的，而且设备的显示屏宽度至少为 800 像素，同时满足这几个条件时才不应用指定的样式，其他情况下则应用指定的样式。

注意：在媒体查询中没有 `or` 关键字。其实，用分隔媒体查询的逗号 `,` 就起到 `or` 的作用。例如：`screen, print` 的意思是 "为屏幕或印刷媒体时应用"。因此，`screen and (max-color: 2) or (monochrome)` 是无效的，正确的写法是 `screen and (max-color: 2), screen and (monochrome)`。

## 媒体描述符

一个**媒体描述符**由一个**媒体类型**和零至多个**媒体特性描述符**构成，而且媒体特性描述符要放在圆括号内。例如：

```css
screen and (color) and (orientation: landscape) and (min-device-width: 800px)
```

多个媒体描述符可由 `,` 分隔，例如：

```css
print and (color), screen and (color)
```

如果没有提供媒体类型，那么媒体类型默认为 `all`。因此，下面两个示例是等效的：

```css
@media all and (min-resolution: 96dpi) {
  ...;
}
@media (min-resolution: 96dpi) {
  ...;
}
```

也可以没有提供媒体特性描述符号。例如：

```css
@media screen, print {
  ...;
}
```

也可以没有提供媒体类型和媒体特性描述符，即不设定媒体描述符，那么样式表或样式规则将应用于所有媒体。例如：

```html
<link rel="stylesheet" type="text/css" href="index.css" />
```

### 媒体类型

常见的媒体类型有：

- `all`：所有能呈现内容的媒体。
- `print`：打印给非盲用户看的文档，或者是文档的打印预览。
- `screen`：呈现文档的屏幕媒体，例如桌上电脑的显示器或手持设备。运行在这种系统上的 Web 浏览器是屏幕媒体用户代理。
- `speech`：语言合成器、屏幕阅读器或其他音频渲染设备。

### 媒体特性描述符

常见的媒体特性描述符有：

#### width，min-width，max-width

取值：`<length>`

指用户代理显示区域的宽度。

- 对屏幕媒体来说，指 Web 浏览器中视区加滚动条的宽度。
- 对分页媒体来说，指页面框 (即页面中用于渲染内容的区域) 的宽度。

因此，`(min-width: 850px)` 在视区的宽度大于或等于 850 像素时起作用。

#### height，min-height，max-height

取值：`<length>`

指用户代理显示区域的高度。

- 对屏幕媒体来说，指 Web 浏览器中视区加滚动条的高度。
- 对分页媒体来说，指页面框的高度。

因此，`(height: 567px)` 在视区的高度正好为 567 像素时起作用。

#### device-width，min-device-width，max-device-width

取值：`<length>`

指输出设备中整个渲染区域的宽度。

- 对屏幕媒体来说，指屏幕的宽度，即手持设备的屏幕或桌面显示器的横向尺寸。
- 对分页媒体来说，指页面自身的宽度。

因此，`(max-device-width: 1200px)` 在设备输出区域的宽度小于或等于 1200 像素时起作用。

#### device-height，min-device-height，max-device-height

取值：`<length>`

指输出设备中整个渲染区域的高度。

- 对屏幕媒体来说，指屏幕的高度，即手持设备的屏幕或桌面显示器的纵向尺寸。
- 对分页媒体来说，指页面自身的高度。

因此，`(max-device-height: 400px)` 在设备输出区域的高度小于或等于 400 像素时起作用。

#### aspect-ratio，min-aspect-ratio，max-aspect-ratio

取值：`<ratio>`

指媒体特性 width 与媒体特性 height 的比值。

因此，`(min-aspect-ratio: 2/1)` 在视区的宽高比至少为 `2:1` 时起作用。

#### device-aspect-ratio，min-device-aspect-ratio，max-device-aspect-ratio

取值：`<ratio>`

指媒体特性 device-width 与媒体特性 device-height 的比值。

因此，`(device-aspect-ratio: 16/9)` 在输出设备显示区域的宽高比正好为 `16:9` 时起作用。

#### color，min-color，max-color

取值：`<integer>`

判断输出设备是否支持彩色显示，可选的数值表示每个色彩分量使用的位数。

因此，只要设备有色彩深度，`(color)` 就起作用；而 `(min-color: 4)` 的意思是，每个色彩分量至少有四位。不支持彩色的设备返回 `0`。

#### color-index，min-color-index，max-color-index

取值：`<integer>`

指输出设备的色彩搜索列表中共有多少颜色。不使用色彩搜索列表的设备返回 `0`。

因此，`(min-color-index: 256)` 在至少有 `256` 个颜色可用的设备中起作用。

#### monochrome，min-monochrome，max-monochrome

取值：`<integer>`

判断显示屏是不是单色的，可选的数值表示在输出设备的帧缓冲器中每像素有多少位。非单色设备返回 `0`。

因此，只要是单色输出设备，`(monochrome)` 就起作用，而 `(min-monochrome: 2)` 的意思是，输出设备的帧缓冲器中每像素至少有 `2` 位。

#### resolution，min-resolution，max-resolution

取值：`<resolution>`

指以像素密度表示的输出设备的分辨率，单位可以是每英寸点数 `(dots per inch，dpi)` 或每厘米点数 `(dots per centimeter，dpcm)`。

如果输出设备的像素不是方形的，以较稀疏的那一轴为准。假如有这么一个设备，在一个轴上的像素密度为 `100 dpcm`，在另一个轴上的像素密度为 `120 dpcm`，那么返回的值为 `100`。

#### orientation

取值：`portrait | landscape`

指用户代理的显示区域放置的方向。

媒体特性 height 大于或等于媒体查询 width 时，结果为 portrait；否则为 landscape。

#### scan

取值：`progressive | interlace`

指输出设备使用的扫描方式。

CRT 和某些等离子显示屏一般使用 interlace；多数现代的显示屏一般使用 progressive。

#### grid

取值：`0 | 1`

判断是否为基于栅格的输出设备，例如：TTY 终端。

基于栅格的设备返回 `1`，否则返回 `0`。

## 响应式网页设计

媒体查询是响应式网页设计的实现方式之一，它可以根据页面显示的环境应用不同的样式表或样式规则。

- 有些情况会使用 `<link>` 标签、`<style>` 标签、@import 引入针对特定媒体的一至多个样式表。
- 通常情况会使用 @media，它可以把针对多种媒体 (例如："移动设备" 和 "桌面系统") 的样式写在一个样式表。

> "移动设备" 和 "桌面系统" 两个术语是放在引号中的，因为在现实生活中你可能也注意到了，这两者之间的界限越来越模糊了。例如，一台带有触摸屏的笔记本电脑，所有东西都可以折叠起来，即可以作为平板电脑使用，也可以作为笔记本电脑使用。CSS (目前) 无法检测折叶有没有到达某一点，也无法判断设备是持在手中还是放在平整的表面上。现在，我们只能从媒体环境的一些特性，例如显示屏的尺寸或放置方向上做一些推论。

响应式网页设计通常都会为每个 @media 块定义断点 (breakpoint)，而断点经常以特定大小的像素宽度形式表示。例如：

```css
/* ...这里是通用的样式... */

@meida (max-width: 400px) {
  /* ...这里是针对小屏设备的样式... */
}
@meida (min-width: 401px) and (max-width: 1000px) {
  /* ...这里是针对中屏设备的样式... */
}
@meida (min-width: 1001px) {
  /* ...这里是针对大屏设备的样式... */
}
```

基于像素的媒体查询具有一定的不确定性。例如，iPhone 6 Plus 的物理分辨率为 1242 × 2208，降低采样后为 1080 × 1920。即使是降低采样后的分辨率，根据上述示例定义的断点，其像素大小也足够把它归为大屏设备。但是，iPhone 6 Plus 还维护着一个内部点数坐标系，尺寸为 414 × 736。以此作为定义像素的基准也完全是合理的，此时 iPhone 6 Plus 将使用针对小屏的样式。

幸运的是，浏览器制造商已经做出了一些努力，力求浏览器的表现符合常理 (对于大部分移动设备，浏览器以内部点数坐标系为基准)，但是绝没有我们想得那么彻底，因为你永远不知道什么时候会出现一个新设备打破你所做的假设。

响应式设计很强大，但是与其他任何强大的工具一样，使用时要深思熟虑、格外谨慎。仔细考虑每个特性查询的影响是成功运用响应式网页设计的最低要求。
