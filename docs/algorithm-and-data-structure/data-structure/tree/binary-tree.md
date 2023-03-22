# 二叉树

二叉树 (BinaryTree，BT) 是结点最大度为 2 的树，即每个结点最多能有不相交的左、右子树的结构。

二叉树的特殊形式有以下几种：

- 满二叉树：深度为 `k` 有 `2^k - 1` 个结点的二叉树。

- 完全二叉树：深度为 `k` 的二叉树，除了最后一层，其余各层都是满的二叉树，且在最后一层上的结点必须从左到右依次放置，不能留空。

- 平衡二叉树：每个结点的左、右子树的深度差的绝对值不超过 1 的二叉树。

## 基本性质

1. 二叉树第 `i` 层 (i>=1) 上最多有 `2^(i-1)` 个结点。此性质只要对层数 `i` 进行数学归纳证明即可。
2. 高度为 `k` 的二叉树最多有 `2^k - 1` 个结点 (k>=1)。由性质 1，每一层的结点数都取最大值 `2^(i-1)` 即可。
3. 对于任何一棵二叉树，若其终端结点数为 `n(0)`，度为 2 的结点数为 `n(2)`，则 `n(0) = n(2) + 1`。
4. 具有 `n` 个结点的完全二叉树的深度为 `⎣log(2)n⎦ + 1`。

## 物理结构

### 顺序存储结构

顺序存储是用一组地址连续的存储单元存储二叉树中的结点，即必须把结点排成一个适当的线性序列，并且结点在这个序列中的相互位置能反映出结点之间的逻辑关系。

因为顺序存储结构仅需要存储数据元素，不需要存储左右子树的根以及双亲等关系信息 (由下标计算)。所以顺序存储结构通常使用数组来存储二叉树的结点，结点之间的关系通过数组的下标来确定。

顺序存储结构的优点是访问结点非常快速，因为可以通过下标直接访问结点，不需要遍历整个树。此外，在理想情况下 (完全二叉树)，顺序存储结构也比较节省空间，因为没有 "虚 (null) 结点" 占用空间，并且顺序存储结构也不需要额外的指针来存储结点之间的关系。但是，顺序存储结构的缺点是当二叉树发生变化时，可能需要移动大量的结点，导致效率很低。

对于深度为 `k` 的完全二叉树，除第 `k` 层外，其余各层中含有最大的结点数，即每一层的结点数恰为其上一层结点数的两倍，由此从一个结点的下标可推知其双亲结点、左孩子结点和右孩子结点的下标。假设完全二叉树有下标为 `i` 的结点，总共有 `n` 个结点，则有：

- 若 `i=1`，则该结点为根结点，无双亲。
- 若 `i>1`，则该结点的双亲结点为 `[i/2]`。
- 若 `2i<=n`，则该结点的左孩子编号为 `2i`，否则无左孩子。
- 若 `2i+1<=n`，则该结点的右孩子编号为 `2i+1`，否则无右孩子。

显然，完全二叉树采用顺序存储结构既简单又节省空间，但是对于一般的二叉树，则不宜采用顺序存储结构。因为一般的二叉树也必须按照完全二叉树的形式存储，也就是要添上一些实际并不存在的 "虚 (null) 结点"，这将造成存储空间的浪费。在最坏情况下，一个深度为 `k` 且只有 `k` 个结点的二叉树 (单支树) 需要 `2^k - 1` 个存储单元。

### 链式存储结构

链式存储是用一组地址不一定连续的存储单元存储二叉树中的结点，使用结点的指针来反映出结点之间的逻辑关系。

因为链式存储结构不仅需要存储数据元素，而且还需要存储左右子树的根以及双亲等关系信息，所以链式存储结构通常使用三叉链表或二叉链表 (即一个结点含有 3 个指针或 2 个指针) 来存储二叉树的结点，结点之间的关系通过结点的指针的来确定。

链式存储结构的优点是可以灵活地插入、删除结点，不会影响整个树的结构。此外，链式存储结构也比较容易理解和实现。但是，链式存储结构的缺点是需要额外的空间来存储指针。

:pushpin:接下来的内容，主要是基于链式存储结构来实现。

## 二叉树结点

**二叉链表**

二叉链表实现的二叉树结点，设计的 API 如下：

```typescript
/**
 * 二叉树结点接口 (二叉链表)
 */
declare interface BinaryTreeNodeByBinaryLinkedListInterface<T, Element> {
  /** 当前结点的数据 */
  data: Element;
  /** 左子结点的指针 */
  left: T | null;
  /** 右子结点的指针 */
  right: T | null;
}
```

实现代码如下：

```typescript
/**
 * 二叉树结点 (二叉链表实现)
 */
abstract class BinaryTreeNodeByBinaryLinkedList<
  T extends BinaryTreeNodeByBinaryLinkedList<T, Element>,
  Element
> implements BinaryTreeNodeByBinaryLinkedListInterface<T, Element>
{
  data: Element;
  left: T | null;
  right: T | null;

  constructor(data: Element, left: T | null = null, right: T | null = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}
```

**三叉链表**

三叉链表实现的二叉树结点，设计的 API 如下：

```typescript
/**
 * 二叉树结点接口 (三叉链表)
 */
declare interface BinaryTreeNodeByTridentLinkedListInterface<T, Element> {
  /** 当前结点的数据 */
  data: Element;
  /** 左子结点的指针 */
  left: T | null;
  /** 右子结点的指针 */
  right: T | null;
  /** 双亲结点的指针 */
  parent: T | null;
}
```

实现代码如下：

```typescript
/**
 * 二叉树结点 (三叉链表实现)
 */
abstract class BinaryTreeNodeByTridentLinkedList<
  T extends BinaryTreeNodeByTridentLinkedList<T, Element>,
  Element
> implements BinaryTreeNodeByTridentLinkedListInterface<T, Element>
{
  data: Element;
  left: T | null;
  right: T | null;
  parent: T | null;

  constructor(
    data: Element,
    left: T | null = null,
    right: T | null = null,
    parent: T | null = null
  ) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.parent = parent;
  }
}
```

**二叉树结点**

二叉树由二叉树结点组成，每个二叉树结点也可以作为一棵单独的二叉树。因此，在设计二叉树的 API 时，我们通常会把 API 设计在二叉树结点上。

在实际应用中，应该根据具体场景来实现特定 API 的结点，例如：二叉查找树结点。因此，二叉树结点通常被设计为抽象的 (abstract)，不允许直接初始化，只提供基础的遍历结点的 API。

我们主要是基于二叉链表来实现二叉树结点，设计的 API 如下：

```typescript
/**
 * 二叉树结点接口
 */
declare interface BinaryTreeNodeInterface<T, Element>
  extends BinaryTreeNodeByBinaryLinkedListInterface<T, Element>,
    Iterable<T> {
  /**
   * 先序遍历
   * @param cb 回调函数
   */
  preOrder(cb: BinaryTreeOrderCallbackType<T>): void;

  /**
   * 中序遍历
   * @param cb 回调函数
   */
  inOrder(cb: BinaryTreeOrderCallbackType<T>): void;

  /**
   * 后序遍历
   * @param cb 回调函数
   */
  postOrder(cb: BinaryTreeOrderCallbackType<T>): void;

  /**
   * 层序遍历
   * @param cb
   */
  levelOrder(cb: BinaryTreeOrderCallbackType<T>): void;

  /**
   * 结点转字符串
   */
  toString(): string;
}

/**
 * 二叉树先/中/后/层序遍历的回调函数类型
 */
declare type BinaryTreeOrderCallbackType<T> = (node: T) => void;
```

### 遍历结点

二叉树是一个可遍历的数据结构，由于二叉树所具有的递归性质，一棵非空的二叉树是由根结点、左子树和右子树三部分构成的，因此若能依次遍历这三部分，也就遍历了整棵二叉树。按照先遍历左子树后遍历右子树的约定，根据访问根结点位置的不同，可得到二叉树的先序、中序和后序 3 种遍历方法。此外，对二叉树还可进行层序遍历。我们提供了下列遍历结点的 API：

- `preOrder()` 先序遍历
- `inOrder()` 中序遍历
- `postOrder()` 后序遍历
- `levelOrder()` 层序遍历
- `[Symbol.iterator]` 默认的遍历方式 (基于先序遍历)

实现代码如下：

```typescript
import { QueueByLinkedList } from "@/data-structure/queue";

/**
 * 二叉树结点
 */
export default abstract class BinaryTreeNode<
    T extends BinaryTreeNode<T, Element>,
    Element
  >
  extends BinaryTreeNodeByBinaryLinkedList<T, Element>
  implements BinaryTreeNodeInterface<T, Element>
{
  public preOrder(cb: BinaryTreeOrderCallbackType<T>) {
    cb(this as any);
    if (this.left) this.left.preOrder(cb);
    if (this.right) this.right.preOrder(cb);
  }

  public inOrder(cb: BinaryTreeOrderCallbackType<T>) {
    if (this.left) this.left.inOrder(cb);
    cb(this as any);
    if (this.right) this.right.inOrder(cb);
  }

  public postOrder(cb: BinaryTreeOrderCallbackType<T>) {
    if (this.left) this.left.postOrder(cb);
    if (this.right) this.right.postOrder(cb);
    cb(this as any);
  }

  public levelOrder(cb: BinaryTreeOrderCallbackType<T>) {
    const queue = new QueueByLinkedList<T>();
    queue.enqueue(this as any);

    while (!queue.isEmpty()) {
      const node = queue.dequeue() as T;
      cb(node);
      node.left && queue.enqueue(node.left);
      node.right && queue.enqueue(node.right);
    }
  }

  public *[Symbol.iterator]() {
    const list: T[] = [];

    this.preOrder((node) => list.push(node));
    yield* list;
  }
}
```

## 复杂度

对该数据结构提供的主要 API 进行复杂度分析，如下所示：

| 方法       | 时间复杂度 | 空间复杂度 |
| ---------- | ---------- | ---------- |
| preOrder   | O(n)       | O(1)       |
| inOrder    | O(n)       | O(1)       |
| postOrder  | O(n)       | O(1)       |
| levelOrder | O(n)       | O(n)       |

## LeetCode 题目

与该数据结构相关的一些 LeetCode 题目：

- [144. 二叉树的前序遍历 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
- [94. 二叉树的中序遍历 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
- [145. 二叉树的后序遍历 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-tree-postorder-traversal/)
- [104. 二叉树的最大深度 - 力扣（LeetCode）](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)
- [100. 相同的树 - 力扣（LeetCode）](https://leetcode.cn/problems/same-tree/)
- [110. 平衡二叉树 - 力扣（LeetCode）](https://leetcode.cn/problems/balanced-binary-tree/)
- [111. 二叉树的最小深度 - 力扣（LeetCode）](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)
- [101. 对称二叉树 - 力扣（LeetCode）](https://leetcode.cn/problems/symmetric-tree/)
- [102. 二叉树的层序遍历 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
- [107. 二叉树的层序遍历 II - 力扣（LeetCode）](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)

## 相关链接

- [BinaryTreeNode 完整代码](https://github.com/CokeBeliever/typescript-algorithm-and-data-structure/blob/master/src/data-structure/tree/BinaryTreeNode.ts)
