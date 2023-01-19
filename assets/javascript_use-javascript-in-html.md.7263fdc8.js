import{_ as s,c as a,o as t,b as l}from"./app.3879c785.js";const g=JSON.parse('{"title":"\u5728 HTML \u4E2D\u4F7F\u7528 JavaScript","description":"","frontmatter":{},"headers":[{"level":2,"title":"<script> \u6807\u7B7E","slug":"script-\u6807\u7B7E","link":"#script-\u6807\u7B7E","children":[]},{"level":2,"title":"\u9875\u9762\u6E32\u67D3\u7684\u95EE\u9898","slug":"\u9875\u9762\u6E32\u67D3\u7684\u95EE\u9898","link":"#\u9875\u9762\u6E32\u67D3\u7684\u95EE\u9898","children":[{"level":3,"title":"\u63A8\u8FDF\u6267\u884C script","slug":"\u63A8\u8FDF\u6267\u884C-script","link":"#\u63A8\u8FDF\u6267\u884C-script","children":[]},{"level":3,"title":"\u5F02\u6B65\u6267\u884C script","slug":"\u5F02\u6B65\u6267\u884C-script","link":"#\u5F02\u6B65\u6267\u884C-script","children":[]}]}],"relativePath":"javascript/use-javascript-in-html.md"}'),p={name:"javascript/use-javascript-in-html.md"},n=l(`<h1 id="\u5728-html-\u4E2D\u4F7F\u7528-javascript" tabindex="-1">\u5728 HTML \u4E2D\u4F7F\u7528 JavaScript <a class="header-anchor" href="#\u5728-html-\u4E2D\u4F7F\u7528-javascript" aria-hidden="true">#</a></h1><p>\u5728 HTML \u4E2D\u4F7F\u7528 JavaScript \u662F\u4F7F\u7528 <code>&lt;script&gt;</code> \u6807\u7B7E\u3002</p><h2 id="script-\u6807\u7B7E" tabindex="-1"><code>&lt;script&gt;</code> \u6807\u7B7E <a class="header-anchor" href="#script-\u6807\u7B7E" aria-hidden="true">#</a></h2><p>\u4F7F\u7528 <code>&lt;script&gt;</code> \u6807\u7B7E\u7684\u65B9\u5F0F\u6709\u4E24\u79CD\uFF1A</p><ul><li>\u884C\u5185 script\uFF1A\u901A\u8FC7\u5B83\u5728 HTML \u4E2D\u5D4C\u5165 JavaScript \u4EE3\u7801\u3002</li><li>\u5916\u90E8 script\uFF1A\u901A\u8FC7\u5B83\u5728 HTML \u4E2D\u5F15\u7528 JavaScript \u6587\u4EF6\u3002</li></ul><p>\u4E0D\u7BA1\u662F\u54EA\u79CD\u65B9\u5F0F\uFF0C\u5982\u679C\u5B83\u4EEC\u6CA1\u6709\u4F7F\u7528 defer \u548C async \u5C5E\u6027\uFF0C\u6D4F\u89C8\u5668\u90FD\u4F1A\u6309\u7167 <code>&lt;script&gt;</code> \u6807\u7B7E\u5728\u9875\u9762\u4E2D\u51FA\u73B0\u7684\u987A\u5E8F\u4F9D\u6B21\u89E3\u91CA\u5B83\u4EEC\u3002\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0C\u7B2C\u4E8C\u4E2A <code>&lt;script&gt;</code> \u6807\u7B7E\u7684\u4EE3\u7801\u5FC5\u987B\u5728\u7B2C\u4E00\u4E2A <code>&lt;script&gt;</code> \u6807\u7B7E\u7684\u4EE3\u7801\u89E3\u91CA\u5B8C\u6BD5\u624D\u80FD\u5F00\u59CB\u89E3\u91CA\uFF0C\u7B2C\u4E09\u4E2A\u5219\u5FC5\u987B\u7B49\u7B2C\u4E8C\u4E2A\u89E3\u91CA\u5B8C\uFF0C\u4EE5\u6B64\u7C7B\u63A8\u3002</p><p>\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0CHTML \u5728\u89E3\u91CA <code>&lt;script&gt;</code> \u6807\u7B7E\u65F6\uFF0C\u4F1A\u963B\u585E\u540E\u7EED\u7684\u4EE3\u7801\u3002\u7279\u522B\u662F\u5728\u5916\u90E8 script \u65F6\uFF0C\u963B\u585E\u65F6\u95F4\u4F1A\u5305\u542B\u4E0B\u8F7D\u6587\u4EF6\u7684\u65F6\u95F4\u3002</p><p>\u884C\u5185 script\uFF0C\u5982\u4E0B\u6240\u793A\uFF1A</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u884C\u5185 script</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>\u5916\u90E8 script\uFF0C\u5982\u4E0B\u6240\u793A\uFF1A</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">example.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="\u9875\u9762\u6E32\u67D3\u7684\u95EE\u9898" tabindex="-1">\u9875\u9762\u6E32\u67D3\u7684\u95EE\u9898 <a class="header-anchor" href="#\u9875\u9762\u6E32\u67D3\u7684\u95EE\u9898" aria-hidden="true">#</a></h2><p>\u8FC7\u53BB\uFF0C\u6240\u6709 <code>&lt;script&gt;</code> \u6807\u7B7E\u90FD\u88AB\u653E\u5728\u9875\u9762\u7684 <code>&lt;head&gt;</code> \u6807\u7B7E\u5185\uFF0C\u8FD9\u79CD\u505A\u6CD5\u7684\u4E3B\u8981\u76EE\u7684\u662F\u628A\u5916\u90E8\u7684 CSS \u548C JavaScript \u6587\u4EF6\u90FD\u96C6\u4E2D\u653E\u5230\u4E00\u8D77\u3002\u4E0D\u8FC7\uFF0C\u8FD9\u6837\u505A\u4E5F\u5C31\u610F\u5473\u7740\u5FC5\u987B\u628A\u6240\u6709 JavaScript \u4EE3\u7801\u90FD\u4E0B\u8F7D\u3001\u89E3\u6790\u548C\u89E3\u91CA\u5B8C\u6210\u540E\uFF0C\u624D\u80FD\u5F00\u59CB\u6E32\u67D3\u9875\u9762\uFF08\u9875\u9762\u5728\u6D4F\u89C8\u5668\u89E3\u6790\u5230 <code>&lt;body&gt;</code> \u7684\u8D77\u59CB\u6807\u7B7E\u65F6\u5F00\u59CB\u6E32\u67D3\uFF09\u3002</p><p>\u5BF9\u4E8E\u9700\u8981\u5F88\u591A JavaScript \u7684\u9875\u9762\uFF0C\u8FD9\u4F1A\u5BFC\u81F4\u9875\u9762\u6E32\u67D3\u7684\u660E\u663E\u5EF6\u8FDF\uFF0C\u5728\u6B64\u671F\u95F4\u6D4F\u89C8\u5668\u7A97\u53E3\u5B8C\u5168\u7A7A\u767D\u3002\u4E3B\u8981\u6709\u4E0B\u9762\u51E0\u79CD\u65B9\u5F0F\u53EF\u4EE5\u89E3\u51B3\u8FD9\u4E2A\u95EE\u9898\uFF1A</p><ul><li>\u5C06\u6240\u6709 JavaScript \u5F15\u5165\u653E\u5728 <code>&lt;body&gt;</code> \u6807\u7B7E\u4E2D\u7684\u9875\u9762\u5185\u5BB9\u540E\u9762\u3002</li><li>\u63A8\u8FDF\u6267\u884C script\u3002</li><li>\u5F02\u6B65\u6267\u884C script\u3002</li></ul><p>\u8FD9\u6837\u4E00\u6765\uFF0C\u9875\u9762\u4F1A\u5728\u5904\u7406 JavaScript \u4EE3\u7801\u4E4B\u524D\u5B8C\u5168\u6E32\u67D3\u9875\u9762\u3002\u7528\u6237\u4F1A\u611F\u89C9\u9875\u9762\u52A0\u8F7D\u66F4\u5FEB\u4E86\uFF0C\u56E0\u4E3A\u6D4F\u89C8\u5668\u663E\u793A\u7A7A\u767D\u9875\u9762\u7684\u65F6\u95F4\u77ED\u4E86\u3002</p><h3 id="\u63A8\u8FDF\u6267\u884C-script" tabindex="-1">\u63A8\u8FDF\u6267\u884C script <a class="header-anchor" href="#\u63A8\u8FDF\u6267\u884C-script" aria-hidden="true">#</a></h3><p>HTML 4.01 \u4E3A <code>&lt;script&gt;</code> \u6807\u7B7E\u5B9A\u4E49\u4E86\u4E00\u4E2A\u53EB defer \u7684\u5C5E\u6027\uFF0C\u53EA\u5BF9\u5916\u90E8 script \u6709\u6548\u3002\u8FD9\u4E2A\u5C5E\u6027\u8868\u793A <code>&lt;script&gt;</code> \u5728\u6267\u884C\u7684\u65F6\u5019\u4E0D\u4F1A\u6539\u53D8\u9875\u9762\u7684\u7ED3\u6784\u3002\u56E0\u6B64\uFF0C\u8FD9\u4E2A <code>&lt;script&gt;</code> \u5B8C\u5168\u53EF\u4EE5\u5728\u6574\u4E2A\u9875\u9762\u89E3\u6790\u5B8C\u4E4B\u540E\u518D\u8FD0\u884C\u3002\u5728 <code>&lt;script&gt;</code> \u6807\u7B7E\u4E0A\u8BBE\u7F6E defer \u5C5E\u6027\uFF0C\u4F1A\u544A\u8BC9\u6D4F\u89C8\u5668\u5E94\u8BE5\u7ACB\u5373\u5F00\u59CB\u4E0B\u8F7D\uFF0C\u4F46\u6267\u884C\u5E94\u8BE5\u5EF6\u8FDF\uFF1A</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;!</span><span style="color:#F07178;">DOCTYPE</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">Example HTML Page</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">    &lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">defer</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">example1.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">    &lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">defer</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">example2.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;">&lt;!-- \u8FD9\u91CC\u662F\u9875\u9762\u5185\u5BB9 --&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>\u867D\u7136\u8FD9\u4E2A\u4F8B\u5B50\u4E2D\u7684 <code>&lt;script&gt;</code> \u6807\u7B7E\u5305\u542B\u5728\u9875\u9762\u7684 <code>&lt;head&gt;</code> \u4E2D\uFF0C\u4F46\u5B83\u4EEC\u4F1A\u5728\u6D4F\u89C8\u5668\u89E3\u6790\u5230\u7ED3\u675F\u7684 <code>&lt;/html&gt;</code> \u6807\u7B7E\u540E\u624D\u4F1A\u6267\u884C\u3002</p><p>HTML5 \u89C4\u8303\u8981\u6C42 <code>&lt;script&gt;</code> \u5E94\u8BE5\u6309\u7167\u5B83\u4EEC\u51FA\u73B0\u7684\u987A\u5E8F\u6267\u884C\uFF0C\u56E0\u6B64\u7B2C\u4E00\u4E2A\u63A8\u8FDF\u7684 <code>&lt;script&gt;</code> \u4F1A\u5728\u7B2C\u4E8C\u4E2A\u63A8\u8FDF\u7684 <code>&lt;script&gt;</code> \u4E4B\u524D\u6267\u884C\uFF0C\u800C\u4E14\u4E24\u8005\u90FD\u4F1A\u5728 DOMContentLoaded \u4E8B\u4EF6\u4E4B\u524D\u6267\u884C\u3002</p><h3 id="\u5F02\u6B65\u6267\u884C-script" tabindex="-1">\u5F02\u6B65\u6267\u884C script <a class="header-anchor" href="#\u5F02\u6B65\u6267\u884C-script" aria-hidden="true">#</a></h3><p>HTML5 \u4E3A <code>&lt;script&gt;</code> \u6807\u7B7E\u5B9A\u4E49\u4E86 async \u5C5E\u6027\u3002\u4ECE\u6539\u53D8 <code>&lt;script&gt;</code> \u5904\u7406\u65B9\u5F0F\u4E0A\u770B\uFF0Casync \u5C5E\u6027\u4E0E defer \u7C7B\u4F3C\u3002\u5F53\u7136\uFF0C\u5B83\u4EEC\u4E24\u8005\u4E5F\u90FD\u53EA\u9002\u7528\u4E8E\u5916\u90E8 script\uFF0C\u90FD\u4F1A\u544A\u8BC9\u6D4F\u89C8\u5668\u7ACB\u5373\u5F00\u59CB\u4E0B\u8F7D\u3002\u4E0D\u8FC7\uFF0C\u4E0E defer \u4E0D\u540C\u7684\u662F\uFF0C\u6807\u8BB0\u4E3A async \u7684 <code>&lt;script&gt;</code> \u5E76\u4E0D\u4FDD\u8BC1\u80FD\u6309\u7167\u4ED6\u4EEC\u51FA\u73B0\u7684\u6B21\u5E8F\u6267\u884C\u3002</p><p>\u7ED9 <code>&lt;script&gt;</code> \u6DFB\u52A0 async \u5C5E\u6027\u7684\u76EE\u7684\u662F\u544A\u8BC9\u6D4F\u89C8\u5668\uFF0C\u4E0D\u5FC5\u7B49 <code>&lt;script&gt;</code> \u4E0B\u8F7D\u548C\u6267\u884C\u5B8C\u540E\u518D\u52A0\u8F7D\u9875\u9762\uFF0C\u540C\u6837\u4E5F\u4E0D\u5FC5\u7B49\u5230\u8BE5\u5F02\u6B65 <code>&lt;script&gt;</code> \u4E0B\u8F7D\u548C\u6267\u884C\u540E\u518D\u52A0\u8F7D\u5176\u4ED6 <code>&lt;script&gt;</code> \u3002\u6B63\u56E0\u4E3A\u5982\u6B64\uFF0C\u5F02\u6B65 <code>&lt;script&gt;</code> \u4E0D\u5E94\u8BE5\u5728\u52A0\u8F7D\u671F\u95F4\u4FEE\u6539 DOM\u3002</p><p>\u5F02\u6B65 <code>&lt;script&gt;</code> \u4FDD\u8BC1\u4F1A\u5728\u9875\u9762\u7684 load \u4E8B\u4EF6\u524D\u6267\u884C\uFF0C\u4F46\u53EF\u80FD\u4F1A\u5728 DOMContentLoaded \u4E4B\u524D\u6216\u4E4B\u540E\u3002</p>`,25),o=[n];function c(e,r,i,d,D,F){return t(),a("div",null,o)}const h=s(p,[["render",c]]);export{g as __pageData,h as default};
