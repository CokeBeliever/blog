# 快速 Diff 算法

快速 Diff 算法借鉴了纯文本 Diff 算法中预处理的步骤。

## 相同的前置元素和后置元素

对于相同的前置节点和后置节点，由于它们在新旧两组子节点中的相对位置不变，所以我们无须移动它们，但仍然需要在它们之间更新内容。预处理过程的逻辑为：

- 对于前置节点，我们可以简历索引 j，其初始值为 0，用来指向两组子节点的开头。然后开启一个 while 循环，让索引 j 递增，直到遇到 key 值不相同的节点为止。
- 对于后置节点，由于新旧两组子节点的数量可能不同，所以我们需要两个索引 newEnd 和 oldEnd，分别指向新旧两组子节点中的最后一个节点。然后开启一个 while 循环，并从后向前遍历这两组子节点，直到遇到 key 值不相同的节点为止。

按照这个思路，我们可以重新实现 patchKeyedChildren 函数，如下面代码所示：

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

  // 1.更新相同 key 的前置节点
  let j = 0;
  let oldVnode = oldChildren[j];
  let newVnode = newChildren[j];
  while (newVnode && oldVnode && oldVnode.key === newVnode.key) {
    // 调用 patch 函数进行更新内容
    patch(oldVnode, newVnode, container);
    j++;
    oldVnode = oldChildren[j];
    newVnode = newChildren[j];
  }

  // 2.更新相同 key 的后置节点
  let oldEnd = oldChildren.length - 1;
  let newEnd = newChildren.length - 1;

  oldVnode = oldChildren[oldEnd];
  newVnode = newChildren[newEnd];

  while (oldEnd >= j && newEnd >= j && oldVnode.key === newVnode.key) {
    // 调用 patch 函数进行更新内容
    patch(oldVnode, newVnode, container);
    oldVnode = oldChildren[--oldEnd];
    newVnode = newChildren[--newEnd];
  }
}
```

观察三个索引 j、newEnd 和 oldEnd 之间的关系：

- 如果 `oldEnd < j` 成立，说明在预处理过程中，所有旧的子节点都已复用了。
- 如果 `newEnd >= j` 成立，说明在预处理过程中，在新的一组子节点中，仍然有未被处理的节点，而这些遗留的节点将视为**新增节点**。
- 如果 `newEnd < j` 成立，说明在预处理过程中，所有新的子节点都已经处理了。
- 如果 `oldEnd >= j` 成立，说明在预处理过程中，在旧的一组子节点中，仍然有未被处理的节点，而这些遗留的节点将视为**删除节点**。

有了这些信息，我们可以把情况分为以下几种：

| oldEnd | newEnd | 备注                                                               |
| ------ | ------ | ------------------------------------------------------------------ |
| `j <=` | `j <=` | 存在旧的子节点未复用，存在新的子节点未处理，我们需要进一步处理     |
| `j <=` | `j >`  | 存在旧的子节点未复用，所有新的子节点都已处理，我们只需卸载旧的节点 |
| `j >`  | `j <=` | 所有旧的子节点都已复用，存在新的子节点未处理，我们只需新增新的节点 |
| `j >`  | `j >`  | 所有旧的子节点都已复用，所有新的子节点都已处理，我们不用做任何处理 |

我们可以先处理 `j > oldEnd && j <= newEnd` 新增节点和 `j > newEnd && j <= oldEnd` 卸载节点的情况，如下所示：

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
  // ...

  // 预处理完毕后
  // 如果满足如下条件，则说明 j --> newEnd 之间的节点为新节点，应该新增
  if (j > oldEnd && j <= newEnd) {
    const anchorIndex = newEnd + 1;
    const anchor =
      anchorIndex < newChildren.length ? newChildren[anchorIndex].el! : null;
    // 采用 while 循环，调用 patch 函数逐个挂载新增节点
    while (j <= newEnd) {
      patch(null, newChildren[j++], container, anchor as ChildNode | null);
    }
  }
  // 如果满足如下条件，则说明 j -> oldEnd 之间的节点为旧节点，应该卸载
  else if (j > newEnd && j <= oldEnd) {
    while (j <= oldEnd) {
      unmount(oldChildren[j++], container);
    }
  }
}
```

## 判断是否需要进行 DOM 移动操作

- source 数组将用来存储新的一组子节点中的节点在旧的一组子节点中的位置索引，后面将会使用它计算出一个最长递增子序列，并用于辅助完成 DOM 移动的操作。

- 我们可以通过两层 for 循环来完成 source 数组的填充工作，外层循环用于遍历旧的一组子节点，内层循环用于遍历新的一组子节点。

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
  // ...

  if (j > oldEnd && j <= newEnd) {
    // ...
  } else if (j > newEnd && j <= oldEnd) {
    // ...
  } else if (j <= oldEnd && j <= newEnd) {
    // 构造 sources 数组
    // 新的一组子节点中剩余未处理节点的数量
    const count = newEnd - j + 1;
    const sources = new Array(count);
    sources.fill(-1);

    // oldStart 和 newStart 分别为起始索引，即 j
    const oldStart = j;
    const newStart = j;

    for (let i = oldStart; i <= oldEnd; i++) {
      const oldVnode = oldChildren[i];
      // 初始值为 false，代表 oldVnode 为不可复用节点
      let find = false;
      for (let k = newStart; k <= newEnd; k++) {
        find = true;
        const newVnode = newChildren[k];
        // 找到拥有相同 key 值的可复用节点
        if (oldVnode.key === newVnode.key) {
          // 调用 patch 函数，更新内容
          patch(oldVnode, newVnode, container);
          sources[k - newStart] = i;
          break;
        }
      }

      // 如果代码运行到这里，find 仍然为 false，则说明 oldVnode 为不可复用节点
      if (!find) {
        // 调用 unmount 函数，卸载
        unmount(oldVnode, container);
      }
    }
  }
}
```

这段代码中我们采用了两层嵌套的循环，其时间复杂度为 `O(n1 * n2)`，其中 n1 和 n2 为新旧两组子节点的数量。当新旧两组子节点的数量较多时，两层嵌套的循环会带来性能问题。

出于优化的目的，我们可以为新的一组子节点构建一张**索引表**，用来存储节点的 key 和节点位置索引之间的映射。如下所示：

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
  // ...

  if (j > oldEnd && j <= newEnd) {
    // ...
  } else if (j > newEnd && j <= oldEnd) {
    // ...
  } else if (j <= oldEnd && j <= newEnd) {
    const count = newEnd - j + 1;
    const sources = new Array(count);
    sources.fill(-1);

    const oldStart = j;
    const newStart = j;

    // 构建索引表
    const keyIndex = {};
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i;
    }

    // patched 变量，代表更新过的节点数量
    let patched = 0;
    // 遍历旧的一组子节点中剩余未处理的节点
    for (let i = oldStart; i <= oldEnd; i++) {
      oldVnode = oldChildren[i];
      // 如果更新过的节点数量小于等于需要更新的节点数量，则执行更新
      if (patched <= count) {
        // 通过索引表快速找到新的一组子节点中具有相同 key 值的节点位置
        const k = keyIndex[oldVnode.key];
        if (typeof k !== "undefined") {
          newVnode = newChildren[k];
          // 调用 patch 函数，更新内容
          patch(oldVnode, newVnode, container);
          // 每更新一个节点，都得 patched 数量 +1
          patched++;
          // 填充 sources 数组
          sources[k - newStart] = i;
        }
        // 没找到，说明 oldVnode 是不可复用节点
        else {
          // 调用 unmount 函数，卸载
          unmount(oldVnode, container);
        }
      }
      // 如果更新过的节点数量大于需要更新的节点数量，则卸载多余的节点
      else {
        unmount(oldVnode, container);
      }
    }
  }
}
```

在这段代码中，同样使用了两个循环，不过它们不再是嵌套的关系，所以能够将代码的时间复杂度降至 `O(n1 + n2)`。

上述流程执行完毕后，source 数组已经填充完毕了。接下来我们应该思考的是，如何判断节点是否需要移动。实际上，快速 Diff 算法判断节点十分需要移动的方法与简单 Diff 算法类似。如下面的代码所示：

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
  // ...

  if (j > oldEnd && j <= newEnd) {
    // ...
  } else if (j > newEnd && j <= oldEnd) {
    // ...
  } else if (j <= oldEnd && j <= newEnd) {
    const count = newEnd - j + 1;
    const sources = new Array(count);
    sources.fill(-1);

    const oldStart = j;
    const newStart = j;

    // 是否需要移动节点
    let moved = false;
    // 遍历旧的一组子节点的过程中遇到的最大索引值
    let pos = 0;

    const keyIndex = {};
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i;
    }

    let patched = 0;
    for (let i = oldStart; i <= oldEnd; i++) {
      oldVnode = oldChildren[i];
      if (patched <= count) {
        const k = keyIndex[oldVnode.key];
        if (typeof k !== "undefined") {
          newVnode = newChildren[k];
          patch(oldVnode, newVnode, container);
          patched++;
          sources[k - newStart] = i;
          // 判断节点是否需要移动
          if (k < pos) {
            moved = true;
          } else {
            pos = k;
          }
        } else {
          unmount(oldVnode, container);
        }
      } else {
        unmount(oldVnode, container);
      }
    }

    // 如果 moved 为真，则说明需要进行 DOM 移动操作
    if (moved) {
    }
  }
}
```

现在我们通过判断变量 moved 的值，已经能够知道是否需要移动节点。

## 如何移动元素

在上一节中，我们实现了两个目标：

- 判断是否需要进行 DOM 移动操作。我们创建了变量 moved 作为标识，当它的值为 true 时，说明需要进行 DOM 移动操作。
- 构建 sources 数组。该数组的长度等于新的一组子节点去掉相同的前置和后置节点后，剩余未处理节点的数量。sources 数组中存储着新的一组子节点中的节点在旧的一组子节点中的位置，后面我们会根据 sources 数组计算出一个**最长递增子序列**，用于 DOM 移动操作。

在实现 DOM 移动操作之前，我们需要先搞清楚什么是一个序列的最长递增子序列。简单的说，一个序列可能有很多个子序列，而其中最长的那个递增的子序列就是最长递增子序列。举个例子，假设给定序列 `[0, 8, 4, 12]`，那么它的最长递增子序列就是 `[0, 8, 12]` 或 `[0, 4, 12]`。

如下是用于求解给定序列的最长递增子序列的代码，取自 Vue3：

```typescript
/**
 * 获取最长递增子序列 (索引数组)
 * @param arr 原序列
 * @returns 返回最长递增子序列的在原序列中的索引数组
 */
function getSequence(arr: number[]) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = ((u + v) / 2) | 0;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
```

可以试着运行一下：

```typescript
getSequence([0, 8, 4, 12]); // [0, 2, 3]
```

可以获得一个最长递增子序列的在原序列中的索引数组，这就意味着，如果要最小化移动操作将原序列变为一个递增序列，我们只需移动不在这个索引数组的元素。例如，将 `[0, 8, 4, 12]` 变为一个递增序列 `[0, 4, 8, 12]`，我们只需移动索引为 1 的 8。

按照这个思路，我们可以实现判断是挂载新增节点还是需要移动节点的逻辑，如下面代码所示：

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
  // ...

  if (j > oldEnd && j <= newEnd) {
    // ...
  } else if (j > newEnd && j <= oldEnd) {
    // ...
  } else if (j <= oldEnd && j <= newEnd) {
    // ...

    // 如果 moved 为真，则说明需要进行 DOM 移动操作
    if (moved) {
      const seq = getSequence(sources);

      // s 指向最长递增子序列的最后一个元素
      let s = seq.length - 1;
      // i 指向新的一组子节点的最后一个元素
      let i = count - 1;

      // for 循环使得 i 递减
      for (i; i >= 0; i--) {
        // 如果条件成立，说明旧的一组子节点中不存在可复用的节点，应该挂载新增节点
        if (sources[i] === -1) {
        }
        // 如果节点的索引 i 不等于 seq[s] 的值，则说明该节点需要移动
        else if (i !== seq[s]) {
        }
        // 当 i === seq[s] 时，说明该位置的节点不需要移动
        else {
          // 只需要让 s 指向下一个位置
          s--;
        }
      }
    }
  }
}
```

当 `sources[i] === -1` 时，我们实现的挂载新增节点，如下所示：

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
  // ...

  if (j > oldEnd && j <= newEnd) {
    // ...
  } else if (j > newEnd && j <= oldEnd) {
    // ...
  } else if (j <= oldEnd && j <= newEnd) {
    // ...

    if (moved) {
      const seq = getSequence(sources);

      let s = seq.length - 1;
      let i = count - 1;

      for (i; i >= 0; i--) {
        if (sources[i] === -1) {
          // 该节点在新的 children 中的真实位置索引
          const pos = i + newStart;
          const newVnode = newChildren[pos];
          // 该节点的下一个节点的位置索引
          const nextPos = pos + 1;
          // 锚点
          const anchor =
            nextPos < newChildren.length ? newChildren[nextPos].el! : null;
          // 挂载
          patch(null, newVnode, container, anchor as ChildNode);
        } else if (i !== seq[s]) {
        } else {
          s--;
        }
      }
    }
  }
}
```

否则，当 `i !== seq[s]` 时，我们实现的移动节点，如下所示：

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
  // ...

  if (j > oldEnd && j <= newEnd) {
    // ...
  } else if (j > newEnd && j <= oldEnd) {
    // ...
  } else if (j <= oldEnd && j <= newEnd) {
    // ...

    if (moved) {
      const seq = getSequence(sources);

      let s = seq.length - 1;
      let i = count - 1;

      for (i; i >= 0; i--) {
        if (sources[i] === -1) {
          // ...
        } else if (i !== seq[s]) {
          // 该节点在新的一组子节点中的真实位置索引
          const pos = i + newStart;
          const newVnode = newChildren[pos];
          // 该节点的下一个节点的位置索引
          const nextPos = pos + 1;
          // 锚点
          const anchor =
            nextPos < newChildren.length ? newChildren[nextPos].el! : null;
          // 移动
          insert(newVnode.el!, container, anchor as ChildNode);
        } else {
          s--;
        }
      }
    }
  }
}
```
