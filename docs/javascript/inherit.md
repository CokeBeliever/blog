# 继承

在 JavaScript 中，实现继承的方式有多种。

## 原型链

ECMA-262 把原型链定义为 ECMAScript 的主要继承方式。其基本思想就是通过原型继承多个引用类型的属性和方法。

重温一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型有一个属性指向构造函数，而实例有一个内部指针指向原型。如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本构想。

实现原型链涉及如下代码模式：

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function () {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

// 继承 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
  return this.subproperty;
};

let instance = new SubType();
console.log(instance.getSuperValue()); // true
```

我们知道，在读取实例上的属性时，首先会在实例上搜索这个属性。如果没找到，则会继承搜索实例的原型。在通过原型链实现继承之后，搜索就可以继承向上，搜索原型的原型。对前面的例子而言，调用 instance.getSuperValue() 经过了 3 步搜索：instance、SubType.prototype 和 SuperType.prototype，最后一步才找到这个方法。对属性和方法的搜索会一直持续到原型链的末端。

### 默认原型

实际上，原型链中还有一环。默认情况下，所有引用类型都继承自 Object，这也是通过原型链实现的。任何函数的默认原型都是一个 Object 的实例，这意味着这个实例有一个内部指针指向 Object.prototype。这也是为什么自定义类型都能继承包括 toString()、valueOf() 在内的所有默认方法的原因。因此前面的例子还有额外一层继承关系。

SubType 继承 SuperType，而 SuperType 继承 Object。在调用 instance.toString() 时，实际上调用的是保存在 Object.prototype 上的方法。

### 原型与继承关系

原型和实例的关系可以通过两种方式来确定。

**instanceof 操作符**

第一种方式是使用 instanceof 操作符，如果一个实例的原型链中出现过相应的构造函数的原型，则 instanceof 返回 true。如下例所示：

```js
console.log(instance instanceof Object); // true
console.log(instance instanceof SuperType); // true
console.log(instance instanceof SubType); // true
```

从技术上讲，instance 是 Object、SuperType 和 SubType 的实例，因为 instance 的原型链中包含这些构造函数的原型。结果就是 instanceof 对所有这些构造函数都返回 true。

**isPrototypeOf() 方法**

第二种方式是使用 isPrototypeOf() 方法。原型链中的每个原型都可以调用这个方法，如下例所示，只要原型链中包含这个原型，这个方法就返回 true：

```js
console.log(Object.prototype.isPrototypeOf(instance)); // true
console.log(SuperType.prototype.isPrototypeOf(instance)); // true
console.log(SubType.prototype.isPrototypeOf(instance)); // true
```

### 关于方法

子类有时候需要覆盖父类的方法，或者增加父类没有的方法。为此，这些方法必须在原型赋值之后再添加到原型上。来看下面的例子：

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function () {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

// 继承 SuperType
SubType.prototype = new SuperType();

// 新方法
SubType.prototype.getSubValue = function () {
  return this.subproperty;
};

// 覆盖已有的方法
SubType.prototype.getSuperValue = function () {
  return false;
};

let instance = new SubType();
console.log(instance.getSuperValue()); // false
```

### 问题

原型链虽然是实现继承的强大工具，但它也有问题。

原型链的第一个问题是：**原型中包含的值会在所有实例间共享，这也是为什么独立数据的属性通常会在构造函数中定义而不会定义在原型上的原因。在使用原型实现继承时，子类型的原型实际上变成了父类型的实例。这意味着原先父类型的实例属性变成了子类型的原型属性。**下面的例子揭示了这个问题：

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}

function SubType() {}

// 继承 SuperType
SubType.prototype = new SuperType();

let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); // "red, blue, green, black"

let instance2 = new SubType();
console.log(instance2.colors); // "red, blue, green, black"
```

原型链的第二个问题是：**子类型在实例化时不能给父类型的构造函数传参**。

### 总结

**优点**

- 子类型可以继承父类型原型中定义的共享数据。
- 在判断是否为父类型的实例时，instanceof 操作符和 isPrototypeOf() 方法结果为 true。

**缺点**

- 子类型在实例化时无法给父类型的构造函数传参。
- 子类型无法继承父类型构造函数中定义的独立数据，独立数据会被变为实例之间的共享数据。

综上所述，在实现继承时原型链基本不会单独使用。

## 盗用构造函数

盗用构造函数实现继承的基本思路很简单：在子类构造函数中调用父类构造函数。因为毕竟函数就是在特定上下文中执行代码的简单对象，所以可以使用 apply() 和 call() 方法以新创建的对象为上下文执行构造函数。来看下面的例子：

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}

function SubType() {
  // 继承 SuperType
  SuperType.call(this);
}

let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); // "red, blue, green, black"

let instance2 = new SubType();
console.log(instance2.colors); // "red, blue, green"
```

### 传递参数

盗用构造函数的第一个优点是：**子类型在实例化时可以给父类型的构造函数传参**。来看下面的例子：

```js
function SuperType(name) {
  this.name = name;
}

function SubType() {
  // 继承 SuperType 并传参
  SuperType.call(this, "Nicholas");

  // 实例属性
  this.age = 29;
}

let instance = new SubType();
console.log(instance.name); // "Nicholas";
console.log(instance.age); // 29
```

为确保 SuperType 构造函数不会覆盖 SubType 定义的属性，可以在调用父类构造函数之后再给子类实例添加额外的属性。

### 总结

**优点**

- 子类型在实例化时可以给父类型的构造函数传参。
- 子类型可以继承父类型构造函数中定义的独立数据。

**缺点**

- 子类型无法继承父类型原型中定义的共享数据。
- 在判断是否为父类型的实例时，instanceof 操作符和 isPrototypeOf() 方法结果为 false。

由于存在这些问题，盗用构造函数基本上也不能单独使用。

## 组合继承

组合继承综合了原型链和盗用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。来看下面的例子：

```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function () {
  console.log(this.age);
};

let instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
console.log(instance1.colors); // "red, blue, green, black"
instance1.sayName(); // "Nicholas"
instance1.sayAge(); // 29

let instance2 = new SubType("Greg", 27);
console.log(instance2.colors); // "red, blue, green"
instance2.sayName(); // "Greg"
instance2.sayAge(); // 27
```

组合继承弥补了原型链和盗用构造函数的不足，是 JavaScript 中使用最多的继承模式。

### 问题

组合继承其实也存在问题，最主要的问题就是父类构造函数会被调用两次：一次是在创建子类原型时调用，另一次是在子类构造函数中调用，因此在实例和原型链中可能会产生冗余数据。

### 总结

**优点**

- 子类型在实例化时可以给父类型的构造函数传参。
- 子类型可以继承父类型构造函数中定义的独立数据。
- 子类型可以继承父类型原型中定义的共享数据。
- 在判断是否为父类型的实例时，instanceof 操作符和 isPrototypeOf() 方法结果为 true。

**缺点**

- 父类构造函数会被调用两次，因此在实例和原型链中可能会产生冗余数据。

## 寄生式组合继承

组合继承的主要问题是父类构造函数会被调用两次，因此在实例和原型链中可能会产生冗余数据。本质上，子类原型最终是要包含父类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了。再来看一看这个组合继承的例子：

```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name); // 第二次调用 SuperType()
  this.age = age;
}

SubType.prototype = new SuperType(); // 第一次调用 SuperType()
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

寄生式组合继承通过盗用构造函数继承属性，但使用混合式原型链继承方法。基本思路是不通过调用父类构造函数给子类原型赋值，而是取得父类原型的一个副本。寄生式组合继承的基本模式如下所示：

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function inheritPrototype(subType, superType) {
  // 等价于 let prototype = Object.create(superType.prototype);
  let prototype = object(superType.prototype); // 创建对象
  prototype.constructor = subType;
  subType.prototype = prototype;
}
```

这个 inheritPrototype() 函数实现了寄生式组合继承的核心逻辑。这个函数接收两个参数：子类构造函数和父类构造函数。在这个函数内部，第一步是创建父类原型的一个副本。然后，给返回的 prototype 对象设置 constructor 属性，解决由于重写原型导致默认 constructor 丢失的问题。最后将新创建的对象赋值给子类型的原型。

如下例所示，调用 inheritPrototype() 就可以实现前面的例子中的子类型原型赋值：

```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

这里只调用了一次 SuperType 构造函数，避免了 SubType.prototype 上不必要也用不到的属性。

寄生式组合继承可以算是引用类型继承的最佳模式。

### 总结

**优点**

- 子类型在实例化时可以给父类型的构造函数传参。
- 子类型可以继承父类型构造函数中定义的独立数据。
- 子类型可以继承父类型原型中定义的共享数据。
- 在判断是否为父类型的实例时，instanceof 操作符和 isPrototypeOf() 方法结果为 true。

**缺点**
