import{_ as s,c as e,o as n,b as a}from"./app.bdb2749c.js";const f=JSON.parse('{"title":"\u526F\u4F5C\u7528\u51FD\u6570","description":"","frontmatter":{},"headers":[],"relativePath":"vue3/reactive-system/side-effect-function.md"}'),o={name:"vue3/reactive-system/side-effect-function.md"},t=a(`<h1 id="\u526F\u4F5C\u7528\u51FD\u6570" tabindex="-1">\u526F\u4F5C\u7528\u51FD\u6570 <a class="header-anchor" href="#\u526F\u4F5C\u7528\u51FD\u6570" aria-hidden="true">#</a></h1><p><strong>\u51FD\u6570\u526F\u4F5C\u7528 (side effect of function)</strong> \u6307\u7684\u662F\u51FD\u6570\u5185\u90E8\u4E0E\u5916\u90E8\u4E92\u52A8\uFF0C\u4ECE\u800C\u4E00\u5B9A\u7A0B\u5EA6\u6539\u53D8\u4E86\u7CFB\u7EDF\u73AF\u5883\u3002\u4F8B\u5982\uFF1A</p><ul><li>\u8BFB\u53D6\u5916\u90E8\u6570\u636E</li><li>\u4FEE\u6539\u5916\u90E8\u6570\u636E</li></ul><p>\u4F1A\u4EA7\u751F\u526F\u4F5C\u7528\u7684\u51FD\u6570\u6211\u4EEC\u79F0\u4E3A<strong>\u526F\u4F5C\u7528\u51FD\u6570</strong>\u3002\u4F8B\u5982\uFF1A</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">effect</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">document</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">body</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">innerText</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hello vue3</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u5982\u4E0A\u9762\u7684\u4EE3\u7801\u6240\u793A\uFF0Ceffect \u51FD\u6570\u4FEE\u6539\u5916\u90E8\u6570\u636E <code>document.body.innerText</code>\uFF0C\u6240\u4EE5\u5B83\u662F\u4E00\u4E2A\u526F\u4F5C\u7528\u51FD\u6570\u3002</p>`,6),p=[t];function l(c,r,i,d,y,_){return n(),e("div",null,p)}const F=s(o,[["render",l]]);export{f as __pageData,F as default};
