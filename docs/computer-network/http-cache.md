# 缓存

在网络中，客户端常常会多次请求同一个资源，这是正常的情况，但是同一个资源在网络中一遍遍地传输，不仅消耗宝贵的网络资源，还加重了对服务器的负载。

为了解决上述问题，我们通常会对一些资源进行缓存，这样做有以下优点：

- 缓存减少了冗余的资源传输，节省了宝贵的网络资源。
- 缓存缓解了网络瓶颈的问题。不仅节省网络带宽，还能够更快地获得资源。
- 缓存降低了对服务器的要求。服务器可以更快地响应，甚至可以不用访问服务器。
- 缓存降低了距离时延，因为从较远的地方加载资源会更慢一些。

## HTTP 缓存

HTTP 有一些简单的机制可以保持客户端已缓存资源与服务器资源之间的一致性。HTTP 将这些简单的机制称为文档过期 (document expiration) 和服务器再验证 (server revalidation)。

### 文档过期

通过特殊的 HTTP Cache-Control 通用首部或 Expires 响应首部，服务器可以向资源附加了一个 "过期日期"，说明了在多长时间内可以将资源视为新鲜的。

- 在缓存资源过期之前，客户端缓存可以以任意频率使用它，而不需要访问服务器——当然，除非客户端请求中包含有阻止提供已缓存/未验证文档的首部。
- 在缓存资源过期之后，客户端缓存就必须与服务器进行再验证，询问资源是否被修改过，如果被修改过，就要获取一份新鲜的资源。

#### Cache-Control

Cache-Control 通用首部，可以指定指令来实现缓存机制，多种指令以逗号分隔。

##### 指令

客户端可以在请求中使用的标准 Cache-Control 指令：

```
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```

服务器可以在响应中使用的标准 Cache-Control 指令：

```
Cache-control: must-revalidate
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: public
Cache-control: private
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-control: s-maxage=<seconds>
```

Cache-Control 指令按功能可分为以下几种：

**可缓存性指令**

1. **public**
   - 请求首部：不可用。
   - 响应首部：表示响应可以被任何对象缓存。比如：客户端、代理服务器等。

```
Cache-Control: public
```

2. **private**
   - 请求首部：不可用。
   - 响应首部：表示响应只能被请求的客户端缓存，不能作为共享缓存，比如：代理服务器等。

```
Cache-Control: private
```

3. **no-store**
   - 请求首部：同下。
   - 响应首部：表示禁止响应存储在客户端缓存中。

```
Cache-Control: no-store
```

4. **no-cache**
   - 请求首部：同下。
   - 响应首部：表示允许响应存储在客户端缓存中，但是在与服务器进行新鲜度再验证之前，缓存不能将其提供给客户端使用。

```
Cache-Control: no-cache
```

**到期指令**

1. **max-age**
   - 请求首部：同下。
   - 响应首部：表示从服务器传输资源之时起，可以认为此资源处于新鲜状态的秒数。

```
Cache-Control: max-age=3600
```

**重新验证和重新加载指令**

1. **must-revalidate**
   - 请求首部：不可用。
   - 响应首部：表示一旦资源过期 (比如已经超过 `max-age`)，在与服务器进行新鲜度再验证之前，缓存不能将其提供给客户端使用。

```
Cache-Control: must-revalidate
```

##### 示例

**禁止缓存**

发送如下响应首部可以禁止缓存。

```
Cache-Control: no-store
```

**缓存静态资源**

对于不经常变化的资源，通常可以在响应中添加表示积极缓存的响应首部。

```
Cache-Control: public, max-age=31536000
```

**服务器再验证**

指定 `no-cache` 或 `max-age=0, must-revalidate` 表示客户端可以缓存资源，但是每次使用缓存资源前都必须请求服务器再验证其有效性。

```
Cache-Control: no-cache
Cache-Control: max-age=0, must-revalidate
```

#### Expires

Expires 响应首部，它指定的是实际的过期日期，而不是秒数。

```
Expires: Fri, 30 Dec 2022 13:40:34 GMT
```

#### Expires 和 Cache-Control: max-age

不推荐使用 Expires 响应首部。

HTTP/1.0+ Expires 和 HTTP/1.1 `Cache-Control: max-age` 都可以用来指定过期日期，它们所做的事情本质上是一样的。但由于 `Cache-Control: max-age` 使用的是相对时间而不是绝对日期，所以我们更倾向于使用比较新的 `Cache-Control: max-age`。因为很多服务器的时钟都不同步，或者不正确，所以最好还是用剩余秒数，而不是绝对时间来表示过期时间。

### 服务器再验证

HTTP 的条件方法可以高效地实现再验证。客户端可以向服务器发送一个 "条件 GET" 请求，服务器只有在资源与客户端缓存的资源不同时，才会回送资源主体。向 GET 请求报文中添加一些特殊的条件首部，就可以发起 "条件 GET" 请求。

#### If-Modified-Since 和 Last-Modified

If-Modified-Since 请求首部可以与 Last-Modified 响应首部配合工作。服务器会将资源的最后修改日期附加到 Last-Modified 响应首部。当缓存要对已缓存资源进行再验证时，就会包含一个 If-Modified-Since 请求首部，其中携带着 Last-Modified 的日期：

```
If-Modified-Since: <cached last-modified date>
```

- 如果自指定日期后，资源被修改过，If-Modified-Since 条件就为真，服务器会向客户端返回一个 200 OK 响应，并携带新首部和新资源主体返回给客户端缓存，新首部除了其他信息之外，还包含了一个新的最后修改日期 Last-Modified。
- 如果自指定日期后，资源没被修改过，If-Modified-Since 条件就为假，服务器会向客户端返回一个 304 Not Modified 响应，不会返回资源主体，只会返回那些需要在缓存更新的首部。比如，Content-Type 首部通常不会被修改，所以通常不需要发送。

#### If-None-Match 和 ETag

> 有些情况只使用 If-Modified-Since 进行再验证，可能不太理想：
>
> - 有些资源可能会被周期性地重写 (比如，从一个后台进程中写入)，但实际包含的数据常常是一样的。尽管内容没有变化，但修改日期会发生变化。
> - 有些资源可能被修改了，但所做修改并不重要，不需要让世界范围内的缓存都重装数据 (比如对拼写或注释的修改)。
> - 有些服务器提供的资源会在亚秒间隙发生变化 (比如，实时监视器)，对这些服务器来说，以秒为粒度的修改日期可能就不够用了。
>
> 为了应对这些情况，HTTP 提供了实体标签 (ETag) 的 "版本标识符"。ETag 是资源的任意标签。它们可能包含了资源的序列号或版本名，或者是资源内容的校验和及其他指纹信息。当发布者对资源进行修改时，可以修改资源的实体标签来说明这是个新的版本。为了方便维护，可以使用摘要算法来生成 ETag。

If-None-Match 请求首部可以与 ETag 响应首部配合工作。服务器会将资源的实体标签附加到 ETag 响应首部。当缓存要对已缓存资源进行再验证时，就会包含一个 If-None-Match 请求首部，其中携带着 ETag 的实体标签：

```
If-None-Match："vx6BOB+qV2UqHeFmm5P39w=="
```

- 如果 If-None-Match 请求首部和服务器资源的 ETag 不同，表示资源有更新过，If-None-Match 条件就为真，服务器会向客户端返回一个 200 OK 响应，并携带新首部和新资源主体返回给客户端缓存，新首部除了其他信息之外，还包含了一个新的实体标签 ETag。
- 如果 If-None-Match 请求首部和服务器资源的 ETag 相同，表示资源没有更新过，If-None-Match 条件就为假，服务器会向客户端返回一个 304 Not Modified 响应，不会返回资源主体，只会返回那些需要在缓存更新的首部。比如，Content-Type 首部通常不会被修改，所以通常不需要发送。

#### ETag 和 Last-Modified

服务器响应：

- 如果服务器只回送 Last-Modified 响应首部，客户端就应该使用 If-Modified-Since 再验证。

- 如果服务器只回送 ETag 响应首部，客户端就应该使用 If-None-Match 再验证。

- 如果服务器同时回送了 ETag 和 Last-Modified 响应首部，客户端就应该使用 If-None-Match 和 If-Modified-Since 再验证。

服务器接收：

- 如果服务器只收到 If-Modified-Since 条件请求首部，服务器就应该使用 If-Modified-Since 和资源的 Last-Modified 进行验证。
- 如果服务器只收到 If-None-Match 条件请求首部，服务器就应该使用 If-None-Match 和资源的 ETag 进行验证。

- 如果服务器同时收到 If-None-Match 和 If-Modified-Since 条件请求首部，If-Modified-Since 会被忽略掉，除非服务器不支持 If-None-Match。

## 示例

### 使用 Expires

```js
/**
 * 缓存方案: 使用 Expires 响应首部
 * 使用效果: Expires 过期之后，客户端会请求服务器再验证 (不推荐使用，可以使用 HTTP/1.1 Cache-Control: max-age 实现相同效果)
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useExpires = async function (req, res, resourcePath) {
  res.setHeader("Expires", new Date(Date.now() + 10 * 1000).toUTCString());
  res.setHeader("Content-Type", mime.getType(resourcePath));
  res.end(fs.readFileSync(resourcePath));
};
```

### 使用 Cache-Control: no-store

```js
/**
 * 缓存方案: 使用 Cache-Control: no-store 响应首部
 * 使用效果：禁止缓存，客户端每次都会请求服务器
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlNoStore = async function (req, res, resourcePath) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", mime.getType(resourcePath));
  res.end(fs.readFileSync(resourcePath));
};
```

### 使用 Cache-Control: no-cache

```js
/**
 * 缓存方案: 使用 Cache-Control: no-cache 响应首部
 * 使用效果：客户端会缓存，但每次都需要请求服务器再验证 (一般会搭配条件请求首部进行再验证)
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlNoCache = async function (req, res, resourcePath) {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", mime.getType(resourcePath));
  res.end(fs.readFileSync(resourcePath));
};
```

### 使用 Cache-Control: max-age

```js
/**
 * 缓存方案: 使用 Cache-Control: max-age 响应首部
 * 使用效果: max-age 过期之后，客户端会请求服务器再验证 (一般会搭配条件请求首部进行再验证)
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlMaxAge = async function (req, res, resourcePath) {
  res.setHeader("Cache-Control", "max-age=10");
  res.setHeader("Content-Type", mime.getType(resourcePath));
  res.end(fs.readFileSync(resourcePath));
};
```

### 使用 Expires 和 Cache-Control: max-age

```js
/**
 * 缓存方案: 使用 HTTP/1.0 Expires 和 HTTP/1.1 Cache-Control: max-age 响应首部
 * 使用效果: 在支持 HTTP/1.1 的客户端中，Cache-Control 优先级更高
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useExpiresAndCacheControlMaxAge = async function (
  req,
  res,
  resourcePath
) {
  res.setHeader("Expires", new Date(Date.now() + 5 * 1000).toUTCString());
  res.setHeader("Cache-Control", "max-age=60");
  res.setHeader("Content-Type", mime.getType(resourcePath));
  res.end(fs.readFileSync(resourcePath));
};
```

### 使用 Cache-Control: max-age, must-revalidate 响应首部

```js
/**
 * 缓存方案: 使用 Cache-Control: max-age, must-revalidate 响应首部
 * 使用效果: max-age 过期之后，客户端会请求服务器再验证 (一般会搭配条件请求首部进行再验证)
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlMaxAgeMustRevalidate = async function (
  req,
  res,
  resourcePath
) {
  res.setHeader("Cache-Control", "max-age=10, must-revalidate");
  res.setHeader("Content-Type", mime.getType(resourcePath));
  res.end(fs.readFileSync(resourcePath));
};
```

### 使用 Cache-Control: max-age 和 Last-Modified

```js
/**
 * 缓存方案: 使用 Cache-Control: max-age 和 Last-Modified 响应首部
 * 使用效果: max-age 过期之后，客户端会请求服务器再验证，通过 If-Modified-Since 条件请求首部进行再验证
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlMaxAgeAndLastModified = async function (
  req,
  res,
  resourcePath
) {
  // 客户端缓存资源的最后修改时间
  const ifModifiedSince = req.headers["if-modified-since"];
  // 服务器资源的最后修改时间
  const lastModified = fs.statSync(resourcePath).mtime.toUTCString();
  const isFirstRequestOrModifiedSince =
    ifModifiedSince === undefined || ifModifiedSince !== lastModified;

  if (isFirstRequestOrModifiedSince) {
    res.statusCode = 200;
    // 10 秒过期之后，客户端会请求服务器再验证
    res.setHeader("Cache-Control", "max-age=10");
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("Content-Type", mime.getType(resourcePath));
  } else {
    res.statusCode = 304;
  }

  isFirstRequestOrModifiedSince
    ? res.end(fs.readFileSync(resourcePath))
    : res.end();
};
```

### 使用 Cache-Control: no-cache 和 Last-Modified

```js
/**
 * 缓存方案: 使用 Cache-Control: no-cache 和 Last-Modified 响应首部
 * 使用效果：客户端会缓存，但每次都需要请求服务器再验证，通过 If-Modified-Since 条件请求首部进行再验证
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlNoCacheAndLastModified = async function (
  req,
  res,
  resourcePath
) {
  // 客户端缓存资源的最后修改时间
  const ifModifiedSince = req.headers["if-modified-since"];
  // 服务器资源的最后修改时间
  const lastModified = fs.statSync(resourcePath).mtime.toUTCString();
  const isFirstRequestOrModifiedSince =
    ifModifiedSince === undefined || ifModifiedSince !== lastModified;

  if (isFirstRequestOrModifiedSince) {
    res.statusCode = 200;
    // 客户端会缓存，但每次都需要请求服务器再验证
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("Content-Type", mime.getType(resourcePath));
  } else {
    res.statusCode = 304;
  }

  isFirstRequestOrModifiedSince
    ? res.end(fs.readFileSync(resourcePath))
    : res.end();
};
```

### 使用 Cache-Control: max-age 和 ETag

```js
/**
 * 缓存方案: 使用 Cache-Control: max-age 和 ETag 响应首部
 * 使用效果: max-age 过期之后，客户端会请求服务器再验证，通过 If-None-Match 条件请求首部进行再验证
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlMaxAgeAndETag = async function (req, res, resourcePath) {
  // 客户端缓存资源的实体标签
  const ifNoneMatch = req.headers["if-none-match"];
  const content = fs.readFileSync(resourcePath);
  // 服务器资源的实体标签
  const eTag = generateMD5Base64(content);
  const isFirstRequestOrNoneMatch =
    ifNoneMatch === undefined || ifNoneMatch !== eTag;

  if (isFirstRequestOrNoneMatch) {
    res.statusCode = 200;
    // 10 秒过期之后，客户端会请求服务器再验证
    res.setHeader("Cache-Control", "max-age=10");
    res.setHeader("ETag", eTag);
    res.setHeader("Content-Type", mime.getType(resourcePath));
  } else {
    res.statusCode = 304;
  }

  isFirstRequestOrNoneMatch ? res.end(content) : res.end();
};
```

### 使用 Cache-Control: no-cache 和 ETag

```js
/**
 * 缓存方案: 使用 Cache-Control: no-cache 和 ETag 响应首部
 * 使用效果：客户端会缓存，但每次都需要请求服务器再验证，通过 If-None-Match 条件请求首部进行再验证
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlNoCacheAndETag = async function (
  req,
  res,
  resourcePath
) {
  // 客户端缓存资源的实体标签
  const ifNoneMatch = req.headers["if-none-match"];
  const content = fs.readFileSync(resourcePath);
  // 服务器资源的实体标签
  const eTag = generateMD5Base64(content);
  const isFirstRequestOrNoneMatch =
    ifNoneMatch === undefined || ifNoneMatch !== eTag;

  if (isFirstRequestOrNoneMatch) {
    res.statusCode = 200;
    // 每次都会请求服务器，进行再验证
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("ETag", eTag);
    res.setHeader("Content-Type", mime.getType(resourcePath));
  } else {
    res.statusCode = 304;
  }

  isFirstRequestOrNoneMatch ? res.end(content) : res.end();
};
```

### 使用 Cache-Control: max-age 和 Last-Modified 和 ETag

```js
/**
 * 缓存方案: 使用 Cache-Control: max-age 和 Last-Modified 和 ETag 响应首部
 * 使用效果: max-age 过期之后，客户端会请求服务器再验证，通过 If-Modified-Since 和 If-None-Match 条件请求首部进行再验证
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlMaxAgeAndLastModifiedAndETag = async function (
  req,
  res,
  resourcePath
) {
  // 客户端缓存资源的最后修改时间
  const ifModifiedSince = req.headers["if-modified-since"];
  // 服务器资源的最后修改时间
  const lastModified = fs.statSync(resourcePath).mtime.toUTCString();

  // 客户端缓存资源的实体标签
  const ifNoneMatch = req.headers["if-none-match"];
  const content = fs.readFileSync(resourcePath);
  // 服务器资源的实体标签
  const eTag = generateMD5Base64(content);

  // 默认值第一次请求资源
  let isFirstRequestOrModifiedSinceOrNoneMatch = true;
  // 如果携带条件请求首部 If-None-Match，就使用 If-None-Match 再验证
  if (ifNoneMatch !== undefined) {
    isFirstRequestOrModifiedSinceOrNoneMatch = ifNoneMatch !== eTag;
    // 否则，如果携带条件请求首部 If-Modified-Since，就使用 If-Modified-Since 再验证
  } else if (ifModifiedSince !== undefined) {
    isFirstRequestOrModifiedSinceOrNoneMatch = ifModifiedSince !== lastModified;
  }

  if (isFirstRequestOrModifiedSinceOrNoneMatch) {
    res.statusCode = 200;
    // 10 秒过期之后，客户端会请求服务器再验证
    res.setHeader("Cache-Control", "max-age=10");
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("ETag", eTag);
    res.setHeader("Content-Type", mime.getType(resourcePath));
  } else {
    res.statusCode = 304;
  }

  isFirstRequestOrModifiedSinceOrNoneMatch ? res.end(content) : res.end();
};
```

### 使用 Cache-Control: no-cache 和 Last-Modified 和 ETag

```js
/**
 * 缓存方案: 使用 Cache-Control: no-cache 和 Last-Modified 和 ETag 响应首部
 * 使用效果：客户端会缓存，但每次都需要请求服务器再验证，通过 If-Modified-Since 和 If-None-Match 条件请求首部进行再验证
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { string } resourcePath
 */
exports.useCacheControlNoCacheAndLastModifiedAndETag = async function (
  req,
  res,
  resourcePath
) {
  // 客户端缓存资源的最后修改时间
  const ifModifiedSince = req.headers["if-modified-since"];
  // 服务器资源的最后修改时间
  const lastModified = fs.statSync(resourcePath).mtime.toUTCString();

  // 客户端缓存资源的实体标签
  const ifNoneMatch = req.headers["if-none-match"];
  const content = fs.readFileSync(resourcePath);
  // 服务器资源的实体标签
  const eTag = generateMD5Base64(content);

  // 默认值第一次请求资源
  let isFirstRequestOrModifiedSinceOrNoneMatch = true;
  // 如果携带条件请求首部 If-None-Match，就使用 If-None-Match 再验证
  if (ifNoneMatch !== undefined) {
    isFirstRequestOrModifiedSinceOrNoneMatch = ifNoneMatch !== eTag;
    // 否则，如果携带条件请求首部 If-Modified-Since，就使用 If-Modified-Since 再验证
  } else if (ifModifiedSince !== undefined) {
    isFirstRequestOrModifiedSinceOrNoneMatch = ifModifiedSince !== lastModified;
  }

  if (isFirstRequestOrModifiedSinceOrNoneMatch) {
    res.statusCode = 200;
    // 每次都会请求服务器，进行再验证
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("ETag", eTag);
    res.setHeader("Content-Type", mime.getType(resourcePath));
  } else {
    res.statusCode = 304;
  }

  isFirstRequestOrModifiedSinceOrNoneMatch ? res.end(content) : res.end();
};
```

## 链接

- [HTTP 缓存演示](https://github.com/CokeBeliever/http-demo/tree/http-cache)
