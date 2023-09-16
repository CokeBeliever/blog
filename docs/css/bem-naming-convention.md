# BEM 命名规范

> 在构建较小的项目时，如何组织代码通常不是一个大问题。但是，当涉及到较大、较复杂的项目时，良好的代码组织就成为至关重要的因素。尤其是在多人协作的团队环境中，代码规范更显得至关紧要。

## 背景

在编程领域，CSS 类名的命名一直是一个具有挑战性的任务，而随意的命名方式可能导致代码的混乱和缺乏一致性。因此，为了解决这一问题，出现了不同的方法，其中一种广受欢迎的方法被称为 **块元素修饰符 (BEM)** 命名规范。**采用 BEM 命名规范可以显著提高代码的灵活性、复用性和可维护性等。**

> 除此之外，还有很多方法旨在帮助开发人员更有效地管理和维护 CSS 代码。例如：
>
> - [OOCSS](http://oocss.org/)：这种方法通过将 CSS "对象" 与容器和内容分离来减少冗余。
> - [SMACSS](http://smacss.com/)：SMACSS 提供了包含五个 CSS 规则类别的样式指南，有助于更系统地组织和管理样式。
> - [SUITCSS](https://suitcss.github.io/)：SUITCSS 强调结构化的类名和有意义的连字符，以促进清晰的代码结构。
> - [Atomic CSS](https://acss.io/)：原子 CSS 将样式分解为原子或不可分割的部分，使得可以更灵活地组合和重用样式。
>
> 你可以访问[这里](https://github.com/awesome-css-group/awesome-css#naming-conventions--methodologies-bulb)获取更多关于这些方法的详细信息。

## 介绍

BEM (Block，Element，Modifier) 是一种基于组件的 Web 开发方法，它是 HTML 和 CSS 类名的流行命名规范。这个方法的核心思想是将用户界面 (UI) 划分为独立的块，从而使得即使在处理复杂的 UI 时，也能够轻松、迅速地进行界面开发。同时，BEM 还允许在不用重复复制和粘贴代码的情况下，方便地重用现有的代码。这种模块化和可维护性强的方法有助于提高开发效率，确保代码的一致性和可读性。

如果你曾经看到过像 `el-button--primary` 这样的类名，那就是 BEM 的实际应用。可以发现，虽然类名可以命名得很长，但它们都是可读、可理解的。

## 结构

### Block 块

**块是 BEM 命名规范的一个部分。块是独立的、可重用的 UI 组件**。因此，我们可以把 UI 划分为多个独立的块，例如：`header` 头部、`menu` 菜单、`form` 表单等。

**特征：**

- **块的命名应该描述其目的 (即它是什么)，而不是描述块的状态或样式 (即它看起来像什么)。这意味着块名称应该反映其功能或用途，而不是具体的视觉属性**。例如，使用 `menu` 或 `button` 来描述块，而不是 `red` 或 `big` 来描述块的外观特征。这种方法有助于使代码更加模块化和可维护，因为它强调了块的用途，而不是具体的样式细节。例如：

```html
<!-- 正确的。`button` 块在语义上描述了它是什么 -->
<div class="button"></div>

<!-- 不正确的。它描述了外观 -->
<div class="red-text"></div>
```

- **块应该是相对独立的单元，不应该影响其环境。这意味着块应该不设置外部几何图形 (如：margin、position)，以确保块可以在不同上下文中进行重用而不会破坏页面布局**。这种独立性有助于减少副作用，提高代码的可维护性，使开发人员能够更自信地使用和组合不同的块，而不必担心它们会干扰其他部分的布局或外观。这也有助于确保代码更容易维护和扩展。
- **使用 BEM 时，你应该避免使用 CSS 标签或 ` ID` 选择器**。这有助于确保样式与 HTML 结构解耦，提高代码的灵活性和复用性。
  - **避免使用标签选择器**：不要使用像 `div`、`p` 或 `h1` 这样的 HTML 标签作为选择器，因为这会将样式与特定的 HTML 元素耦合在一起。
  - **避免使用 ID 选择器**：不要使用像 `#myElement` 这样的 ID 选择器。ID 选择器具有较高的特异性，可能导致样式覆盖问题和难以维护的代码。

#### 使用准则

##### 嵌 套

**块可以相互嵌套，且可以有任意数量的嵌套级别。**

```html
<!-- `header` 块 -->
<header class="header">
  <!-- 嵌套 `logo` 块 -->
  <div class="logo"></div>

  <!-- 嵌套 `search-form` 块 -->
  <form class="search-form"></form>
</header>
```

### Element 元素

**元素是 BEM 命名规范的一个部分。元素是块的内部组件，用于构成块的结构。因此，它不能在该块之外独立存在。**

**特征：**

- **元素的命名应该描述其用途 (即它是什么)，而不是描述元素的状态或样式 (即它的类型或看起来像什么)。这意味着元素名称应该反映其在块内的功能或角色。**例如，使用 `item` 或 `text` 来描述元素，而不是 `red` 或 `big` 来描述其外观或样式。

- 元素全名的结构是：`block-name__element-name`。元素名称与块名称之间用双下划线 (`__`) 分隔。例如：

  ```html
  <!-- `search-form` 块 -->
  <form class="search-form">
    <!-- `input` 元素在 `search-form` 块中 -->
    <input class="search-form__input" />

    <!-- `button` 元素在 `search-form` 块中 -->
    <button class="search-form__button">Search</button>
  </form>
  ```

#### 使用准则

##### 嵌套

**元素可以相互嵌套，且可以有任意数量的嵌套级别。**

在 HTML 中，块的 DOM 结构可以具有嵌套的元素：

```html
<div class="block">
  <div class="block__elem1">
    <div class="block__elem2">
      <div class="block__elem3"></div>
    </div>
  </div>
</div>
```

但是，在 CSS 中，应该保持使用元素的平面列表来表示：

```css
/* 正确。元素以平面列表来表示 */
.block {
}
.block__elem1 {
}
.block__elem2 {
}
.block__elem3 {
}
/* 不正确。元素以嵌套结构来表示 */
.block {
}
.block__elem1 {
}
.block__elem1 .block__elem2 {
}
.block__elem1 .block__elem2 .block__elem3 {
}
```

在 SCSS 中：

```scss
/* 正确。元素以平面列表来表示 */
.block {
  &__elem1 {
  }
  &__elem2 {
  }
  &__elem3 {
  }
}
/* 不正确。元素以嵌套结构来表示 */
.block {
  &__elem1 {
    &__elem2 {
      &__elem3 {
      }
    }
  }
}
```

这允许你更改块的 DOM 结构，而无需更改每个单独元素的 CSS 代码：

```html
<div class="block">
  <div class="block__elem1">
    <div class="block__elem2"></div>
  </div>

  <div class="block__elem3"></div>
</div>
```

块的结构发生了变化，但元素的规则及其名称保持不变。这种方法提供了更大的灵活性、复用性和可维护性，允许开发人员轻松地调整界面的结构，而不会干扰元素的样式或功能。

**元素始终是块的一部分，而不是另一个元素。这意味着元素名称不能定义层次结构，例如：`block__elem1__elem2`。**

```html
<!--
   正确的。完整元素名称的结构遵循该模式: `block-name__element-name`
-->
<form class="search-form">
  <div class="search-form__content">
    <input class="search-form__input" />

    <button class="search-form__button">Search</button>
  </div>
</form>

<!--
    不正确的。完整元素名称的结构不遵循该模式: `block-name__element-name`
-->
<form class="search-form">
  <div class="search-form__content">
    <!-- 推荐: `search-form__input` or `search-form__content-input` -->
    <input class="search-form__content__input" />

    <!-- 推荐: `search-form__button` or `search-form__content-button` -->
    <button class="search-form__content__button">Search</button>
  </div>
</form>
```

##### 会员身份

**元素始终是块的一部分，不应将其与块分开使用。**

```html
<!-- 正确的。元素位于 `search-form` 块中 -->
<!-- `search-form` 块 -->
<form class="search-form">
  <!-- `input` 元素在 `search-form` 块中 -->
  <input class="search-form__input" />

  <!-- `button` 元素在 `search-form` 块中 -->
  <button class="search-form__button">Search</button>
</form>

<!--
    不正确的。元素位于 `search-form` 块的上下文之外
-->
<!-- `search-form` 块 -->
<form class="search-form"></form>

<!-- `input` 元素不在 `search-form` 块中 -->
<input class="search-form__input" />

<!-- `button` 元素不在 `search-form` 块中 -->
<button class="search-form__button">Search</button>
```

##### 可选性

**元素是可选的块组件。并非所有块都有元素。**

```html
<!-- `search-form` 块 -->
<div class="search-form">
  <!-- `input` 块 -->
  <input class="input" />

  <!-- `button` 块 -->
  <button class="button">Search</button>
</div>
```

### Modifier 修饰符

**修饰符是 BEM 命名规范的一个部分。修饰符用于在不修改块或元素的基本类名的情况下，对块或元素的外观、状态或行为进行样式上的调整**。这种做法有助于保持代码的一致性，提高可维护性和复用性，减少重复编写样式的工作。

**特征：**

- **修饰符名称用于描述块或元素的外观 (例如，"什么大小？" 或 "哪个主题？"，如：`size_s`、`theme_islands`)、状态 ("它与其他主题有何不同？"，如：`disabled`、`focused`) 以及行为 ("它的行为如何？" 或 "它如何响应用户？"，如：`directions_left-top`)**。修饰符的使用有助于更清晰地定义和区分不同块或元素的特征，从而提高了代码的可读性和维护性。
- 修饰符名称与块或元素名称之间用单个下划线 (`_`) 分隔，例如：`block-name__element-name_modifier-name`。

> 除了标准的 BEM 修饰符分隔方式之外，还存在其他替代的分隔方案，例如：Harry Roberts 风格。在这种风格中，它使用双连字符 (`--`) 作为分隔符，例如：`block-name__element-name--modifier-name`。尽管在单下划线和双连字符之间没有太大的区别，但双连字符提供了一种清晰的方式来区分修饰符，使其在视觉上与元素双下划线 (`__`) 有所不同，使你能够立即识别修饰符。
>
> 注意，无论你选择使用哪种方式，关键是在整个项目中保持一致性，以确保代码的一致性和可维护性。

#### 修饰符的类型

##### 布尔

- **当只有修饰符的存在与否非常重要，而其具体值无关紧要时，可以简化修饰符的命名**。例如，对于一个表示 "按钮是否被禁用的修饰符"，你可以将其简单命名为 `disabled`，而不必指定值。在这种情况下，如果修饰符存在于块或元素中，则假定其值为 `true`，如果不存在，则假定其值为 `false`。

- 修饰符全名的结构遵循以下模式：

  - `block-name_modifier-name`
  - `block-name__element-name_modifier-name`

  ```html
  <!-- `search-form` 块有 `focused` 布尔修饰符 -->
  <form class="search-form search-form_focused">
    <input class="search-form__input" />

    <!-- `button` 元素有 `disabled` 布尔修饰符 -->
    <button class="search-form__button search-form__button_disabled">
      Search
    </button>
  </form>
  ```

##### 键值

- 当修饰符值非常重要时。例如，对于一个表示 "菜单具有特定的设计主题 (如：`islands`)"，你可以命名为：`menu_theme_islands`。在这种情况下，修饰符的键为 `theme`，修饰符的值为 `islands`。

- 修饰符全名的结构遵循以下模式：

  - `block-name_modifier-name_modifier-value`
  - `block-name__element-name_modifier-name_modifier-value`

  ```html
  <!-- `search-form` 块有 `theme` 修饰符，其值为 `islands` -->
  <form class="search-form search-form_theme_islands">
    <input class="search-form__input" />

    <!-- `button` 元素有 `size` 修饰符，其值为 `m` -->
    <button class="search-form__button search-form__button_size_m">
      Search
    </button>
  </form>

  <!-- 你不能同时使用两个具有不同值的相同修饰符。 -->
  <form class="search-form search-form_theme_islands search-form_theme_lite">
    <input class="search-form__input" />

    <button
      class="search-form__button search-form__button_size_s search-form__button_size_m"
    >
      Search
    </button>
  </form>
  ```

#### 修饰符使用指南

##### 修饰符不能单独使用

从 BEM 的角度来看，修饰符不能与修改后的块或元素隔离使用，这是因为修饰符的主要目的是修改块或元素的外观、行为或状态，而不是替代它们。例如：

```html
<!--
    正确的。`search-form` 块有 `theme` 修饰符，其值为 `islands`
-->
<form class="search-form search-form_theme_islands">
  <input class="search-form__input" />

  <button class="search-form__button">Search</button>
</form>

<!-- 不正确。修改后的类 `search-form` 块丢失了 -->
<form class="search-form_theme_islands">
  <input class="search-form__input" />

  <button class="search-form__button">Search</button>
</form>
```

### 小结

综上所述，BEM 类的命名通常可以归纳为以下几种：

1. **块的命名：** 使用块名称来定义块的基本样式和行为。

   ```
   .block-name {}
   ```

2. **块和元素的命名：** 使用块名称和元素名称的组合来表示块内元素的样式和行为。

   ```
   .block-name__element-name {}
   ```

3. **块和修饰符的命名：** 使用块名称和修饰符名称的组合来表示块的变体或状态。

   ```
   .block-name--modifier-name {}
   ```

4. **块、元素和修饰符的命名：** 结合块、元素和修饰符的名称，以描述块内元素的变体或状态。

   ```
   .block-name__element-name--modifier-name {}
   ```

## 混合

混合是一种在单个 DOM 节点上使用不同 BEM 实体的技术。

**混合允许你：**

- 组合多个实体的行为和样式，而无需重复代码。
- 基于现有 UI 组件创建语义上新的 UI 组件。

例如：

```html
<!-- `header` 块 -->
<div class="header">
  <!--
        `search-form` 块与 `header` 块中的 `search-form` 元素混合在一起
    -->
  <div class="search-form header__search-form"></div>
</div>
```

在此示例中，我们将块 `search-form` 块与 `header` 块中的 `search-form` 元素混合在一起。这意味着你可以在 `header__search-form` 元素中设置外部几何形状和位置，而 `search-form` 块本身仍然是通用的，因为它没有指定任何填充。这种方法允许你创建具有不同行为和样式的组件，同时仍然可以将它们嵌套在其他环境中，因为它们的代码结构是独立的。这有助于提高代码的可复用性和可维护性。

## 参考

[Quick start / Methodology / BEM](https://en.bem.info/methodology/quick-start/)
