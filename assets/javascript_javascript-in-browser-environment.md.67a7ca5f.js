import{_ as a,c as e,o as r,b as t}from"./app.ae0ff176.js";const m=JSON.parse('{"title":"\u5728\u6D4F\u89C8\u5668\u73AF\u5883\u4E2D\u7684 JavaScript","description":"","frontmatter":{},"headers":[{"level":2,"title":"ECMAScript","slug":"ecmascript","link":"#ecmascript","children":[]},{"level":2,"title":"DOM","slug":"dom","link":"#dom","children":[]},{"level":2,"title":"BOM","slug":"bom","link":"#bom","children":[]}],"relativePath":"javascript/javascript-in-browser-environment.md"}'),i={name:"javascript/javascript-in-browser-environment.md"},c=t('<h1 id="\u5728\u6D4F\u89C8\u5668\u73AF\u5883\u4E2D\u7684-javascript" tabindex="-1">\u5728\u6D4F\u89C8\u5668\u73AF\u5883\u4E2D\u7684 JavaScript <a class="header-anchor" href="#\u5728\u6D4F\u89C8\u5668\u73AF\u5883\u4E2D\u7684-javascript" aria-hidden="true">#</a></h1><p>\u5728\u6D4F\u89C8\u5668\u73AF\u5883\u4E2D\uFF0C\u5B8C\u6574\u7684 JavaScript \u5B9E\u73B0\u5305\u542B\u4EE5\u4E0B\u51E0\u4E2A\u90E8\u5206\uFF1A</p><ul><li>\u6838\u5FC3 (ECMAScript)\uFF1A\u7531 ECMA-262 \u5B9A\u4E49\u5E76\u63D0\u4F9B\u6838\u5FC3\u529F\u80FD\u3002</li><li>\u6587\u6863\u5BF9\u8C61\u6A21\u578B (DOM)\uFF1A\u63D0\u4F9B\u4E0E\u9875\u9762\u5185\u5BB9\u4EA4\u4E92\u7684\u65B9\u6CD5\u548C\u63A5\u53E3\u3002</li><li>\u6D4F\u89C8\u5668\u5BF9\u8C61\u6A21\u578B (BOM)\uFF1A\u63D0\u4F9B\u4E0E\u6D4F\u89C8\u5668\u4EA4\u4E92\u7684\u65B9\u6CD5\u548C\u63A5\u53E3\u3002</li></ul><h2 id="ecmascript" tabindex="-1">ECMAScript <a class="header-anchor" href="#ecmascript" aria-hidden="true">#</a></h2><p>ECMAScript \u53EA\u662F\u5BF9\u5B9E\u73B0\u8FD9\u4E2A\u89C4\u8303\u63CF\u8FF0\u7684\u6240\u6709\u65B9\u9762\u7684\u4E00\u95E8\u8BED\u8A00\u7684\u79F0\u547C\u3002\u6BD4\u5982 JavaScript \u5B9E\u73B0\u4E86 ECMAScript\u3002</p><p>ECMAScript \u5E76\u4E0D\u5C40\u9650\u4E8E\u6D4F\u89C8\u5668\uFF0C\u6D4F\u89C8\u5668\u53EA\u662F ECMAScript \u5B9E\u73B0\u53EF\u80FD\u5B58\u5728\u7684\u4E00\u79CD\u5BBF\u4E3B\u73AF\u5883 (host environment)\u3002\u5BBF\u4E3B\u73AF\u5883\u63D0\u4F9B ECMAScript \u7684\u57FA\u51C6\u5B9E\u73B0\u548C\u4E0E\u73AF\u5883\u81EA\u8EAB\u4EA4\u4E92\u5FC5\u9700\u7684\u6269\u5C55\u3002\u6269\u5C55 (\u6BD4\u5982 DOM) \u4F7F\u7528 ECMAScript \u6838\u5FC3\u7C7B\u578B\u548C\u8BED\u6CD5\uFF0C\u63D0\u4F9B\u7279\u5B9A\u4E8E\u73AF\u5883\u7684\u989D\u5916\u529F\u80FD\u3002\u5176\u4ED6\u5BBF\u4E3B\u73AF\u5883\u8FD8\u6709\u670D\u52A1\u5668\u7AEF JavaScript \u5E73\u53F0 Node.js\u3002</p><h2 id="dom" tabindex="-1">DOM <a class="header-anchor" href="#dom" aria-hidden="true">#</a></h2><p>\u6587\u6863\u5BF9\u8C61\u6A21\u578B (DOM\uFF0CDocument Object Model) \u662F\u4E00\u4E2A\u5E94\u7528\u7F16\u7A0B\u63A5\u53E3 (API)\uFF0C\u7528\u4E8E\u652F\u6301\u8BBF\u95EE\u548C\u64CD\u4F5C\u9875\u9762\u5185\u5BB9\uFF0C\u5373\u5728 HTML \u4E2D\u4F7F\u7528\u6269\u5C55\u7684 XML\u3002DOM \u5C06\u6574\u4E2A\u9875\u9762\u62BD\u8C61\u4E3A\u4E00\u7EC4\u5206\u5C42\u8282\u70B9\u3002HTML \u6216 XML \u9875\u9762\u7684\u6BCF\u4E2A\u7EC4\u6210\u90E8\u5206\u90FD\u662F\u4E00\u79CD\u8282\u70B9\uFF0C\u5305\u542B\u4E0D\u540C\u7684\u6570\u636E\u3002</p><p>\u4F7F\u7528 DOM API\uFF0C\u53EF\u4EE5\u8F7B\u677E\u5730\u5220\u9664\u3001\u6DFB\u52A0\u3001\u66FF\u6362\u3001\u4FEE\u6539\u8282\u70B9\u3002</p><h2 id="bom" tabindex="-1">BOM <a class="header-anchor" href="#bom" aria-hidden="true">#</a></h2><p>\u6D4F\u89C8\u5668\u5BF9\u8C61\u6A21\u578B (BOM) \u662F\u4E00\u4E2A\u5E94\u7528\u7F16\u7A0B\u63A5\u53E3 (API)\uFF0C\u7528\u4E8E\u652F\u6301\u8BBF\u95EE\u548C\u64CD\u4F5C\u6D4F\u89C8\u5668\u7684\u7A97\u53E3\uFF0C\u4EBA\u4EEC\u901A\u5E38\u4F1A\u628A\u4EFB\u4F55\u7279\u5B9A\u4E8E\u6D4F\u89C8\u5668\u7684\u6269\u5C55\u90FD\u5F52\u5728 BOM \u7684\u8303\u7574\u5185\u3002</p><p>\u4F7F\u7528 BOM API\uFF0C\u5F00\u53D1\u8005\u53EF\u4EE5\u64CD\u63A7\u6D4F\u89C8\u5668\u663E\u793A\u9875\u9762\u4E4B\u5916\u7684\u90E8\u5206\u3002\u800C BOM \u771F\u6B63\u72EC\u4E00\u65E0\u4E8C\u7684\u5730\u65B9\uFF0C\u5F53\u7136\u4E5F\u662F\u95EE\u9898\u6700\u591A\u7684\u5730\u65B9\uFF0C\u5C31\u662F\u5B83\u662F\u552F\u4E00\u4E00\u4E2A\u6CA1\u6709\u76F8\u5173\u6807\u51C6\u7684 JavaScript \u5B9E\u73B0\u3002HTML5 \u6539\u53D8\u4E86\u8FD9\u4E2A\u5C40\u9762\uFF0C\u8FD9\u4E2A\u7248\u672C\u7684 HTML \u4EE5\u6B63\u5F0F\u89C4\u8303\u7684\u5F62\u5F0F\u6DB5\u76D6\u4E86\u5C3D\u53EF\u80FD\u591A\u7684 BOM \u7279\u6027\u3002</p>',12),n=[c];function p(s,o,d,l,h,M){return r(),e("div",null,n)}const v=a(i,[["render",p]]);export{m as __pageData,v as default};
