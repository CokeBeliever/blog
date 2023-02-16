# [算法和数据结构]-数据结构-队列

## Queue 队列

队列在逻辑上是线性结构的数据结构，在物理上是根据实现的方式所决定的，主要有数组实现 (顺序存储结构) 和链表实现 (链式存储结构)。

队列是一种支持增加/删除/查询数据元素且可遍历的数据结构，数据元素的顺序是重要的。

设计 API 如下：

```typescript
/**
 * 队列接口
 */
declare interface QueueInterface<Element> extends Iterable<Element> {
  /**
   * 入队
   */
  enqueue(el: Element): void;

  /**
   * 出队
   */
  dequeue(): Element | null;

  /**
   * 查看队首的数据元素
   */
  peek(): Element | null;

  /**
   * 队列转字符串
   */
  toString(): string;

  /**
   * 队列是否为空
   */
  isEmpty(): boolean;
}
```

### 初始化

初始化一个空数组/链表来存储数据元素。

**数组实现**

```typescript
/**
 * 队列 (数组实现)
 */
export default class QueueByArray<Element> implements QueueInterface<Element> {
  /** 元素容器 */
  private container: Element[] = [];
}
```

**链表实现**

```typescript
/**
 * 队列 (链表实现)
 */
export default class QueueByLinkedList<Element>
  implements QueueInterface<Element>
{
  /** 元素容器 */
  private container: LinkedList<Element> = new LinkedList();
}
```

### 添加数据元素

队列是一个可以添加数据元素的数据结构，我们提供了下列添加数据元素的 API：

- `enqueue()` 入队

**数组实现**

```typescript
/**
 * 队列 (数组实现)
 */
export default class QueueByArray<Element> implements QueueInterface<Element> {
  public enqueue(el: Element) {
    this.container.push(el);
  }
}
```

**链表实现**

```typescript
/**
 * 队列 (链表实现)
 */
export default class QueueByLinkedList<Element>
  implements QueueInterface<Element>
{
  public enqueue(el: Element) {
    this.container.insertTail(el);
  }
}
```

### 删除数据元素

队列是一个可以删除数据元素的数据结构，我们提供了下列删除数据元素的 API：

- `dequeue()` 出队

**数组实现**

```typescript
/**
 * 队列 (数组实现)
 */
export default class QueueByArray<Element> implements QueueInterface<Element> {
  public dequeue() {
    if (this.isEmpty()) return null;
    return this.container.shift() as Element;
  }
}
```

**链表实现**

```typescript
/**
 * 队列 (链表实现)
 */
export default class QueueByLinkedList<Element>
  implements QueueInterface<Element>
{
  public dequeue() {
    if (this.isEmpty()) return null;
    return this.container.deleteHead()!.data;
  }
}
```

### 查询数据元素

队列是一个可以查询队首数据元素的数据结构，我们提供了下列查询结点的 API：

- `peek()` 查看队首的数据元素

**数组实现**

```typescript
/**
 * 队列 (数组实现)
 */
export default class QueueByArray<Element> implements QueueInterface<Element> {
  public peek() {
    if (this.isEmpty()) return null;
    return this.container[0];
  }
}
```

**链表实现**

```typescript
/**
 * 队列 (链表实现)
 */
export default class QueueByLinkedList<Element>
  implements QueueInterface<Element>
{
  public peek() {
    if (this.isEmpty()) return null;
    return this.container.getHead()!.data;
  }
}
```

### 遍历数据元素

队列是一个可遍历的数据结构，我们可以提供 `Symbol.iterator` 迭代器方法，来实现遍历数据元素。

**数组实现**

```typescript
/**
 * 队列 (数组实现)
 */
export default class QueueByArray<Element> implements QueueInterface<Element> {
  public [Symbol.iterator]() {
    return this.container[Symbol.iterator]();
  }
}
```

**链表实现**

```typescript
/**
 * 队列 (链表实现)
 */
export default class QueueByLinkedList<Element>
  implements QueueInterface<Element>
{
  public *[Symbol.iterator]() {
    for (let node of this.container) {
      yield node.data;
    }
  }
}
```

## 复杂度

对该数据结构提供的主要 API 进行复杂度分析，如下所示：

| 方法    | 数组时间复杂度 | 数组空间复杂度 | 链表时间复杂度 | 链表空间复杂度 |
| ------- | -------------- | -------------- | -------------- | -------------- |
| enqueue | O(1)           | O(1)           | O(1)           | O(1)           |
| dequeue | O(n)           | O(1)           | O(1)           | O(1)           |
| peek    | O(1)           | O(1)           | O(1)           | O(1)           |

## LeetCode 题目

与该数据结构相关的一些 LeetCode 题目：

- [933. 最近的请求次数 - 力扣（LeetCode）](https://leetcode.cn/problems/number-of-recent-calls/)
- [1700. 无法吃午餐的学生数量 - 力扣（LeetCode）](https://leetcode.cn/problems/number-of-students-unable-to-eat-lunch/)

## 相关链接

- [Queue 完整代码](https://github.com/CokeBeliever/typescript-algorithm-and-data-structure/tree/master/src/data-structure/queue)
