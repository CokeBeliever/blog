# 分块上传

分块上传是一种文件上传的方式，通常用于上传 "大型文件" 到云存储或服务器。它的原理是将大文件分割成多个较小的块，然后分别上传这些块，最后在服务器端将这些块合并成完整的文件。这种方法主要有以下优点：

1. **稳定性**：如果在传输过程中出现网络中断或其他问题，只需重新上传丢失或损坏的分块，而不需要重新上传整个文件。这种稳定性使得分块上传在处理大型文件或在不稳定网络环境下尤为可靠。
2. **并发性**：分块上传可以并行上传多个分块，它的上传速度理论上要快于单个文件的上传。
3. **节省资源**：分块上传允许用户从上传中断处继续上传，而无需重新上传整个文件，从而节省了时间和网络资源。更进一步，当用户再次上传相同文件时，分块上传技术还能实现 "秒传" 的效果，这一优势也节省了服务器存储空间。
4. **断点续传**：用户可以随时暂停上传，然后在需要时继续上传，而已上传的分块数据不会丢失。

## 基本思路

分块上传的基本思路是将大文件分割成多个较小的块，然后逐个上传这些块到服务端。这个过程通常包括以下几个步骤：

1. **文件分块**：客户端将要上传的文件分割成多个固定大小的块，并计算出文件和分块的哈希值。这些块的大小可以根据需求和服务端要求进行设置，通常在几百 KB 到几 MB 之间。
2. **文件级别校验（可选）**：客户端可以请求服务端，通过文件哈希值，以确定是否有相同的文件已经存在于服务端。如果服务端上已经存在具有相同哈希值的文件，那么客户端可以避免二次上传文件。
3. **块级别校验（可选）**：客户端可以请求服务端，通过分块哈希值，以确定是否有相同的分块已经存在于服务端。如果服务端上已经存在具有相同哈希值的分块，那么客户端可以直接跳过该分块上传。
4. **分块上传**：客户端将每个块逐个上传到服务端。
5. **分块合并**：一旦所有分块都成功上传到服务端，服务端可以按照其顺序将这些块合并成完整的文件。这个过程可能需要对块进行排序和组装，以确保文件的完整性和正确性。

## 实现

为了模拟这个过程，我们采用以下技术：

- 客户端：
  - 浏览器（运行环境）
  - vue3（web 单页面应用框架）
  - spark-md5（计算 hash 库）
  - axios（http 请求库）
  - element-plus（ui 组件库）
- 服务端：
  - nodejs（运行环境）
  - express（web 服务框架）
  - multer（文件处理库）
  - body-parser（请求实体解析库）

### 初始化项目

创建并进入项目目录：

```
mkdir split-chunks-upload
cd split-chunks-upload
git init
echo "node_modules" > .gitignore
```

**客户端**

初始化项目：

```bash
npm create vue@latest
√ 请输入项目名称： ... client
√ 是否使用 TypeScript 语法？ ... 否 / 是
√ 是否启用 JSX 支持？ ... 否 / 是
√ 是否引入 Vue Router 进行单页面应用开发？ ... 否 / 是
√ 是否引入 Pinia 用于状态管理？ ... 否 / 是
√ 是否引入 Vitest 用于单元测试？ ... 否 / 是
√ 是否要引入一款端到端（End to End）测试工具？ » 不需要
√ 是否引入 ESLint 用于代码质量检测？ ... 否 / 是
√ 是否引入 Vue DevTools 7 扩展用于调试? (试验阶段) ... 否 / 是

项目初始化完成，可执行以下命令：
cd client
npm install
npm run dev
```

由于前后端分离的原因，为了避免跨域请求，我们可以配置请求代理，修改 `vite.config.js` 内容如下：

```js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/files": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

安装依赖：

```bash
npm install spark-md5 axios element-plus
```

**为了方便，我们先删除 `src` 中的所有文件/目录。**

初始化入口文件，创建 `src/main.js` 内容如下：

```js
import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
```

初始化页面，创建 `src/App.vue` 内容如下：

```vue
<template>
  <div style="padding: 40px">
    <input type="file" @change="onChangeFileUploadInput" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import axios from "axios";

/**
 * 事件监听，change on 文件上传输入框
 * @param {*} event 事件对象
 */
const onChangeFileUploadInput = (event) => {
  const file = event.target.files[0];
  console.log("file", file);
};
</script>
```

为了在上传文件的过程中控制 UI 效果（按钮启用/禁用、文本显示/隐藏等），我们可以定义以下状态：

**文件：**

- 未选择：未选择文件。
- 未上传：未上传文件。
- 校验中：正在预处理文件（文件分块、生成 hash 值、文件级别校验）。
- 上传中：正在上传所有分块。
- 上传失败：存在分块上传失败。
- 合并中：正在合并分块。
- 合并成功：分块合并成功。
- 合并失败：分块合并失败。

**分块：**

- 未上传：未上传分块。
- 校验中：正在分块级别校验。
- 上传中：正在上传分块。
- 上传成功：分块上传成功。
- 上传失败：分块上传失败。

因此，我们可以创建 `src/consts/file.js`，内容如下：

```js
/** 文件状态到值的映射 */
export const FILE_STATUS_TO_VALUE_MAP = {
  /** 未选择 */
  NOT_SELECTED: 0,
  /** 未上传 */
  NOT_UPLOADED: 1,
  /** 校验中 */
  VALIDATING: 2,
  /** 上传中 */
  UPLOADING: 3,
  /** 上传失败 */
  UPLOAD_FAILED: 4,
  /** 合并中 */
  MERGING: 5,
  /** 合并成功 */
  MERGE_SUCCESSFUL: 6,
  /** 合并失败 */
  MERGE_FAILED: 7,
};

/**
 * 文件状态值到中文的映射
 */
export const FILE_STATUS_VALUE_TO_ZHCN_MAP = {
  [FILE_STATUS_TO_VALUE_MAP.NOT_SELECTED]: "未选择",
  [FILE_STATUS_TO_VALUE_MAP.NOT_UPLOADED]: "未上传",
  [FILE_STATUS_TO_VALUE_MAP.VALIDATING]: "校验中",
  [FILE_STATUS_TO_VALUE_MAP.UPLOADING]: "上传中",
  [FILE_STATUS_TO_VALUE_MAP.UPLOAD_FAILED]: "上传失败",
  [FILE_STATUS_TO_VALUE_MAP.MERGING]: "合并中",
  [FILE_STATUS_TO_VALUE_MAP.MERGE_SUCCESSFUL]: "合并成功",
  [FILE_STATUS_TO_VALUE_MAP.MERGE_FAILED]: "合并失败",
};

/** 分块状态到值的映射 */
export const CHUNK_STATUS_TO_VALUE_MAP = {
  /** 未上传 */
  NOT_UPLOADED: 0,
  /** 校验中 */
  VALIDATING: 1,
  /** 上传中 */
  UPLOADING: 2,
  /** 上传成功 */
  UPLOAD_SUCCESSFUL: 3,
  /** 上传失败 */
  UPLOAD_FAILED: 4,
};

/**
 * 分块状态值到中文的映射
 */
export const CHUNK_STATUS_VALUE_TO_ZHCN_MAP = {
  [CHUNK_STATUS_TO_VALUE_MAP.NOT_UPLOADED]: "未上传",
  [CHUNK_STATUS_TO_VALUE_MAP.VALIDATING]: "校验中",
  [CHUNK_STATUS_TO_VALUE_MAP.UPLOADING]: "上传中",
  [CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_SUCCESSFUL]: "上传成功",
  [CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_FAILED]: "上传失败",
};
```

为了在上传文件的过程中控制上传（并发量、暂停/继续），我们可以定义一个上传辅助类，创建 `src/utils/upload-helper.js` 内容如下：

```js
/**
 * 上传辅助类
 * @param {number} maxConcurrent 最大上传并发数
 */
export default class UploadHelper {
  constructor(maxConcurrent = 5) {
    /** 上传任务队列 */
    this.queue = [];
    /** 当前上传并发数 */
    this.currConcurrent = 0;
    /** 最大上传并发数 */
    this.maxConcurrent = maxConcurrent;
    /** 是否暂停上传 */
    this.paused = false;
  }

  /**
   * 添加上传任务
   * @param {() => Promise<any>} task 上传任务
   */
  enqueue(task) {
    this.queue.push(task);
  }

  /**
   * 移除上传任务
   * @returns {() => Promise<any>} 上传任务
   */
  dequeue() {
    return this.queue.shift();
  }

  /**
   * 刷新上传队列
   */
  flush() {
    const { queue, maxConcurrent, paused } = this;

    // 如果 "队列不为空"、"未达到最大并发数" 和 "未暂停上传"，那么刷新
    while (queue.length > 0 && this.currConcurrent < maxConcurrent && !paused) {
      const task = this.dequeue();

      task().finally(() => {
        this.currConcurrent--;
        this.flush();
      });
      this.currConcurrent++;
    }
  }

  /**
   * 暂停上传
   */
  pause() {
    this.paused = true;
  }

  /**
   * 恢复上传
   */
  resume() {
    this.paused = false;
    this.flush();
  }
}
```

现在，我们可以开始定义页面所需的 UI 和 数据结构，修改 `src/App.vue` 如下所示：

```vue
<template>
  <div style="padding: 40px">
    <!-- 上传文件输入框，当文件 "校验中"、"上传中" 或 "合并中" 状态禁用 -->
    <input
      type="file"
      :disabled="
        file.status === FILE_STATUS_TO_VALUE_MAP.VALIDATING ||
        file.status === FILE_STATUS_TO_VALUE_MAP.UPLOADING ||
        file.status === FILE_STATUS_TO_VALUE_MAP.MERGING
      "
      @change="onChangeFileUploadInput"
    />

    <!-- 上传设置表单，当文件 "未上传" 状态可用 -->
    <el-form
      label-width="160px"
      style="margin-top: 20px"
      :disabled="file.status !== FILE_STATUS_TO_VALUE_MAP.NOT_UPLOADED"
    >
      <el-form-item label="分块校验并发数">
        <el-slider
          v-model="chunkValidateHelper.maxConcurrent"
          :step="1"
          :min="1"
          :max="100"
          show-input
        />
      </el-form-item>
      <el-form-item label="分块上传并发数">
        <el-slider
          v-model="chunkUploadHelper.maxConcurrent"
          :step="1"
          :min="1"
          :max="100"
          show-input
        />
      </el-form-item>
      <el-form-item label="分块大小">
        <el-slider
          v-model="file.chunkSize"
          :step="1024 * 1024"
          :min="1024 * 1024"
          :max="100 * 1024 * 1024"
          show-input
          :format-tooltip="(value) => `${value / 1024 / 1024}MB`"
        />
      </el-form-item>
    </el-form>

    <el-descriptions
      border
      title="文件信息"
      style="margin-top: 20px"
      :column="2"
    >
      <template #extra>
        <!-- 暂停上传按钮，当文件 "上传中" 状态可用 -->
        <el-button
          type="primary"
          :disabled="file.status !== FILE_STATUS_TO_VALUE_MAP.UPLOADING"
          @click="onClickPauseOrContinueButton"
        >
          {{ chunkUploadHelper.paused ? "继续上传" : "暂停上传" }}
        </el-button>
        <!-- 上传文件按钮，当文件 "未上传" 状态可用 -->
        <el-button
          type="primary"
          :disabled="file.status !== FILE_STATUS_TO_VALUE_MAP.NOT_UPLOADED"
          @click="onClickUploadFileButton"
        >
          上传文件
        </el-button>
      </template>
      <el-descriptions-item label="标识（hash）">
        {{ file.hash }}
      </el-descriptions-item>
      <el-descriptions-item label="名称">
        {{ file.raw?.name }}
      </el-descriptions-item>
      <el-descriptions-item label="类型">
        {{ file.raw?.type }}
      </el-descriptions-item>
      <el-descriptions-item label="大小">
        {{ file.raw?.size }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag>{{ FILE_STATUS_VALUE_TO_ZHCN_MAP[file.status] }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="上传进度">
        {{ file.percentage }}
      </el-descriptions-item>
      <el-descriptions-item label="文件链接">
        <!-- 文件链接，当文件 "合并成功" 状态可用 -->
        <el-link
          target="_blank"
          :href="file.href"
          :disabled="file.status !== FILE_STATUS_TO_VALUE_MAP.MERGE_SUCCESSFUL"
        >
          查看文件
        </el-link>
      </el-descriptions-item>
    </el-descriptions>

    <h4>分块列表</h4>
    <el-table
      border
      size="small"
      style="margin-top: 20px"
      :data="file.chunkList"
      :height="400"
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="hash" label="标识（hash）" min-width="160" />
      <el-table-column prop="status" label="状态" width="160">
        <template #default="scope">
          <el-tag>
            {{ CHUNK_STATUS_VALUE_TO_ZHCN_MAP[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template #default="scope">
          <!-- 重新上传按钮，当分块 "上传失败" 状态可用 -->
          <el-button
            type="primary"
            size="small"
            link
            :disabled="
              scope.row.status !== CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_FAILED
            "
            @click="onClickReUploadButton(scope.row, scope.$index)"
          >
            重新上传
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import axios from "axios";
import {
  FILE_STATUS_TO_VALUE_MAP,
  FILE_STATUS_VALUE_TO_ZHCN_MAP,
  CHUNK_STATUS_TO_VALUE_MAP,
  CHUNK_STATUS_VALUE_TO_ZHCN_MAP,
} from "@/consts/file";
import UploadHelper from "@/utils/upload-helper";

/** 分块校验辅助对象 */
const chunkValidateHelper = reactive(new UploadHelper(10));
/** 分块上传辅助对象 */
const chunkUploadHelper = reactive(new UploadHelper(10));
/** 文件对象 */
const file = ref({
  /** 文件原始对象 */
  raw: null,
  /**
   * 文件哈希值
   */
  hash: "",
  /**
   * 文件链接
   */
  href: "",
  /**
   * 文件上传进度
   */
  percentage: computed(() => {
    const chunkList = file.value.chunkList;
    const chunkCount = chunkList.length;
    const uploadedChunkList = chunkList.filter(
      (chunk) => chunk.status === CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_SUCCESSFUL
    );
    const uploadedChunkCount = uploadedChunkList.length;

    return `${uploadedChunkCount}/${chunkCount}`;
  }),
  /**
   * 文件状态
   */
  status: FILE_STATUS_TO_VALUE_MAP.NOT_SELECTED,
  /**
   * 分块大小
   */
  chunkSize: 20 * 1024 * 1024,
  /**
   * @type {Array<{raw: Blob, hash: string, status: number}>} 分块列表
   *  - raw: 分块数据
   *  - hash: 分块哈希值
   *  - status: 分块状态
   */
  chunkList: [],
});

/**
 * 事件监听，change on 文件上传输入框
 * @param {*} event 事件对象
 */
const onChangeFileUploadInput = (event) => {
  const fileValue = file.value;
  fileValue.raw = event.target.files[0];
  fileValue.hash = "";
  fileValue.href = "";
  fileValue.status = fileValue.raw
    ? FILE_STATUS_TO_VALUE_MAP.NOT_UPLOADED
    : FILE_STATUS_TO_VALUE_MAP.NOT_SELECTED;
  fileValue.chunkList = [];
};

/**
 * 事件监听，click on 上传文件按钮
 */
const onClickUploadFileButton = async () => {
  const fileValue = file.value;
  const { raw: fileRaw, chunkSize, chunkList } = fileValue;
  const fileExt = fileRaw.name.split(".").pop();
  let fileHash = "";

  // todo：文件分块
  {
  }

  // todo: 文件级别校验（可选）
  {
  }

  // todo: 块级别校验（可选）
  {
  }

  // todo: 分块上传
  {
  }

  // todo: 分块合并
  {
  }
};

/**
 * 事件监听，click on 暂停/继续按钮
 */
const onClickPauseOrContinueButton = () => {
  chunkUploadHelper.paused
    ? chunkUploadHelper.resume()
    : chunkUploadHelper.pause();
};

/**
 * 事件监听，click on 重新上传按钮
 * @param {*} chunk 分块对象
 * @param {number} index 分块索引
 */
const onClickReUploadButton = (chunk, index) => {
  uploadChunk(chunk, index);
};

/**
 * 上传分块
 * @param {Blob} chunk 分块数据
 * @param {number} chunkIndex 分块顺序
 * @returns {Promise} 上传结果
 */
const uploadChunk = (chunk, chunkIndex) => {
  const { hash: fileHash, chunkSize } = file.value;
  const formData = new FormData();

  // 文件哈希值
  formData.append("fileHash", fileHash);
  // 分块大小
  formData.append("chunkSize", chunkSize);
  // 分块顺序
  formData.append("chunkIndex", chunkIndex);
  // 分块哈希值
  formData.append("chunkHash", chunk.hash);
  // 分块数据
  formData.append("chunk", chunk.raw);

  return new Promise((resolve, reject) => {
    chunkUploadHelper.enqueue(() => {
      chunk.status = CHUNK_STATUS_TO_VALUE_MAP.UPLOADING;
      return axios
        .post("/api/upload/chunk", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          chunk.status = CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_SUCCESSFUL;
          resolve();
        })
        .catch(() => {
          chunk.status = CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_FAILED;
          reject();
        });
    });

    chunkUploadHelper.flush();
  });
};
</script>
```

**服务端**

初始化项目：

```bash
cd split-chunks-upload
mkdir server
cd server
npm init -y
```

安装依赖：

```bash
npm install express multer body-parser
```

为了方便，在 `package.json` 中，新增 script 如下：

```json
{
  "scripts": {
    "dev": "node index.js"
  }
}
```

在项目根目录下，创建 `index.js` 文件，内容如下：

```js
const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();
/** 服务端端口 */
const SERVER_PORT = 3000;
/** 文件链接前缀 */
const FILE_HREF_PREV = "/files";
/** 文件存储路径 */
const FILES_PATH = path.resolve(__dirname, "files");
/** 分块存储路径 */
const CHUNKS_PATH = path.resolve(__dirname, "chunks");
/** 分块上传 Multer */
const chunkUploadMulter = multer({
  storage: multer.diskStorage({
    // 定义分块存储路径
    destination: (req, file, cb) => {
      const { fileHash, chunkSize } = req.body;
      // 由于文件和分块是一对多的关系，并且相同文件在不同分块大小下产生的分块内容和数量不同
      // 因此，分块存储路径需要根据文件哈希值和分块大小生成，我们可以采用 fileHash/chunkSize/ 的路径结构来存储分块
      const filePath = path.resolve(CHUNKS_PATH, fileHash, String(chunkSize));
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      cb(null, filePath);
    },
    // 定义分块文件名
    filename: (req, file, cb) => {
      const { chunkHash, chunkIndex } = req.body;
      // 为了保证分块的唯一性和分块顺序，我们可以采用 chunkHash_chunkIndex 的分块文件名格式（即：分块哈希值_分块序号）
      cb(null, `${chunkHash}_${chunkIndex}`);
    },
  }),
  limits: {
    fileSize: Infinity,
  },
});

// 初始化文件存储路径
if (!fs.existsSync(FILES_PATH)) {
  fs.mkdirSync(FILES_PATH, { recursive: true });
}
// 初始化分块存储路径
if (!fs.existsSync(CHUNKS_PATH)) {
  fs.mkdirSync(CHUNKS_PATH, { recursive: true });
}

// 静态文件请求处理
app.use(FILE_HREF_PREV, express.static(FILES_PATH));
// 解析请求体
app.use(bodyParser.json());

// 上传分块
app.post(
  "/upload/chunk",
  chunkUploadMulter.single("chunk"),
  (req, res, next) => {
    res.json({
      code: 200,
      data: null,
      message: "分块上传成功",
    });
  }
);

// 启动服务
app.listen(SERVER_PORT, () => {
  console.log(`文件存储路径：${FILES_PATH}`);
  console.log(`分块存储路径：${CHUNKS_PATH}`);
  console.log(`启动服务地址：http://localhost:${SERVER_PORT}`);
});
```

至此，项目初始化阶段已经完成，接下来将是分块上传的关键阶段。

### 文件分块

> 该步骤主要是为了：
>
> 1. 获取文件所有分块（分块数据、分块哈希值等），用于后续阶段的 "块级别校验" 和 "分块上传"。
> 2. 获取文件哈希值，用于后续阶段的 "文件级别校验"。

**客户端**

我们可以把文件分块逻辑封装为一个独立函数，新建 `src/utils/file.js` 内容如下：

```js
import SparkMd5 from "spark-md5";

/**
 * 文件分块
 * @param {File} file 文件对象
 * @param {number} chunkSize 分块大小
 * @param {Function | undefined} callback 分块上传进度回调函数
 * @returns {Promise <{fileHash: string, chunkList: Array<{raw: Blob, hash: string}>}} Promise 对象
 */
export const splitChunks = (file, chunkSize, callback) => {
  return new Promise((resolve, reject) => {
    /** 开始时间 */
    const startTime = Date.now();
    /** 文件大小 */
    const fileSize = file.size;
    /** 分块列表 */
    const chunkList = [];
    /** 分块方法 */
    const fileSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    /** 分块总数量 */
    const totalChunk = Math.ceil(fileSize / chunkSize);
    /** 当前分块索引 */
    let currChunkIndex = 0;
    const sparkMd5 = new SparkMd5.ArrayBuffer();
    const fileReader = new FileReader();
    const loadNextChunk = () => {
      const start = currChunkIndex * chunkSize;
      const end = start + chunkSize >= fileSize ? fileSize : start + chunkSize;

      fileReader.readAsArrayBuffer(fileSlice.call(file, start, end));
    };

    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const chunk = {
        raw: new Blob([arrayBuffer]),
        hash: SparkMd5.ArrayBuffer.hash(arrayBuffer),
      };
      console.log(`chunk 序号：${currChunkIndex + 1}/${totalChunk}`);
      console.log(`chunk 哈希值：${chunk.hash}`);

      Object.assign(
        chunk,
        callback && callback(chunk, currChunkIndex, totalChunk)
      );
      sparkMd5.append(arrayBuffer);
      chunkList.push(chunk);

      // 下一分块索引
      currChunkIndex++;
      if (currChunkIndex < totalChunk) {
        loadNextChunk();
      } else {
        const fileHash = sparkMd5.end();
        console.log(`file 读取分块完成, 总耗时：${Date.now() - startTime}ms`);
        console.log(`file 哈希值：${fileHash}`);
        resolve({ fileHash, chunkList });
      }
    };

    fileReader.onerror = () => {
      reject("fileReader.onerror：读取文件出错！");
    };

    loadNextChunk();
  });
};
```

然后，在 `src/App.vue` 中引入使用，内容如下：

```vue
<template>//...</template>

<script setup>
// ...
import { splitChunks } from "@/utils/file";

/**
 * 事件监听，click on 上传文件按钮
 */
const onClickUploadFileButton = async () => {
  // ...

  // todo：文件分块
  {
    fileValue.status = FILE_STATUS_TO_VALUE_MAP.VALIDATING;
    const splitChunksResult = await splitChunks(
      fileRaw,
      chunkSize,
      (chunk, index, total) => {
        chunkList.push({
          ...chunk,
          status: CHUNK_STATUS_TO_VALUE_MAP.NOT_UPLOADED,
        });
      }
    );
    fileValue.hash = fileHash = splitChunksResult.fileHash;
  }

  // todo: 文件级别校验（可选）
  {
  }

  // todo: 块级别校验（可选）
  {
  }

  // todo: 分块上传
  {
  }

  // todo: 分块合并
  {
  }
};

// ...
</script>
```

**服务端**

暂无涉及。

### 文件级别校验（可选）

> 该步骤主要是为了避免不必要的二次上传相同文件：
>
> 1. 避免相同文件的重复存储，从而减少对服务器存储空间的占用。
> 2. 避免相同文件的再次上传过程，从而减少对服务器网络带宽和 I/O 等资源的占用。

**客户端**

继续编写 `onClickUploadFileButton`，内容如下：

```vue
<template>//...</template>

<script setup>
// ...

/**
 * 事件监听，click on 上传文件按钮
 */
const onClickUploadFileButton = async () => {
  // ...

  // todo：文件分块
  {
    // ...
  }

  // todo: 文件级别校验（可选）
  {
    const validateFileResult = await axios
      .get(`/api/upload/validate-file/${fileHash}`, {
        params: {
          fileExt,
        },
      })
      .then((res) => res.data.data);

    // 如果 "文件" 在服务器存在，那么 "文件" 合并成功
    if (validateFileResult) {
      chunkList.forEach((chunk) => {
        chunk.status = CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_SUCCESSFUL;
      });
      fileValue.status = FILE_STATUS_TO_VALUE_MAP.MERGE_SUCCESSFUL;
      fileValue.href = await axios
        .get(`/api/upload/get-file-href/${fileHash}`, {
          params: { fileExt },
        })
        .then((res) => res.data.data);
      return;
    }
  }

  // todo: 块级别校验（可选）
  {
  }

  // todo: 分块上传
  {
  }

  // todo: 分块合并
  {
  }
};

// ...
</script>
```

**服务端**

这里服务端需要提供以下接口：

- 判断文件是否存在
- 获取文件链接

在 `index.js` 中，新增内容如下：

```js
// ...

// 判断文件是否存在
app.get("/upload/validate-file/:fileHash", (req, res, next) => {
  const { fileHash } = req.params;
  const { fileExt } = req.query;
  const result = fs.existsSync(
    path.resolve(FILES_PATH, `${fileHash}.${fileExt}`)
  );

  res.json({
    code: 200,
    data: result,
    message: result ? "文件存在" : "文件不存在",
  });
});

// 获取文件链接
app.get("/upload/get-file-href/:fileHash", (req, res, next) => {
  const { fileHash } = req.params;
  const { fileExt } = req.query;
  const filename = `${fileHash}.${fileExt}`;
  const fileHref = `${FILE_HREF_PREV}/${filename}`;
  const result = fs.existsSync(path.resolve(FILES_PATH, filename));

  res.json({
    code: 200,
    data: result ? fileHref : null,
    message: result ? "获取文件链接成功" : "获取文件链接失败",
  });
});

// ...
```

### 块级别校验（可选）

> 该步骤主要是为了避免不必要的二次上传相同分块：
>
> 1. 避免相同分块的重复存储，从而减少对服务器存储空间的占用。
> 2. 避免相同分块的再次上传过程，从而减少对服务器网络带宽和 I/O 等资源的占用。

**客户端**

```vue
<template>//...</template>

<script setup>
// ...

/**
 * 事件监听，click on 上传文件按钮
 */
const onClickUploadFileButton = async () => {
  // ...

  // todo：文件分块
  {
    // ...
  }

  // todo: 文件级别校验（可选）
  {
    // ...
  }

  // todo: 块级别校验（可选）
  {
    const validateChunkRequestList = chunkList.map((chunk, chunkIndex) => {
      return new Promise((resolve, reject) => {
        chunkValidateHelper.enqueue(() => {
          chunk.status = CHUNK_STATUS_TO_VALUE_MAP.VALIDATING;
          return axios
            .get(`/api/upload/validate-chunk/${chunk.hash}`, {
              params: {
                chunkIndex,
                fileHash,
                chunkSize,
              },
            })
            .then((res) => {
              if (res.data.data) {
                // 如果 "分块" 在服务器存在，那么 "分块" 上传成功
                chunk.status = CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_SUCCESSFUL;
              }
              resolve();
            })
            .catch(() => {
              reject();
            });
        });

        chunkValidateHelper.flush();
      });
    });
    await Promise.all(validateChunkRequestList);
  }

  // todo: 分块上传
  {
  }

  // todo: 分块合并
  {
  }
};

// ...
</script>
```

**服务端**

这里服务端需要提供以下接口：

- 判断分块是否存在

在 `index.js` 中，新增内容如下：

```js
// ...

// 判断分块是否存在
app.get("/upload/validate-chunk/:chunkHash", (req, res, next) => {
  const { chunkHash } = req.params;
  const { chunkIndex, fileHash, chunkSize } = req.query;
  const result = fs.existsSync(
    path.resolve(
      CHUNKS_PATH,
      fileHash,
      String(chunkSize),
      `${chunkHash}_${chunkIndex}`
    )
  );

  res.json({
    code: 200,
    data: result,
    message: result ? "分块存在" : "分块不存在",
  });
});

// ...
```

### 分块上传

**客户端**

```vue
<template>//...</template>

<script setup>
// ...

/**
 * 事件监听，click on 上传文件按钮
 */
const onClickUploadFileButton = async () => {
  // ...

  // todo：文件分块
  {
    // ...
  }

  // todo: 文件级别校验（可选）
  {
    // ...
  }

  // todo: 块级别校验（可选）
  {
    // ...
  }

  // todo: 分块上传
  {
    fileValue.status = FILE_STATUS_TO_VALUE_MAP.UPLOADING;
    const uploadChunkRequestList = chunkList.map((chunk, chunkIndex) => {
      if (chunk.status === CHUNK_STATUS_TO_VALUE_MAP.UPLOAD_SUCCESSFUL) {
        return Promise.resolve();
      }
      return uploadChunk(chunk, chunkIndex);
    });

    try {
      await Promise.all(uploadChunkRequestList);
    } catch (err) {
      fileValue.status = FILE_STATUS_TO_VALUE_MAP.UPLOAD_FAILED;
    }
  }

  // todo: 分块合并
  {
  }
};

// ...
</script>
```

**服务端**

这里服务端需要提供以下接口：

- 上传分块

在前面 "初始化项目" 阶段已经实现。

### 分块合并

**客户端**

```vue
<template>//...</template>

<script setup>
// ...

/**
 * 事件监听，click on 上传文件按钮
 */
const onClickUploadFileButton = async () => {
  // ...

  // todo：文件分块
  {
    // ...
  }

  // todo: 文件级别校验（可选）
  {
    // ...
  }

  // todo: 块级别校验（可选）
  {
    // ...
  }

  // todo: 分块上传
  {
    // ...
  }

  // todo: 分块合并
  {
    fileValue.status = FILE_STATUS_TO_VALUE_MAP.MERGING;
    await axios
      .post("/api/upload/merge-chunks", {
        fileExt,
        fileHash,
        chunkSize,
      })
      .then((res) => {
        fileValue.status = FILE_STATUS_TO_VALUE_MAP.MERGE_SUCCESSFUL;
        fileValue.href = res.data.data;
      })
      .catch((err) => {
        fileValue.status = FILE_STATUS_TO_VALUE_MAP.MERGE_FAILED;
      });
  }
};

// ...
</script>
```

**服务端**

这里服务端需要提供以下接口：

- 合并分块

```js
// ...

// 合并分块
app.post("/upload/merge-chunks", async (req, res, next) => {
  const { fileExt, fileHash, chunkSize } = req.body;
  const filename = `${fileHash}.${fileExt}`;
  const filePath = path.resolve(FILES_PATH, filename);
  const fileHref = `${FILE_HREF_PREV}/${filename}`;
  const chunksDirPath = path.resolve(CHUNKS_PATH, fileHash, String(chunkSize));

  // 校验，文件存在
  if (fs.existsSync(filePath)) {
    return res.json({
      code: 200,
      data: fileHref,
      message: "文件已存在",
    });
  }

  // 校验，分块不存在
  if (!fs.existsSync(chunksDirPath)) {
    return res.json({
      code: 500,
      data: null,
      message: "文件分块缺失",
    });
  }

  // 合并分块
  {
    const fileWriteStream = fs.createWriteStream(filePath);
    const chunkNameList = fs.readdirSync(chunksDirPath);
    const mergeResult = true;

    // 根据分块序号排序
    chunkNameList.sort((a, b) => {
      const [hashA, indexA] = a.split("_");
      const [hashB, indexB] = b.split("_");
      return parseInt(indexA) - parseInt(indexB);
    });

    // 写入文件
    for (const [index, chunkName] of chunkNameList.entries()) {
      const chunkReadStream = fs.createReadStream(
        path.resolve(chunksDirPath, chunkName)
      );

      try {
        await pipeline(chunkReadStream, fileWriteStream, { end: false });
      } catch (err) {
        mergeResult = false;
        break;
      } finally {
        chunkReadStream.close();
      }
    }
    fileWriteStream.end();

    if (mergeResult) {
      res.json({
        code: 200,
        data: fileHref,
        message: "合并分块成功",
      });
    } else {
      fs.unlinkSync(filePath);
      res.json({
        code: 500,
        data: null,
        message: "合并分块失败",
      });
    }
  }
});

// ...
```

## 相关链接

- [CokeBeliever/split-chunks-upload (github.com)](https://github.com/CokeBeliever/split-chunks-upload)
