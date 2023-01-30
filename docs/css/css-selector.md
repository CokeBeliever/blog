# CSS 选择符

CSS 提供了多种选择符方便我们选择元素。

## 元素选择符

元素选择符 (element selector)，这个选择符选择指定元素名的元素。

例如，下述 CSS 选择 html、h1 和 h2 元素：

```css
html {
  color: black;
}
h1 {
  color: gray;
}
h2 {
  color: silver;
}
```

## 群组选择符

群组选择符 (group selector)，这个选择符选择以逗号 (`,`) 分隔的每个选择符选择的所有元素。

例如，下列 CSS 选择 h2 元素和 p 元素：

```css
h2,
p {
  color: gray;
}
```

群组选择符可以在很大程度上压缩同类样式，这样得到的样式表更短。

## 通用选择符

通用选择符 (universal selector)，星号 (`*`) 的选择符。这个选择符选择所有元素。

例如，下列 CSS 选择所有元素：

```css
* {
  color: red;
}
```

## class 选择符

class 选择符 (class selector)，这个选择符选择包含以点号 (`.`) 开始的值的 class 属性的元素。

例如，下述 CSS 选择包含 warning 的 class 属性的元素：

```css
.warning {
  font-weight: bold;
}
```

```html
<p class="warning">
  When handling plutonium, care must be taken to avoid the formation of a
  critical mass.
</p>
<p>
  With plutonium,
  <span class="warning"
    >the possibility of implosion is very real, and must be avoided at all
    costs</span
  >. This can be accomplished by keeping ths various masses separate.
</p>
```

class 属性的值可以是以空格分隔的列表。

例如，下述 CSS 选择包含 warning 和 urgent 的 class 属性的元素：

```css
.warning.urgent {
  background: silver;
}
```

```html
<p class="urgent warning">
  When handling plutonium, care must be taken to avoid the formation of a
  critical mass.
</p>
<p>
  With plutonium,
  <span class="warning"
    >the possibility of implosion is very real, and must be avoided at all
    costs</span
  >. This can be accomplished by keeping ths various masses separate.
</p>
```

## id 选择符

id 选择符 (id selector)，这个选择符选择井号 (`#`) 开始的值的 id 属性的元素。

例如，下述 CSS 选择 lead-para 的 id 属性的元素：

```css
#lead-para {
  font-weight: bold;
}
```

```html
<p id="lead-para">This paragraph will be boldfaced.</p>
<p>This paragraph will NOT be bold.</p>
```

## 属性选择符

属性选择符 (attribute selector)，根据属性及其值选择元素。属性选择符大致可以分为三类：

- 简单属性选择符
- 精准属性值选择符
- 部分选择属性值选择符

### 简单属性选择符

如果想选择具有某个属性的元素，而不管属性的值是什么，可以使用简单属性选择符。

例如，下述 CSS 选择包含 class 属性的 h1 元素：

```css
h1[class] {
  color: silver;
}
```

此外，还可以基于多个属性选择。

例如，下述 CSS 选择包含 href 属性和 title 属性的 a 元素：

```css
a[href][title] {
  font-weight: bold;
}
```

### 精准属性值选择符

如果想选择具有某个属性和值的元素，可以使用精准属性值选择符。

例如，下述 CSS 选择包含 href 属性值为 `http://www.css-discuss.org/about.html` 的 a 元素：

```css
a[href="http://www.css-discuss.org/about.html"]
{
  font-weight: bold;
}
```

此外，还可以基于多个属性选择。

例如，下述 CSS 选择包含 href 属性值为 `http://www.w3.org/` 和 title 属性值为 `W3C Home` 的 a 元素：

```css
a[href="http://www.w3.org/"][title="W3C Home"]
{
  font-size: 200%;
}
```

### 部分选择属性值选择符

如果想根据属性值的一部分选择元素，而不是完整的值。CSS 为这种情况提供了多种不同的方式来选择属性值的子串。

#### 选择属性值开头的子串/子串-

如果想根据属性值的开头为 `子串` 或 `子串-` 选择元素，这种选择符的形式为 `[att|="val"]`。

例如，下述 CSS 选择包含 lang 属性值开头为 `en` 或 `en-` 的元素：

```css
*[lang|="en"] {
  color: white;
}
```

#### 选择属性值中以空格分隔的一组词中的一个

如果想根据属性值中以空格分隔的一组词中的一个选择元素，这种选择符的形式为 `[att~="val"]`。

例如，下述 CSS 选择包含 class 属性值中以空格分隔的一组词中的一个为 warning 的 p 元素：

```css
p[class~="warning"] {
  font-weight: bold;
}
```

```html
<p class="urgent warning">
  When handling plutonium, care must be taken to avoid the formation of a
  critical mass.
</p>
```

#### 选择属性值的子串

如果想根据属性值的子串选择元素，这种选择符的形式为 `[att*="val"]`。

例如，下述 CSS 选择包含 class 属性值的子串为 `cloud` 的 span 元素，所以 class 属性的值中有 "cloudy" 的那两个元素都选择：

```css
span[class*="cloud"] {
  font-size: italic;
}
```

```html
<span class="barren rocky">Mercury</span>
<span class="cloudy barren">Venus</span>
<span class="life-bearing cloudy">Earth</span>
```

#### 选择属性值开头的子串

如果想根据属性值开头的子串选择元素，这种选择符的形式为 `[att^="val"]`。

例如，下述 CSS 选择包含 href 属性值开头为 `https:` 和 `mailto:` 的 a 元素：

```css
a[href^="https:"] {
  font-weight: bold;
}
a[href^="mailto:"] {
  font-style: italic;
}
```

#### 选择属性值结尾的子串

如果想根据属性值结尾的子串选择元素，这种选择符的形式为 `[att$="val"]`。

例如，下述 CSS 选择包含 href 属性值结尾为 `.pdf` 的 a 元素：

```css
a[href$=".pdf"] {
  font-weight: bold;
}
```

### 不区分大小写的标识符

CSS Selectors Level 4 为属性选择符引入了一个不区分大小写的选项。在结束方括号前加上 `i`，选择属性值时不区分大小写。

例如，下述 CSS 选择包含 href 属性值结尾为 `.PDF` 不区分大小写的 a 元素：

```css
a[href$='.PDF' i]
```

## 根据文档结构选择

HTML 文档中的元素是一种层次结构。在这个层次结构中，元素要么是另一个元素的父元素，要么是另一个元素的子元素，而且经常二者兼具。

在文档的层次结构中，如果一个元素的位置直接在另一个元素的上方，我们说前者是后者的父元素。反过来，如果一个元素的位置直接在另一个元素的下方，前者是后者的子元素。如果两个元素所在的层级是连续的，它们之间是父子关系，也是祖辈和后代关系；如果两个元素之间跨两个层级以上，它们之间是祖辈和后代关系。

### 后代选择符

后代选择符 (descendant selector)，这个选择符选择以空格分隔的一个元素的所有后代元素。

例如，下述 CSS 选择 h1 元素的所有后代 em 元素：

```css
h1 em {
  color: gray;
}
```

### 子代连结符

子代连结符 (progeny combinator)，这个连结符选择以大于号 (`>`) 分隔的一个元素的所有子元素。

例如，下述 CSS 选择 h1 元素的子元素的 strong 元素：

```css
h1 > strong {
  color: red;
}
```

### 紧邻同胞连结符

紧邻同胞连结符 (adjacent sibling combinator)，这个连结符选择同一个父元素中以加号 (`+`) 分隔的紧跟在一个元素后面的另一个元素。

例如，下述 CSS 选择 h1 元素后面紧邻的一个 p 元素，二者同属一个父元素的子元素：

```css
h1 + p {
  margin-top: 0;
}
```

### 一般同胞连结符

一般同胞连结符 (general sibling combinator)，这个连结符选择同一个父元素中以波浪号 (`~`) 分隔的紧跟在一个元素后面的另多个元素。

例如，下述 CSS 选择 h2 元素后面多个的 ol 元素，二者同属一个父元素的子元素：

```css
h2 ~ ol {
  font-style: italic;
}
```

## 伪类选择符

伪类选择符 (pseudo class selector) 可以为文档中不一定真实存在的结构指定样式，或者为某些元素 (甚至文档本身) 的特定状态赋予幽灵类。

所有伪类无一例外都是一个冒号 (`:`) 后面跟着一个词，而且可以出现在选择符的任何位置。

注意，伪类始终指代所依附的元素。

### 结构伪类

#### 选择根元素

`:root` 伪类选择文档的根元素。在 HTML 中，根元素始终是 html 元素。这个选择符的真正用途体现在 XML 语言的样式表中，在不同的 XML 语言中，根元素有所不同。例如，RSS 2.0 的根元素是 rss。

例如，在 HTML 文档中，下述 CSS 选择 html 元素：

```css
:root {
  border: 10px dotted gray;
}
```

#### 选择空元素

`:empty` 伪类可以选择没有任何子代和文本节点的元素。

例如，下述 CSS 选择没有任何子代和文本节点的 p 元素：

```css
p:empty {
  display: none;
}
```

对下面几个元素来说，只有第一个和最后一个能被 `p:empty` 选择：

```html
<p></p>
<p></p>
<p></p>
<p><!-- 注释 --></p>
```

#### 选择唯一的子代

`:only-child` 伪类可以选择一个元素的唯一子元素。

例如，下述 CSS 选择一个元素的唯一子元素，并且这个子元素是 img 元素：

```css
img:only-child {
  border: 1px solid black;
}
```

```html
<a href="http://w3.org/"><img src="w3.png" alt="W3C" /></a>
```

如果想选择 a 元素中唯一的 img 元素，而 a 元素中还有其他内容该怎么办呢？

`:only-of-type` 伪类可以选择一个元素的唯一类型子元素。

例如，下述 CSS 选择一个元素的唯一类型子元素，并且这个唯一类型子元素是 img 元素：

```css
img:only-of-type {
  border: 1px solid black;
}
```

```html
<a href="http://w3.org/"><b>*</b><img src="w3.png" alt="W3C" /></a>
```

#### 选择第一个和最后一个子代

`:first-child` 伪类选择一个元素的第一个子元素。

例如，下述 CSS 选择一个元素的第一个子元素，并且这个子元素是 p 元素：

```css
p:first-child {
  color: red;
}
```

`:last-child` 伪类选择一个元素的最后一个子元素。

例如，下述 CSS 选择一个元素的最后一个子元素，并且这个子元素是 p 元素：

```css
p:last-child {
  color: red;
}
```

#### 选择第一个和最后一个某种元素

`:first-of-type` 伪类选择一个元素的第一个类型子元素。

例如，下述 CSS 选择一个元素的第一个 table 元素：

```css
table:first-of-type {
  border-top: 2px solid gray;
}
```

`:last-of-type` 伪类选择一个元素的最后一个类型子元素。

例如，下述 CSS 选择一个元素的最后一个 table 元素：

```css
table:last-of-type {
  border-top: 2px solid gray;
}
```

### 动态伪类

#### 超链接伪类

CSS2.1 定义了两个只能在超链接上使用的伪类。在 HTML 中，这两个伪类用在具有 href 属性的 a 元素上；在 XML 语言中，这两个伪类在链接到其他资源的元素上应用。这两个伪类的说明见下表：

| 伪类       | 说明                                   |
| ---------- | -------------------------------------- |
| `:link`    | 指代指向具有 href 属性尚未访问的超链接 |
| `:visited` | 指代指向已访问地址的超链接             |

#### 用户操作伪类

CSS 中有几个伪类可以根据用户的操作改变文档的外观。这些伪类的说明见下表：

| 伪类      | 说明                                                                 |
| --------- | -------------------------------------------------------------------- |
| `:focus`  | 指代当前获得输入焦点的元素，即可以接受键盘输入或以某种方式激活       |
| `:hover`  | 指代鼠标指针放置其上的元素，例如鼠标指针悬停在超链接上               |
| `:active` | 指代由用户输入激活的元素，例如用户单击超链接时按下鼠标按键的那段时间 |

例如，下述 CSS 选择获得键盘输入焦点的 input 元素：

```css
input:focus {
  background: silver;
  font-weight: bold;
}
```

### UI 状态伪类

与动态伪类紧密相关的是用户界面 (user-interface，UI) 状态伪类。这些伪类根据用户界面元素 (例如复选框) 的当前状态应用样式。

| 伪类             | 说明                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- |
| `:enabled`       | 指代启用的用户界面元素 (例如表单元素)，即接受输入的元素                                 |
| `:disabled`      | 指代禁用的用户界面元素 (例如表单元素)，即不接受输入的元素                               |
| `:checked`       | 指代由用户或文档默认选中的单选按钮或复选框                                              |
| `:indeterminate` | 指代既未选中也没有未选中的单选按钮或复选框；这个状态只能由 DOM 脚本设定，不能由用户设定 |
| `:default`       | 指代默认选中的单选按钮、复选框或选项                                                    |
| `:valid`         | 指代满足所有数据有效性语义的输入框                                                      |
| `:invalid`       | 指代不满足所有数据有效性语义的输入框                                                    |
| `:in-range`      | 指代输入的值在最小值和最大值之间的输入框                                                |
| `:out-of-range`  | 指代输入的值小于控件允许的最小值或大于控件允许的最大值的输入框                          |
| `:required`      | 指代必须输入值的输入框                                                                  |
| `:optional`      | 指代无需一定输入值的输入框                                                              |
| `:read-write`    | 指代可由用户编辑的输入框                                                                |
| `:read-only`     | 指代不能由用户编辑的输入框                                                              |

#### 启用和禁用的 UI 元素

某些 UI 元素可以由 disabled 属性控制启用和禁用状态，例如 HTML 中的文本框。这两个状态的 UI 元素可以使用 `:enabled` 和 `:disabled` 伪类选择。

例如，下述 CSS 选择启用的元素：

```css
:enabled {
  font-weight: bold;
}
```

例如，下述 CSS 选择禁用的元素：

```css
:disabled {
  opacity: 0.5;
}
```

#### 选择状态

某些 UI 元素可以由 checked 属性控制选中或不选中状态，例如 HTML 中的复选框和单选按钮。这两个状态的 UI 元素可以使用 `:checked` 和 `:indeterminate` 伪类选择。

例如，下述 CSS 选择选中的元素：

```css
:checked {
  background: silver;
}
```

例如，下述 CSS 选择未选中的元素：

```css
:indeterminate {
  border: red;
}
```

#### 默认选项伪类

某些 UI 元素可以有默认值，例如 HTML 中的复选框和单选按钮。`:default` 伪类选择一组相似元素中取默认值的 UI 元素。

例如，下述 CSS 选择默认值的元素：

```css
:default {
  box-shadow: 0 0 2px 1px coral;
}
```

#### 可选性伪类

某些 UI 元素可以由 required 属性控制必填或选填状态，例如 HTML 中的文本框。这两个状态的 UI 元素可以使用 `:required` 和 `:optional` 伪类选择。

#### 有效性伪类

某些 UI 元素可以有通过校验和未通过校验状态，例如 HTML 中的文本框。这两个状态的 UI 元素可以使用 `:valid` 和 `:invalid` 伪类选择。

#### 范围伪类

某些 UI 元素可以由 min 和 max 属性控制范围状态，例如 HTML 中的范围框。这两个状态的 UI 元素可以使用 `:in-range` 和 `:out-of-range` 伪类选择。

#### 可变性伪类

所有元素可以由 contenteditable 属性和某些 UI 元素可以由 readonly 属性控制读写和只读状态，例如 HTML 中的文本框。这两个状态的 UI 元素可以使用 `:read-write` 和 `:read-only` 伪类选择。

### `:target` 伪类

URL 中有个片段标识符 (fragment identifier)，URL 片段标识符指向的目标元素可以使用 `:target` 伪类选择。

比如下面这个 URL：

```
http://www.w3.org/TR/css3-selectors/#target-pseudo
```

这个 URL 中的 target-pseudo 部分就是片段标识符，由 `#` 符号标记。

例如，在 `http://www.w3.org/TR/css3-selectors/#target-pseudo` 页面中，下述 CSS 选择 id 属性为 target-pseudo 的元素：

```css
:target {
  color: red;
}
```

```html
<p id="target-pseudo">target</p>
```

### `:lang()` 伪类

如果想根据文本使用的语言选择元素，可以使用 `:lang()` 伪类。

例如，下述 CSS 选择由 fr 语言编写的元素：

```css
*:lang(fr) {
  font-style: italic;
}
```

Selectors Level 3 是这样规定的：在 HTML 中，语言可以通过 lang 属性判断，也可以通过 meta 元素和协议（例如 HTTP 首部）判断。XML 使用 xml:lang 属性，此外还可能有文档语言专用的方法。

### `:not()` 伪类

如果想反过来，选择不满足条件的元素，可以使用 Selectors Level 3 引入的 `:not()` 伪类。

`:not()` 伪类依附在元素上，括号中是简单的选择符。根据 W3C 的定义，简单的选择符指：一个元素选择符、通用选择符、class 选择符、id 选择符或伪类。因为括号中只能使用其中的一个选择符，所以不能使用群组选择符，也不能使用连结符，因此不能使用后代选择符，因为后代选择符中分隔元素的空格是连结符。

例如，下述 CSS 选择包含 link 的 class 属性并且不是 li 元素也不是 p 元素的元素：

```css
*.link:not(li):not(p) {
  font-style: italic;
}
```

## 伪元素选择符

伪元素与伪类很像，为了实现特定的效果，它在文档中插入虚构的元素。CSS2 定义了四个基本的伪元素，分别用于选择元素的首字母、首行，以及创建 "前置" 和 "后置" 内容。

伪类使用一个冒号，而伪元素使用一对冒号，例如 `::first-line`。这么做是为了把伪元素与伪类区分开。

### 选择首字母

`::first-letter` 伪元素用于选择任何非行内元素的首字母，或者开头的标点符号和首字母（如果文本以标点符号开头）。

例如，下述 CSS 选择 p 元素的首字母或标点符号和首字母：

```css
p::first-letter {
  color: red;
}
```

### 选择首行

`::first-line` 伪元素用于选择任何非行内元素的首行文本。

例如，下述 CSS 选择 p 元素的首行文本：

```css
p::first-line {
  font-size: 150%;
  color: purple;
}
```

### 创建选择前置和后置内容元素

`::before` 和 `::after` 伪元素分别用于创建选择前置和后置内容元素，内容由 content 属性控制。

例如，下述 CSS 在 h2 元素前创建和选择 `]]` 前置内容元素：

```css
h2::before {
  content: "]]";
  color: silver;
}
```

例如，下述 CSS 在 body 元素后创建和选择 `The End.` 后置内容元素：

```css
body::after {
  content: "The End.";
}
```
