import{_ as s,c as n,o as a,b as l}from"./app.2d4ace4e.js";const p="/blog/assets/Xnip2022-10-26_20-42-49.dd184ebe.png",d=JSON.parse('{"title":"\u9762\u5411\u5BF9\u8C61\u7684\u57FA\u672C\u6982\u5FF5","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5BF9\u8C61","slug":"\u5BF9\u8C61","link":"#\u5BF9\u8C61","children":[]},{"level":2,"title":"\u6D88\u606F","slug":"\u6D88\u606F","link":"#\u6D88\u606F","children":[]},{"level":2,"title":"\u7C7B","slug":"\u7C7B","link":"#\u7C7B","children":[]},{"level":2,"title":"\u7EE7\u627F","slug":"\u7EE7\u627F","link":"#\u7EE7\u627F","children":[]}],"relativePath":"object-oriented/basic-concept-of-object-oriented.md"}'),o={name:"object-oriented/basic-concept-of-object-oriented.md"},e=l(`<h1 id="\u9762\u5411\u5BF9\u8C61\u7684\u57FA\u672C\u6982\u5FF5" tabindex="-1">\u9762\u5411\u5BF9\u8C61\u7684\u57FA\u672C\u6982\u5FF5 <a class="header-anchor" href="#\u9762\u5411\u5BF9\u8C61\u7684\u57FA\u672C\u6982\u5FF5" aria-hidden="true">#</a></h1><p>Peter Coad \u548C Edward Yourdon \u63D0\u51FA\u7528\u4E0B\u9762\u7684\u7B49\u5F0F\u8BC6\u522B\u9762\u5411\u5BF9\u8C61\u65B9\u6CD5\u3002</p><p><code>\u9762\u5411\u5BF9\u8C61 = \u5BF9\u8C61 (Object) + \u5206\u7C7B (Classification) + \u7EE7\u627F (Inheritance) + \u901A\u8FC7\u6D88\u606F\u7684\u901A\u4FE1 (Communication with Messages)</code></p><p>\u53EF\u4EE5\u8BF4\uFF0C\u91C7\u7528\u8FD9 4 \u4E2A\u6982\u5FF5\u5F00\u53D1\u7684\u8F6F\u4EF6\u7CFB\u7EDF\u662F\u9762\u5411\u5BF9\u8C61\u7684\u3002</p><h2 id="\u5BF9\u8C61" tabindex="-1">\u5BF9\u8C61 <a class="header-anchor" href="#\u5BF9\u8C61" aria-hidden="true">#</a></h2><p>\u5728\u9762\u5411\u5BF9\u8C61\u7684\u7CFB\u7EDF\u4E2D\uFF0C\u5BF9\u8C61\u662F\u57FA\u672C\u7684\u8FD0\u884C\u65F6\u7684\u5B9E\u4F53\uFF0C\u5B83\u65E2\u5305\u62EC\u6570\u636E (\u5C5E\u6027)\uFF0C\u4E5F\u5305\u62EC\u4F5C\u7528\u4E8E\u6570\u636E\u7684\u64CD\u4F5C (\u65B9\u6CD5)\u3002\u4E00\u4E2A\u5BF9\u8C61\u901A\u5E38\u53EF\u7531\u5BF9\u8C61\u540D\u3001\u5C5E\u6027\u548C\u65B9\u6CD5 3 \u4E2A\u90E8\u5206\u7EC4\u6210\u3002</p><p>\u5728\u73B0\u5B9E\u4E16\u754C\u4E2D\uFF0C\u6BCF\u4E2A\u5B9E\u4F53\u90FD\u662F\u5BF9\u8C61\uFF0C\u5982\u5B66\u751F\u3001\u6C7D\u8F66\u3001\u7535\u89C6\u673A\u548C\u7A7A\u8C03\u7B49\u90FD\u662F\u73B0\u5B9E\u4E16\u754C\u4E2D\u7684\u5BF9\u8C61\u3002\u6BCF\u4E2A\u5BF9\u8C61\u90FD\u6709\u5B83\u7684\u5C5E\u6027\u548C\u65B9\u6CD5\uFF0C\u5982\u7535\u89C6\u673A\u6709\u989C\u8272\u3001\u97F3\u91CF\u3001\u4EAE\u5EA6\u3001\u7070\u5EA6\u3001\u9891\u9053\u7B49\u5C5E\u6027\uFF0C\u53EF\u4EE5\u6709\u5207\u6362\u9891\u9053\u3001\u589E\u5927/\u51CF\u4F4E\u97F3\u91CF\u7B49\u65B9\u6CD5\u3002\u7535\u89C6\u673A\u7684\u5C5E\u6027\u503C\u8868\u793A\u4E86\u7535\u89C6\u673A\u6240\u5904\u7684\u72B6\u6001\uFF0C\u800C\u8FD9\u4E9B\u5C5E\u6027\u53EA\u80FD\u901A\u8FC7\u5176\u63D0\u4F9B\u7684\u65B9\u6CD5\u6765\u6539\u53D8\u3002</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: \u7535\u89C6\u673A */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> television </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u989C\u8272 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">color</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">black</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u97F3\u91CF */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">volume</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">50</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u4EAE\u5EA6 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">brightness</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u7070\u5EA6 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">grayscale</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u9891\u9053 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">channel</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u5207\u6362\u9891\u9053 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">setChannel</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">channel</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u589E\u5927\u97F3\u91CF */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">addVolume</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">volume</span><span style="color:#89DDFF;">++;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u51CF\u4F4E\u97F3\u91CF */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">reduceVolume</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">volume</span><span style="color:#89DDFF;">--;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span></code></pre></div><h2 id="\u6D88\u606F" tabindex="-1">\u6D88\u606F <a class="header-anchor" href="#\u6D88\u606F" aria-hidden="true">#</a></h2><p>\u6D88\u606F\u662F\u5BF9\u8C61\u4E4B\u95F4\u8FDB\u884C\u901A\u4FE1\u7684\u4E00\u79CD\u6784\u9020\u3002\u5F53\u4E00\u4E2A\u6D88\u606F\u53D1\u9001\u7ED9\u67D0\u4E2A\u5BF9\u8C61\u65F6\uFF0C\u5305\u542B\u8981\u6C42\u63A5\u6536\u5BF9\u8C61\u53BB\u6267\u884C\u67D0\u4E9B\u6D3B\u52A8\u7684\u4FE1\u606F\u3002\u63A5\u6536\u5230\u4FE1\u606F\u7684\u5BF9\u8C61\u7ECF\u8FC7\u89E3\u91CA\uFF0C\u7136\u540E\u4E88\u4EE5\u54CD\u5E94\u3002\u8FD9\u79CD\u901A\u4FE1\u673A\u5236\u79F0\u4E3A\u6D88\u606F\u4F20\u9012\u3002</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: client */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> client </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">request</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">server</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;">// \u8FDB\u884C\u901A\u4FE1</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">response</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">server</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">response</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">response</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: server */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> server </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">response</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">message</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hi</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">client</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">request</span><span style="color:#A6ACCD;">(server)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="\u7C7B" tabindex="-1">\u7C7B <a class="header-anchor" href="#\u7C7B" aria-hidden="true">#</a></h2><p>\u4E00\u4E2A\u7C7B\u5B9A\u4E49\u4E86\u4E00\u7EC4\u5927\u4F53\u4E0A\u76F8\u4F3C\u7684\u5BF9\u8C61\u3002\u4E00\u4E2A\u7C7B\u6240\u5305\u542B\u7684\u5C5E\u6027\u548C\u65B9\u6CD5\u63CF\u8FF0\u4E00\u7EC4\u5BF9\u8C61\u7684\u5171\u540C\u884C\u4E3A\u548C\u5C5E\u6027\u3002\u628A\u4E00\u7EC4\u5BF9\u8C61\u7684\u5171\u540C\u7279\u5F81\u52A0\u4EE5\u62BD\u8C61\u5E76\u5B58\u50A8\u5728\u4E00\u4E2A\u7C7B\u4E2D\u662F\u9762\u5411\u5BF9\u8C61\u6280\u672F\u6700\u91CD\u8981\u7684\u4E00\u70B9\u3002</p><p>\u62BD\u8C61\u4E4B\u524D\uFF1A</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: people1 */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> people1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u5F20\u4E09</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">18</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">eat</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u5403\u996D...</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: people2 */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> people2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u674E\u56DB</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">27</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">eat</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u5403\u996D...</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span></code></pre></div><p>\u62BD\u8C61\u4E4B\u540E\uFF1A</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#676E95;">/** \u7C7B: Person */</span></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Person</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">age</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">age</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">eat</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u5403\u996D...</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: people1 */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> people1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Person</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u5F20\u4E09</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">18</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** \u5BF9\u8C61: people2 */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> people2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Person</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u674E\u56DB</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">27</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u7C7B\u662F\u5728\u5BF9\u8C61\u4E4B\u4E0A\u7684\u62BD\u8C61\uFF0C\u5BF9\u8C61\u662F\u7C7B\u7684\u5177\u4F53\u5316\uFF0C\u662F\u7C7B\u7684\u5B9E\u4F8B (Instance)\u3002\u5728\u5206\u6790\u548C\u8BBE\u8BA1\u65F6\uFF0C\u901A\u5E38\u628A\u6CE8\u610F\u529B\u96C6\u4E2D\u5728\u7C7B\u4E0A\uFF0C\u800C\u4E0D\u662F\u5177\u4F53\u7684\u5BF9\u8C61\u3002\u4E5F\u4E0D\u5FC5\u9010\u4E2A\u5B9A\u4E49\u6BCF\u4E2A\u5BF9\u8C61\uFF0C\u53EA\u9700\u5BF9\u7C7B\u505A\u51FA\u5B9A\u4E49\uFF0C\u800C\u5BF9\u7C7B\u7684\u5C5E\u6027\u8FDB\u884C\u4E0D\u540C\u8D4B\u503C\u5373\u53EF\u5F97\u5230\u8BE5\u7C7B\u7684\u5BF9\u8C61\u5B9E\u4F8B\u3002</p><p>\u7C7B\u53EF\u4EE5\u5206\u4E3A\u4E09\u79CD\uFF1A\u5B9E\u4F53\u7C7B\u3001\u63A5\u53E3\u7C7B (\u8FB9\u754C\u7C7B) \u548C\u63A7\u5236\u7C7B\u3002</p><ul><li>\u5B9E\u4F53\u7C7B\u7684\u5BF9\u8C61\u8868\u793A\u73B0\u5B9E\u4E16\u754C\u4E2D\u771F\u5B9E\u7684\u5B9E\u4F53\uFF0C\u5982\u4EBA\u3001\u7269\u7B49\u3002</li><li>\u63A5\u53E3\u7C7B (\u8FB9\u754C\u7C7B) \u7684\u5BF9\u8C61\u4E3A\u7528\u6237\u63D0\u4F9B\u4E00\u79CD\u4E0E\u7CFB\u7EDF\u5408\u4F5C\u4EA4\u4E92\u7684\u65B9\u5F0F\uFF0C\u5206\u4E3A\u4EBA\u548C\u7CFB\u7EDF\u4E24\u5927\u7C7B\uFF0C\u5176\u4E2D\u4EBA\u7684\u63A5\u53E3\u53EF\u4EE5\u662F\u663E\u793A\u5C4F\u3001\u7A97\u53E3\u3001Web \u7A97\u4F53\u3001\u5BF9\u8BDD\u6846\u3001\u83DC\u5355\u3001\u5217\u8868\u6846\u3001\u5176\u4ED6\u663E\u793A\u63A7\u5236\u3001\u6761\u5F62\u7801\u3001\u4E8C\u7EF4\u7801\u6216\u8005\u7528\u6237\u4E0E\u7CFB\u7EDF\u4EA4\u4E92\u7684\u5176\u4ED6\u65B9\u6CD5\u3002\u7CFB\u7EDF\u63A5\u53E3\u6D89\u53CA\u5230\u628A\u6570\u636E\u53D1\u9001\u5230\u5176\u4ED6\u7CFB\u7EDF\uFF0C\u6216\u8005\u4ECE\u5176\u4ED6\u7CFB\u7EDF\u63A5\u6536\u6570\u636E\u3002</li><li>\u63A7\u5236\u7C7B\u7684\u5BF9\u8C61\u7528\u6765\u63A7\u5236\u6D3B\u52A8\u6D41\uFF0C\u5145\u5F53\u534F\u8C03\u8005\u3002</li></ul><p>\u6709\u4E9B\u7C7B\u4E4B\u95F4\u5B58\u5728\u4E00\u822C\u548C\u7279\u6B8A\u5173\u7CFB\uFF0C\u8FD9\u662F\u4E00\u79CD is-a \u5173\u7CFB\uFF0C\u5373\u7279\u6B8A\u7C7B\u662F\u4E00\u79CD\u4E00\u822C\u7C7B\u3002\u4F8B\u5982 \u201C\u6C7D\u8F66\u201D \u7C7B\u3001\u201C\u8F6E\u8239\u201D \u7C7B\u3001\u201C\u98DE\u673A\u201D \u7C7B\u90FD\u662F\u4E00\u79CD \u201C\u4EA4\u901A\u5DE5\u5177\u201D \u7C7B\u3002\u7279\u6B8A\u7C7B\u662F\u4E00\u822C\u7C7B\u7684\u5B50\u7C7B\uFF0C\u4E00\u822C\u7C7B\u662F\u7279\u6B8A\u7C7B\u7684\u7236\u7C7B\u3002\u540C\u6837\uFF0C\u201C\u6C7D\u8F66\u201D \u7C7B\u8FD8\u53EF\u4EE5\u6709\u66F4\u7279\u6B8A\u7684\u7C7B\uFF0C\u5982 \u201C\u8F7F\u8F66\u201D \u7C7B\u3001\u201C\u8D27\u8F66\u201D \u7C7B\u7B49\u3002\u5728\u8FD9\u79CD\u5173\u7CFB\u4E0B\u5F62\u6210\u4E00\u79CD\u5C42\u6B21\u7684\u5173\u8054\u3002</p><h2 id="\u7EE7\u627F" tabindex="-1">\u7EE7\u627F <a class="header-anchor" href="#\u7EE7\u627F" aria-hidden="true">#</a></h2><p>\u7EE7\u627F\u662F\u7236\u7C7B\u548C\u5B50\u7C7B\u4E4B\u95F4\u5171\u4EAB\u5C5E\u6027\u548C\u65B9\u6CD5\u7684\u673A\u5236\u3002\u8FD9\u662F\u7C7B\u4E4B\u95F4\u7684\u4E00\u79CD\u5173\u7CFB\uFF0C\u5728\u5B9A\u4E49\u548C\u5B9E\u73B0\u4E00\u4E2A\u7C7B\u7684\u65F6\u5019\uFF0C\u53EF\u4EE5\u5728\u4E00\u4E2A\u5DF2\u7ECF\u5B58\u5728\u7684\u7C7B\u7684\u57FA\u7840\u4E0A\u8FDB\u884C\uFF0C\u628A\u8FD9\u4E2A\u5DF2\u7ECF\u5B58\u5728\u7684\u7C7B\u6240\u5B9A\u4E49\u7684\u5185\u5BB9\u4F5C\u4E3A\u81EA\u5DF1\u7684\u5185\u5BB9\uFF0C\u5E76\u52A0\u5165\u82E5\u5E72\u65B0\u7684\u5185\u5BB9\u3002\u56FE 7-1 \u8868\u793A\u4E86\u7236\u7C7B A \u548C\u5B83\u7684\u5B50\u7C7B B \u4E4B\u95F4\u7684\u7EE7\u627F\u5173\u7CFB\u3002</p><p><img src="`+p+`" alt="Xnip2022-10-26_20-42-49"></p><p>\u4E00\u4E2A\u7236\u7C7B\u53EF\u4EE5\u6709\u591A\u4E2A\u5B50\u7C7B\uFF0C\u8FD9\u4E9B\u5B50\u7C7B\u90FD\u662F\u7236\u7C7B\u7684\u7279\u4F8B\uFF0C\u7236\u7C7B\u63CF\u8FF0\u4E86\u8FD9\u4E9B\u5B50\u7C7B\u7684\u516C\u5171\u5C5E\u6027\u548C\u65B9\u6CD5\u3002\u4E00\u4E2A\u5B50\u7C7B\u53EF\u4EE5\u7EE7\u627F\u5B83\u7684\u7236\u7C7B (\u6216\u7956\u5148\u7C7B) \u4E2D\u7684\u5C5E\u6027\u548C\u65B9\u6CD5\uFF0C\u8FD9\u4E9B\u5C5E\u6027\u548C\u64CD\u4F5C\u5728\u5B50\u7C7B\u4E2D\u4E0D\u5FC5\u5B9A\u4E49\uFF0C\u5B50\u7C7B\u4E2D\u8FD8\u53EF\u4EE5\u5B9A\u4E49\u81EA\u5DF1\u7684\u5C5E\u6027\u548C\u65B9\u6CD5\u3002</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre><code><span class="line"><span style="color:#676E95;">/** \u7C7B: Person */</span></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Person</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">age</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">age</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">eat</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u5403\u996D...</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** \u7C7B: Teacher */</span></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Teacher</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Person</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u804C\u7EA7 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">rank</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">rank</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">super</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">age</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">rank</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">rank</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">teach</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u6559\u4E66...</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** \u7C7B: Student */</span></span>
<span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Student</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Person</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;">/** \u5E74\u7EA7 */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">grade</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">grade</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">super</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">age</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">grade</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">grade</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">doHomework</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u505A\u4F5C\u4E1A...</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,26),c=[e];function t(r,D,y,F,C,A){return a(),n("div",null,c)}const u=s(o,[["render",t]]);export{d as __pageData,u as default};