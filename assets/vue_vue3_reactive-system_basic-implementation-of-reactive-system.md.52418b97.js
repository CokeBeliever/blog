import{_ as s,c as n,o as a,b as p}from"./app.f9a17689.js";const i=JSON.parse('{"title":"\u54CD\u5E94\u5F0F\u7CFB\u7EDF\u7684\u57FA\u672C\u5B9E\u73B0","description":"","frontmatter":{},"headers":[],"relativePath":"vue/vue3/reactive-system/basic-implementation-of-reactive-system.md"}'),l={name:"vue/vue3/reactive-system/basic-implementation-of-reactive-system.md"},o=p(`<h1 id="\u54CD\u5E94\u5F0F\u7CFB\u7EDF\u7684\u57FA\u672C\u5B9E\u73B0" tabindex="-1">\u54CD\u5E94\u5F0F\u7CFB\u7EDF\u7684\u57FA\u672C\u5B9E\u73B0 <a class="header-anchor" href="#\u54CD\u5E94\u5F0F\u7CFB\u7EDF\u7684\u57FA\u672C\u5B9E\u73B0" aria-hidden="true">#</a></h1><p>\u5982\u4F55\u8BA9 <code>obj.text</code> \u53D8\u6210\u54CD\u5E94\u5F0F\u6570\u636E\u5462\uFF1F\u901A\u8FC7\u89C2\u5BDF\u6211\u4EEC\u80FD\u53D1\u73B0\u4E24\u70B9\u7EBF\u7D22\uFF1A</p><ul><li>\u5F53 effect \u51FD\u6570\u6267\u884C\u65F6\uFF0C\u4F1A\u89E6\u53D1 <code>obj.text</code> \u7684\u8BFB\u53D6 (get) \u64CD\u4F5C\uFF1B</li><li>\u5F53\u4FEE\u6539 <code>obj.text</code> \u7684\u503C\u65F6\uFF0C\u4F1A\u89E6\u53D1 <code>obj.text</code> \u7684\u8BBE\u7F6E (set) \u64CD\u4F5C\uFF1B</li></ul><p>\u5982\u679C\u6211\u4EEC\u80FD\u62E6\u622A\u4E00\u4E2A\u5BF9\u8C61\u7684\u8BFB\u53D6\u548C\u8BBE\u7F6E\u64CD\u4F5C\uFF0C\u4E8B\u60C5\u5C31\u53D8\u5F97\u7B80\u5355\u4E86\uFF1A</p><ul><li>\u5728\u8BFB\u53D6 <code>obj.text</code> \u65F6\uFF0C\u5C06\u8FD9\u4E2A\u6570\u636E\u76F8\u5173\u7684\u51FD\u6570\u5B58\u50A8\u8D77\u6765\uFF1B</li><li>\u5728\u8BBE\u7F6E <code>obj.text</code> \u65F6\uFF0C\u5C06\u8FD9\u4E2A\u6570\u636E\u76F8\u5173\u7684\u51FD\u6570\u53D6\u51FA\u6765\u6267\u884C\uFF1B</li></ul><p>\u73B0\u5728\u95EE\u9898\u7684\u5173\u952E\u53D8\u6210\u4E86\u6211\u4EEC\u5982\u4F55\u624D\u80FD\u62E6\u622A\u4E00\u4E2A\u5BF9\u8C61\u5C5E\u6027\u7684\u8BFB\u53D6\u548C\u8BBE\u7F6E\u64CD\u4F5C\u5462\uFF1F\u5728 ES6 \u4E4B\u524D\uFF0C\u53EA\u80FD\u901A\u8FC7 <code>Object.defineProperty</code> \u51FD\u6570\u5B9E\u73B0\uFF0C\u8FD9\u4E5F\u662F Vue2 \u6240\u91C7\u7528\u7684\u65B9\u5F0F\u3002\u4ECE ES6 \u5F00\u59CB\uFF0C\u6211\u4EEC\u53EF\u4EE5\u4F7F\u7528\u4EE3\u7406\u5BF9\u8C61 Proxy \u6765\u5B9E\u73B0\uFF0C\u8FD9\u4E5F\u662F Vue3 \u6240\u91C7\u7528\u7684\u65B9\u5F0F\u3002</p><p>\u6211\u4EEC\u53EF\u4EE5\u6839\u636E\u4E0A\u8FF0\u601D\u8DEF\uFF0C\u91C7\u7528 Proxy \u6765\u5B9E\u73B0\uFF1A</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#676E95;">// \u5B58\u50A8\u51FD\u6570\u7684 &quot;\u6876&quot;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> bucket </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Set</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Function</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#676E95;">// \u539F\u59CB\u6570\u636E</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> data </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">text</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">hello world</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#676E95;">// \u54CD\u5E94\u5F0F\u6570\u636E</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> obj </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Proxy</span><span style="color:#A6ACCD;">(data</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// \u62E6\u622A\u8BFB\u53D6\u64CD\u4F5C</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">get</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">receiver</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;">// \u5C06 effect \u5B58\u50A8\u8D77\u6765</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">bucket</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">add</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">effect</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;">// \u8FD4\u56DE\u5C5E\u6027\u503C</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Reflect</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">receiver</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// \u62E6\u622A\u8BBE\u7F6E\u64CD\u4F5C</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">set</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">newVal</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">receiver</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;">// \u8BBE\u7F6E\u5C5E\u6027\u503C</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">res</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Reflect</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">set</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">newVal</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">receiver</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;">// \u5982\u679C\u8BBE\u7F6E\u64CD\u4F5C\u6210\u529F\uFF0C\u5C31\u628A\u5B58\u50A8\u7684\u51FD\u6570\u53D6\u51FA\u6765\u6267\u884C</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">res</span><span style="color:#F07178;">) </span><span style="color:#A6ACCD;">bucket</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">forEach</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">effectFn</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">effectFn</span><span style="color:#F07178;">())</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;">// \u8FD4\u56DE\u8BBE\u7F6E\u64CD\u4F5C\u662F\u5426\u6210\u529F</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">res</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">effect</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">document</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">body</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">innerText</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">obj</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">text</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u6D4B\u8BD5\u4E00\u4E0B\uFF1A</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#82AAFF;">effect</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">setTimeout</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">obj</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">text</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">hello vue3</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">},</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1000</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p>\u4E0A\u9762\u8FD9\u6BB5\u4EE3\u7801\u7F16\u8BD1\u4E3A JavaScript \u4EE3\u7801\uFF0C\u5E76\u5728\u6D4F\u89C8\u5668\u4E2D\u8FD0\u884C\uFF0C\u4F1A\u5F97\u5230\u671F\u671B\u7684\u7ED3\u679C (1s \u540E <code>obj.text</code> \u4F1A\u4FEE\u6539\uFF0Ceffect \u51FD\u6570\u4F1A\u91CD\u65B0\u6267\u884C)\u3002</p><p>\u4F46\u662F\u76EE\u524D\u5B9E\u73B0\u8FD8\u5B58\u5728\u5F88\u591A\u7F3A\u9677\uFF0C\u5B9E\u73B0\u4E00\u4E2A\u5B8C\u5584\u7684\u54CD\u5E94\u5F0F\u7CFB\u7EDF\u8981\u8003\u8651\u8BF8\u591A\u7EC6\u8282\u3002</p>`,12),e=[o];function t(c,r,y,D,F,A){return a(),n("div",null,e)}const d=s(l,[["render",t]]);export{i as __pageData,d as default};