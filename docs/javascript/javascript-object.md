# JavaScript 对象

## 对象的属性

JavaScript 对象的属性可以分两种：

- 数据属性
- 访问器属性

**数据属性**

数据属性包含一个保存数据值的位置。值会从这个位置读取，也会写入到这个位置。数据属性有 4 个特性描述它们的行为。

- `[[Configurable]]`：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问器属性。默认情况下，所有直接定义在对象的属性的这个特性都是 true。
- `[[Enumberable]]`：表示属性是否可以通过 for-in 循环返回。默认情况下，所有直接定义在对象上的属性的这个特性都是 true。
- `[[Writable]]`：表示属性的值是否可以被修改。默认情况下，所有直接定义在对象上的属性的这个特性都是 true。
- `[[Value]]`：包含属性实际的值。这就是前面提到的那个读取和写入属性值的位置。这个特性的默认值为 `undefined`。

**访问器属性**

访问器属性不包含数据值。相反，它们包含一个获取 (getter) 函数和一个设置 (setter) 函数，不过这两个函数不是必需的。在读取访问器属性时，会调用获取函数，这个函数的责任就是返回一个有效的值。在写入访问器属性时，会调用设置函数并传入新值，这个函数必须决定对数据做出什么修改。访问器属性有 4 个特性描述它们的行为。

- `[[Configurable]]`：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为数据属性。默认情况下，所有直接定义在对象的属性的这个特性都是 true。
- `[[Enumberable]]`：表示属性是否可以通过 for-in 循环返回。默认情况下，所有直接定义在对象上的属性的这个特性都是 true。
- `[[Get]]`：获取函数，在读取属性时调用。默认值为 `undefined`。
- `[[Set]]`：设置函数，在写入属性时调用。默认值为 `undefined`。

访问器属性是不能直接定义的，必须使用 Object.defineProperty() 方法。

### 定义单个属性

使用 Object.defineProperty() 方法可以定义单个属性 (数据属性或访问器属性)。下面是一个例子：

```js
// 定义一个对象，包含伪私有成员 year_ 和公共成员 edition
let book = {
  year_: 2017,
  edition: 1,
};
Object.defineProperty(book, "year", {
  get() {
    return this.year_;
  },
  set(newValue) {
    if (newValue > 2017) {
      this.year_ = newValue;
      this.edition += newValue - 2017;
    }
  },
});
book.year = 2018;
console.log(book.edition); // 2
```

### 定义多个属性

使用 Object.defineProperties() 方法可以通过多个描述符一次性定义多个属性。下面是一个例子：

```js
let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017,
  },

  edition: {
    value: 1,
  },

  year: {
    get() {
      return this.year_;
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017;
      }
    },
  },
});
```

### 获取单个属性的属性描述符

使用 Object.getOwnPropertyDescriptor() 方法可以取得指定属性的属性描述符。这个方法返回值是一个对象，对于访问器属性包含 configurable、enumerable、get 和 set 属性，对于数据属性包含 configurable、enumerable、writable 和 value 属性。下面是一个例子：

```js
let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017,
  },

  edition: {
    value: 1,
  },

  year: {
    get() {
      return this.year_;
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017;
      }
    },
  },
});

let descriptor = Object.getOwnPropertyDescriptor(book, "year_");
console.log(descriptor.value); // 2017
console.log(descriptor.configurable); // false
console.log(typeof descriptor.get); // "undefined"
descriptor = Object.getOwnPropertyDescriptor(book, "year");
console.log(descriptor.value); // undefined
console.log(descriptor.configurable); // false
console.log(typeof descriptor.get); // "function"
```

### 获取多个属性的属性描述符

使用 Object.getOwnPropertyDescriptors() 方法可以取得所有属性的属性描述符。下面是一个例子：

```js
let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017,
  },

  edition: {
    value: 1,
  },

  year: {
    get() {
      return this.year_;
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017;
      }
    },
  },
});

console.log(Object.getOwnPropertyDescriptors(book));
// {
//     edition: {
//         configurable: false
//         enumerable: false
//         value: 1
//         writable: false
//     },
//     year: {
//         configurable: false
//         enumerable: false
//         get: ƒ get()
//         set: ƒ set(newValue )
//     },
//     year_: {
//         configurable: false
//         enumerable: false
//         value: 2017
//         writable: false
//     }
// }
```

## 创建对象

在 JavaScript 中，创建对象的方式有多种。

### Object 构造函数或对象字面量

Object 构造函数可以创建对象。如下所示：

```js
let person1 = new Object();
person1.name = "Nicholas";
person1.age = 29;
person1.job = "Software Engineer";
person1.sayName = function () {
  console.log(this.name);
};

let person2 = new Object();
person2.name = "Greg";
person2.age = 27;
person2.job = "Doctor";
person2.sayName = function () {
  console.log(this.name);
};
```

**对象字面量**

对象字面量可以创建对象。如下所示：

```js
let person1 = {
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName() {
    console.log(this.name);
  },
};

let person2 = {
  name: "Greg",
  age: 27,
  job: "Doctor",
  sayName() {
    console.log(this.name);
  },
};
```

**优点**

- 创建对象方便。

**缺点**

- 创建多个特定对象需要编写重复代码，所以可维护性较低，容易编码错误。
- 特定对象没有标识，创建的对象都是 Object 的实例。

### 工厂模式

工厂模式是一种众所周知的设计模式，广泛应用于软件工程领域，用于抽象创建特定对象的过程。如下所示：

```js
function createPerson(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}

let person1 = createPerson("Nicholas", 29, "Software Engineer");
let person2 = createPerson("Greg", 27, "Doctor");
```

这里，函数 createPerson() 接收 3 个参数，根据这几个参数构建了一个包含 Person 信息的对象。可以用不同的参数多次调用这个函数，每次都会返回包含 3 个属性和 1 个方法的对象。

**优点**

- 创建对象方便。
- 工厂函数封装创建特定对象的过程，解决了创建多个特定对象需要编写重复代码的问题。

**缺点**

- 特定对象没有标识，创建的对象都是 Object 的实例。

### 构造函数模式

ECMAScript 中的构造函数是用于创建特定类型对象的。像 Object 和 Array 这样的原生构造函数，运行时可以直接在执行环境中使用。当然也可以自定义构造函数，以函数的形式为自己的对象类型定义属性和方法。

比如，前面的例子使用构造函数可以这样写：

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function () {
    console.log(this.name);
  };
}

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

person1.sayName(); // Nicholas
person2.sayName(); // Greg
```

要创建 Person 的实例，应使用 new 操作符。以这种方式调用构造函数会执行如下操作：

1. 在内存中创建一个新对象。
2. 这个新对象内部的 `[[Prototype]]` 特性被赋值为构造函数的 prototype 属性。
3. 构造函数内部的 this 被赋值为这个新对象 (即 this 指向新对象)。
4. 执行构造函数内部的代码 (给新对象添加属性)。
5. 如果构造函数返回非空对象，则返回对象；否则，返回刚创建的新对象。

创建的对象都是 Object 的实例，同时也是 Person 的实例，如下面调用 instanceof 操作符结果所示：

```js
console.log(person1 instanceof Object); // true
console.log(person1 instanceof Person); // true
console.log(person2 instanceof Object); // true
console.log(person2 instanceof Person); // true
```

**问题**

构造函数的主要问题在于，其定义的方法会在每个实例上都创建一遍。因此对前面的例子而言，person1 和 person2 都有名为 sayName() 的方法，但这两个方法不是同一个 Function 实例。我们知道，ECMAScript 中的函数是对象，因此每次定义函数时，都会初始化一个对象。逻辑上讲，这个构造函数实际上是这样的：

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = new Function("console.log(this.name)"); // 逻辑等价
}
```

这样理解这个构造函数可以更清楚地知道，每个 Person 实例都会有自己的 Function 实例用于显示 name 属性。当然了，以这种方式创建函数会带来不同的作用域链和标识符解析。但创建新 Function 实例的机制是一样的。因此不同实例上的函数虽然同名却不相等，如下所示：

```js
console.log(person1.sayName == person2.sayName); // false
```

因为都是做一样的事，所以没必要定义两个不同的 Function 实例。况且，this 对象可以把函数与对象的绑定推迟到运行时。要解决这个问题，可以把函数定义转移到构造函数外部：

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = sayName;
}

function sayName() {
  console.log(this.name);
}

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

person1.sayName(); // Nicholas
person2.sayName(); // Greg

console.log(person1.sayName == person2.sayName); // true
```

这样虽然解决了相同逻辑的函数重复定义的问题，但全局作用域也因此被搞混乱了，因为那个函数实际上只能在一个对象上调用。如果这个对象需要多个方法，那么就要在全局作用域中定义多个函数。这会导致自定义类型引用的代码不能很好地聚集一起。

**优点**

- 创建对象方便。
- 构造函数封装创建特定对象的过程，解决了创建多个特定对象需要编写重复代码的问题。
- 特定对象有标识，创建的对象不仅是 Object 的实例，同时也是自己构造函数的实例。
- 实例对象之间可以独立数据。

**缺点**

- 实例对象之间无法共享数据。例如：无法共享实例方法，每个实例上都会创建重复功能的方法。

### 原型模式

每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。

使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型，如下所示：

```js
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person();
person1.sayName(); // "Nicholas"

let person2 = new Person();
person2.sayName(); // "Nicholas"

console.log(person1.sayName == person2.sayName); // true
```

这里，所有属性和 sayName() 方法都直接添加到了 Person 的 prototype 属性上，构造函数中什么也没有。但这样定义之后，调用构造函数创建的新对象仍然拥有相应的属性和方法。与构造函数模式不同，使用这种原型模式定义的属性和方法是由所有实例共享的。

**理解原型**

无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 prototype 属性 (指向原型对象)。默认情况下，所有原型对象自动获得一个名为 constructor 的属性，指向与之关联的构造函数。对前面的例子而言，`Person.prototype.constructor` 指向 Person。

在自定义构造函数时，原型对象默认只会获得 constructor 属性，其他的所有方法都继承自 Object。每次调用构造函数创建一个新实例，这个实例的内部 `[[Prototype]]` 指针就会被赋值为构造函数的原型对象。JavaScript 中没有访问这个 `[[Prototype]]` 特性的标准方式，但 Firefox、Safari 和 Chrome 会在每个对象上暴露 `__proto__` 属性，通过这个属性可以访问对象的原型。在其他实现中，这个特性完全被隐藏了。关键在于理解这一点：**实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有。**

这种关系不好可视化，但可以通过下面的代码来理解原型的行为：

```js
/**
 *  构造函数可以是函数表达式
 *  也可以是函数声明，因此以下两种形式都可以：
 *  function Peron {}
 *  let Person = function() {}
 */
function Person() {}

/**
 *  声明之后，构造函数就有了一个
 *  与之关联的原型对象：
 */
console.log(typeof Person.prototype); // object
console.log(Person.prototype);
// {
//     constructor: ƒ Person(),
//     __proto__: Object
// }

/**
 *  如前所述，构造函数有一个 prototype 属性
 *  引用其原型对象，而这个原型对象也有一个
 *  constructor 属性，引用这个构造函数
 *  换句话说，两者循环引用：
 */
console.log(Person.prototype.constructor === Person); // true

/**
 *  正常的原型链都会终止于 Object 的原型对象
 *  Object 原型的原型是 null
 */
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Person.prototype.__proto__.constructor === Object); // true
console.log(Person.prototype.__proto__.__proto__ === null); // true

console.log(Person.prototype.__proto__);
// {
//     constructor: ƒ Object()
//     toString: ...
//     hasOwnProperty: ...
//     isPrototypeOf: ...
//     ...
// }

let person1 = new Person(),
  person2 = new Person();

/**
 *  构造函数，原型对象和实例
 *  是 3 个完全不同的对象
 */
console.log(person1 !== Person); // true
console.log(person1 !== Person.prototype); // true
console.log(Person.prototype !== Person); // true

/**
 *  实例通过 __proto__ 链接到原型对象，
 *  它实际上指向隐藏特性 [[Prototype]]
 *
 *  构造函数通过 prototype 属性链接到原型对象
 *
 *  实例与构造函数没有直接联系，与原型对象有直接联系
 */
console.log(person1.__proto__ === Person.prototype); // true
console.log(person1.__proto__.constructor === Person); // true

/**
 *  同一个构造函数创建的两个实例
 *  共享同一个原型对象：
 */
console.log(person1.__proto__ === person2.__proto__); // true

/**
 *  instanceof 检查实例的原型链中
 *  是否包含指定构造函数的原型：
 */
console.log(person1 instanceof Person); // true
console.log(person1 instanceof Object); // true
console.log(Person.prototype instanceof Object); // true
```

**原型层级**

在通过对象访问属性时，会按照这个属性的名称开始搜索。搜索开始于对象实例本身。如果在这个实例上发现了给定的名称，则返回该名称对应的值。如果没有找到这个属性，则搜索会沿着指针进入原型对象，然后在原型对象上找到属性后，再返回对应的值。

虽然可以通过实例读取原型对象上的值，但不可能通过实例重写这些值。如果在实例上添加了一个与原型对象中同名的属性，那就会在实例上创建这个属性，这个属性会遮住原型对象上的属性。下面看一个例子：

```js
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person();
let person2 = new Person();

person1.name = "Greg";
console.log(person1.name); // "Greg"，来自实例
console.log(person2.name); // "Nicholas"，来自原型
```

只要给对象实例添加一个属性，这个属性就会遮蔽 (shadow) 原型对象上的同名属性，也就是虽然不会修改它，但会屏蔽对它的访问。即使在实例上把这个属性设置为 null，也不会恢复它和原型的联系。不过，使用 delete 操作符可以完全删除实例上的这个属性，从而让标识符解析过程能够继续搜索原型对象。

```js
delete person1.name;
console.log(person1.name); // "Nicholas"，来自原型
```

**问题**

原型模式也不是没有问题。首先，它弱化了向构造函数传递初始化参数的能力，会导致所有实例默认都取得相同的属性值。虽然这会带来不便，但还不是原型的最大问题。**原型的最主要问题源自它的共享特性**。

我们知道，原型上的所有属性是在实例间共享的，这对函数来说比较合适。另外包含原始值的属性也还好，如前面例子所示，可以通过在实例上添加同名属性来简单地遮蔽原型上的属性。真正的问题来自包含引用数据类型的属性。来看下面的例子：

```js
function Person() {}

Person.prototype = {
  constructor: Person,
  name: "Nicholas",
  age: 29,
  job: "SoftWare Engineer",
  friends: ["Shelby", "Court"],
  sayName() {
    console.log(this.name);
  },
};

let person1 = new Person();
let person2 = new Person();

person1.friends.push("van");

console.log(person1.friends); // "Shelby, court, val"
console.log(person1.friends); // "Shelby, court, val"
console.log(person1.friends === person2.firends); // true
```

如果这是有意在多个实例间共享数组，那没什么问题。但一般来说，不同的实例应该有属于自己的属性副本，这就是实际开发中通常不单独使用原型模式的原因。

**优点**

- 创建对象方便。
- 原型模式定义创建特定对象的共享数据，解决了创建多个特定对象需要编写重复代码的问题。
- 特定对象有标识，创建的对象不仅是 Object 的实例，同时也是自己构造函数的实例。
- 实例对象之间可以共享数据。

**缺点**

- 实例对象之间无法独立数据。

### 构造函数模式 + 原型模式

构造函数模式和原型模式都有各自的缺点，单独使用会存在各自的问题，但是我们可以结合起来使用。对于希望共享的数据，我们使用原型模式；而对于希望独立的数据，我们使用构造函数模式。如下所示：

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}

Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

console.log(person1.sayName === person2.sayName); // true
```

这里 person1 和 person2 都有名为 sayName() 的方法，这个方法指向是同一个 Function 实例。

**优点**

- 创建对象方便。
- 构造函数封装了创建特定对象的过程，解决了创建多个特定对象需要编写重复代码的问题。
- 特定对象有标识，创建的对象不仅是 Object 的实例，同时也是自己构造函数的实例。
- 实例对象之间即可以共享数据，也可以独立数据。
