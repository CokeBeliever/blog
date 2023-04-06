import{_ as e,c as t,o as a,b as d}from"./app.d855798e.js";const m=JSON.parse('{"title":"\u6811","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u57FA\u672C\u6982\u5FF5","slug":"\u57FA\u672C\u6982\u5FF5","link":"#\u57FA\u672C\u6982\u5FF5","children":[]}],"relativePath":"algorithm-and-data-structure/data-structure/tree/index.md"}'),c={name:"algorithm-and-data-structure/data-structure/tree/index.md"},i=d('<h1 id="\u6811" tabindex="-1">\u6811 <a class="header-anchor" href="#\u6811" aria-hidden="true">#</a></h1><p>\u6811\u5728\u903B\u8F91\u4E0A\u662F\u6811\u72B6\u7ED3\u6784\u7684\u6570\u636E\u7ED3\u6784\uFF0C\u5728\u7269\u7406\u4E0A\u662F\u6839\u636E\u5B9E\u73B0\u7684\u65B9\u5F0F\u6240\u51B3\u5B9A\u7684\uFF0C\u4E3B\u8981\u6709\u6570\u7EC4\u5B9E\u73B0 (\u987A\u5E8F\u5B58\u50A8\u7ED3\u6784) \u548C\u94FE\u8868\u5B9E\u73B0 (\u94FE\u5F0F\u5B58\u50A8\u7ED3\u6784)\u3002</p><p>\u6811\u662F\u4E00\u79CD\u975E\u5E38\u91CD\u8981\u7684\u6570\u636E\u7ED3\u6784\uFF0C\u8BE5\u7ED3\u6784\u4E2D\u7684\u4E00\u4E2A\u7ED3\u70B9\u53EF\u4EE5\u6709\u4E00\u81F3\u591A\u4E2A\u76F4\u63A5\u540E\u7EE7\u7ED3\u70B9\uFF0C\u8BE5\u7ED3\u6784\u53EF\u4EE5\u7528\u6765\u63CF\u8FF0\u5BA2\u89C2\u4E16\u754C\u4E2D\u5E7F\u6CDB\u5B58\u5728\u7684\u5C42\u6B21\u7ED3\u6784\u5173\u7CFB\u3002</p><p>\u6811\u662F\u6709 <code>n (n&gt;=0)</code> \u4E2A\u7ED3\u70B9\u7684\u6709\u9650\u96C6\u5408\uFF0C\u5F53 <code>n=0</code> \u65F6\u79F0\u4E3A\u7A7A\u6811\u3002\u5728\u4EFB\u4E00\u975E\u7A7A\u6811 <code>(n&gt;0)</code> \u4E2D\uFF0C\u6709\u4E14\u4EC5\u6709\u4E00\u4E2A\u79F0\u4E3A\u6839\u7ED3\u70B9\uFF1B\u5176\u4F59\u7ED3\u70B9\u53EF\u5206\u4E3A <code>m(m&gt;=0)</code> \u4E2A\u4E92\u4E0D\u76F8\u4EA4\u7684\u6709\u9650\u5B50\u96C6 <code>T(1),T(2),...,T(m)</code>\uFF0C\u5176\u4E2D\uFF0C\u6BCF\u4E2A <code>T</code> \u53C8\u90FD\u662F\u4E00\u68F5\u6811\uFF0C\u5E76\u4E14\u79F0\u4E3A\u6839\u7ED3\u70B9\u7684\u5B50\u6811\u3002\u4E5F\u5C31\u662F\u4E00\u68F5\u6811\u7531\u82E5\u5E72\u68F5\u5B50\u6811\u6784\u6210\uFF0C\u800C\u5B50\u6811\u53C8\u7531\u66F4\u5C0F\u7684\u5B50\u6811\u6784\u6210\u3002</p><h2 id="\u57FA\u672C\u6982\u5FF5" tabindex="-1">\u57FA\u672C\u6982\u5FF5 <a class="header-anchor" href="#\u57FA\u672C\u6982\u5FF5" aria-hidden="true">#</a></h2><ul><li>\u53CC\u4EB2\u3001\u5B69\u5B50\u548C\u5144\u5F1F\u3002\u7ED3\u70B9\u7684\u5B50\u6811\u7684\u6839\u7ED3\u70B9\u79F0\u4E3A\u8BE5\u7ED3\u70B9\u7684\u5B69\u5B50\u7ED3\u70B9\uFF0C\u4E14\u7ED3\u70B9\u79F0\u4E3A\u8BE5\u5B69\u5B50\u7ED3\u70B9\u7684\u53CC\u4EB2\u7ED3\u70B9\uFF0C\u5177\u6709\u76F8\u540C\u53CC\u4EB2\u7684\u7ED3\u70B9\u4E92\u4E3A\u5144\u5F1F\u7ED3\u70B9\u3002</li><li>\u7ED3\u70B9\u7684\u5EA6\u3002\u4E00\u4E2A\u7ED3\u70B9\u7684\u5B50\u6811\u7684\u4E2A\u6570\u8BB0\u4E3A\u8BE5\u7ED3\u70B9\u7684\u5EA6\u3002</li><li>\u53F6\u5B50\u7ED3\u70B9\u3002\u53F6\u5B50\u7ED3\u70B9\u4E5F\u79F0\u4E3A\u7EC8\u7AEF\u7ED3\u70B9\uFF0C\u6307\u5EA6\u4E3A 0 \u7684\u7ED3\u70B9\u3002</li><li>\u5185\u90E8\u7ED3\u70B9\u3002\u5EA6\u4E0D\u4E3A 0 \u7684\u7ED3\u70B9\uFF0C\u4E5F\u79F0\u4E3A\u5206\u652F\u7ED3\u70B9\u6216\u975E\u7EC8\u7AEF\u7ED3\u70B9\u3002\u9664\u6839\u7ED3\u70B9\u4EE5\u5916\uFF0C\u5206\u652F\u7ED3\u70B9\u4E5F\u79F0\u4E3A\u5185\u90E8\u7ED3\u70B9\u3002</li><li>\u7ED3\u70B9\u7684\u5C42\u6B21\u3002\u6839\u7ED3\u70B9\u4E3A\u7B2C\u4E00\u5C42\uFF0C\u6839\u7ED3\u70B9\u7684\u5B69\u5B50\u7ED3\u70B9\u4E3A\u7B2C\u4E8C\u5C42\uFF0C\u4F9D\u6B64\u7C7B\u63A8\uFF0C\u82E5\u67D0\u7ED3\u70B9\u5728\u7B2C <code>i</code> \u5C42\uFF0C\u5219\u5176\u5B69\u5B50\u7ED3\u70B9\u5728\u7B2C <code>i+1</code> \u5C42\u3002</li><li>\u6811\u7684\u9AD8\u5EA6\u3002\u4E00\u68F5\u6811\u7684\u6700\u5927\u5C42\u6570\u8BB0\u4E3A\u6811\u7684\u9AD8\u5EA6 (\u6216\u6DF1\u5EA6)\u3002</li></ul>',6),o=[i];function r(n,l,s,_,h,u){return a(),t("div",null,o)}const T=e(c,[["render",r]]);export{m as __pageData,T as default};