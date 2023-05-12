# 渲染器的设计

## 渲染器和响应式系统结合

顾名思义，渲染器是用来执行渲染任务的。在浏览器平台上，用它来渲染真实 DOM。

下面简单地实现一个渲染器：

```typescript
function renderer(domString, container) {
  container.innerHTML = domString;
}
```

我们可以如下所示使用它：

```typescript
renderer("<h1>Hello</h1>", document.getElementById("app"));
```

上面代码会将 `<h1>Hello</h1>` 插入到 `#app` 元素中。

我们还可以和响应式系统结合，实现响应式数据发生改变，自动重新渲染真实 DOM 的效果。例如：

```typescript
const count = ref(1);

effect(() => {
  renderer(`<h1>${count.value}</h1>`, document.getElementById("app"));
});

setTimeout(() => {
  count.value++;
}, 3000);
```

## 渲染器的基本概念

渲染器的作用是把**虚拟 DOM (virtual DOM，vdom)** 渲染为特定平台上的**真实 DOM**。

虚拟 DOM 和真实 DOM 的结构一样，都是由一个个节点组成的树形结构。其中，任何一个**虚拟节点 (也称为 vnode)** 都可以是一棵子树。因此，有时候 vnode 和 vdom 可以替换使用。为了避免造成困惑，我们在这里统一使用以下术语：

- **虚拟节点 vnode**：用来表示虚拟 DOM 和虚拟节点的统称；
- **真实节点/元素**：用来表示真实 DOM、真实节点和元素的统称。

渲染器将虚拟节点渲染为真实节点的过程被称为**挂载** (mount)。例如，Vue 组件中的 mounted 钩子会在组件挂载完成时触发，这意味着在 mounted 钩子中可以开始访问真实节点。

渲染器通常需要接受一个**挂载点**作为参数，用来指定具体的挂载位置。渲染器将该挂载点作为**容器 (container)**，并将真实节点渲染到其中。

渲染器不仅具有跨平台性，而且它不仅只提供 render 渲染功能，还可能提供 hydrate 服务端渲染功能等。因此，我们可以设计一个创建渲染器的工厂函数，以便在不同平台上创建适合该平台的渲染器。如下所示：

```typescript
function createRenderer() {
  function render(vnode, container) {
    // ...
  }

  function hydrate(vnode, container) {
    // ...
  }

  return {
    render,
    hydrate,
  };
}
```

### render 函数

render 函数的主要作用是将虚拟节点渲染为真实节点，并将其挂载到容器上。根据传递给该函数的 vnode 参数值的不同，执行的操作也会有所不同，以下是可能的操作：

- **挂载操作 (mount)**：如果 vnode 参数是虚拟节点，且容器是首次挂载，则执行挂载操作。
- **更新操作 (patch)**：如果 vnode 参数是虚拟节点，且容器不是首次挂载，则执行更新操作。
- **卸载操作 (unmount)**：如果 vnode 参数是 null，则执行卸载操作。

下面的代码，在浏览器平台上演示了执行这些操作的情况。

**挂载操作**

```typescript
const renderer = createRenderer();
// 挂载操作：容器是首次渲染
renderer.render(vnode, document.querySelector("#app"));
```

在这种情况下，渲染器将 vnode 渲染为真实节点，并挂载即可。在实现中，挂载操作可以视为 oldVnode 不存在的更新操作。

**更新操作**

```typescript
const renderer = createRenderer();
// 挂载操作：容器是首次渲染
renderer.render(oldVnode, document.querySelector("#app"));
// 更新操作：容器不是首次渲染
renderer.render(newVnode, document.querySelector("#app"));
```

在这种情况下，渲染器会使用 newVnode 与上一次渲染的 oldVnode 进行比较，试图找到并更新变更点。

**卸载操作**

```typescript
const renderer = createRenderer();
// 挂载操作：容器是首次渲染
renderer.render(vnode, document.querySelector("#app"));
// 卸载操作：vnode 参数是 null
renderer.render(null, document.querySelector("#app"));
```

在这种情况下，渲染器会将上一次渲染的 vnode 对应的真实节点进行卸载。

## 跨平台的渲染器

要实现一个跨平台的渲染器，不仅需要将真实节点抽象为虚拟节点 vnode，还需要提供可配置的创建特定平台渲染器的接口。这样就可以根据平台的不同，创建适合该平台的渲染器，并实现跨平台渲染的目的。

### 虚拟节点

#### 节点类型 type

在 HTML 中，都有哪些真实节点呢？来看一段 HTML 代码：

```html
<div>我是 div 元素节点</div>
<p>我是 p 元素节点</p>
<!-- 我是注释节点 -->
我是文本节点
```

可以看出，对一个真实节点来说，常见的节点类型有以下几种：

- **元素节点**：一个/对标签，标签名称表示元素节点的类型。
- **文本节点**：一段文本内容，不具有标签名称。
- **注释节点**：一段注释内容，不具有标签名称。

**设计实现**

我们可以设计 `vnode.type` 属性来表示虚拟节点的类型，如下所示：

```typescript
// -------------------- 类型代码 --------------------
/**
 * 元素虚拟节点
 */
interface ElementVnode {
  /** 节点类型 */
  type: string;
}

/**
 * 文本虚拟节点
 */
interface TextVnode {
  /** 节点类型 */
  type: VnodeTypeEnum.TEXT;
}

/**
 * 注释虚拟节点
 */
interface CommentVnode {
  /** 节点类型 */
  type: VnodeTypeEnum.COMMENT;
}

/**
 * 虚拟节点
 */
type Vnode = ElementVnode | TextVnode | CommentVnode;

// -------------------- 逻辑代码 --------------------
/**
 * 虚拟节点类型枚举 (用于枚举文本/注释/片段虚拟节点)
 */
enum VnodeTypeEnum {
  /** 文本节点的 type 标识 */
  TEXT,
  /** 注释节点的 type 标识 */
  COMMENT,
}
```

#### 子节点 children

在 HTML 中，都有哪些子节点呢？

**元素节点**

对于元素节点，它的子节点的情况有多种。来看一段 HTML 代码：

```html
<!-- 没有子节点 -->
<div></div>
<!-- 单个文本子节点 -->
<div>Some Text</div>
<!-- 其他情况 -->
<div>
  <p></p>
  Some Text
</div>
```

可以看出，对于一个元素节点来说，子节点的情况可以分为以下几种：

- 没有子节点：子节点可以用 undefined 类型表示。
- 单个文本子节点：子节点可以用 string 类型表示。
- 其他情况：子节点可以用 vnode 数组类型表示。

**文本节点和注释节点**

对于文本节点和注释节点，它的子节点的情况只有一种。来看一段 HTML 代码：

```html
<!-- 我是注释节点 -->
我是文本节点
```

可以看出，对于一个文本节点和注释节点来说，子节点用 string 类型表示 (文本内容和注释内容)。

**设计实现**

我们可以设计 `vnode.children` 属性来表示虚拟节点的子节点，如下所示：

```typescript
interface ElementVnode {
  /** 节点类型 */
  type: string;
  /** 子节点 */
  children?: string | Vnode[];
}

/**
 * 文本虚拟节点
 */
interface TextVnode {
  /** 节点类型 */
  type: VnodeTypeEnum.TEXT;
  /** 子节点 */
  children?: string;
}

/**
 * 注释虚拟节点
 */
interface CommentVnode {
  /** 节点类型 */
  type: VnodeTypeEnum.COMMENT;
  /** 子节点 */
  children?: string;
}
```

#### 节点属性 props

**元素节点**

对于元素节点，来看一段 HTML 代码：

```html
<input
  id="my-input"
  class="input"
  type="text"
  value="foo"
  aria-valuenow="75"
  onClick="onClickInput"
/>
```

可以看出，对于一个元素节点，节点属性的键为 string 类型，而属性的值似乎也是 sting 类型。然而，在 Vue 模板中，属性是可以使用 `v-bind` 动态绑定的。此外，Vue 模板需要编译为渲染 vnode 的函数。因此，节点属性的值应该是任意类型 (`any` 类型)。

**文本节点和注释节点**

对于文本节点和注释节点，没有节点属性。

**设计实现**

我们可以设计 `vnode.props` 属性来表示元素节点属性的键值对映射，如下所示：

```typescript
/**
 * 元素虚拟节点
 */
interface ElementVnode {
  /** 节点类型 */
  type: string;
  /** 子节点 */
  children?: string | Vnode[];
  /** 节点属性的键值对映射 */
  props?: { [key: string]: any };
}
```

#### 真实节点 el

**设计实现**

为了方便，我们可以设计 `vnode.el` 属性来表示虚拟节点对应的真实节点，如下所示：

```typescript
/**
 * 元素虚拟节点
 * @template ElementNode 真实元素节点类型
 * @template TextNode 真实文本节点类型
 * @template CommentNode 真实注释节点类型
 */
interface ElementVnode<ElementNode, TextNode, CommentNode> {
  /** 节点类型 */
  type: string;
  /** 子节点 */
  children?: string | Vnode<ElementNode, TextNode, CommentNode>[];
  /** 节点属性的键值对映射 */
  props?: { [key: string]: any };
  /** 虚拟节点对应的真实节点 */
  el?: ElementNode;
}

/**
 * 文本虚拟节点
 * @template TextNode 真实文本节点类型
 */
interface TextVnode<TextNode> {
  /** 节点类型 */
  type: VnodeTypeEnum.TEXT;
  /** 子节点 */
  children?: string;
  /** 虚拟节点对应的真实节点 */
  el?: TextNode;
}

/**
 * 注释虚拟节点
 * @template CommentNode 真实注释节点类型
 */
interface CommentVnode<CommentNode> {
  /** 节点类型 */
  type: VnodeTypeEnum.COMMENT;
  /** 子节点 */
  children?: string;
  /** 虚拟节点对应的真实节点 */
  el?: CommentNode;
}

/**
 * 虚拟节点
 * @template ElementNode 真实元素节点类型
 * @template TextNode 真实文本节点类型
 * @template CommentNode 真实注释节点类型
 */
type Vnode<ElementNode, TextNode, CommentNode> =
  | ElementVnode<ElementNode, TextNode, CommentNode>
  | TextVnode<TextNode>
  | CommentVnode<CommentNode>;
```

真实节点的类型使用泛型来表示，该泛型将在创建特定平台的渲染器时被指定，以便实现跨平台渲染的目的。因此，真实节点的类型不是固定的，而且元素节点、文本节点和注释节点的真实节点在不同平台的类型可能不同，这是根据具体的平台而定的。例如，在浏览器平台上，元素节点的真实节点类型为 `HTMLElement`，文本节点的真实节点类型为 `Text`，注释节点的真实节点类型为 `Comment`。而在其他平台上，它们的真实节点类型可能会有所不同。

### 容器

为了方便，我们可以设计 `container._vnode` 属性来表示容器上挂载的真实节点所对应的虚拟节点，如下所示：

`````typescript
/**
 * 元素容器
 * @template ElementNode 真实元素节点类型
 * @template TextNode 真实文本节点类型
 * @template CommentNode 真实注释节点类型
 * @example _vnode 虚拟节点类型：
 * ```html
 * 元素虚拟节点：例如：<div class="container"><input /></div>
 * 文本虚拟节点：例如：<div class="container">我是文本节点</div>
 * 注释虚拟节点：例如：<div class="container"><!-- 我是注释节点 --></div>
 * ```
 */
type ElementContainer<ElementNode, TextNode, CommentNode> = ElementNode & {
  /** 容器上挂载的真实节点所对应的虚拟节点 */
  _vnode?: Vnode<ElementNode, TextNode, CommentNode> | null;
};

/**
 * 挂载容器
 * @template ElementNode 真实元素节点类型
 * @template TextNode 真实文本节点类型
 * @template CommentNode 真实注释节点类型
 * @example 容器类型：
 * ```html
 * 元素容器，例如：<div class="container"></div>
 * ````
 */
type Container<ElementNode, TextNode, CommentNode> = ElementContainer<
  ElementNode,
  TextNode,
  CommentNode
>;
`````

在 DOM 结构中，文本节点和注释节点不能作为容器，因此通常使用元素节点作为容器。然而，需要注意的是，虽然容器通常是元素节点，但是容器中可以挂载元素节点、文本节点和注释节点。

### 可配置的创建特定平台渲染器的接口

想要设计跨平台渲染器，我们就需要把这些特定平台的 API 抽离。

```typescript
/**
 * 创建渲染器配置项
 * @template ElementNode 平台的真实元素节点类型
 * @template TextNode 平台的真实文本节点类型
 * @template CommentNode 平台的真实注释节点类型
 * @template ChildNode 平台的真实的 ChildNode 类型
 */
interface CreateRendererOptions<ElementNode, TextNode, CommentNode, ChildNode> {
  /**
   * 创建元素节点
   * @param tag 标签名称
   */
  createElement: (tag: string) => ElementNode;

  /**
   * 设置元素节点的文本内容
   * @param el 元素节点
   * @param text 文本内容
   */
  setElementText: (el: ElementNode, text: string) => void;

  /**
   * 在给定的 parent 元素节点下添加指定的 el 子节点
   * @param el 子节点
   * @param parent 父元素节点
   * @param anchor 如果是节点，则添加在 anchor 之前
   */
  insert: (
    el: ElementNode | TextNode | CommentNode,
    parent: ElementNode,
    anchor?: ChildNode | null
  ) => void;
}
```

接着这些基于特定平台的 API 作为配置项参数传递给 createRenderer 函数：

```typescript
/**
 * 创建跨平台的渲染器函数
 * @template ElementNode 平台的真实元素节点类型
 * @template TextNode 平台的真实文本节点类型
 * @template CommentNode 平台的真实注释节点类型
 * @template ChildNode 平台的真实的 ChildNode 类型
 */
function createRenderer<ElementNode, TextNode, CommentNode, ChildNode>(
  options: CreateRendererOptions<ElementNode, TextNode, CommentNode, ChildNode>
) {
  /** 虚拟节点 */
  type CreateRendererVnode = Vnode<ElementNode, TextNode, CommentNode>;
  /** 容器 */
  type CreateRendererContainer = Container<ElementNode, TextNode, CommentNode>;
  /** 元素虚拟节点 */
  type CreateRendererElementVnode = ElementVnode<
    ElementNode,
    TextNode,
    CommentNode
  >;
  /** 文本虚拟节点 */
  type CreateRendererTextVnode = TextVnode<TextNode>;
  /** 注释虚拟节点 */
  type CreateRendererCommentVnode = CommentVnode<CommentNode>;

  const { createElement, setElementText, insert } = options;

  /**
   * 更新操作、挂载操作
   * @param n1 旧的虚拟节点、null、undefined
   * @param n2 新的虚拟节点
   * @param container 挂载容器
   */
  function patch(
    n1: CreateRendererVnode | null | undefined,
    n2: CreateRendererVnode,
    container: CreateRendererContainer
  ) {}

  /**
   * 卸载操作
   * @param vnode 虚拟节点
   * @param container 挂载容器
   */
  function unmount(
    vnode: CreateRendererVnode,
    container: CreateRendererContainer
  ) {}

  /**
   * 挂载操作、更新操作、卸载操作
   * @param vnode 虚拟节点、null
   * @param container 挂载容器
   */
  function render(
    vnode: CreateRendererVnode | null,
    container: CreateRendererContainer
  ) {}

  return {
    render,
  };
}
```

在创建特定平台的渲染器时，我们可以将配置项作为参数传递。

例如，在下面的代码中，创建了浏览器平台和通用平台 (可在浏览器和 Node.js 等平台) 的渲染器：

```typescript
// 浏览器平台渲染器
const browserRenderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
});

// 通用平台渲染器
const commonRenderer = createRenderer<any, any, any, any>({
  createElement(tag) {
    console.log(`创建元素 ${tag}`);
    return { tag };
  },
  setElementText(el, text) {
    console.log(`设置 ${JSON.stringify(el)} 的文本内容: ${text}`);
    el.text = text;
  },
  insert(el, parent, anchor) {
    console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`);
    parent.children = el;
  },
});
```

可以看出，我们通过抽象的方式，让核心代码不再依赖特定平台的 API，再通过支持个性化的配置来实现跨平台的能力。
