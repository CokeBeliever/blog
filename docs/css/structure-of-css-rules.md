# CSS 规则的结构

一个 CSS 样式表由一系列规则构成。

一个规则由两个基本部分构成：选择符 (selector) 和声明块 (declaration block)。

一个声明块由一个或多个声明组成，而一个声明包含一个属性 (property) 和对应的值 (value)。

例如，下述 CSS 样式表：

```css
h1 {
  color: red;
  background: yellow;
}
h2 {
  color: blue;
  background: gray;
}
```

- CSS 样式表有 2 个规则，分别为 `h1 {color: red; background: yellow;}` 和 `h2 {color: blue; background: gray;}`
- 规则 `h1 {color: red; background: yellow;}` 的选择符为 `h1`，声明块为 `{color: red; background: yellow;}`。
- 声明块 `{color: red; background: yellow;}` 有 2 个声明，分别为 `color: red;` 和 `background: yellow;`。
- 声明 `color: red;` 的属性为 `color`，值为 `red`。
