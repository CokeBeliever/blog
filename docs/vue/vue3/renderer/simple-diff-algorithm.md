# 简单 Diff 算法

当新旧 vnode 的子节点都是一组节点时，为了以最小的性能开销完成更新操作，需要比较两组子节点，用于比较的算法就叫做 Diff 算法。

我们知道，操作 DOM 的性能开销通常比较大，而渲染器的核心 Diff 算法就是为了解决这个问题而诞生的。

## 减少 DOM 操作的性能开销

之前，我们针对新旧子节点都是一组子节点的更新方式，采用了一种简单直接的手段，即卸载旧的一组子节点，再挂载新的一组子节点。这么做确实可以完成更新，但由于没有复用任何 DOM 元素，所以会产生极大的性能开销。以下面的新旧虚拟节点为例：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1" },
    { type: "p", children: "2" },
    { type: "p", children: "3" },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "p", children: "4" },
    { type: "p", children: "5" },
    { type: "p", children: "6" },
  ],
};
```

按照之前的实现，当更新子节点时，我们需要执行 6 次 DOM 操作。

- 卸载所有旧的子节点，需要 3 次 DOM 删除操作。
- 挂载所有新的子节点，需要 3 次 DOM 添加操作。

但是，通过观察上面新旧 vnode 的子节点，可以发现：

- 更新前后的所有子节点都是 p 标签，即元素类型不变。
- 只有 p 标签的子节点 (文本节点) 会发生变化。

因此，在这种情况下，我们只需对每个元素的文本节点进行更新即可，一共只需要 3 次 DOM 操作，性能提升了一倍。

按照这个思路，我们可以重新实现两组子节点的更新逻辑，如下面 patchChildren 函数的代码所示：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      // 重新实现新旧子节点都是一组子节点的更新方式
      const oldChildren = n1.children;
      const newChildren = n2.children;
      // 遍历新的 children
      for (let i = 0; i < newChildren.length; i++) {
        // 调用 patch 函数逐个更新子节点
        patch(oldChildren[i], newChildren[i], container);
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

在上面的代码中，我们通过遍历旧的一组子节点，并假设新的一组子节点的数量与之相同，只有在这种情况下，这段代码才能正确工作。

但是，新旧两组子节点的数量未必相同。我们也应该考虑数量不同的情况：

- 如果新的一组子节点的数量少于 (`<`) 旧的一组子节点的数量时，则多出部分旧的子节点应该被卸载 (unmount)。
- 如果新的一组子节点的数量大于 (`>`) 旧的一组子节点的数量时，则多出部分新的子节点应该被挂载 (mount)。

按照上面的分析，我们应该在进行新旧两组子节点的更新时，不应该总是遍历新的一组子节点，而是应该遍历其中长度较短的那一组，通过 patch 函数对新旧子节点的更新。接着，再对比新旧两组子节点的长度，如果新的一组子节点更长，则说明有新子节点需要挂载，否则说明有旧子节点需要卸载。最终实现如下：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      // 重新实现新旧子节点都是一组子节点的更新方式
      const oldChildren = n1.children;
      const newChildren = n2.children;
      // 旧的一组子节点的长度
      const oldLen = oldChildren.length;
      // 新的一组子节点的长度
      const newLen = newChildren.length;
      // 两组子节点的公共长度，即两者中较短的那一组子节点的长度
      const commonLength = Math.min(oldLen, newLen);

      // 遍历 commonLength 次
      for (let i = 0; i < commonLength; i++) {
        patch(oldChildren[i], newChildren[i], container);
      }

      // 如果 newLen > oldLen，则说明有新的子节点需要挂载
      if (newLen > oldLen) {
        for (let i = commonLength; i < newLen; i++) {
          patch(null, newChildren[i], container);
        }
      }
      // 如果 newLen < oldLen，则说明有旧的子节点需要卸载
      else if (oldLen > newLen) {
        for (let i = commonLength; i < oldLen; i++) {
          unmount(oldChildren[i], container);
        }
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

这样，无论新旧两组子节点的数量关系如何，渲染器都能够正确地挂载或卸载它们。

## DOM 复用与 key 的作用

前面，我们通过减少 DOM 操作的次数，提升了更新性能。但这种方式仍然存在可优化的空间。以下面的新旧虚拟节点为例：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1" },
    { type: "div", children: "2" },
    { type: "span", children: "3" },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "span", children: "3" },
    { type: "p", children: "1" },
    { type: "div", children: "2" },
  ],
};
```

按照之前的实现，当更新子节点时，我们还是需要执行 6 次 DOM 操作。这是由于在新旧两组子节点中，每次调用 patch 时都是不同元素标签：

- 第 1 次：旧的 `{ type: 'p', children: '1' }` 和新的 `{ type: 'span', children: '3' }`，它们是不同元素标签，patch 函数会卸载旧的节点，再挂载新的节点，2 次 DOM 操作。
- 第 2 次：旧的 `{ type: 'div', children: '2' }` 和新的 `{ type: 'p', children: '1' }`，它们是不同元素标签，patch 函数会卸载旧的节点，再挂载新的节点，2 次 DOM 操作。
- 第 3 次：旧的 `{ type: 'span', children: '3' }` 和新的 `{ type: 'div', children: '2' }`，它们是不同元素标签，patch 函数会卸载旧的节点，再挂载新的节点，2 次 DOM 操作。

我们观察新旧两组子节点，很容易发现，二者只是顺序不同。所以最优的处理方式是，通过 DOM 的移动来完成子节点的更新，这要比不断地执行子节点的卸载和挂载性能更好。

但是，想要通过 DOM 的移动来完成更新，必须要保证一个前提：新旧两组子节点中的确存在可复用的节点。如果新的子节点没有在旧的一组子节点中出现，就无法通过移动节点的方式完成更新。所以现在问题变成了：应该如何确定新的子节点是否出现在旧的一组子节点中呢？

这时，我们可以引入额外的 key 来作为 vnode 的标识，如下面的代码所示：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1 },
    { type: "div", children: "2", key: 2 },
    { type: "span", children: "3", key: 3 },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "span", children: "3", key: 3 },
    { type: "p", children: "1", key: 1 },
    { type: "div", children: "2", key: 2 },
  ],
};
```

**key 属性就像虚拟节点的 id，只要两个虚拟节点的 type 属性值和 key 属性值都相同，那么我们就认为它们是相同的，即可以进行 DOM 复用**。需要注意的是，DOM 复用并不意味着只需要更新位置，如下面的两个虚拟节点所示：

```typescript
const oldVnode = { type: "p", key: 1, children: "1" };
const newVnode = { type: "p", key: 1, children: "2" };
```

这两个虚拟节点拥有相同的 key 值和 `vnode.type` 属性值，这意味着，在更新时可以 DOM 复用。但是，不仅需要通过移动操作更新位置，还需要对这两个虚拟节点更新内容。例如：新旧 vnode 的 children 不同。

**实现**

我们为所有节点接口添加 key 属性的声明：

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
  /** 虚拟节点对应的真实节点 */
  el?: ElementNode;
  /** 节点属性的键值对映射 */
  props?: { [key: string]: any };
  /** 节点标识 */
  key?: any;
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
  /** 节点标识 */
  key?: undefined;
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
  /** 节点标识 */
  key?: undefined;
}

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
  /** 节点标识 */
  key?: undefined;
}
```

我们重新实现了新旧两组子节点的更新逻辑，如下所示：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      const oldChildren = n1.children;
      const newChildren = n2.children;

      // 遍历新的 children
      for (let i = 0; i < newChildren.length; i++) {
        const newVnode = newChildren[i];
        // 遍历旧的 children
        for (let j = 0; j < oldChildren.length; j++) {
          const oldVnode = oldChildren[j];
          // 如果找到了具有相同 key 值的两个节点，说明可以复用，但仍然需要调用 patch 函数更新
          if (newVnode.key === oldVnode.key) {
            patch(oldVnode, newVnode, container);
            break;
          }
        }
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

上面代码，我们能够保证所有可复用的节点都已经更新内容，但还没更新位置。测试一下：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1 },
    { type: "p", children: "2", key: 2 },
    { type: "p", children: "hello", key: 3 },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "p", children: "world", key: 3 },
    { type: "p", children: "1", key: 1 },
    { type: "p", children: "2", key: 2 },
  ],
};

// 首次挂载
renderer.render(oldVnode, document.querySelector("#app")!);
setTimeout(() => {
  // 1 秒钟后更新
  renderer.render(newVnode, document.querySelector("#app")!);
}, 1000);
```

运行上面这段代码，1 秒钟后，key 值为 3 的子节点对应的真实节点的文本内容会由字符串 "hello" 更新为字符串 "world"。可以发现，newVnode 的真实节点都更新完毕了，但是真实节点仍然保持 oldVnode 一组子节点的顺序。

现在，我们已经能够通过 key 属性找到可复用的节点并更新内容了。接下来需要思考的是：

- 如何判断一个节点是否需要移动？
- 如何移动节点？

## 找到需要移动的元素

如何判断一个节点是否需要移动，我们可以采用逆向思维的方式，先想一想在什么情况下节点不需要移动？答案很简单，当新旧两组子节点的节点相对顺序不变时，就不需要额外的移动操作。来看一个例子：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1 },
    { type: "div", children: "2", key: 2 },
    { type: "span", children: "3", key: 3 },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "span", children: "3", key: 3 },
    { type: "p", children: "1", key: 1 },
    { type: "div", children: "2", key: 2 },
  ],
};
```

我们用 key 来描述节点相对顺序：

- 旧的一组子节点的节点相对顺序为：`1, 2, 3`。
- 新的一组子节点的节点相对顺序为：`3, 1, 2`。

相对顺序，意味着需要有一个参考系，我们用新的一组子节点的第一个的可复用节点的位置作为参考系，在上面例子中，也就是 key 为 3 旧节点的索引。可以发现：

- 新的一组子节点 key 为 3 的可复用节点在旧的一组子节点索引为 2 的位置，参考系记为 2。
- 新的一组子节点 key 为 1 的可复用节点在旧的一组子节点索引为 0 的位置，0 < 参考系的索引，因此相对顺序发生改变，需要移动。
- 新的一组子节点 key 为 2 的可复用节点在旧的一组子节点索引为 1 的位置，1 < 参考系的索引，因此相对顺序发生改变，需要移动。

在实现中，我们可以通过一个变量 lastIndex 来存储遍历过程中遇到的旧的子节点的最大索引值 (参考系)，通过这个变量就可以确定：可复用的节点在新旧两组子节点中的相对顺序是否一致。如果相对顺序是不一致的，则说明需要移动。如下面代码所示：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      const oldChildren = n1.children;
      const newChildren = n2.children;

      // 用来存储寻找过程中遇到的最大索引值
      let lastIndex = 0;
      for (let i = 0; i < newChildren.length; i++) {
        const newVnode = newChildren[i];
        for (let j = 0; j < oldChildren.length; j++) {
          const oldVnode = oldChildren[j];
          if (newVnode.key === oldVnode.key) {
            patch(oldVnode, newVnode, container);
            // 如果当前找到的节点在旧 children 中的索引小于最大索引值 lastIndex，则说明该节点对应的真实节点需要移动
            if (j < lastIndex) {
            }
            // 如果当前找到的节点在旧 children 中的索引不小于最大索引值 lastIndex，则更新 lastIndex
            else {
              lastIndex = j;
            }
            break;
          }
        }
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

## 如何移动元素

如何移动节点？来看前面的例子：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1 },
    { type: "div", children: "2", key: 2 },
    { type: "span", children: "3", key: 3 },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "span", children: "3", key: 3 },
    { type: "p", children: "1", key: 1 },
    { type: "div", children: "2", key: 2 },
  ],
};
```

节点相对顺序 `1, 2, 3` 移动为 `3, 1, 2`：

- 新的一组子节点索引为 0 的可复用节点在旧的一组子节点的索引为 2 的位置。标定参考系，不需要移动。
- 新的一组子节点索引为 1 的可复用节点在旧的一组子节点的索引为 0 的位置。相对位置改变，需要移动，将该真实节点移动到前一个节点之后，也就是后一个节点之前。
- 新的一组子节点索引为 2 的可复用节点在旧的一组子节点的索引为 1 的位置。相对位置改变，需要移动，将该真实节点移动到前一个节点之后，也就是后一个节点之前。

如下面代码所示：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      const oldChildren = n1.children;
      const newChildren = n2.children;

      let lastIndex = 0;
      for (let i = 0; i < newChildren.length; i++) {
        const newVnode = newChildren[i];
        for (let j = 0; j < oldChildren.length; j++) {
          const oldVnode = oldChildren[j];
          if (newVnode.key === oldVnode.key) {
            patch(oldVnode, newVnode, container);
            if (j < lastIndex) {
              // 先获取 newVnode 的前一个 vnode，即 prevVnode
              // 注意，当 i = 0 时，j >= lastIndex，不会进入这个语句块。因此，prevVnode 肯定能取得到虚拟节点值。
              const prevVnode = newChildren[i - 1];
              // 由于我们要将 newVnode 对应的真实节点移动到 prevVnode 所对应真实节点后面，
              // 所以我们需要获取 prevVnode 所对应真实节点的下一个兄弟节点，并将其作为锚点
              const anchor = nextSibling(prevVnode.el!);
              // 调用 insert 方法将 newVnode 对应的真实节点插入到锚点元素前面
              // 也就是 prevVnode 对应真实节点的后面
              insert(newVnode.el!, container, anchor);
            } else {
              lastIndex = j;
            }
            break;
          }
        }
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

获取节点的下一个兄弟节点 nextSibling 是个跨平台的操作，因此，我们需要修改创建渲染器配置项：

```typescript
/**
 * 创建渲染器配置项
 * @template ElementNode 平台的真实元素节点类型
 * @template TextNode 平台的真实文本节点类型
 * @template CommentNode 平台的真实注释节点类型
 * @template ChildNode 平台的真实的 ChildNode 类型
 */
interface CreateRendererOptions<ElementNode, TextNode, CommentNode, ChildNode> {
  // ...
  /**
   * 获取节点的下一个兄弟节点
   * @param el 节点
   */
  nextSibling: (el: ElementNode | TextNode | CommentNode) => ChildNode | null;
}
```

在浏览器平台上，nextSibling 的 API，如下所示：

```typescript
const renderer = createRenderer<ExtendedHTMLElement, Text, Comment, ChildNode>({
  // ...
  nextSibling(el) {
    return el.nextSibling;
  },
});
```

现在，我们已经能够通过 key 属性找到可复用的节点并更新内容和位置了。接下来需要思考的是：

- 如果没有找到可复用到节点，意味着要添加新的元素，如何添加新的元素？
- 如果有旧节点没有被复用，意味着要删除旧的元素，如何卸载不存在的元素？

## 添加新元素

以下面的新旧虚拟节点为例：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1 },
    { type: "p", children: "2", key: 2 },
    { type: "p", children: "hello", key: 3 },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "p", children: "world", key: 3 },
    { type: "p", children: "1", key: 1 },
    { type: "p", children: "4", key: 4 },
    { type: "p", children: "2", key: 2 },
  ],
};
```

在这种情况下，新旧两组子节点数量是不同，在新的一组子节点中，多出来一个 key 为 4 的节点。

前面的实现，我们已经能够复用节点，并更新新旧两组子节点的内容和相对顺序。但是，如果在旧的一组子节点中不存在新的一组子节点的可复用节点。这意味着，我们要添加新元素。

如下面代码所示：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      const oldChildren = n1.children;
      const newChildren = n2.children;

      let lastIndex = 0;
      for (let i = 0; i < newChildren.length; i++) {
        const newVnode = newChildren[i];
        // 初始值为 false，代表没有找到 newVnode 可复用的节点
        let find = false;
        for (let j = 0; j < oldChildren.length; j++) {
          const oldVnode = oldChildren[j];
          if (newVnode.key === oldVnode.key) {
            // 一旦找到可复用的节点，则将变量 find 的值设为 true
            find = true;
            patch(oldVnode, newVnode, container);
            if (j < lastIndex) {
              const prevVnode = newChildren[i - 1];
              const anchor = nextSibling(prevVnode.el!);
              insert(newVnode.el!, container, anchor);
            } else {
              lastIndex = j;
            }
            break;
          }
        }

        // 如果代码运行到这里，find 仍然为 false，则说明没有找到 newVnode 可复用的节点
        if (!find) {
          // 为了将节点挂载到正确位置，我们需要先获取锚点元素
          // 首先获取当前 newVnode 的前一个 vnode 节点
          const prevVnode = newChildren[i - 1];
          // 如果 prevvnode 存在，则使用它的下一个兄弟节点作为锚点，否则使用容器的第一个子节点作为锚点
          let anchor = prevVnode
            ? nextSibling(prevVnode.el!)
            : firstChild(container);
          // 挂载 newVnode
          patch(null, newVnode, container, anchor);
        }
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

但由于目前实现的 patch 函数还不支持传递第 4 个参数，所以我们需要调整 patch 函数的代码，如下所示：

```typescript
/**
 * 更新操作、挂载操作
 * @param n1 旧的虚拟节点、null、undefined
 * @param n2 新的虚拟节点
 * @param container 挂载容器
 * @param anchor 锚点节点
 */
function patch(
  n1: CreateRendererVnode | null | undefined,
  n2: CreateRendererVnode,
  container: CreateRendererContainer,
  anchor?: ChildNode | null
) {
  // ...
  if (typeof type === "string") {
    if (!n1) {
      // 挂载时，将锚点节点作为第三个参数传递给 mountElement 函数
      mountElement(n2, container, anchor);
    } else {
      // ...
    }
  } else if (type === VnodeTypeEnum.TEXT) {
    // ...
  } else if (type === VnodeTypeEnum.COMMENT) {
    // ...
  }
}

/**
 * 挂载元素节点
 * @param vnode 元素虚拟节点
 * @param container 挂载容器
 * @param anchor 锚点节点
 */
function mountElement(
  vnode: CreateRendererElementVnode,
  container: CreateRendererContainer,
  anchor?: ChildNode | null
) {
  // ...
  // 在插入节点时，将锚点节点传递给 insert 函数
  insert(el, container, anchor);
}
```

## 移除不存在的元素

以下面的新旧虚拟节点为例：

```typescript
// 旧 vnode
const oldVnode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1 },
    { type: "p", children: "2", key: 2 },
    { type: "p", children: "hello", key: 3 },
  ],
};

// 新 vnode
const newVnode = {
  type: "div",
  children: [
    { type: "p", children: "world", key: 3 },
    { type: "p", children: "1", key: 1 },
  ],
};
```

在这种情况下，在新的一组子节点中，key 为 2 的节点已经不存在了，这说明该节点被删除了。渲染器应该能找到那些需要删除的节点并正确地将其删除。

具体要怎么做呢？我们需要在标记出哪些旧的子节点是最终需要卸载的。

思路很简单，当基本都更新结束时，我们需要遍历旧的一组子节点，然后去新的一组子节点中寻找具有相同 key 值的节点。如果找不到，则说明应该删除该节点，如下面 patchChildren 函数的代码所示：

```typescript
/**
 * 更新元素或 Fragment 的子节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  if (typeof n2.children === "string") {
    // ...
  } else if (Array.isArray(n2.children)) {
    if (Array.isArray(n1.children)) {
      const oldChildren = n1.children;
      const newChildren = n2.children;

      let lastIndex = 0;
      for (let i = 0; i < newChildren.length; i++) {
        const newVnode = newChildren[i];
        let find = false;
        for (let j = 0; j < oldChildren.length; j++) {
          const oldVnode = oldChildren[j];
          if (newVnode.key === oldVnode.key) {
            find = true;
            patch(oldVnode, newVnode, container);
            if (j < lastIndex) {
              const prevVnode = newChildren[i - 1];
              const anchor = nextSibling(prevVnode.el!);
              insert(newVnode.el!, container, anchor);
            } else {
              lastIndex = j;
            }
            break;
          }
        }

        if (!find) {
          const prevVnode = newChildren[i - 1];
          let anchor = prevVnode
            ? nextSibling(prevVnode.el!)
            : firstChild(container);
          patch(null, newVnode, container, anchor);
        }
      }

      // 代码运行到这里，更新操作已经完成
      // 遍历旧的一组子节点
      for (let i = 0; i < oldChildren.length; i++) {
        const oldVnode = oldChildren[i];
        // 拿旧的子节点 oldVnode 去新的一组子节点中寻找具有相同 key 值的节点
        const has = newChildren.find((vnode) => vnode.key === oldVnode.key);
        // 如果没有找到具有相同 key 值的节点，则说明需要删除该节点
        if (!has) {
          // 调用 unmount 函数将其卸载
          unmount(oldVnode, container);
        }
      }
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```
