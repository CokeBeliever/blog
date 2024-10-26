import{_ as s,c as n,o as a,b as e}from"./app.4e6a3a91.js";const D=JSON.parse('{"title":".env \u6587\u4EF6","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u73AF\u5883","slug":"\u73AF\u5883","link":"#\u73AF\u5883","children":[]},{"level":2,"title":"\u4E0D\u8981\u5728 Git \u4E2D\u5B58\u50A8 .env \u6587\u4EF6","slug":"\u4E0D\u8981\u5728-git-\u4E2D\u5B58\u50A8-env-\u6587\u4EF6","link":"#\u4E0D\u8981\u5728-git-\u4E2D\u5B58\u50A8-env-\u6587\u4EF6","children":[{"level":3,"title":"\u95EE\u9898","slug":"\u95EE\u9898","link":"#\u95EE\u9898","children":[]},{"level":3,"title":"\u89E3\u51B3\u65B9\u6848","slug":"\u89E3\u51B3\u65B9\u6848","link":"#\u89E3\u51B3\u65B9\u6848","children":[]}]},{"level":2,"title":".env \u6587\u4EF6\u683C\u5F0F","slug":"env-\u6587\u4EF6\u683C\u5F0F","link":"#env-\u6587\u4EF6\u683C\u5F0F","children":[]},{"level":2,"title":"\u4F7F\u7528","slug":"\u4F7F\u7528","link":"#\u4F7F\u7528","children":[{"level":3,"title":"\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6","slug":"\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6","link":"#\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6","children":[]},{"level":3,"title":"\u5728\u547D\u4EE4\u884C\u4E2D\u8BFB\u53D6","slug":"\u5728\u547D\u4EE4\u884C\u4E2D\u8BFB\u53D6","link":"#\u5728\u547D\u4EE4\u884C\u4E2D\u8BFB\u53D6","children":[]}]}],"relativePath":"front-end-engineering/dot-env-file.md"}'),o={name:"front-end-engineering/dot-env-file.md"},p=e(`<h1 id="env-\u6587\u4EF6" tabindex="-1"><code>.env</code> \u6587\u4EF6 <a class="header-anchor" href="#env-\u6587\u4EF6" aria-hidden="true">#</a></h1><p><code>.env</code> \u662F\u4E00\u4E2A\u7528\u4E8E\u5B58\u50A8\u73AF\u5883\u53D8\u91CF\u7684\u6587\u4EF6\uFF0C\u901A\u5E38\u7528\u4E8E\u5B58\u50A8\u5E94\u7528\u7A0B\u5E8F\u7684\u914D\u7F6E\u4FE1\u606F\u3002\u8FD9\u4E9B\u914D\u7F6E\u4FE1\u606F\u5305\u62EC\uFF1A</p><ul><li>\u6570\u636E\u5E93 URL</li><li>\u5BC6\u94A5</li><li>\u4E00\u4E9B\u4E0D\u5E94\u8BE5\u76F4\u63A5\u5728\u4EE3\u7801\u4E2D\u5199\u5165\u7684\u914D\u7F6E\u4FE1\u606F\u3002</li></ul><p>\u901A\u8FC7\u4F7F\u7528 <code>.env</code> \u6587\u4EF6\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5C06\u8FD9\u4E9B\u654F\u611F\u4FE1\u606F\u4ECE\u4EE3\u7801\u4E2D\u5206\u79BB\u51FA\u6765\uFF0C\u4ECE\u800C\u63D0\u9AD8\u5E94\u7528\u7A0B\u5E8F\u7684\u5B89\u5168\u6027\u548C\u53EF\u7EF4\u62A4\u6027\u3002</p><p>\u4E0B\u9762\u662F\u4E00\u4E2A <code>.env</code> \u6587\u4EF6\u7684\u793A\u4F8B\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">DATABASE_URL=mysql://username:password@localhost:3306/database_name</span></span>
<span class="line"><span style="color:#A6ACCD;">JWT_SECRET=CokeBeliever</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u5728\u5E94\u7528\u7A0B\u5E8F\u8FD0\u884C\u542F\u52A8\u65F6\uFF0C\u5E94\u7528\u7A0B\u5E8F\u4F1A\u8BFB\u53D6 <code>.env</code> \u6587\u4EF6\u4E2D\u7684\u914D\u7F6E\u4FE1\u606F\uFF0C\u5E76\u5C06\u5176\u8BBE\u7F6E\u4E3A\u73AF\u5883\u53D8\u91CF\uFF0C\u4ECE\u800C\u4F7F\u5176\u5728\u6574\u4E2A\u5E94\u7528\u7A0B\u5E8F\u4E2D\u90FD\u53EF\u4EE5\u4F7F\u7528\u3002</p><h2 id="\u73AF\u5883" tabindex="-1">\u73AF\u5883 <a class="header-anchor" href="#\u73AF\u5883" aria-hidden="true">#</a></h2><p>\u5728\u73B0\u4EE3\u5E94\u7528\u7A0B\u5E8F\u7684\u751F\u547D\u5468\u671F\u4E2D\uFF0C\u901A\u5E38\u9700\u8981\u6D89\u53CA\u591A\u4E2A\u72EC\u7ACB\u7684\u73AF\u5883\u3002\u8FD9\u4E9B\u73AF\u5883\u5305\u62EC\uFF1A</p><ul><li><strong>\u5F00\u53D1\u73AF\u5883</strong>\uFF1A\u5F00\u53D1\u4EBA\u5458\u5728\u672C\u5730\u8BA1\u7B97\u673A\u4E0A\u8FDB\u884C\u7F16\u7801\u548C\u8C03\u8BD5\u7684\u73AF\u5883\uFF1B</li><li><strong>\u6D4B\u8BD5\u73AF\u5883</strong>\uFF1A\u7528\u4E8E\u6A21\u62DF\u6700\u7EC8\u7528\u6237\u4EA4\u4E92\u5E76\u6D4B\u8BD5\u5E94\u7528\u7A0B\u5E8F\u7684\u73AF\u5883\uFF1B</li><li><strong>\u751F\u4EA7\u73AF\u5883</strong>\uFF1A\u6700\u7EC8\u7528\u6237\u5C06\u8981\u4F7F\u7528\u7684\u73AF\u5883\u3002</li></ul><p>\u6839\u636E\u5B9A\u4E49\uFF0C\u73AF\u5883\u53D8\u91CF\u662F\u7279\u5B9A\u4E8E\u73AF\u5883\u7684\u3002\u4F8B\u5982\uFF0C\u5728\u4E0D\u540C\u7684\u73AF\u5883\u4E0B\u6211\u4EEC\u9700\u8981\u8BBF\u95EE\u4E0D\u540C\u7684\u6570\u636E\u5E93 URL\u3002\u56E0\u6B64\uFF0C\u6211\u4EEC\u9700\u8981\u4F7F\u7528\u591A\u4E2A\u4E0D\u540C\u7684 <code>.env</code> \u6587\u4EF6\u3002\u53EF\u4EE5\u6839\u636E\u89C4\u8303\u6216\u4E2A\u4EBA\u559C\u597D\u521B\u5EFA\u4E0D\u540C\u7684 <code>.env</code> \u6587\u4EF6\uFF0C\u4F8B\u5982\uFF1A<code>.env.dev</code>\u3001<code>.env.test</code>\u3001<code>.env.prod</code> \u7B49\u7B49\u3002\u8FD9\u6837\u505A\u7684\u597D\u5904\u662F\uFF0C\u6211\u4EEC\u53EF\u4EE5\u6839\u636E\u9700\u8981\u5728\u4E0D\u540C\u7684\u73AF\u5883\u4E2D\u81EA\u7531\u5730\u5207\u6362\uFF0C\u800C\u4E0D\u5FC5\u62C5\u5FC3\u4E0D\u540C\u73AF\u5883\u4E4B\u95F4\u7684\u51B2\u7A81\u3002</p><h2 id="\u4E0D\u8981\u5728-git-\u4E2D\u5B58\u50A8-env-\u6587\u4EF6" tabindex="-1">\u4E0D\u8981\u5728 Git \u4E2D\u5B58\u50A8 <code>.env</code> \u6587\u4EF6 <a class="header-anchor" href="#\u4E0D\u8981\u5728-git-\u4E2D\u5B58\u50A8-env-\u6587\u4EF6" aria-hidden="true">#</a></h2><p>\u7531\u4E8E <code>.env</code> \u6587\u4EF6\u53EF\u80FD\u4F1A\u5305\u542B\u654F\u611F\u4FE1\u606F\uFF0C\u4F8B\u5982\uFF1A\u6570\u636E\u5E93\u7528\u6237\u540D\u548C\u5BC6\u7801\u3001\u5BC6\u94A5\u3002\u56E0\u6B64\uFF0C\u4E3A\u4E86\u786E\u4FDD\u654F\u611F\u4FE1\u606F\u7684\u5B89\u5168\uFF0C\u4F60\u4E0D\u5E94\u8BE5\u5C06 <code>.env</code> \u6587\u4EF6\u63D0\u4EA4\u5230 Git \u5B58\u50A8\u5E93\u6216\u4EFB\u4F55\u5176\u4ED6\u7248\u672C\u63A7\u5236\u7CFB\u7EDF\u3002</p><p>\u4F60\u5E94\u8BE5\u662F\u59CB\u7EC8\u9700\u8981\u5C06 <code>.env</code> \u6DFB\u52A0\u5230 <code>.gitignore</code> \u4E2D\u7684\u5FFD\u7565\u6587\u4EF6\u5217\u8868\uFF0C\u5982\u4E0B\u6240\u793A\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">.env</span></span>
<span class="line"><span style="color:#A6ACCD;">.env.*</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="\u95EE\u9898" tabindex="-1">\u95EE\u9898 <a class="header-anchor" href="#\u95EE\u9898" aria-hidden="true">#</a></h3><blockquote><p>\u5C3D\u7BA1\u4E0D\u8981\u5728 Git \u4E2D\u5B58\u50A8 <code>.env</code> \u6587\u4EF6\u53EF\u4EE5\u907F\u514D\u654F\u611F\u4FE1\u606F\u6CC4\u9732\uFF0C\u4F46\u8FD9\u4E5F\u4F1A\u5E26\u6765\u65B0\u7684\u95EE\u9898\u3002</p></blockquote><p>\u5728\u4F7F\u7528 <code>.env</code> \u6587\u4EF6\u4E0E\u5176\u4ED6\u5F00\u53D1\u4EBA\u5458\u5171\u4EAB\u73AF\u5883\u53D8\u91CF\u65F6\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u4E00\u4E9B\u9EBB\u70E6\u3002\u4F8B\u5982\uFF0C\u5982\u679C\u5176\u4E2D\u4E00\u4E2A\u56E2\u961F\u6210\u5458\u66F4\u6539\u4E86 <code>.env</code> \u6587\u4EF6\u4E2D\u7684\u67D0\u4E9B\u73AF\u5883\u53D8\u91CF\uFF0C\u90A3\u4E48\u4ED6\u5C06\u9700\u8981\u901A\u77E5\u6240\u6709\u7684\u5F00\u53D1\u4EBA\u5458\u5E76\u8BA9\u4ED6\u4EEC\u5728\u81EA\u5DF1\u7684 <code>.env</code> \u6587\u4EF6\u4E2D\u66F4\u6539\u76F8\u5E94\u7684\u73AF\u5883\u53D8\u91CF\uFF0C\u5426\u5219\u5176\u4ED6\u5F00\u53D1\u6210\u5458\u53EF\u80FD\u4F1A\u9047\u5230\u95EE\u9898\uFF0C\u56E0\u4E3A\u4ED6\u4EEC\u7684\u672C\u5730\u73AF\u5883\u4E0E\u5176\u4ED6\u4EBA\u7684\u73AF\u5883\u4E0D\u540C\u3002\u8FD9\u4E0D\u53EF\u907F\u514D\u4F1A\u4EA7\u751F\u6781\u5927\u7684\u6C9F\u901A\u548C\u534F\u8C03\u6210\u672C\uFF0C\u7279\u522B\u662F\u5728\u56E2\u961F\u89C4\u6A21\u8F83\u5927\u65F6\u3002</p><p>\u5C3D\u7BA1\u5B58\u5728\u95EE\u9898\uFF0C\u4F46\u662F\u76EE\u524D\u6CA1\u6709\u9ED8\u8BA4\u89E3\u51B3\u65B9\u6848\u3002</p><h3 id="\u89E3\u51B3\u65B9\u6848" tabindex="-1">\u89E3\u51B3\u65B9\u6848 <a class="header-anchor" href="#\u89E3\u51B3\u65B9\u6848" aria-hidden="true">#</a></h3><p><strong><code>.env.example</code> \u6587\u4EF6</strong></p><p>\u4E00\u79CD\u7B80\u5355\u7684\u89E3\u51B3\u65B9\u6848\u662F\u521B\u5EFA\u4E00\u4E2A\u793A\u4F8B\u7684 <code>.env.example</code> \u6587\u4EF6\uFF0C\u5E76\u5C06\u5176\u5B58\u50A8\u5728 Git \u4E2D\u3002\u8BE5\u793A\u4F8B\u6587\u4EF6\u5305\u542B\u4E86 <code>.env</code> \u6587\u4EF6\u6240\u6709\u73AF\u5883\u53D8\u91CF\u540D\u79F0\uFF0C\u4F46\u4E0D\u5305\u542B\u5177\u4F53\u7684\u73AF\u5883\u53D8\u91CF\u503C\u3002\u8FD9\u6837\uFF0C\u6BCF\u4E2A\u5F00\u53D1\u4EBA\u5458\u90FD\u53EF\u4EE5\u4E86\u89E3\u5E94\u7528\u7A0B\u5E8F\u6240\u9700\u7684\u73AF\u5883\u53D8\u91CF\u3002</p><p>\u5982\u679C\u4F60\u4E0D\u60F3\u624B\u52A8\u590D\u5236\u6587\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u4ECE\u7EC8\u7AEF\u751F\u6210\u6587\u4EF6\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">sed &#39;s/=.*/=/&#39; .env &gt; .env.example</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p><strong>\u5176\u4ED6</strong></p><p>\u5176\u4ED6\u89E3\u51B3\u65B9\u6848\uFF0C\u4F8B\u5982\uFF1Adotenv-vault\u3002</p><h2 id="env-\u6587\u4EF6\u683C\u5F0F" tabindex="-1"><code>.env</code> \u6587\u4EF6\u683C\u5F0F <a class="header-anchor" href="#env-\u6587\u4EF6\u683C\u5F0F" aria-hidden="true">#</a></h2><p><code>.env</code> \u6587\u4EF6\u662F\u4E00\u4E2A\u884C\u5206\u9694\u7684\u6587\u672C\u6587\u4EF6\uFF0C\u6BCF\u4E00\u884C\u8868\u793A\u4E00\u4E2A\u73AF\u5883\u53D8\u91CF\u3002\u6309\u7167\u60EF\u4F8B\uFF0C\u53D8\u91CF\u540D\u79F0\u7531\u4EE5\u4E0B\u5212\u7EBF\u5206\u9694\u7684\u5927\u5199\u5355\u8BCD\u7EC4\u6210\u3002\u53D8\u91CF\u540D\u79F0\u548C\u53D8\u91CF\u503C\u4E4B\u95F4\u7531 <code>=</code> \u5206\u9694\u3002\u4F8B\u5982\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">DATABASE_HOST=localhost</span></span>
<span class="line"><span style="color:#A6ACCD;">DATABASE_PORT=5432</span></span>
<span class="line"><span style="color:#A6ACCD;">DATABASE_USER=myuser</span></span>
<span class="line"><span style="color:#A6ACCD;">DATABASE_PASSWORD=mypass</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p><code>.env</code> \u6587\u4EF6\u652F\u6301\u5355\u884C\u6CE8\u91CA\uFF0C\u6CE8\u91CA\u4EE5 <code>#</code> \u5F00\u5934\u3002\u4F8B\u5982\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;"># \u8FD9\u662F\u6CE8\u91CA</span></span>
<span class="line"><span style="color:#A6ACCD;">DATABASE_HOST=localhost # \u8FD9\u662F\u6CE8\u91CA</span></span>
<span class="line"><span style="color:#A6ACCD;">DATABASE_PORT=5432</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="\u4F7F\u7528" tabindex="-1">\u4F7F\u7528 <a class="header-anchor" href="#\u4F7F\u7528" aria-hidden="true">#</a></h2><p>\u6BCF\u79CD\u7F16\u7A0B\u8BED\u8A00\u548C\u5F00\u53D1\u6846\u67B6\u90FD\u6709\u81EA\u5DF1\u7684\u5904\u7406 <code>.env</code> \u6587\u4EF6\u7684\u65B9\u6CD5\u3002\u4E0B\u9762\u5C31\u4EE5 JavaScript \u7684 Node.js \u8FD0\u884C\u65F6\u4E3A\u793A\u4F8B\u3002</p><p>\u9996\u5148\uFF0C\u521B\u5EFA\u4E00\u4E2A\u9879\u76EE\u76EE\u5F55\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">mkdir env-demo</span></span>
<span class="line"><span style="color:#A6ACCD;">cd ./env-demo</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u521B\u5EFA <code>package.json</code> \u6587\u4EF6\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm init -y</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u521D\u59CB\u5316 Git \u4ED3\u5E93\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">git init</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u5728\u9879\u76EE\u7684\u6839\u76EE\u5F55\u4E0B\u521B\u5EFA\u4E00\u4E2A <code>.gitignore</code> \u6587\u4EF6\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">.env</span></span>
<span class="line"><span style="color:#A6ACCD;">.env.*</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u5728\u9879\u76EE\u7684\u6839\u76EE\u5F55\u4E0B\u521B\u5EFA\u4E00\u4E2A <code>.env</code> \u6587\u4EF6\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">S3_BUCKET=YOURS3BUCKET</span></span>
<span class="line"><span style="color:#A6ACCD;">SECRET_KEY=YOURSECRETKEYGOESHERE</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u8FD9\u6837\uFF0C\u6211\u4EEC\u51C6\u5907\u5DE5\u4F5C\u5C31\u5DF2\u7ECF\u505A\u597D\u4E86\u3002</p><h3 id="\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6" tabindex="-1">\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6 <a class="header-anchor" href="#\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6" aria-hidden="true">#</a></h3><p>\u5B89\u88C5 <code>dotenv</code>\uFF0C\u5B83\u53EF\u4EE5<strong>\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D</strong>\u5C06\u73AF\u5883\u53D8\u91CF\u4ECE <code>.env</code> \u6587\u4EF6\u52A0\u8F7D\u5230 <code>p<wbr>rocess.env</code> \u4E2D\u3002</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm i dotenv</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u521B\u5EFA <code>index.js</code> \u6587\u4EF6\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">dotenv</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">config</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(process</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">env)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u8FD0\u884C <code>node index.js</code> \u53EF\u4EE5\u770B\u5230\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6 <code>.env</code> \u6587\u4EF6\u914D\u7F6E\u7684\u73AF\u5883\u53D8\u91CF\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	// ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  S3_BUCKET: &#39;YOURS3BUCKET&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  SECRET_KEY: &#39;YOURSECRETKEYGOESHERE&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p><strong>\u81EA\u5B9A\u4E49\u8BFB\u53D6</strong></p><p>\u6211\u4EEC\u4E5F\u53EF\u4EE5\u81EA\u5B9A\u4E49\u8BFB\u53D6\u914D\u7F6E\u6587\u4EF6\u3002</p><p>\u521B\u5EFA <code>.env.dev</code> \u6587\u4EF6\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">NODE_ENV=dev</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u521B\u5EFA <code>.env.prod</code> \u6587\u4EF6\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">NODE_ENV=prod</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u4FEE\u6539 <code>index.js</code> \u5185\u5BB9\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">dotenv</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">config</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">path</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">.env.dev</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">// require(&#39;dotenv&#39;).config({ path: &#39;.env.prod&#39; });</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(process</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">env)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u8FD0\u884C <code>node index.js</code> \u53EF\u4EE5\u770B\u5230\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6 <code>.env.dev</code> \u6216 <code>.env.prod</code> \u6587\u4EF6\u914D\u7F6E\u7684\u73AF\u5883\u53D8\u91CF\uFF1A</p><h3 id="\u5728\u547D\u4EE4\u884C\u4E2D\u8BFB\u53D6" tabindex="-1">\u5728\u547D\u4EE4\u884C\u4E2D\u8BFB\u53D6 <a class="header-anchor" href="#\u5728\u547D\u4EE4\u884C\u4E2D\u8BFB\u53D6" aria-hidden="true">#</a></h3><p>\u5B89\u88C5 <code>dotenv-cli</code>\uFF0C\u5B83\u53EF\u4EE5<strong>\u5728\u547D\u4EE4\u884C\u4E2D</strong>\u5C06\u73AF\u5883\u53D8\u91CF\u4ECE <code>.env</code> \u6587\u4EF6\u52A0\u8F7D\u5230 <code>p<wbr>rocess.env</code> \u4E2D\u3002</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm i dotenv-cli --save-dev</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u4FEE\u6539 <code>index.js</code> \u5185\u5BB9\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(process</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">env)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u8FD0\u884C <code>npx dotenv node index.js</code> \u53EF\u4EE5\u770B\u5230\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6 <code>.env</code> \u6587\u4EF6\u914D\u7F6E\u7684\u73AF\u5883\u53D8\u91CF\uFF1A</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	// ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  S3_BUCKET: &#39;YOURS3BUCKET&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  SECRET_KEY: &#39;YOURSECRETKEYGOESHERE&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p><strong>\u81EA\u5B9A\u4E49\u8BFB\u53D6</strong></p><p>\u6211\u4EEC\u4E5F\u53EF\u4EE5\u81EA\u5B9A\u4E49\u8BFB\u53D6\u914D\u7F6E\u6587\u4EF6\u3002</p><p>\u4E3A\u4E86\u65B9\u4FBF\uFF0C\u6211\u4EEC\u4FEE\u6539 <code>package.json</code> \u6587\u4EF6 <code>scripts</code> \u90E8\u5206\uFF1A</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">dev</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">dotenv -e .env.dev node index.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">prod</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">dotenv -e .env.prod node index.js</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u8FD0\u884C <code>npm run dev</code> \u6216 <code>npm run prod</code> \u53EF\u4EE5\u770B\u5230\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5728\u5E94\u7528\u7A0B\u5E8F\u4E2D\u8BFB\u53D6 <code>.env.dev</code> \u6216 <code>.env.prod</code> \u6587\u4EF6\u914D\u7F6E\u7684\u73AF\u5883\u53D8\u91CF\u3002</p>`,72),l=[p];function c(t,d,r,i,C,A){return a(),n("div",null,l)}const v=s(o,[["render",c]]);export{D as __pageData,v as default};