# 文章管理模块

## 📋 功能概述

文章管理模块提供了完整的文章信息管理功能，支持增删改查、批量AI格式化等操作。

## 🚀 主要功能

### 1. 文章列表显示
- ✅ 分页表格展示文章信息
- ✅ 显示文章基本信息（标题、作者、状态、类型、标签等）
- ✅ 状态标识（已发布/未发布/草稿）
- ✅ 类型标识（普通文章/周报）
- ✅ 标签展示
- ✅ 阅读量统计
- ✅ 发布时间和创建时间

### 2. 文章搜索
- ✅ 按文章标题搜索
- ✅ 按文章类型筛选（普通/周报）
- ✅ 按状态筛选（已发布/未发布/草稿）

### 3. 文章管理
- ✅ 新增文章（独立页面）
- ✅ 编辑文章信息（独立页面）
- ✅ 删除文章
- ✅ 批量AI格式化文章

### 4. 文章编辑功能
- ✅ 基本信息编辑（标题、副标题、作者）
- ✅ 分类选择（关联文章分类）
- ✅ 类型选择（普通/周报）
- ✅ 标签管理（支持空格和逗号分隔）
- ✅ 封面图片上传
- ✅ 多语言支持（国家、语言）
- ✅ 富文本编辑器（使用 WangEditor 5）
  - Content 编辑器
  - Markdown 编辑器
  - Raw HTML 编辑器
  - 支持图片上传
  - 支持多种格式化工具
- ✅ 发布时间设置
- ✅ 阅读量设置
- ✅ URL设置

## 📁 文件结构

```
src/views/iras/article/
├── index.vue           # 主页面 - 文章列表和操作
├── edit.vue           # 编辑页面 - 新增/编辑文章
├── data.ts            # 数据配置 - 表格列和搜索表单
└── README.md          # 说明文档
```

```
src/api/iras/
└── article.ts         # API接口定义
```

```
src/components/editor/
└── wang-editor.vue    # WangEditor 富文本编辑器组件
```

## 🔧 技术实现

### API接口
- `POST /iras-api/api/v1/article/list` - 获取文章列表
- `POST /iras-api/api/v1/article/save` - 保存文章（创建/更新）
- `DELETE /iras-api/api/v1/article/{id}` - 删除文章
- `POST /iras-api/api/v1/article/ai/format` - 批量AI格式化文章
- `POST /iras-api/api/v1/upload/image` - 上传图片

### 数据结构
```typescript
interface ArticleInfo {
  id?: string;
  title: string;            // 文章标题
  subtitle?: string;        // 副标题
  author?: string;          // 作者
  content?: string;         // 内容
  markdown?: string;        // Markdown内容
  rawHTML?: string;         // 原始HTML
  categoryId: number;       // 分类ID
  tags: string[];           // 标签数组
  type?: string;            // 类型 (normal/weekly)
  country?: string;         // 国家
  language?: string;        // 语言
  cover?: string;           // 封面图片URL
  url?: string;             // 文章URL
  readCount: number;        // 阅读量
  publishedAt?: string;     // 发布时间
  status?: string;          // 状态 (published/unpublished/draft)
}
```

## 🎯 使用方式

### 1. 访问文章管理
导航到 `iRas > 文章管理` 页面

### 2. 查看文章列表
- 页面加载时自动显示所有文章的分页列表
- 使用搜索表单筛选文章

### 3. 新增文章
1. 点击 "新增文章" 按钮
2. 跳转到独立的编辑页面
3. 填写文章信息
   - 基本信息：标题、副标题、作者
   - 分类和类型：选择文章分类、类型
   - 标签：输入标签（支持空格和逗号分隔）
   - 封面图片：上传封面图片
   - 内容：填写文章内容（支持 content、markdown、rawHTML）
   - 元数据：设置国家、语言、URL、阅读量、发布时间
4. 点击确认保存

### 4. 编辑文章
1. 点击文章行的 "编辑" 按钮
2. 跳转到独立的编辑页面
3. 修改文章信息
4. 点击确认保存

### 5. 删除文章
1. 点击文章行的 "删除" 按钮
2. 确认删除操作

### 6. 批量AI格式化
1. 勾选需要格式化的文章
2. 点击 "AI格式化选中文章" 按钮
3. 确认批量格式化操作

## 🌍 国际化支持

支持中英文双语：
- 中文：`zh-CN/iras.json` 中的 `article` 配置
- 英文：`en-US/iras.json` 中的 `article` 配置

## ⚠️ 注意事项

1. **表单验证**：所有必填字段都有相应的验证规则
2. **标签输入**：支持空格和逗号分隔，提交时自动转换为数组
3. **图片上传**：支持上传封面图片，使用 `/iras-api/api/v1/upload/image` 接口
4. **分页加载**：列表支持分页，默认每页20条记录
5. **独立编辑页面**：编辑功能使用独立页面而非弹窗，提供更好的编辑体验
6. **批量操作**：支持批量选择文章进行AI格式化

## 🎨 富文本编辑器

本模块使用 **WangEditor 5** 作为富文本编辑器，提供以下特性：

### 特点
- ✅ 开源免费，国产编辑器
- ✅ 中文文档完善
- ✅ 轻量级，易于集成
- ✅ 支持图片上传
- ✅ 支持多种格式化工具
- ✅ 支持暗色主题

### 依赖
```json
{
  "@wangeditor/editor": "^5.1.23",
  "@wangeditor/editor-for-vue": "^5.1.12"
}
```

### 组件位置
`src/components/editor/wang-editor.vue`

### 使用方式
```vue
<template>
  <WangEditor v-model="content" :height="400" />
</template>

<script setup>
import { ref } from 'vue';
import WangEditor from '#/components/editor/wang-editor.vue';

const content = ref('');
</script>
```

### 图片上传
编辑器已集成图片上传功能，使用 `/iras-api/api/v1/upload/image` 接口。

## 🔄 扩展建议

1. **Markdown编辑器**：集成专门的 Markdown 编辑器，支持实时预览
2. **批量导入导出**：支持Excel导入导出文章数据
3. **版本控制**：记录文章变更历史，支持版本回退
4. **审核流程**：添加文章审核流程，支持多级审核
5. **定时发布**：支持设置文章定时发布
6. **SEO优化**：添加SEO相关字段（关键词、描述等）
7. **多媒体管理**：支持更多媒体类型（视频、音频等）
8. **代码高亮**：为技术文章添加代码高亮功能

