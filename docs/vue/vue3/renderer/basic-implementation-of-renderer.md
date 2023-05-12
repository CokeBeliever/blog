# 渲染器的基本实现

## 渲染操作 (render)

render 函数执行的是渲染操作。在设计上，它是向外界暴露的一个函数，供使用者调用。下面是该函数的实现：

```typescript
/**
 * 挂载操作、更新操作、卸载操作
 * @param vnode 虚拟节点、null
 * @param container 挂载容器
 */
function render(
  vnode: CreateRendererVnode | null,
  container: CreateRendererContainer
) {
  // 如果新的 vnode 存在，说明是挂载操作、更新操作
  if (vnode) {
    // 将旧的 vnode 和新的 vnode 一起传递给 patch 函数
    patch(container._vnode, vnode, container);
  }
  // 如果新的 vnode 为 null，说明是卸载操作
  else {
    // 如果旧的 vnode 存在，将旧的 vnode 卸载
    if (container._vnode) {
      unmount(container._vnode, container);
    }
  }

  container._vnode = vnode;
}
```

在实现中，render 函数，根据传递的 vnode 参数的不同，以及容器上是否有挂载虚拟节点，来执行不同的操作 (挂载操作、更新操作、卸载操作)。其中，挂载操作和更新操作在实现时不细化区分，而是直接调用 patch 函数。因为挂载操作本身可以看作一种特殊的更新操作，它的特殊之处在于旧 vnode 是不存在的。

## 卸载操作 (unmount)

unmount 函数执行的是卸载操作。

卸载操作，需要注意以下几点：

- 容器的内容可能是由某个或多个组件渲染的，当卸载操作发生时，应该正确地调用这些组件的 beforeUnmount、unmounted 等生命周期函数。
- 即使内容不是由组件渲染的，有的元素存在自定义指令，我们应该在卸载操作发生时正确执行对应的指令钩子函数。
- 需要移除绑定在元素节点上的事件处理函数。

由于，移除节点是一个基于特定的平台的操作。因此，我们应该通过配置项来传递 API：

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
   * 移除指定的 el 节点
   * @param el 节点
   */
  remove: (el: ElementNode | TextNode | CommentNode) => void;
  // ...
}
```

在浏览器平台上，remove 的 API，如下所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  remove(el) {
    // 获取 el 的父元素
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
});
```

下面是该函数的实现：

```typescript
/**
 * 卸载操作
 * @param vnode 虚拟节点
 * @param container 挂载容器
 */
function unmount(
  vnode: CreateRendererVnode,
  container: CreateRendererContainer
) {
  // 调用 remove 函数移除真实节点
  remove(vnode.el!);
}
```

## 挂载和更新操作 (patch)

patch 函数执行的是挂载操作和更新操作。

在实现中，挂载操作我们将视为旧的 vnode 不存在的更新操作处理。因此，在 patch 函数中，我们需要对新旧节点进行一些判断：

- 如果旧的 vnode 不存在，那么执行挂载操作。但是，节点类型不同，挂载操作和更新操作也会有所不同 (例如：元素节点需要处理属性、子节点等，而文本或注释节点则不需要)：
  - 如果新 vnode 是元素节点，那么执行挂载元素节点 mountElement 函数。
  - 如果新 vnode 是文本节点，那么执行挂载文本节点 mountText 函数。
  - 如果新 vnode 是注释节点，那么执行挂载注释节点 mountComment 函数。
- 如果旧的 vnode 存在，那么：
  - 如果新旧 vnode 是不同类型，那么执行更新操作是：先卸载旧的 vnode，然后挂载新的 vnode。(这里的不同类型的节点不仅是元素节点、文本节点和注释节点等节点之间，同时也包括了不同标签的元素节点之间，例如：p 元素和 input 元素。这是因为对于不同的元素来说，每个元素都有特有的属性，并且元素节点之间不能直接转变，需要重新创建。)
  - 如果新旧 vnode 是相同类型的节点，那么执行更新操作。但是，节点类型不同，更新操作也会有所不同：
    - 如果新旧 vnode 是元素节点，那么执行更新元素节点 patchElement 函数。
    - 如果新旧 vnode 是文本节点，那么执行更新文本节点 patchText 函数。
    - 如果新旧 vnode 是注释节点，那么执行更新注释节点 patchComment 函数。

按照上述判断，下面是 patch 函数的实现：

```typescript
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
) {
  // 如果旧 vnode 的存在，并且新旧 vnode 是不同类型，那么卸载旧节点
  if (n1 && n1.type !== n2.type) {
    unmount(n1, container);
    n1 = null;
  }

  const { type } = n2;
  // 如果新 vnode 的类型是 string，则说明该 vnode 描述的是元素节点
  if (typeof type === "string") {
    // 如果旧的 vnode 不存在，则进行挂载操作
    if (!n1) {
      mountElement(n2, container);
    }
    // 如果旧的 vnode 存在，则进行更新操作
    else {
      patchElement(n1 as CreateRendererElementVnode, n2);
    }
  }
  // 如果新 vnode 的类型是 VnodeTypeEnum.TEXT，则说明该 vnode 描述的是文本节点
  else if (type === VnodeTypeEnum.TEXT) {
    // 如果旧的 vnode 不存在，则进行挂载操作
    if (!n1) {
      mountText(n2, container);
    }
    // 如果旧的 vnode 存在，则进行更新操作
    else {
      patchText(n1 as CreateRendererTextVnode, n2);
    }
  }
  // 如果新 vnode 的类型是 VnodeTypeEnum.COMMENT，则说明该 vnode 描述的是注释节点
  else if (type === VnodeTypeEnum.COMMENT) {
    // 如果旧的 vnode 不存在，则进行挂载操作
    if (!n1) {
      mountComment(n2, container);
    }
    // 如果旧的 vnode 存在，则进行更新操作
    else {
      patchComment(n1 as CreateRendererCommentVnode, n2);
    }
  }
}
```

同时，在 createRenderer 函数中新增方法，如下所示：

```typescript
/**
 * 挂载元素节点
 * @param vnode 元素虚拟节点
 * @param container 挂载容器
 */
function mountElement(
  vnode: CreateRendererElementVnode,
  container: CreateRendererContainer
) {}

/**
 * 更新元素节点
 * @param n1 旧的元素虚拟节点
 * @param n2 新的元素虚拟节点
 */
function patchElement(
  n1: CreateRendererElementVnode,
  n2: CreateRendererElementVnode
) {}

/**
 * 挂载文本节点
 * @param vnode 文本虚拟节点
 * @param container 挂载容器
 */
function mountText(
  vnode: CreateRendererTextVnode,
  container: CreateRendererContainer
) {}

/**
 * 更新文本节点
 * @param n1 旧的文本虚拟节点
 * @param n2 新的文本虚拟节点
 */
function patchText(n1: CreateRendererTextVnode, n2: CreateRendererTextVnode) {}

/**
 * 挂载注释节点
 * @param vnode 注释虚拟节点
 * @param container 挂载容器
 */
function mountComment(
  vnode: CreateRendererCommentVnode,
  container: CreateRendererContainer
) {}

/**
 * 更新注释节点
 * @param n1 旧的注释虚拟节点
 * @param n2 新的注释虚拟节点
 */
function patchComment(
  n1: CreateRendererCommentVnode,
  n2: CreateRendererCommentVnode
) {}
```

### 文本节点

**children**

文本 vnode 的数据结构，如下所示：

```typescript
// ‘’
const textVnode = {
  type: VnodeTypeEnum.TEXT,
};

// ‘我是文本内容’
const textVnode = {
  type: VnodeTypeEnum.TEXT,
  children: "我是文本内容",
};
```

children 属性表示的是文本的内容可以有：不存在 (undefined)、字符串 (string)。

#### 挂载 (mountText)

mountText 函数执行的是挂载文本节点操作。下面是该函数的实现：

```typescript
/**
 * 挂载文本节点
 * @param vnode 文本虚拟节点
 * @param container 挂载容器
 */
function mountText(
  vnode: CreateRendererTextVnode,
  container: CreateRendererContainer
) {
  // 使用 createText 创建文本节点
  const el = (vnode.el = createText(vnode.children || ""));
  // 将文本节点插入到容器中
  insert(el, container);
}
```

创建文本节点 createText 是个跨平台的操作，因此，我们需要修改创建渲染器配置项：

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
   * 创建文本节点
   * @param text 文本内容
   */
  createText: (text: string) => TextNode;
  // ...
}
```

在浏览器平台上，createText 的 API，如下所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  createText(text) {
    return document.createTextNode(text);
  },
});
```

#### 更新 (patchText)

patchText 函数执行的是更新文本节点操作。下面是该函数的实现：

```typescript
/**
 * 更新文本节点
 * @param n1 旧的文本虚拟节点
 * @param n2 新的文本虚拟节点
 */
function patchText(n1: CreateRendererTextVnode, n2: CreateRendererTextVnode) {
  const el = (n2.el = n1.el) as TextNode;
  // 如果新旧 vnode 的文本内容不同，那么更新文本内容
  if (n2.children !== n1.children) {
    // 使用 setTextText 设置文本节点的文本内容
    setTextText(el, n2.children || "");
  }
}
```

设置文本节点的文本内容 setTextText 是个跨平台的操作，因此，我们需要修改创建渲染器配置项：

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
   * 设置文本节点的文本内容
   * @param el 文本节点
   * @param text 文本内容
   */
  setTextText: (el: TextNode, text: string) => void;
  // ...
}
```

在浏览器平台上，setTextText 的 API，如下所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  setTextText(el, text) {
    el.nodeValue = text;
  },
});
```

### 注释节点

**children**

注释 vnode 的数据结构，如下所示：

```typescript
// <!-- -->
const commentVnode = {
  type: VnodeTypeEnum.COMMENT,
};

// <!-- 我是注释内容 -->
const commentVnode = {
  type: VnodeTypeEnum.COMMENT,
  children: "我是注释内容",
};
```

children 属性表示的是注释的内容可以有：不存在 (undefined)、字符串 (string)。

#### 挂载 (mountComment)

mountComment 函数执行的是挂载注释节点操作。下面是该函数的实现：

```typescript
/**
 * 挂载注释节点
 * @param vnode 注释虚拟节点
 * @param container 挂载容器
 */
function mountComment(
  vnode: CreateRendererCommentVnode,
  container: CreateRendererContainer
) {
  // 使用 createComment 创建注释节点
  const el = (vnode.el = createComment(vnode.children || ""));
  // 将注释节点插入到容器中
  insert(el, container);
}
```

创建注释节点 createComment 是个跨平台的操作，因此，我们需要修改创建渲染器配置项：

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
   * 创建注释节点
   * @param text 注释内容
   */
  createComment: (text: string) => CommentNode;
  // ...
}
```

在浏览器平台上，createComment 的 API，如下所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  createComment(text) {
    return document.createComment(text);
  },
});
```

#### 更新 (patchComment)

patchComment 函数执行的是更新注释节点操作。下面是该函数的实现：

```typescript
/**
 * 更新注释节点
 * @param n1 旧的注释虚拟节点
 * @param n2 新的注释虚拟节点
 */
function patchComment(
  n1: CreateRendererCommentVnode,
  n2: CreateRendererCommentVnode
) {
  const el = (n2.el = n1.el) as CommentNode;
  // 如果新旧 vnode 的注释内容不同，那么更新注释内容
  if (n2.children !== n1.children) {
    // 使用 setCommentText 设置注释节点的注释内容
    setCommentText(el, n2.children || "");
  }
}
```

设置文本节点的文本内容 setCommentText 是个跨平台的操作，因此，我们需要修改创建渲染器配置项：

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
   * 设置注释节点的注释内容
   * @param el 注释节点
   * @param text 注释内容
   */
  setCommentText: (el: CommentNode, text: string) => void;
  // ...
}
```

在浏览器平台上，setCommentText 的 API，如下所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  setCommentText(el, text) {
    el.nodeValue = text;
  },
});
```

### 元素节点

**children**

元素 vnode 的数据结构，如下所示：

```typescript
/**
 * <div></div>
 */
const elementVnode = {
  type: "div",
};

/**
 * <div>
 *  我是 div 元素节点
 * </div>
 */
const elementVnode = {
  type: "div",
  children: "我是 div 元素节点",
};

/**
 * <div>
 *  <p>我是 p 元素节点</p>
 *  我是文本节点
 * </div>
 */
const elementVnode = {
  type: "div",
  children: [
    {
      type: "p",
      children: "我是 p 元素节点",
    },
    {
      type: VnodeTypeEnum.TEXT,
      children: "我是文本节点",
    },
  ],
};
```

children 属性表示的是元素的子节点可以有：不存在 (undefined)、字符串 (string)、虚拟节点数组 (Vnode[])。

**props**

元素 vnode 的数据结构，如下所示：

```typescript
/**
 * <div></div>
 */
const elementVnode = {
  type: "div",
};

/**
 * <input id="my-input" class="input" type="text" value="foo" aria-valuenow="75" onChange=() => {...}/>
 */
const elementVnode = {
  type: "input",
  props: {
    id: "my-input",
    className: "input",
    type: "text",
    value: "foo",
    "aria-valuenow": "75",
    onChange: () => {
      alert("changed");
    },
  },
};
```

props 属性表示的是元素的属性可以有：不存在 (undefined)、节点属性的键值对映射对象 (object)。

#### 挂载 (mountElement)

mountElement 函数执行的是挂载元素节点操作。下面是该函数的实现：

```typescript
/**
 * 挂载元素节点
 * @param vnode 元素虚拟节点
 * @param container 挂载容器
 */
function mountElement(
  vnode: CreateRendererElementVnode,
  container: CreateRendererContainer
) {
  const el = (vnode.el = createElement(vnode.type));
  // 1.挂载 children
  // 如果 children 是字符串，则设置文本内容
  if (typeof vnode.children === "string") {
    setElementText(el, vnode.children);
  }
  // 如果 children 是数组，则遍历每一个子节点，并调用 patch 函数挂载它们
  else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      patch(null, child, el as CreateRendererContainer);
    });
  }

  // 2.挂载 props
  // 如果 vnode.props 存在才处理它
  if (vnode.props) {
    // 遍历 vnode.props
    for (const key in vnode.props) {
      // 调用 patchProps 将属性设置到元素上
      patchProps(el, key, null, vnode.props[key]);
    }
  }

  // 将元素节点插入到容器中
  insert(el, container);
}
```

挂载元素节点主要是：

1. 处理 children 子节点的挂载
2. 处理 props 节点属性的挂载

#### 更新属性 (patchProps)

在更新 props 属性时，我们可以分为两种属性来处理：普通属性 (例如：id、class)、事件属性 (例如：onClick)。

- 普通属性：使用 HTML Attributes 或 DOM Properties 更新。
- 事件属性：使用 addEleventListener 更新。

更新元素节点的属性 patchProps 是个跨平台的操作，因此，我们需要修改创建渲染器配置项：

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
   * 更新元素节点的属性
   * @param el 元素节点
   * @param key 属性键
   * @param prevValue 旧属性值
   * @param nextValue 新属性值
   */
  patchProps: (
    el: ElementNode,
    key: string,
    prevValue: any,
    nextValue: any
  ) => void;
  // ...
}
```

##### 普通属性

来看一段 HTML 代码：

```html
<button disabled>Button</button>
```

浏览器在解析这段 HTML 代码时，会发现一个 disabled 的 HTML Attributes，于是浏览器在创建具体的 DOM 元素对象时，会将它的 `el.disabled` 的 DOM Properties 的值设置为 true，这一切都是浏览器帮我们处理好的。但是，如果这段代码是在 Vue 模板中，由于 Vue 需要在编译时将 Vue 模板编译为渲染 vnode 的函数。因此，在 Vue 运行时对 vnode 渲染为真实节点时，需要对节点属性进行相应的处理。

###### HTML Attributes 与 DOM Properties

在浏览器中，元素节点的属性可以通过 HTML Attributes 与 DOM Properties 设置。因此，理解 HTML Attributes 和 DOM Properties 之间的差异和关联非常重要，这能够帮助我们合理地设计虚拟节点的结构，更是正确地为元素设置属性的关键。

先来看一段 HTML 代码：

```html
<input id="my-input" class="input" type="text" value="foo" aria-valuenow="75" />
```

HTML Attributes 指的就是定义在 HTML 标签上的属性，例如：`id="my-input"`、`class="input"`、`type="text"`、`value="foo"`、`aria-valuenow="75"`。当浏览器解析这段 HTML 代码后，会创建一个与之相符的 DOM 对象，我们可以通过 JavaScript 代码来读取该 DOM 对象：

```typescript
const el = document.querySelector("#my-input");
```

这个 DOM 对象默认会包含很多属性 (properties)，这些属性就是所谓的 DOM Properties。

下面总结 HTML Attributes 和 DOM Properties 的对应关系：

- 有些 HTML Attributes 在 DOM 对象上有与之对应的同名 DOM Properties，例如：`id="my-input"` 对应 `el.id`、`type="text"` 对应 `el.type`、`value="foo"` 对应 `el.value` 等。
- 有些 HTML Attributes 在 DOM 对象上有与之对应的不同名 DOM Properties，例如：`class="input"` 对应 `el.className` (class 在 ECMAScript 中是一个关键字，主要是避免 ECMAScript 和 DOM API 之间的冲突)。
- 有些 HTML Attributes 在 DOM 对象上没有与之对应的 DOM Properties，例如：`aria-valuenow="75"` 没有对应的 DOM Properties、可能还有更多的自定义 HTML Attributes。
- 有些 DOM 对象的 DOM Properties 上没有与之对应的 HTML Attributes，例如：`el.textContent` 没有对应的 HTML Attributes 来设置元素的文本内容。

再来看一段 HTML 代码：

```html
<input value="foo" />
```

这是一个具有 value 属性的 input 标签。如果元素没有修改文本框的内容，那么通过 `el.value` 读取对应的 DOM Properties 的值就是字符串 "foo"。而如果用户修改了文本框的值，那么 `el.value` 的值就是当前文本框的值。例如，用户将文本框的内容修改为 "bar"，那么：

```typescript
console.log(el.value); // "bar"
```

但是，如果我们使用 HTML Attributes API 来读取 value 的值：

```typescript
console.log(el.getAttribute("value")); // "foo"，与文本框的实际内容不一致
```

可以发现，用户对文本框内容的修改并不会影响 `el.getAttribute('value')` 的返回值，这个现象蕴含着 HTML Attributes 所代表的意义。实际上，**HTML Attributes 的作用是设置 DOM 对象上与之对应的 DOM Properties 的初始值**。HTML Attributes API 读取的是 HTML 标签上的 HTML Attributes，而不是 DOM 对象上的 DOM Properties。

###### 通用处理

**只有属性键**

来看一段 Vue 模板，下面 button 的 disabled 属性只有属性键：

```html
<button disabled>Button</button>
```

编译后，上面这段代码对应的 vnode 是：

```typescript
const vnode = {
  type: "button",
  props: {
    disabled: "",
  },
  children: "Button",
};
```

在只有属性键时，Vue 会将属性值编译为空字符串。

1. HTML Attributes

   上述 vnode，通过 HTML Attributes API 设置节点属性，如下所示：

   ```typescript
   el.setAttribute("disabled", "");
   ```

   最终渲染的 HTML：

   ```html
   <button disabled="">Button</button>
   ```

   在浏览器中会禁用按钮，而这与编译之前的 Vue 模板的**本意相符**。

2. DOM Properties

   上述 vnode，通过 DOM Properties API 设置节点属性，如下所示：

   ```typescript
   el.disabled = "";
   ```

   由于 `el.disabled` 接收一个布尔类型的值，所以当我们对它设置字符串类型会进行隐式类型转换，空字符串会被转为 false。

   在浏览器中不会禁用按钮，而这与编译之前的 Vue 模板的**本意不符**。

**有属性键和值**

来看一段 Vue 模板，下面 button 的 disabled 属性有属性键和值：

```vue
<button :disabled="false">Button</button>
```

编译后，上面这段代码对应的 vnode 是：

```typescript
const vnode = {
  type: "button",
  props: {
    disabled: false,
  },
  children: "Button",
};
```

1. HTML Attributes

   上述 vnode，通过 HTML Attributes API 设置节点属性，如下所示：

   ```typescript
   el.setAttribute("disabled", false);
   ```

   布尔值 false 会进行隐式类型转换为字符串值 "false"，最终渲染的 HTML：

   ```html
   <button disabled="false">Button</button>
   ```

   在浏览器中会禁用按钮，而这与编译之前的 Vue 模板的**本意不符**。

2. DOM Properties

   上述 vnode，通过 DOM Properties API 设置节点属性，如下所示：

   ```typescript
   el.disabled = false;
   ```

   在浏览器中不会禁用按钮，而这与编译之前的 Vue 模板的**本意相符**。

**实现**

这么看来，在更新节点普通属性时，无论是使用 HTML Attributes，还是 DOM Properties，都存在缺陷。要彻底解决这个问题，我们只能做特殊处理，即优先设置元素的 DOM Properties，但当值为空字符串时，要手动将值矫正为 true。只有这样，才能保证代码的行为符合预期。

在浏览器平台上，patchProps 的 API，如下所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    // 用 in 操作符判断 key 是否存在对应的 DOM Properties
    if (key in el) {
      // 获取该 DOM Properties 的类型
      const type = typeof el[key];
      // 如果是布尔类型，并且 nextValue 是空字符串，则将值矫正为 true
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    }
    // 如果要设置的属性没有对应的 DOM Properties，则使用 setAttribute 函数设置属性
    else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

###### 只读 DOM Properties 处理

来看一段 Vue 模板：

```vue
<input form="form1" />
```

编译后，上面这段代码对应的 vnode 是：

```typescript
const vnode = {
  type: "input",
  props: {
    form: "form1",
  },
};
```

在这段 Vue 模板中，input 标签的 form 属性所对应的 DOM Properties 是 `el.form`，但 `el.form` 是只读的。因此，我们只能够通过 HTML Attributes 的 setAttribute 函数来设置它。因此，我们需要调整 patchProps 函数的实现，如下面的代码所示：

```typescript
/**
 * 是否应该作为 DOM Properties 设置
 * @param el 元素节点
 * @param key 属性键
 * @param value 属性值
 */
function shouldSetAsProps(el: HTMLElement, key: string, value: any) {
  // 特殊处理
  if (key === "form" && el.tagName === "INPUT") return false;
  // 用 in 操作符判断 key 是否存在对应的 DOM Properties
  return key in el;
}

const renderer = createRenderer<HTMLElement>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    // 是否应该作为 DOM Properties 设置
    if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

###### class 属性处理

由于 class 属性对应的 DOM Properties 是 `el.className`，所以表达式 `'class' in el` 的值将会是 false。因此，patchProps 函数会使用 setAttribute 函数来完成 class 的设置。但是我们知道，在浏览器中为一个元素设置 class 有三种方式，即使用 setAttribute、`el.className` 或 `el.classList`。经过测试，`el.className` 的性能最优。因此，我们需要调整 patchProps 函数的实现，如下面的代码所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    // 对 class 进行特殊处理
    if (key === "class") {
      el.className = nextValue || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

##### 事件属性

如何在虚拟节点中描述事件呢？事件可以视作一种特殊的属性。因此，我们可以约定，在 `vnode.props` 对象中，凡是以字符串 on 开头的属性都视作事件。

来看一段 Vue 模板：

```vue
<p
  @click="
    () => {
      alert('clicked');
    }
  "
>text</p>
```

编译后，上面这段代码对应的 vnode 是：

```typescript
const vnode = {
  type: "p",
  props: {
    // 使用 onXxx 描述事件
    onClick: () => {
      alert("clicked");
    },
  },
  children: "text",
};
```

解决了事件在虚拟节点中的描述问题后，我们就需要实现在 DOM 对象上的添加和移除事件操作，一般我们使用 `addEventListener` 来添加事件、`removeEventListener` 来移除事件。如下面的代码所示：

```typescript
const renderer = createRenderer<HTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    // 匹配以 on 开头的属性，视其为事件
    if (/^on/.test(key)) {
      // 根据属性名称得到对应的事件名称，例如 onClick ---> click
      const name = key.slice(2).toLocaleLowerCase();
      // 移除上一次绑定的事件处理函数
      prevValue && el.removeEventListener(name, prevValue);
      // 绑定事件，nextValue 为事件处理函数
      el.addEventListener(name, nextValue);
    } else if (key === "class") {
      el.className = nextValue || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

虽然这样做代码就能够按照预期工作，但是在更新时会对元素进行移除和添加事件，在频繁更新时性能可能会受此影响。其实还有一种性能更优的方式来完成事件更新，如下代码所示：

```typescript
/**
 * 扩展 HTMLElement
 */
interface ExtendedHTMLElement extends HTMLElement {
  /** 伪造的事件处理函数 */
  _vei?: {
    (e: Event): void;
    /** 真正的事件处理函数 */
    value: (e: Event) => void;
  };
}

const renderer = createRenderer<ExtendedHTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    // 匹配以 on 开头的属性，视其为事件
    if (/^on/.test(key)) {
      // 获取为该元素伪造的事件处理函数 invoker
      let invoker = el._vei;
      // 根据属性名称得到对应的事件名称，例如 onClick ---> click
      const name = key.slice(2).toLocaleLowerCase();

      if (nextValue) {
        if (!invoker) {
          const eventHandler = (e: Event) => {
            if (!invoker) return;
            // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
            invoker.value(e);
          };
          // 将真正的事件处理函数赋值给 eventHandler.value
          eventHandler.value = nextValue;
          // 将伪造的事件处理函数缓存到 invoker 和 el._vei 中，vei 是 vue event invoker 的首字母缩写
          invoker = el._vei = eventHandler;
          // 绑定 invoker 作为事件处理函数
          el.addEventListener(name, invoker);
        }
        // 如果 invoker 存在，意味着更新，并且只需要更新 invoker.value 的值即可
        else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        // 新的事件处理函数不存在，且之前绑定的 invoker 存在，则移除绑定
        el.removeEventListener(name, invoker);
      }
    } else if (key === "class") {
      el.className = nextValue || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

当更新事件时，如果 `el._vei` 已经存在了，只需将 `invoker.value` 的值修改为新的事件处理函数即可。这样，在更新事件时可以避免 `removeEventListener` 和 `addEventListener` 函数的调用，从而提升了性能。

但是目前的实现仍然存在问题。我们将事件处理函数缓存在 `el._vei` 中，这意味着同一时刻只能缓存一个事件处理函数。如果一个元素同时绑定了多种事件，将会出现事件覆盖的现象。例如同时给元素绑定 click 和 contextmenu 事件：

```typescript
const vnode = {
  type: "p",
  props: {
    onClick: () => {
      alert("clicked");
    },
    onContextmenu: () => {
      alert("contextmenu");
    },
  },
  children: "text",
};
```

为了解决事件覆盖的问题，我们需要重写设计 `el.vei` 的数据结构，我们应该将 `el.vei` 设计为一个对象，它的键是事件名，它的值则是对应的伪造的事件处理函数，这样就不会发生事件覆盖的现象了，如下面的代码所示：

```typescript
/**
 * 扩展 HTMLElement
 */
interface ExtendedHTMLElement extends HTMLElement {
  /** 事件名到伪造的事件处理函数的映射对象 */
  _vei?: {
    [key: string]: {
      /** 伪造的事件处理函数 */
      (e: Event): void;
      /** 真正的事件处理函数 */
      value: (e: Event) => void;
    };
  };
}

const renderer = createRenderer<ExtendedHTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
      // 定义 el._vei 为一个对象，存储事件名到伪造的事件处理函数的映射
      const invokers = el._vei || (el._vei = {});
      // 获取为该元素伪造的事件处理函数 invoker
      let invoker = invokers[key];
      const name = key.slice(2).toLocaleLowerCase();

      if (nextValue) {
        if (!invoker) {
          const eventHandler = (e: Event) => {
            if (!invoker) return;
            invoker.value(e);
          };
          eventHandler.value = nextValue;
          // 将伪造的事件处理函数缓存到 invoker 和 el._vei[key] 中
          invoker = el._vei[key] = eventHandler;
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === "class") {
      el.className = nextValue || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

另外，一个元素不仅可以绑定多种类型的事件，对于同一类型的事件而言，还可以绑定多个事件处理函数，多个事件处理函数可以共存。例如：

```typescript
el.addEventListener("click", fn1);
el.addEventListener("click", fn2);
```

当同一类型事件绑定多个事件处理函数时，`vnode.props.onXxx` 的属性值是一个事件处理函数数组，例如：

```typescript
const vnode = {
  type: "p",
  props: {
    onClick: [
      // 第一个事件处理函数
      () => {
        alert("clicked 1");
      },
      // 第二个事件处理函数
      () => {
        alert("clicked 2");
      },
    ],
  },
  children: "text",
};
```

为了实现此功能，我们需要修改 patchProps 函数中事件处理相关的代码，如下面的代码所示：

```typescript
/**
 * 扩展 HTMLElement
 */
interface ExtendedHTMLElement extends HTMLElement {
  /** 事件名到伪造的事件处理函数的映射对象 */
  _vei?: {
    [key: string]: {
      /** 伪造的事件处理函数 */
      (e: Event): void;
      /** 真正的事件处理函数 */
      value: (e: Event) => void;
    };
  };
}

const renderer = createRenderer<ExtendedHTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {});
      let invoker = invokers[key];
      const name = key.slice(2).toLocaleLowerCase();

      if (nextValue) {
        if (!invoker) {
          const eventHandler = (e: Event) => {
            if (!invoker) return;
            // 如果 invoker.value 是数组，则遍历它并逐个调用事件处理函数
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => fn(e));
            }
            // 否则直接作为函数调用
            else {
              invoker.value(e);
            }
          };
          eventHandler.value = nextValue;
          invoker = el._vei[key] = eventHandler;
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === "class") {
      el.className = nextValue || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

###### 事件冒泡与更新机制

接下来，我们来看一个事件冒泡与更新机制相结合所导致的问题。例如：

```typescript
const { effect, ref } = VueReactivity;

const bol = ref(false);

effect(() => {
  // 创建 vnode
  const vnode = {
    type: "div",
    props: bol.value
      ? {
          onClick: () => {
            alert("父元素 clicked");
          },
        }
      : {},
    children: [
      {
        type: "p",
        props: {
          onClick: () => {
            bol.value = true;
          },
        },
        children: "text",
      },
    ],
  };

  // 渲染 vnode
  renderer.render(vnode, document.querySelector("#app"));
});
```

在上面这段代码中，我们创建一个响应式数据 bol，它是一个 ref，初始值为 false。接着，创建了一个 effect，并在副作用函数内调用 `renderer.render` 函数来渲染 vnode。这里的重点在于该 vnode 对象，它描述了一个 div 元素，并且该 div 元素具有一个 p 元素作为子节点。下面是 div 和 p 节点的首次渲染情况：

- div 元素：由于 `bol.value` 的值为 false，所以它的 props 的值是一个空对象。

- p 元素：它具有 click 点击事件，当点击时，事件处理函数会将 `bol.value` 的值设置为 true。

我们期望的运行效果是：

1. 首次点击 p 元素时，会触发它的 click 事件处理程序，`bol.value` 的值会设置为 true。(**事件冒泡结束**)
2. 响应式数据 bol 发生改变，会使副作用函数重新执行，因为 `bol.value` 为 true，重新渲染的 div 元素会绑定 click 事件处理程序。

在实际中，我们并不能保证副作用函数重新执行一定发生在事件冒泡结束之后，这可能在不同浏览器会有所不同。如果副作用函数在事件冒泡结束之前执行，则运行的效果是：

1. 首次点击 p 元素时，会触发它的 click 事件处理程序，`bol.value` 的值会设置为 true。
2. 响应式数据 bol 发生改变，会使副作用函数重新执行，因为 `bol.value` 为 true，重新渲染的 div 元素会绑定 click 事件处理程序。
3. 事件冒泡到 div 元素，会触发它的 click 事件处理程序。(**事件冒泡结束**)

为了保证事件的触发一定是发生在事件的绑定之后，**我们可以屏蔽所有绑定时间晚于事件触发时间的事件处理函数的执行**。我们需要修改 patchProps 函数中事件处理相关的代码，如下面的代码所示：

```typescript
/**
 * 扩展 HTMLElement
 */
interface ExtendedHTMLElement extends HTMLElement {
  /** 事件名到伪造的事件处理函数的映射对象 */
  _vei?: {
    [key: string]: {
      /** 伪造的事件处理函数 */
      (e: Event): void;
      /** 真正的事件处理函数 */
      value: (e: Event) => void;
      /** 事件处理函数绑定的时间 */
      attached: number;
    };
  };
}

const renderer = createRenderer<ExtendedHTMLElement, Text, Comment, ChildNode>({
  // ...
  patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {});
      let invoker = invokers[key];
      const name = key.slice(2).toLocaleLowerCase();

      if (nextValue) {
        if (!invoker) {
          const eventHandler = (e: Event) => {
            if (!invoker) return;
            // e.timeStamp 是事件发生的时间
            // 如果事件发生的时间早于事件处理函数绑定的时间，则不执行事件处理函数
            if (e.timeStamp < invoker.attached) return;
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => fn(e));
            } else {
              invoker.value(e);
            }
          };
          eventHandler.value = nextValue;
          // 添加 eventHandler.attached 属性，存储事件处理函数被绑定的时间
          eventHandler.attached = performance.now();
          invoker = el._vei[key] = eventHandler;
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === "class") {
      el.className = nextValue || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});
```

#### 更新 (patchElement)

patchElement 函数执行的是更新元素节点操作。下面是该函数的实现：

```typescript
/**
 * 更新元素节点
 * @param n1 旧的元素虚拟节点
 * @param n2 新的元素虚拟节点
 */
function patchElement(
  n1: CreateRendererElementVnode,
  n2: CreateRendererElementVnode
) {
  const el = (n2.el = n1.el) as ElementNode;
  const oldProps = n1.props || {};
  const newProps = n2.props || {};

  // 1.更新 props
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      patchProps(el, key, oldProps[key], newProps[key]);
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      patchProps(el, key, oldProps[key], null);
    }
  }

  // 2.更新 children
  patchChildren(n1, n2, el as CreateRendererContainer);
}
```

上面代码中的实现主要是：

1. 更新 props：设置新的 props、卸载旧的 props。
2. 更新 children：具体实现封装在 patchChildren 函数。

##### 更新子节点 (patchChildren)

patchChildren 函数执行的是更新元素子节点操作。

前面我们提到，元素节点的 children 属性的类型可以有：没有子节点 (undefined)、文本子节点 (string)、一组子节点 (Vnode[])。因此，新旧子节点类型将有九种组合：

| 新的子节点 | 旧的子节点 | 更新方式                               |
| ---------- | ---------- | -------------------------------------- |
| 没有子节点 | 没有子节点 | 不需要任何处理                         |
| 没有子节点 | 文本子节点 | 卸载旧的文本子节点                     |
| 没有子节点 | 一组子节点 | 卸载旧的一组子节点                     |
| 文本子节点 | 没有子节点 | 挂载新的文本子节点                     |
| 文本子节点 | 文本子节点 | 挂载新的文本子节点                     |
| 文本子节点 | 一组子节点 | 卸载旧的一组子节点，挂载新的文本子节点 |
| 一组子节点 | 没有子节点 | 挂载新的一组子节点                     |
| 一组子节点 | 文本子节点 | 卸载旧的文本子节点，挂载新的一组子节点 |
| 一组子节点 | 一组子节点 | 卸载旧的一组子节点，挂载新的一组子节点 |

下面是 patchChildren 函数的实现：

```typescript
/**
 * 更新元素子节点
 * @param n1 旧的元素虚拟节点
 * @param n2 新的元素虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode,
  n2: CreateRendererElementVnode,
  container: CreateRendererContainer
) {
  // 新子节点的类型是文本节点
  if (typeof n2.children === "string") {
    // 旧子节点的类型有三种可能：没有子节点、文本子节点以及一组子节点
    // 只有当旧子节点为一组子节点时，才需要逐个卸载，其他情况下什么都不需要做
    if (Array.isArray(n1.children)) {
      n1.children.forEach((c) => unmount(c, container));
    }
    // 最后将新的文本节点内容设置给容器元素
    setElementText(container, n2.children);
  }
  // 新子节点的类型是一组子节点
  else if (Array.isArray(n2.children)) {
    // 判断旧子节点是否也是一组子节点
    if (Array.isArray(n1.children)) {
      // 代码运行到这里，则说明新旧子节点都是一组子节点，这里涉及核心的 Diff 算法
      // 目前先简单处理：将旧的一组子节点逐个卸载，再将新的一组子节点逐个挂载
      n1.children.forEach((c) => unmount(c, container));
      n2.children.forEach((c) => patch(null, c, container));
    } else {
      // 此时：
      // 旧子节点要么是文本子节点，要么没有子节点
      // 但无论哪种情况，我们都只需要将容器清空，然后将新的一组子节点逐个挂载
      setElementText(container, "");
      n2.children.forEach((c) => patch(null, c, container));
    }
  }
  // 新子节点的类型是没有子节点
  else {
    // 旧子节点是一组子节点，只需逐个卸载即可
    if (Array.isArray(n1.children)) {
      n1.children.forEach((c) => unmount(c, container));
    }
    // 旧子节点是文本子节点，清空内容即可
    else if (typeof n1.children === "string") {
      setElementText(container, "");
    }
    // 如果旧子节点也是没有子节点，那么不需要任何处理
  }
}
```

## 其他 vnode 类型

### Fragment

Fragment (片段) 是 Vue 3 新增的一个 vnode 类型。

在 Vue2 中，组件的模板不允许存在多个根节点。例如：

```vue
<template>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</template>
```

这段代码，如果是在 Vue2 中编译，将会报错。

而 Vue3 支持多根节点模板。在 Vue3 中编译，这段代码会编译为：

```typescript
const = vnode {
  type: VnodeTypeEnum.FRAGMENT,
  children: [
    { type: 'li', children: '1' },
    { type: 'li', children: '2' },
    { type: 'li', children: '3' }
  ]
}
```

children 属性表示的是 Fragment 的内容可以有：不存在 (undefined)、虚拟节点数组 (Vnode[])。

#### TypeScript 类型

由于我们使用 TypeScript 来实现。因此，需要做一些类型上的调整：

```typescript
// 新增：FragmentVnode 接口
/**
 * Fragment (片段) 虚拟节点
 * @template ElementNode 真实元素节点类型
 * @template TextNode 真实文本节点类型
 * @template CommentNode 真实注释节点类型
 */
interface FragmentVnode<ElementNode, TextNode, CommentNode> {
  /** 节点类型 */
  type: VnodeTypeEnum.FRAGMENT;
  /** 子节点 */
  children?: Vnode<ElementNode, TextNode, CommentNode>[];
  /** 虚拟节点对应的真实节点 */
  el?: undefined;
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
  | CommentVnode<CommentNode>
  // 修改：Vnode 还可能是 FragmentVnode 类型
  | FragmentVnode<ElementNode, TextNode, CommentNode>;

/**
 * 虚拟节点类型枚举 (用于枚举文本/注释/片段虚拟节点)
 */
enum VnodeTypeEnum {
  /** 文本节点的 type 标识 */
  TEXT,
  /** 注释节点的 type 标识 */
  COMMENT,
  // 新增：Fragment 枚举
  /** Fragment 的 type 标识 */
  FRAGMENT,
}

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
  // ...

  // 新增：CreateRendererFragmentVnode 类型
  /** Fragment 虚拟节点 */
  type CreateRendererFragmentVnode = FragmentVnode<
    ElementNode,
    TextNode,
    CommentNode
  >;

  // ...

  /**
   * 更新元素或 Fragment 的子节点
   * @param n1 旧的元素或 Fragment 虚拟节点
   * @param n2 新的元素或 Fragment 虚拟节点
   * @param container 挂载容器
   */
  function patchChildren(
    // 修改：n1 和 n2 还可能是 CreateRendererFragmentVnode 类型
    n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
    n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
    container: CreateRendererContainer
  ) {
    /* ... */
  }
}
```

#### 挂载和更新操作 (patch)

原先我们的渲染器只支持处理文本、注释、元素节点的挂载和更新操作，由于我们新增了 Fragment 类型，因此需要修改 patch 函数的实现：

```typescript
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
) {
  if (n1 && n1.type !== n2.type) {
    unmount(n1, container);
    n1 = null;
  }

  const { type } = n2;
  if (typeof type === "string") {
    // ...
  } else if (type === VnodeTypeEnum.TEXT) {
    // ...
  } else if (type === VnodeTypeEnum.COMMENT) {
    // ...
  } else if (type === VnodeTypeEnum.FRAGMENT) {
    // 如果旧的 vnode 不存在，则进行挂载操作
    if (!n1) {
      mountFragment(n2, container);
    }
    // 如果旧的 vnode 存在，则进行更新操作
    else {
      patchFragment(n1 as CreateRendererFragmentVnode, n2, container);
    }
  }
}
```

同时，在 createRenderer 函数中新增方法，如下所示：

```typescript
/**
 * 挂载 Fragment
 * @param vnode Fragment 虚拟节点
 * @param container 挂载容器
 */
function mountFragment(
  vnode: CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {}

/**
 * 更新 Fragment
 * @param n1 旧的 Fragment 虚拟节点
 * @param n2 新的 Fragment 虚拟节点
 */
function patchFragment(
  n1: CreateRendererFragmentVnode,
  n2: CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {}
```

##### 挂载 (mountFragment)

mountFragment 函数执行的是挂载 Fragment 操作。下面是该函数的实现：

```typescript
/**
 * 挂载 Fragment
 * @param vnode Fragment 虚拟节点
 * @param container 挂载容器
 */
function mountFragment(
  vnode: CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  // 只需要逐个挂载 Fragment 的 children 即可
  vnode.children?.forEach((c) => patch(null, c, container));
}
```

##### 更新 (patchFragment)

patchFragment 函数执行的是更新 Fragment 操作。下面是该函数的实现：

```typescript
/**
 * 更新 Fragment
 * @param n1 旧的 Fragment 虚拟节点
 * @param n2 新的 Fragment 虚拟节点
 */
function patchFragment(
  n1: CreateRendererFragmentVnode,
  n2: CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  // 只需要更新 Fragment 的 children 即可
  patchChildren(n1, n2, container);
}
```

#### 卸载操作 (unmount)

原先我们的渲染器只支持处理文本、注释、元素节点的卸载操作，由于我们新增了 Fragment 类型，因此需要修改 unmount 函数的实现：

```typescript
/**
 * 卸载操作
 * @param vnode 虚拟节点
 * @param container 挂载容器
 */
function unmount(
  vnode: CreateRendererVnode,
  container: CreateRendererContainer
) {
  // 在卸载时，如果卸载的 vnode 类型为 VnodeTypeEnum.FRAGMENT，则需要卸载其 children
  if (vnode.type === VnodeTypeEnum.FRAGMENT) {
    vnode.children?.forEach((c) => unmount(c, container));
  } else {
    remove(vnode.el!);
  }
}
```
