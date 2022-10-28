import{_ as e,c as a,o as t,a as n}from"./app.f6bf7dac.js";const f=JSON.parse('{"title":"\u6C47\u7F16\u7A0B\u5E8F\u57FA\u672C\u539F\u7406","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u6C47\u7F16\u8BED\u8A00","slug":"\u6C47\u7F16\u8BED\u8A00","link":"#\u6C47\u7F16\u8BED\u8A00","children":[]},{"level":2,"title":"\u6C47\u7F16\u7A0B\u5E8F","slug":"\u6C47\u7F16\u7A0B\u5E8F","link":"#\u6C47\u7F16\u7A0B\u5E8F","children":[]}],"relativePath":"language/fundamentals-of-assembler.md"}'),r={name:"language/fundamentals-of-assembler.md"},s=n('<h1 id="\u6C47\u7F16\u7A0B\u5E8F\u57FA\u672C\u539F\u7406" tabindex="-1">\u6C47\u7F16\u7A0B\u5E8F\u57FA\u672C\u539F\u7406 <a class="header-anchor" href="#\u6C47\u7F16\u7A0B\u5E8F\u57FA\u672C\u539F\u7406" aria-hidden="true">#</a></h1><h2 id="\u6C47\u7F16\u8BED\u8A00" tabindex="-1">\u6C47\u7F16\u8BED\u8A00 <a class="header-anchor" href="#\u6C47\u7F16\u8BED\u8A00" aria-hidden="true">#</a></h2><p>\u6C47\u7F16\u8BED\u8A00\u662F\u4E3A\u7279\u5B9A\u7684\u8BA1\u7B97\u673A\u8BBE\u8BA1\u7684\u9762\u5411\u673A\u5668\u7684\u7B26\u53F7\u5316\u7684\u7A0B\u5E8F\u8BBE\u8BA1\u8BED\u8A00\u3002\u7528\u6C47\u7F16\u8BED\u8A00\u7F16\u5199\u7684\u7A0B\u5E8F\u79F0\u4E3A\u6C47\u7F16\u8BED\u8A00\u6E90\u7A0B\u5E8F\u3002</p><p>\u56E0\u4E3A\u8BA1\u7B97\u673A\u4E0D\u80FD\u76F4\u63A5\u8BC6\u522B\u548C\u8FD0\u884C\u6C47\u7F16\u8BED\u8A00\u6E90\u7A0B\u5E8F\uFF0C\u6240\u4EE5\u8981\u7528\u4E13\u95E8\u7684\u7FFB\u8BD1\u7A0B\u5E8F\u2014\u2014<strong>\u6C47\u7F16\u7A0B\u5E8F</strong>\u8FDB\u884C\u7FFB\u8BD1\u3002\u7528\u6C47\u7F16\u8BED\u8A00\u7F16\u5199\u7A0B\u5E8F\u8981\u9075\u5FAA\u6240\u7528\u8BED\u8A00\u7684\u89C4\u8303\u548C\u7EA6\u5B9A\u3002</p><p>\u6C47\u7F16\u8BED\u8A00\u6E90\u7A0B\u5E8F\u7531\u82E5\u5E72\u6761\u8BED\u53E5\u7EC4\u6210\uFF0C\u5176\u4E2D\u53EF\u4EE5\u6709\u4E09\u7C7B\u8BED\u53E5\uFF1A<strong>\u6307\u4EE4\u8BED\u53E5</strong>\u3001<strong>\u4F2A\u6307\u4EE4\u8BED\u53E5</strong>\u548C<strong>\u5B8F\u6307\u4EE4\u8BED\u53E5</strong>\u3002</p><ul><li><p>\u6307\u4EE4\u8BED\u53E5</p><p>\u6307\u4EE4\u8BED\u53E5\u53C8\u79F0\u4E3A\u673A\u5668\u6307\u4EE4\u8BED\u53E5\uFF0C\u5C06\u5176\u6C47\u7F16\u540E\u80FD\u4EA7\u751F\u76F8\u5E94\u7684\u673A\u5668\u4EE3\u7801\uFF0C\u8FD9\u4E9B\u4EE3\u7801\u80FD\u88AB CPU \u76F4\u63A5\u8BC6\u522B\u5E76\u6267\u884C\u76F8\u5E94\u7684\u64CD\u4F5C\u3002\u57FA\u672C\u7684\u6307\u4EE4\u6709 <code>ADD</code>\u3001<code>SUB</code> \u548C <code>AND</code> \u7B49\uFF0C\u4E66\u5199\u6307\u4EE4\u8BED\u53E5\u65F6\u5FC5\u987B\u9075\u5FAA\u6307\u4EE4\u7684\u683C\u5F0F\u8981\u6C42\u3002</p><p>\u6307\u4EE4\u8BED\u53E5\u53EF\u5206\u4E3A\u4F20\u9001\u6307\u4EE4\u3001\u7B97\u672F\u8FD0\u7B97\u6307\u4EE4\u3001\u903B\u8F91\u8FD0\u7B97\u6307\u4EE4\u3001\u79FB\u4F4D\u6307\u4EE4\u3001\u8F6C\u79FB\u6307\u4EE4\u548C\u5904\u7406\u673A\u63A7\u5236\u6307\u4EE4\u7B49\u7C7B\u578B\u3002</p></li><li><p>\u4F2A\u6307\u4EE4\u8BED\u53E5</p><p>\u4F2A\u6307\u4EE4\u8BED\u53E5\u6307\u793A\u6C47\u7F16\u7A0B\u5E8F\u5728\u6C47\u7F16\u6E90\u7A0B\u5E8F\u65F6\u5B8C\u6210\u67D0\u4E9B\u5DE5\u4F5C\uFF0C\u4F8B\u5982\u4E3A\u53D8\u91CF\u5206\u914D\u5B58\u50A8\u5355\u5143\u5730\u5740\uFF0C\u7ED9\u67D0\u4E2A\u7B26\u53F7\u8D4B\u4E00\u4E2A\u503C\u7B49\u3002</p><p>\u4F2A\u6307\u4EE4\u8BED\u53E5\u4E0E\u6307\u4EE4\u8BED\u53E5\u7684\u533A\u522B\u662F\uFF1A</p><ul><li>\u4F2A\u6307\u4EE4\u8BED\u53E5\u7ECF\u6C47\u7F16\u540E\u4E0D\u4EA7\u751F\u673A\u5668\u4EE3\u7801\uFF0C\u800C\u6307\u4EE4\u8BED\u53E5\u7ECF\u6C47\u7F16\u540E\u8981\u4EA7\u751F\u76F8\u5E94\u7684\u673A\u5668\u4EE3\u7801\u3002</li><li>\u4F2A\u6307\u4EE4\u8BED\u53E5\u6240\u6307\u793A\u7684\u64CD\u4F5C\u662F\u5728\u6E90\u7A0B\u5E8F\u88AB\u6C47\u7F16\u65F6\u5B8C\u6210\u7684\uFF0C\u800C\u6307\u4EE4\u8BED\u53E5\u7684\u64CD\u4F5C\u5FC5\u987B\u5728\u7A0B\u5E8F\u8FD0\u884C\u65F6\u5B8C\u6210\u3002</li></ul></li><li><p>\u5B8F\u6307\u4EE4\u8BED\u53E5</p><p>\u5728\u6C47\u7F16\u8BED\u8A00\u4E2D\uFF0C\u8FD8\u5141\u8BB8\u7528\u6237\u5C06\u591A\u6B21\u91CD\u590D\u4F7F\u7528\u7684\u7A0B\u5E8F\u6BB5\u5B9A\u4E49\u4E3A\u5B8F\uFF0C\u5B8F\u6307\u4EE4\u8BED\u53E5\u5C31\u662F\u5BF9\u5B8F\u7684\u4F7F\u7528\u3002</p><p>\u5B8F\u7684\u5B9A\u4E49\u5FC5\u987B\u6309\u7167\u76F8\u5E94\u7684\u89C4\u5B9A\u8FDB\u884C\uFF0C\u6BCF\u4E2A\u5B8F\u90FD\u6709\u76F8\u5E94\u7684\u5B8F\u540D\u3002\u5728\u7A0B\u5E8F\u7684\u4EFB\u610F\u4F4D\u7F6E\uFF0C\u82E5\u9700\u8981\u4F7F\u7528\u8FD9\u6BB5\u7A0B\u5E8F\uFF0C\u53EA\u8981\u5728\u76F8\u5E94\u7684\u4F4D\u7F6E\u4F7F\u7528\u5B8F\u540D\uFF0C\u5373\u76F8\u5F53\u4E8E\u4F7F\u7528\u4E86\u8FD9\u6BB5\u7A0B\u5E8F\u3002</p></li></ul><h2 id="\u6C47\u7F16\u7A0B\u5E8F" tabindex="-1">\u6C47\u7F16\u7A0B\u5E8F <a class="header-anchor" href="#\u6C47\u7F16\u7A0B\u5E8F" aria-hidden="true">#</a></h2><p>\u6C47\u7F16\u7A0B\u5E8F\u7684\u529F\u80FD\u662F\u5C06\u7528\u6C47\u7F16\u8BED\u8A00\u7F16\u5199\u7684\u6E90\u7A0B\u5E8F\u7FFB\u8BD1\u6210\u673A\u5668\u6307\u4EE4\u7A0B\u5E8F\u3002</p><p>\u6C47\u7F16\u7A0B\u5E8F\u7684\u57FA\u672C\u5DE5\u4F5C\u5305\u62EC\uFF1A\u5C06\u6BCF\u4E00\u6761\u53EF\u6267\u884C\u6C47\u7F16\u8BED\u53E5\u8F6C\u6362\u6210\u5BF9\u5E94\u7684\u673A\u5668\u6307\u4EE4\uFF1B\u5904\u7406\u6E90\u7A0B\u5E8F\u4E2D\u51FA\u73B0\u7684\u4F2A\u6307\u4EE4\u3002</p><p>\u7531\u4E8E\u6C47\u7F16\u6307\u4EE4\u4E2D\u5F62\u6210\u64CD\u4F5C\u6570\u5730\u5740\u7684\u90E8\u5206\u53EF\u80FD\u51FA\u73B0\u540E\u9762\u624D\u4F1A\u5B9A\u4E49\u7684\u7B26\u53F7\uFF0C\u6240\u4EE5\u6C47\u7F16\u7A0B\u5E8F\u4E00\u822C\u9700\u8981\u4E24\u6B21\u626B\u63CF\u6E90\u7A0B\u5E8F\u624D\u80FD\u5B8C\u6210\u7FFB\u8BD1\u8FC7\u7A0B\u3002</p>',10),l=[s];function o(p,i,d,c,_,h){return t(),a("div",null,l)}const g=e(r,[["render",o]]);export{f as __pageData,g as default};
