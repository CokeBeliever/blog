# 双端 Diff 算法

## 双端比较的原理

简单 Diff 算法的问题在于，它对 DOM 的移动操作并不是最优的。以下面的新旧虚拟节点为例：

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

在这个例子中，如果使用简单 Diff 算法来更新它，则会发生两次 DOM 移动操作。

- 将 `{ type: 'p', children: '1', key: 1 }` 节点移动到 `{ type: 'span', children: '3', key: 3 }` 节点之后。
- 将 `{ type: 'div', children: '2', key: 2 }` 节点移动到 `{ type: 'p', children: '1', key: 1 }` 节点之后。

假设新旧两组子节点的数量为 N，且子节点都可复用，在上面这种情况下，我们需要 `N - 1` 次 DOM 移动操作。可见随着新旧两组子节点的数量增加，DOM 移动操作次数将线性增加。

出现这种每个 DOM 都需要移动操作的原因是什么？答案很明显：在简单 Diff 算法的实现中，设定的参考系 (新的一组子节点的第一个节点) 如果是旧的一组子节点的最后一个节点，那么这会导致最坏的情况，就是需要 N-1 次 DOM 移动操作。

为了解决这种问题。我们采用双端 Diff 算法。

为了方便，我们将处理新旧两组子节点的逻辑封装在 patchKeyedChildren 函数中：

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
      // 封装 patchKeyedChildren 函数处理新旧两组子节点
      patchKeyedChildren(n1, n2, container);
    } else {
      // ...
    }
  } else {
    // ...
  }
}
```

双端指的是一组子节点的头和尾两端，新旧有两组子节点就有四个端点：新的一组子节点的头 (newStartVnode)、新的一组子节点的尾 (oldEndVnode)、旧的一组子节点的头 (oldStartVnode)、旧的一组子节点的尾 (oldEndVnode)。如下面代码所示：

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  const oldChildren = n1.children as CreateRendererVnode[];
  const newChildren = n2.children as CreateRendererVnode[];
  // 四个索引值
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;
  // 四个索引值指向的 vnode 节点
  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];
}
```

双端 Diff 算法的逻辑，可分为以下几部分：

- 在头和尾寻找可复用的节点

  - 第一步：旧的一组子节点的头和新的一组子节点的头比较。如果命中，那么更新内容。
  - 第二步：旧的一组子节点的尾和新的一组子节点的尾比较。如果命中，那么更新内容。
  - 第三步：旧的一组子节点的头和新的一组子节点的尾比较。如果命中，那么更新内容和位置 (将真实节点移动到旧的尾节点之后)。
  - 第四步：旧的一组子节点的尾和新的一组子节点的头比较。如果命中，那么更新内容和位置 (将真实节点移动到旧的头节点之前)。

- 在中间寻找可复用节点

  - 在旧的一组子节点中寻找可复用节点。如果命中，那么更新内容和位置 (将真实节点移动到旧的头节点之前)。

  - 将命中旧的子节点设置为 undefined，表示已经处理复用过了。

- 找不到可复用节点

  - 添加新的节点

- 最终：卸载旧的节点

通过双端 Diff 算法，每次让新旧两组子节点的双端进行比较，就可以避免简单 Diff 算法最坏的情况。

## 在头尾部分寻找可复用节点

按照这个思路，我们可以重新实现在**头和尾寻找可复用的节点的更新逻辑**，如下面 patchKeyedChildren 函数的代码所示：

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  const oldChildren = n1.children as CreateRendererVnode[];
  const newChildren = n2.children as CreateRendererVnode[];

  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  // 第一步：oldStartVnode 和 newStartVnode 比较
  if (oldStartVnode.key === newStartVnode.key) {
    // 调用 patch 函数，在 oldStartVnode 和 newStartVnode 之间更新内容
    patch(oldStartVnode, newStartVnode, container);
    // 更新相关索引，指向下一个位置
    oldStartVnode = oldChildren[++oldStartIdx];
    newStartVnode = newChildren[++newStartIdx];
  }
  // 第二步：oldEndVnode 和 newEndVnode 比较
  else if (oldEndVnode.key === newEndVnode.key) {
    // 调用 patch 函数，在 oldEndVnode 和 newEndVnode 之间更新内容
    patch(oldEndVnode, newEndVnode, container);
    // 更新相关索引，指向下一个位置
    oldEndVnode = oldChildren[--oldEndIdx];
    newEndVnode = newChildren[--newEndIdx];
  }
  // 第三步：oldStartVnode 和 newEndVnode 比较
  else if (oldStartVnode.key === newEndVnode.key) {
    // 调用 patch 函数，在 oldStartVnode 和 newEndVnode 之间更新内容
    patch(oldStartVnode, newEndVnode, container);
    // 调用 insert 函数，移动 DOM 操作，更新位置
    insert(oldStartVnode.el!, container, nextSibling(oldEndVnode.el!));
    // 更新相关索引，指向下一个位置
    oldStartVnode = oldChildren[++oldStartIdx];
    newEndVnode = newChildren[--newEndIdx];
  }
  // 第四步：oldEndVnode 和 newStartVnode 比较
  else if (oldEndVnode.key === newStartVnode.key) {
    // 调用 patch 函数，在 oldEndVnode 和 newStartVnode 之间更新内容
    patch(oldEndVnode, newStartVnode, container);
    // 调用 insert 函数，移动 DOM 操作，更新位置
    insert(oldEndVnode.el!, container, oldStartVnode.el as ChildNode);
    // 更新相关索引，指向下一个位置
    oldEndVnode = oldChildren[--oldEndIdx];
    newStartVnode = newChildren[++newStartIdx];
  }
}
```

当然进行一轮更新之后，还需要进行下一轮更新。因此，我们需要将更新逻辑封装到一个 while 循环中，如下面的代码所示：

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  const oldChildren = n1.children as CreateRendererVnode[];
  const newChildren = n2.children as CreateRendererVnode[];

  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode.key === newStartVnode.key) {
      // ...
    } else if (oldEndVnode.key === newEndVnode.key) {
      // ...
    } else if (oldStartVnode.key === newEndVnode.key) {
      // ...
    } else if (oldEndVnode.key === newStartVnode.key) {
      // ...
    }
  }
}
```

## 在中间部分寻找可复用节点

我们接下来实现中间部分寻找可复用节点到代码：

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  // 下面代码在运行时可能有修改索引值操作，因此 oldChildren 的索引值也有可能是 undefined 类型
  const oldChildren = n1.children as (CreateRendererVnode | undefined)[];
  const newChildren = n2.children as CreateRendererVnode[];

  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 增加判断，如果旧的头尾部节点为 undefined，则说明节点已经被处理复用过了，直接跳到下一个位置
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx];
      continue;
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx];
      continue;
    }

    if (oldStartVnode.key === newStartVnode.key) {
      // ...
    } else if (oldEndVnode.key === newEndVnode.key) {
      // ...
    } else if (oldStartVnode.key === newEndVnode.key) {
      // ...
    } else if (oldEndVnode.key === newStartVnode.key) {
      // ...
    }
    // 在中间部分寻找可复用节点
    else {
      // 遍历旧的一组子节点，试图寻找与 newStartVnode 拥有相同 key 值的节点
      // idxInOld 就是新的一组子节点的头部节点在旧的一组子节点中的索引
      const idxInOld = oldChildren.findIndex(
        (node) => node && node.key === newStartVnode.key
      );
      // idxInOld 大于 0，说明找到了可复用的节点，并且需要将其对应的真实节点移动到头部
      if (idxInOld > 0) {
        // idxInOld 位置对应的 vnode 就是需要移动的节点
        const vnodeToMove = oldChildren[idxInOld] as CreateRendererVnode;
        // 调用 patch 函数，在 vnodeToMove 和 newStartVnode 之间更新内容
        patch(vnodeToMove, newStartVnode, container);
        // 调用 insert 函数，移动 DOM 操作，更新位置
        insert(vnodeToMove.el!, container, oldStartVnode.el as ChildNode);
        // 由于位置 idxInOld 处的节点所对应的真实节点已经移动到了别处，因此将其设置为 undefined
        oldChildren[idxInOld] = undefined;
        // 更新 newStartIdx，指向下一个位置
        newStartVnode = newChildren[++newStartIdx];
      }
    }
  }
}
```

## 添加新元素

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  const oldChildren = n1.children as (CreateRendererVnode | undefined)[];
  const newChildren = n2.children as CreateRendererVnode[];

  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx];
      continue;
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx];
      continue;
    }

    if (oldStartVnode.key === newStartVnode.key) {
      // ...
    } else if (oldEndVnode.key === newEndVnode.key) {
      // ...
    } else if (oldStartVnode.key === newEndVnode.key) {
      // ...
    } else if (oldEndVnode.key === newStartVnode.key) {
      // ...
    } else {
      const idxInOld = oldChildren.findIndex(
        (node) => node && node.key === newStartVnode.key
      );
      if (idxInOld > 0) {
        const vnodeToMove = oldChildren[idxInOld] as CreateRendererVnode;
        patch(vnodeToMove, newStartVnode, container);
        insert(vnodeToMove.el!, container, oldStartVnode.el as ChildNode);
        oldChildren[idxInOld] = undefined;
        // newStartVnode = newChildren[++newStartIdx]
      }
      // 没有找到可复用节点
      else {
        // 将 newStartVnode 作为新的节点挂载到头部，使用当前头部节点 oldStartVnode.el 作为锚点
        patch(null, newStartVnode, container, oldStartVnode.el as ChildNode);
      }
      // 更新 newStartIdx，指向下一个位置
      newStartVnode = newChildren[++newStartIdx];
    }
  }
}
```

如果当旧的可复用节点都已经复用完了，那么会退出 while 循环，这时新的一组子节点还没完全处理结束，当然还未处理的新的子节点就是需要添加的节点。我们需要增加代码：

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  const oldChildren = n1.children as (CreateRendererVnode | undefined)[];
  const newChildren = n2.children as CreateRendererVnode[];

  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx];
      continue;
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx];
      continue;
    }

    if (oldStartVnode.key === newStartVnode.key) {
      // ...
    } else if (oldEndVnode.key === newEndVnode.key) {
      // ...
    } else if (oldStartVnode.key === newEndVnode.key) {
      // ...
    } else if (oldEndVnode.key === newStartVnode.key) {
      // ...
    } else {
      const idxInOld = oldChildren.findIndex(
        (node) => node && node.key === newStartVnode.key
      );
      if (idxInOld > 0) {
        const vnodeToMove = oldChildren[idxInOld] as CreateRendererVnode;
        patch(vnodeToMove, newStartVnode, container);
        insert(vnodeToMove.el!, container, oldStartVnode.el as ChildNode);
        oldChildren[idxInOld] = undefined;
      } else {
        patch(null, newStartVnode, container, oldStartVnode.el as ChildNode);
      }
      newStartVnode = newChildren[++newStartIdx];
    }
  }

  // 循环结束后检查索引值的情况
  // 如果满足条件，则说明有新的节点遗留，需要挂载它们
  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVnode!.el as ChildNode);
    }
  }
}
```

## 移除不存在的元素

```typescript
/**
 * 更新新旧两组子节点的可复用的节点
 * @param n1 旧的元素或 Fragment 虚拟节点
 * @param n2 新的元素或 Fragment 虚拟节点
 * @param container 挂载容器
 */
function patchKeyedChildren(
  n1: CreateRendererElementVnode | CreateRendererFragmentVnode,
  n2: CreateRendererElementVnode | CreateRendererFragmentVnode,
  container: CreateRendererContainer
) {
  const oldChildren = n1.children as (CreateRendererVnode | undefined)[];
  const newChildren = n2.children as CreateRendererVnode[];

  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx];
      continue;
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx];
      continue;
    }

    if (oldStartVnode.key === newStartVnode.key) {
      patch(oldStartVnode, newStartVnode, container);
      oldStartVnode = oldChildren[++oldStartIdx];
      newStartVnode = newChildren[++newStartIdx];
    } else if (oldEndVnode.key === newEndVnode.key) {
      patch(oldEndVnode, newEndVnode, container);
      oldEndVnode = oldChildren[--oldEndIdx];
      newEndVnode = newChildren[--newEndIdx];
    } else if (oldStartVnode.key === newEndVnode.key) {
      patch(oldStartVnode, newEndVnode, container);
      insert(oldStartVnode.el!, container, nextSibling(oldEndVnode.el!));
      oldStartVnode = oldChildren[++oldStartIdx];
      newEndVnode = newChildren[--newEndIdx];
    } else if (oldEndVnode.key === newStartVnode.key) {
      patch(oldEndVnode, newStartVnode, container);
      insert(oldEndVnode.el!, container, oldStartVnode.el as ChildNode);
      oldEndVnode = oldChildren[--oldEndIdx];
      newStartVnode = newChildren[++newStartIdx];
    } else {
      const idxInOld = oldChildren.findIndex(
        (node) => node && node.key === newStartVnode.key
      );
      if (idxInOld > 0) {
        const vnodeToMove = oldChildren[idxInOld] as CreateRendererVnode;
        patch(vnodeToMove, newStartVnode, container);
        insert(vnodeToMove.el!, container, oldStartVnode.el as ChildNode);
        oldChildren[idxInOld] = undefined;
      } else {
        patch(null, newStartVnode, container, oldStartVnode.el as ChildNode);
      }
      newStartVnode = newChildren[++newStartIdx];
    }
  }

  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVnode!.el as ChildNode);
    }
  }
  // 如果满足条件，则说明有旧的节点遗留，需要卸载它们
  else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      const oldChild = oldChildren[i];
      // 如果 oldChild 是虚拟节点，那么调用 unmount 卸载
      if (oldChild) unmount(oldChild, container);
    }
  }
}
```
