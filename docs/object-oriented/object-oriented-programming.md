# 面向对象程序设计

面向对象程序设计 (Object-Oriented Programming, OOP) 的实质是选用一种面向对象程序设计语言 (Object-Oriented Programming Language, OOPL)，采用对象、类及其相关概念所进行的程序设计。它的关键在于加入了类和继承性，从而进一步提高了抽象程度。

特定的 OOP 概念一般是通过 OOPL 中特定的语言机制来体现的。

## 类

当设计和实现一个面向对象的程序时，首先接触到的不是对象，而是类和类层次结构。

例如，雇员类的定义：

```typescript
/** 类标识符: Employee */
class Employee {
  /** 实例属性: name */
  name: string;
  /** 实例属性: age */
  age: number;
  /** 构造器 (实例化方法): constructor */
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  /** 实例方法: change */
  void change(name: string, age: number) {
    // ...
  }
}
```

类具有实例化功能，由类的 `constructor` 完成。类的实例化功能决定了类及其实例具有下面的特征。

- 同一个类的不同实例具有相同的数据结构、相同的方法集所定义的操作，因此具有规律相同的行为。
- 同一个类的不同实例可以持有不同的值，因此可以具有不同的状态。
- 实例的初始状态 (初值) 可以在实例化时确定。

## 继承和类层次结构

客观世界中实体集合 (或类) 的划分通常要考虑在不同实体集合之间在特征方面关联的相似性，在 OOP 中使用继承机制解决这一问题。

在一个面向对象系统中，子类与父类之间的继承关系构成了这个系统的类层次结构。

例如，经理类的定义：

```typescript
/** Manager */
class Manager extends Employee {
  level: number;
  constructor(name: string, age: number, level: number) {
    super(name, age);
    this.level = level;
  }
  void changeLevel(level: number) {
    // ...
  }
}
```

当执行一个子类的实例生成方法时：

- 首先在类层次结构中从该子类沿继承路径上溯至它的一个基类；
- 然后自顶向下执行该子类所有父类的实例生成方法；
- 最后执行该子类实例生成方法的函数体。

所以，与一般数据类型的实例化过程相比，类的实例化过程是一种实例的合成过程，而不仅仅是根据单个类型进行的空间分配、初始化和绑定。

## 对象、消息传递和方法

对象是类的实例。对象被看成用传递消息的方式互相联系的通信实体，它们既可以接收，也可以拒绝外界发来的消息。一般情况下，对象接收它能够识别的消息，拒绝它不能识别的消息。

发送一条消息至少应给出一个**对象的名字**和要发给这个对象的那条**消息的名字**。通常，消息的名字就是这个对象中外界可知的某个方法的名字。在消息中，经常还有一组参数 (也就是那个方法所要求的参数)，将外界的有关信息传给这个对象。

例如，假设 m1 是类 Manager 的一个实例 (或对象)，当外界要求把这个对象所代表的那位经理的级别改变为 2 时，就应以下面的方式向这个对象发出一条消息：

```typescript
// 对象: m1
const m1 = new Manager("小白", 20, 1);
/**
 * 消息传递
 * 对象的名字: m1
 * 消息的名字: changeLevel
 * 参数: 2
 */
m1.changeLevel(2);
```

一个类的实例方法集定义了它实例的消息传递协议。由于类是先于它实例构造而成的，所以一个类为它实例提供了可以预知的交互方式。

## 对象自身引用

对象自身引用 (self-Reference) 是 OOPL 中的一种特有结构。这种结构在不同的 OOPL 中有不同的名称，在 TypeScript、C++ 和 Java 中称为 `this`，在 Smalltalk-80、Object-C 和其他一些 OOPL 中则称为 `self`。

对象自身引用机制使得在进行方法的设计和实现时并不需要考虑与对象联系的细节，而是从更高一级的抽象层次，也就是类的角度来设计同类型对象的行为特征，从而使得方法在一个类及其子类的范围内具有共性。

在程序运行过程中，消息传递机制和对象自身引用将方法与特定的对象动态地联系在一起，使得不同的对象在执行同样的方法体时，可以因对象的不同而产生不同的行为。

```typescript
class Employee {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  void change(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const e1 = new Employee('小明', 20);
const e2 = new Employee('小红', 22);

e1.change('小明', 30);// 此时，方法体 change 中的 this 为 e1
e1.change('小红', 12);// 此时，方法体 change 中的 this 为 e2
```

## 重置

重置或覆盖 (Overriding) 是在子类中重新定义父类中已经定义的方法，其基本思想是通过一种动态绑定机制的支持，使得子类在继承父类接口定义的前提下用适合自己要求的实现去置换父类中的相应实现。

```typescript
class Employee {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  void change(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  /** 抽象方法: retire 供 Employee 的子类重置 */
  abstract void retire();
}

class Manager extends Employee {
  level: number;
  constructor(name: string, age: number, level: number) {
    super(name, age);
    this.level = level;
  }
  /** 实例方法: retire 重置从父类继承的 retire 方法 */
  void retire() {
    // ...
  }
  /** 抽象方法：changeLevel 供 Manager 的子类重置 */
  void changeLevel(level: number);
}
```

## 泛型

泛型是程序设计语言中普遍的一种参数多态机制，在 OOPL 中也不例外。

```typescript
/** 队列 */
class Queue<T> {
  list: T[];
  // ...
}

// 实例化时定义具体类型参数
const q1 = new Queue<string>();
const q2 = new Queue<number>();
```

其中，`<T>` 中的 T 用来声明一个类型参数。

泛型可以看成是类的模板。一个泛型是关于一组类的一个特性抽象，它强调的是这些类的实例特征中与具体类型无关的那些部分，而与具体类型相关的那些部分则用变元 (例如: `T`) 来表示。这就使得对类的集合也可以按照特性的相似性再次进行划分。泛型对类库的建设提供了强有力的支持。

## 抽象类

类是对象的模板，对象是类的实例。那么是否每个类都至少有一个实例？

如果在类之间没有定义继承关系，回答是肯定的。这是因为若存在没有实例的类，那么这样的类对程序的行为没有任何贡献，因而是冗余的。相反，如果存在继承关系，那么的确有可能在类层次结构的较高层次上看到始终没有实例的类。

在 TypeScript 中通过将一个类声明 (`abstract`) 来创建一个抽象类，并在抽象类中定义抽象方法，抽象类中也可以没有抽象方法。

```typescript
/** 抽象类: Person */
abstract class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  void change(name: string, int age) {
    // ...
  }
  /** 抽象方法 */
  abstract void PrintOn();
}
```
