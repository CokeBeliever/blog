# 链表

## Node 结点

结点是链表的基本组成单元，也是一种简单的数据结构，通常有包含有**数据域**和**指针域**，数据域用于存储数据元素，指针域则存储当前数据元素的**直接前驱结点**或**直接后继结点**的位置信息，通常我们存储的是直接后继结点。

设计 API 如下：

```typescript
/**
 * 结点接口
 */
declare interface NodeInterface<Element> {
  /** 当前结点的数据 */
  data: Element;
  /** 后继结点的指针 */
  next: NodeInterface<Element> | null;

  /**
   * 结点转字符串
   */
  toString(): string;
}
```

实现代码如下：

```typescript
/**
 * 结点
 */
class Node<Element> implements NodeInterface<Element> {
  public data: Element;
  public next: Node<Element> | null;

  constructor(data: Element, next: Node<Element> | null = null) {
    this.data = data;
    this.next = next;
  }

  public toString() {
    return `${this.data}`;
  }
}
```

## LinkedList 链表

链表在逻辑上是线性结构，在物理上是链式存储结构的数据结构。链表是最基础的数据结构之一 (另一个是数组)。链表由结点 (`Node`) 引用结点或空 (`null`) 的结构组成的集合，当不存在任何结点时，它为空 (`null`)。

链表是一种支持增加/删除/查询数据元素且可遍历的数据结构，数据元素的顺序是重要的。

设计 API 如下：

```typescript
/**
 * 链表接口
 */
declare interface LinkedListInterface<Element>
  extends Iterable<NodeInterface<Element>> {
  /**
   * 在链表头部插入结点
   * @param el 数据元素
   */
  insertHead(el: Element): this;

  /**
   * 在链表尾部插入结点
   * @param el 数据元素
   */
  insertTail(el: Element): this;

  /**
   * 在链表指定位置插入结点
   * @param el 数据元素
   * @param index 指定位置索引
   */
  insert(el, index): this;

  /**
   * 在链表头部删除结点
   */
  deleteHead(): NodeInterface<Element> | null;

  /**
   * 在链表尾部删除结点
   */
  deleteTail(): NodeInterface<Element> | null;

  /**
   * 在链表中删除指定数据元素的结点
   * @param el 数据元素
   */
  delete(el: Element): NodeInterface<Element>[] | null;

  /**
   * 在链表中查询指定数据元素的结点
   * @param el 数据元素
   */
  find(el: Element): NodeInterface<Element> | null;

  /**
   * 链表反转
   */
  reverse(): this;

  /**
   * 链表转字符串
   */
  toString(): string;

  /**
   * 链表是否为空
   */
  isEmpty(): boolean;
}
```

### 初始化

在 TypeScript 中，我们可以提供一个构造函数，用于初始化链表时执行。主要是做以下事情：

- 为了实现不同的数据元素的对比，提供了一个可选的形参，即 comparatorFunction 比较函数，用于节点之间的比较。
- 为了实现方便，我们不仅有链表头部节点 head，还有链表尾部节点 tail，但是访问属性都为 private，即不允许在外部访问，避免破坏链表结构。在初始化时默认为空链表，所以 head 和 tail 都为 null。

实现代码如下：

```typescript
/**
 * 链表
 */
export default class LinkedList<Element>
  implements LinkedListInterface<Element>
{
  /** 比较器 */
  private compare: Comparator<Element>;
  /** 链表头部结点 */
  private head: Node<Element> | null = null;
  /** 链表尾部结点 */
  private tail: Node<Element> | null = null;

  /**
   * 构造函数
   * @param comparatorFunction 比较函数
   */
  constructor(comparatorFunction?: (a: Element, b: Element) => number) {
    this.compare = new Comparator(comparatorFunction);
  }
}
```

### 插入结点

链表是一个可以在任意指定位置插入结点的数据结构，但是为了使用方便，我们提供了下列插入结点的 API：

- `insertHead()` 在链表头部插入结点
- `insertTail()` 在链表尾部插入结点
- `insert()` 在链表指定位置插入结点

实现代码如下：

```typescript
import Comparator from "@/utils/Comparator";

/**
 * 结点
 */
class Node<Element> implements NodeInterface<Element> {
  public data: Element;
  public next: Node<Element> | null;

  constructor(data: Element, next: Node<Element> | null = null) {
    this.data = data;
    this.next = next;
  }

  public toString() {
    return `${this.data}`;
  }
}

/**
 * 链表
 */
export default class LinkedList<Element>
  implements LinkedListInterface<Element>
{
  public insertHead(el: Element) {
    const node = new Node(el, this.head);

    if (this.isEmpty()) {
      this.head = this.tail = node;
    } else {
      this.head = node;
    }
    return this;
  }

  public insertTail(el: Element) {
    const node = new Node(el);

    if (this.isEmpty()) {
      this.head = this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }
    return this;
  }

  public insert(el: Element, index: number) {
    if (index < 0) throw new Error("insert(): index 参数不能小于 0");
    // 在链表头部插入
    if (index === 0) {
      this.insertHead(el);
    } else {
      let count = 1;
      let currNode = this.head;

      while (currNode) {
        if (count === index) break;
        currNode = currNode.next;
        count++;
      }

      // 在链表中间插入
      if (currNode) {
        currNode.next = new Node(el, currNode.next);
        // 在链表尾部插入
      } else {
        this.insertTail(el);
      }
    }

    return this;
  }
}
```

### 删除结点

链表是一个可以删除结点的数据结构，我们提供了下列删除结点的 API：

- `deleteHead()` 在链表头部删除结点
- `deleteTail()` 在链表尾部删除结点
- `delete()` 在链表中删除指定数据元素的结点

实现代码如下：

```typescript
/**
 * 链表
 */
export default class LinkedList<Element>
  implements LinkedListInterface<Element>
{
  public deleteHead() {
    if (this.isEmpty()) return null;

    const deletedNode = this.head as Node<Element>;

    if (deletedNode.next) {
      this.head = deletedNode.next;
      deletedNode.next = null;
    } else {
      this.head = this.tail = null;
    }

    return deletedNode;
  }

  public deleteTail() {
    if (this.isEmpty()) return null;

    const deletedNode = this.tail as Node<Element>;

    // 链表只有一个结点的情况
    if (this.head === this.tail) {
      this.head = this.tail = null;
      return deletedNode;
    }

    // 链表大于一个结点的情况
    let currNode = this.head as Node<Element>;
    while (currNode) {
      if (currNode.next === deletedNode) break;
      currNode = currNode.next as Node<Element>;
    }
    currNode.next = null;
    this.tail = currNode;

    return deletedNode;
  }

  public delete(el: Element) {
    const deletedNodeList: Node<Element>[] = [];

    let prevNode: Node<Element> | null = null;
    let currNode: Node<Element> | null = this.head;
    while (currNode) {
      if (this.compare.equal(currNode.data, el)) {
        if (currNode === this.head) {
          deletedNodeList.push(this.deleteHead() as Node<Element>);
          prevNode = null;
          currNode = this.head;
        } else if (currNode === this.tail) {
          deletedNodeList.push(this.deleteTail() as Node<Element>);
          break;
        } else {
          deletedNodeList.push(currNode);
          prevNode!.next = currNode.next;
          currNode.next = null;
          currNode = prevNode!.next;
        }
      } else {
        prevNode = currNode;
        currNode = currNode.next;
      }
    }

    return deletedNodeList;
  }
}
```

### 查询结点

链表是一个可以查询指定数据元素的结点的数据结构，我们提供了下列查询结点的 API：

- `find()` 在链表中查询指定数据元素的结点

实现代码如下：

```typescript
/**
 * 链表
 */
export default class LinkedList<Element>
  implements LinkedListInterface<Element>
{
  public find(el: Element) {
    let currNode = this.head;

    while (currNode) {
      if (this.compare.equal(currNode.data, el)) return currNode;
      currNode = currNode.next;
    }

    return null;
  }
}
```

### 遍历结点

链表是一个可遍历的数据结构，我们可以提供 `Symbol.iterator` 迭代器方法：

```typescript
/**
 * 链表
 */
export default class LinkedList<Element>
  implements LinkedListInterface<Element>
{
  public *[Symbol.iterator]() {
    let currNode = this.head;

    while (currNode !== null) {
      yield currNode;
      currNode = currNode.next;
    }
  }
}
```

## 复杂度

对该数据结构提供的主要 API 进行复杂度分析，如下所示：

| 方法       | 时间复杂度 | 空间复杂度 |
| ---------- | ---------- | ---------- |
| insertHead | O(1)       | O(1)       |
| insertTail | O(1)       | O(1)       |
| insert     | O(n)       | O(1)       |
| deleteHead | O(1)       | O(1)       |
| deleteTail | O(n)       | O(1)       |
| delete     | O(n)       | O(n)       |
| find       | O(n)       | O(1)       |

## LeetCode 题目

与该数据结构相关的一些 LeetCode 题目：

- [83. 删除排序链表中的重复元素 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/submissions/)
- [206. 反转链表 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-linked-list/)
- [21. 合并两个有序链表 - 力扣（LeetCode）](https://leetcode.cn/problems/merge-two-sorted-lists/submissions/)
- [876. 链表的中间结点 - 力扣（LeetCode）](https://leetcode.cn/problems/middle-of-the-linked-list/submissions/)

## 相关链接

- [LinkedList 完整代码](https://github.com/CokeBeliever/typescript-algorithm-and-data-structure/blob/master/src/data-structure/linked-list/LinkedList.ts)
