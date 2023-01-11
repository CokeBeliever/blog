# 栈

## Stack 栈

栈在逻辑上是线性结构的数据结构，在物理上是根据实现的方式所决定的，主要有数组实现 (顺序存储结构) 和链表实现 (链式存储结构)。

栈是一种支持增加/删除/查询数据元素且可遍历的数据结构，数据元素的顺序是重要的。

设计 API 如下：

```typescript
/**
 * 栈接口
 */
declare interface StackInterface<Element> extends Iterable<Element> {
  /**
   * 入栈
   */
  push(el: Element): void;

  /**
   * 出栈
   */
  pop(): Element | null;

  /**
   * 查看栈顶的数据元素
   */
  peek(): Element | null;

  /**
   * 栈转字符串
   */
  toString(): string;

  /**
   * 栈是否为空
   */
  isEmpty(): boolean;
}
```

### 初始化

初始化一个空数组/链表来存储数据元素。

**数组实现**

```typescript
/**
 * 栈 (数组实现)
 */
export default class StackByArray<Element> implements StackInterface<Element> {
  /** 元素容器 */
  private container: Element[] = [];
}
```

**链表实现**

```typescript
/**
 * 栈 (链表实现)
 */
export default class StackByLinkedList<Element>
  implements StackInterface<Element>
{
  /** 元素容器 */
  private container: LinkedList<Element> = new LinkedList();
}
```

### 添加数据元素

栈是一个可以添加数据元素的数据结构，我们提供了下列添加数据元素的 API：

- `push()` 入栈

**数组实现**

```typescript
/**
 * 栈 (数组实现)
 */
export default class StackByArray<Element> implements StackInterface<Element> {
  public push(el: Element) {
    this.container.push(el);
  }
}
```

**链表实现**

```typescript
/**
 * 栈 (链表实现)
 */
export default class StackByLinkedList<Element>
  implements StackInterface<Element>
{
  public push(el: Element) {
    this.container.insertHead(el);
  }
}
```

### 删除数据元素

链表是一个可以删除数据元素的数据结构，我们提供了下列删除数据元素的 API：

- `pop()` 出栈

**数组实现**

```typescript
/**
 * 栈 (数组实现)
 */
export default class StackByArray<Element> implements StackInterface<Element> {
  public pop() {
    if (this.isEmpty()) return null;
    return this.container.pop() as Element;
  }
}
```

**链表实现**

```typescript
/**
 * 栈 (链表实现)
 */
export default class StackByLinkedList<Element>
  implements StackInterface<Element>
{
  public pop() {
    if (this.isEmpty()) return null;
    return this.container.deleteHead()!.data;
  }
}
```

### 查询数据元素

链表是一个可以查询栈顶数据元素的数据结构，我们提供了下列查询结点的 API：

- `peek()` 查看栈顶的数据元素

**数组实现**

```typescript
/**
 * 栈 (数组实现)
 */
export default class StackByArray<Element> implements StackInterface<Element> {
  public peek() {
    if (this.isEmpty()) return null;
    return this.container[this.container.length - 1];
  }
}
```

**链表实现**

```typescript
/**
 * 栈 (链表实现)
 */
export default class StackByLinkedList<Element>
  implements StackInterface<Element>
{
  public peek() {
    if (this.isEmpty()) return null;
    return this.container.getHead()!.data;
  }
}
```

### 遍历数据元素

栈是一个可遍历的数据结构，我们可以提供 `Symbol.iterator` 迭代器方法，来实现遍历数据元素。

**数组实现**

```typescript
/**
 * 栈 (数组实现)
 */
export default class StackByArray<Element> implements StackInterface<Element> {
  public *[Symbol.iterator]() {
    for (let i = this.container.length - 1; i >= 0; i--) {
      yield this.container[i];
    }
  }
}
```

**链表实现**

```typescript
/**
 * 栈 (链表实现)
 */
export default class StackByLinkedList<Element>
  implements StackInterface<Element>
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

| 方法 | 数组时间复杂度 | 数组空间复杂度 | 链表时间复杂度 | 链表空间复杂度 |
| ---- | -------------- | -------------- | -------------- | -------------- |
| push | O(1)           | O(1)           | O(1)           | O(1)           |
| pop  | O(1)           | O(1)           | O(1)           | O(1)           |
| peek | O(1)           | O(1)           | O(1)           | O(1)           |

## LeetCode 题目

与该数据结构相关的一些 LeetCode 题目：

- [844. 比较含退格的字符串 - 力扣（LeetCode）](https://leetcode.cn/problems/backspace-string-compare/submissions/)
- [1047. 删除字符串中的所有相邻重复项 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)
- [1544. 整理字符串 - 力扣（LeetCode）](https://leetcode.cn/problems/make-the-string-great/)
- [1598. 文件夹操作日志搜集器 - 力扣（LeetCode）](https://leetcode.cn/problems/crawler-log-folder/)
- [682. 棒球比赛 - 力扣（LeetCode）](https://leetcode.cn/problems/baseball-game/)
- [20. 有效的括号 - 力扣（LeetCode）](https://leetcode.cn/problems/valid-parentheses/)

## 相关链接

- [Stack 完整代码](https://github.com/CokeBeliever/typescript-algorithm-and-data-structure/tree/master/src/data-structure/stack)
