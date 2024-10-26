import{_ as s,c as n,o as a,b as l}from"./app.4e6a3a91.js";const d=JSON.parse('{"title":"lint-staged","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5FEB\u901F\u5F00\u59CB","slug":"\u5FEB\u901F\u5F00\u59CB","link":"#\u5FEB\u901F\u5F00\u59CB","children":[]},{"level":2,"title":"\u5C1D\u8BD5\u4E00\u4E0B","slug":"\u5C1D\u8BD5\u4E00\u4E0B","link":"#\u5C1D\u8BD5\u4E00\u4E0B","children":[]}],"relativePath":"front-end-engineering/lint-staged.md"}'),p={name:"front-end-engineering/lint-staged.md"},o=l(`<h1 id="lint-staged" tabindex="-1">lint-staged <a class="header-anchor" href="#lint-staged" aria-hidden="true">#</a></h1><blockquote><p><a href="https://github.com/lint-staged/lint-staged?tab=readme-ov-file" target="_blank" rel="noreferrer">lint-staged/lint-staged: \u{1F6AB}\u{1F4A9} \u2014 Run linters on git staged files (github.com)</a></p></blockquote><p>lint-staged \u662F\u4E00\u4E2A\u80FD\u591F\u5BF9 Git \u6682\u5B58\u533A\u6587\u4EF6\u6267\u884C\u811A\u672C\u7684\u5DE5\u5177\uFF0C\u5B83\u901A\u5E38\u4E0E Husky \u4E00\u8D77\u4F7F\u7528\u3002\u5B83\u7684\u4E3B\u8981\u529F\u80FD\u662F\u9488\u5BF9 Git \u6682\u5B58\u533A\uFF08\u5373\u5C06\u63D0\u4EA4\u7684\u6587\u4EF6\uFF09\u8FD0\u884C\u9884\u5B9A\u4E49\u7684\u811A\u672C\uFF0C\u800C\u4E0D\u662F\u5BF9\u6574\u4E2A\u9879\u76EE\u3002</p><p>\u901A\u5E38\u60C5\u51B5\u4E0B\uFF0C\u4F8B\u5982\uFF1A\u5BF9\u6574\u4E2A\u9879\u76EE\u8FD0\u884C ESLint\uFF08\u7528\u4E8E JavaScript \u4EE3\u7801\u68C0\u67E5\uFF09\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u68C0\u67E5\u8FC7\u7A0B\u8F83\u4E3A\u7F13\u6162\uFF0C\u5E76\u4E14\u68C0\u67E5\u7ED3\u679C\u53EF\u80FD\u5305\u542B\u8BB8\u591A\u4E0E\u5373\u5C06\u63D0\u4EA4\u7684\u6587\u4EF6\u65E0\u5173\u7684\u5185\u5BB9\u3002lint-staged \u7684\u4F18\u52BF\u5728\u4E8E\u5B83\u53EA\u5BF9 Git \u6682\u5B58\u533A\u8FDB\u884C\u68C0\u67E5\uFF0C\u8FD9\u6837\u53EF\u4EE5\u63D0\u9AD8\u6548\u7387\u5E76\u786E\u4FDD\u68C0\u67E5\u7ED3\u679C\u7684\u76F8\u5173\u6027\u3002</p><h2 id="\u5FEB\u901F\u5F00\u59CB" tabindex="-1">\u5FEB\u901F\u5F00\u59CB <a class="header-anchor" href="#\u5FEB\u901F\u5F00\u59CB" aria-hidden="true">#</a></h2><blockquote><p>lint-staged \u901A\u5E38\u4E0E Husky \u4E00\u8D77\u4F7F\u7528\u3002\u6709\u5173 Husky \u7684\u5185\u5BB9\uFF0C\u8BF7\u53C2\u9605 <a href="https://github.com/typicode/husky" target="_blank" rel="noreferrer">typicode/husky: Git hooks made easy \u{1F436} woof! (github.com)</a>\u3002</p></blockquote><p><strong>\u5B89\u88C5</strong></p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install --save-dev lint-staged</span></span>
<span class="line"></span></code></pre></div><p><strong>\u6DFB\u52A0\u94A9\u5B50</strong></p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">npx lint-staged</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> .husky/pre-commit</span></span>
<span class="line"></span></code></pre></div><p><strong>\u914D\u7F6E\u6587\u4EF6</strong></p><p>\u5728\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\uFF0C\u521B\u5EFA <code>.lintstagedrc.json</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">prettier --write</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">*.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">eslint</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u8FD9\u4E2A\u914D\u7F6E\u8868\u793A\uFF0C\u5E76\u884C\u6267\u884C\uFF1A</p><ol><li>\u5BF9\u5339\u914D <code>*</code> \u4EFB\u610F\u6587\u4EF6\uFF0C\u6267\u884C <code>prettier --write</code> \u547D\u4EE4\uFF1B</li><li>\u5BF9\u5339\u914D <code>*.js</code> \u7279\u5B9A\u6587\u4EF6\uFF0C\u6267\u884C <code>eslint</code> \u547D\u4EE4\u3002</li></ol><h2 id="\u5C1D\u8BD5\u4E00\u4E0B" tabindex="-1">\u5C1D\u8BD5\u4E00\u4E0B <a class="header-anchor" href="#\u5C1D\u8BD5\u4E00\u4E0B" aria-hidden="true">#</a></h2><p><strong>\u76EE\u6807\uFF1Agit commit \u65F6\uFF0C\u4EC5\u5BF9 Git \u6682\u5B58\u533A\u7684\u6587\u4EF6\uFF0C\u6267\u884C ESLint \u68C0\u67E5\u4EE3\u7801\u8D28\u91CF\u3001Prettier \u683C\u5F0F\u5316\u4EE3\u7801\u98CE\u683C</strong></p><p>\u521D\u59CB\u5316\u9879\u76EE\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">mkdir lint-staged-demo</span></span>
<span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> lint-staged-demo</span></span>
<span class="line"><span style="color:#A6ACCD;">npm init -y</span></span>
<span class="line"><span style="color:#A6ACCD;">git init</span></span>
<span class="line"><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">node_modules</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> .gitignore</span></span>
<span class="line"></span></code></pre></div><p><strong>husky</strong></p><p>\u5B89\u88C5 husky\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install --save-dev husky</span></span>
<span class="line"></span></code></pre></div><p>\u521D\u59CB\u5316 husky\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">npx husky init</span></span>
<span class="line"></span></code></pre></div><hr><p><strong>lint-staged</strong></p><p>\u5B89\u88C5 lint-staged\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install --save-dev lint-staged</span></span>
<span class="line"></span></code></pre></div><p>\u6DFB\u52A0\u94A9\u5B50\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">npx lint-staged</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> .husky/pre-commit</span></span>
<span class="line"></span></code></pre></div><p>\u5728\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\uFF0C\u521B\u5EFA <code>.lintstagedrc.json</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">prettier --write</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">*.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">eslint</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><hr><p><strong>ESLint/Prettier</strong></p><p>\u5B89\u88C5 ESLint\u3001Prettier\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install --save-dev eslint prettier</span></span>
<span class="line"></span></code></pre></div><p>\u5728\u9879\u76EE\u6839\u76EE\u5F55\u4E2D\uFF0C\u521B\u5EFA <code>.eslintrc.json</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">env</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">node</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">es6</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">rules</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">no-unused-vars</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">error</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u5728\u9879\u76EE\u6839\u76EE\u5F55\u4E2D\uFF0C\u521B\u5EFA <code>.prettierrc.json</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">printWidth</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">80</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">semi</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">false</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><strong>\u5176\u4ED6</strong></p><p>\u5728\u9879\u76EE\u6839\u76EE\u5F55\u4E2D\uFF0C\u521B\u5EFA <code>index.js</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> name </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">CokeBeliever</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u63A5\u7740\uFF0C\u521B\u5EFA <code>index.html</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;!</span><span style="color:#F07178;">doctype</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">lang</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">en</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">charset</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">UTF-8</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">viewport</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">content</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">width=device-width, initial-scale=1.0</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">CokeBeliever</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;&lt;</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>\u63D0\u4EA4\u4EE3\u7801\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">git add index.js index.html</span></span>
<span class="line"><span style="color:#A6ACCD;">git commit -m </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">test</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span></code></pre></div><p>\u53EF\u4EE5\u5728\u7EC8\u7AEF\u770B\u5230\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">1:7  error  </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">name</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> is assigned a value but never used  no-unused-vars</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">\u2716 1 problem </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">1 error, 0 warnings</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">husky - pre-commit script failed </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">code 1</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span></code></pre></div><p>\u53EF\u4EE5\u770B\u5230\uFF0C\u867D\u7136 Prettier \u4EE3\u7801\u683C\u5F0F\u5316\u6267\u884C\u6210\u529F\uFF0C\u4F46 ESLint \u68C0\u67E5\u62A5\u9519\u3002</p><p>\u8FD9\u662F\u56E0\u4E3A ESLint \u89C4\u5219\u914D\u7F6E\u4E86 &quot;\u4E0D\u5141\u8BB8\u672A\u4F7F\u7528\u7684\u58F0\u660E\u53D8\u91CF&quot;\uFF0C\u6211\u4EEC\u53EF\u4EE5\u4FEE\u6539 <code>index.js</code>\uFF0C\u5185\u5BB9\u5982\u4E0B\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> name </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">CokeBeliever</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(name)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u518D\u6B21\uFF0C\u63D0\u4EA4\u4EE3\u7801\uFF1A</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">git add index.js index.html</span></span>
<span class="line"><span style="color:#A6ACCD;">git commit -m </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">test</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span></code></pre></div><p>\u68C0\u67E5\u901A\u8FC7\uFF0C\u63D0\u4EA4\u6210\u529F\uFF0C\u4E0B\u9762\u662F Prettier \u683C\u5F0F\u5316\u540E\u7684\u4EE3\u7801\uFF1A</p><p><code>index.js</code></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> name </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">CokeBeliever</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(name)</span></span>
<span class="line"></span></code></pre></div><p>\u6839\u636E\u914D\u7F6E <code>semi</code>\uFF0C\u81EA\u52A8\u53BB\u9664\u5C3E\u968F\u5206\u53F7\u3002</p><p><code>index.html</code></p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;!</span><span style="color:#F07178;">doctype</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">lang</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">en</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">charset</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">UTF-8</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">viewport</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">content</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">width=device-width, initial-scale=1.0</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">CokeBeliever</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        \u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p</span></span>
<span class="line"><span style="color:#A6ACCD;">        \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p</span></span>
<span class="line"><span style="color:#A6ACCD;">        \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01\u672A\u683C\u5F0F\u5316\u4E4B\u524D div p \u6807\u7B7E\u5728\u540C\u4E00\u884C\uFF01</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>\u6839\u636E\u914D\u7F6E <code>printWidth</code>\uFF0C\u5F53\u5355\u884C\u5B57\u7B26\u6570\u8D85\u8FC7\u9650\u5236\uFF0C\u81EA\u52A8\u6362\u884C\u3002</p>`,61),e=[o];function t(c,r,D,y,F,i){return a(),n("div",null,e)}const A=s(p,[["render",t]]);export{d as __pageData,A as default};