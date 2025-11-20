# 爬虫任务管理模块

## 📋 功能概述

爬虫任务管理模块提供了完整的爬虫任务配置和管理功能，支持创建、编辑、删除爬虫任务，以及配置详细的爬取规则和选择器。

## 🚀 主要功能

### 1. 爬虫任务列表显示
- ✅ 分页表格展示爬虫任务信息
- ✅ 显示任务基本信息（名称、目标URL、状态、进度等）
- ✅ 任务状态标识（待执行/运行中/已暂停/已完成/失败）
- ✅ 进度条显示任务执行进度
- ✅ 启用/禁用状态标识

### 2. 爬虫任务搜索
- ✅ 按任务名称搜索
- ✅ 按目标URL搜索
- ✅ 按任务状态筛选
- ✅ 按启用状态筛选
- ✅ 按网站类型筛选

### 3. 爬虫任务管理
- ✅ 新增爬虫任务
- ✅ 编辑爬虫任务配置
- ✅ 删除爬虫任务
- ✅ 完整的表单验证

### 4. 任务配置功能
- ✅ **基本信息配置**：任务名称、目标URL、网站类型、描述、状态、优先级、定时计划
- ✅ **分类信息配置**：文章分类、标签、语言、国家
- ✅ **爬取配置**：并发数、延迟、超时、最大请求数、最大深度、重试策略、robots.txt遵守等
- ✅ **选择器配置**：标题、内容、日期、作者、标签、摘要、主图等CSS选择器
- ✅ **存储配置**：MongoDB集合、ES索引、文本编码

## 📁 文件结构

```
src/views/iras/crawler/
├── task.vue           # 主页面 - 爬虫任务列表和操作
├── task-data.ts       # 数据配置 - 表格列和搜索表单
├── modules/
│   └── task-form.vue  # 表单组件 - 新增/编辑爬虫任务
└── task-README.md     # 说明文档
```

```
src/api/iras/
└── crawler-task.ts    # API接口定义
```

## 🔧 技术实现

### API接口
- `POST /iras-api/api/v1/crawler/tasks/list` - 获取爬虫任务列表
- `POST /iras-api/api/v1/crawler/tasks/save` - 保存爬虫任务（创建/更新）
- `DELETE /iras-api/api/v1/crawler/tasks/{id}` - 删除爬虫任务

### 数据结构
```typescript
interface TaskInfo {
  id?: number;
  name: string;                    // 任务名称
  targetUrl: string;               // 目标URL
  siteType: string;                // 网站类型
  status: string;                  // 任务状态
  enabled: boolean;                // 是否启用
  priority: number;                // 优先级
  schedule?: string;               // Cron表达式
  progress: number;                // 进度百分比
  
  // 爬取配置
  parallelism: number;             // 并发数
  delayMs: number;                 // 请求延迟
  timeoutSeconds: number;          // 超时时间
  maxRequests: number;             // 最大请求数
  maxDepth: number;                // 最大深度
  
  // 选择器配置
  titleSelector: string;           // 标题选择器
  contentSelector: string;         // 内容选择器
  dateSelector?: string;           // 日期选择器
  authorSelector?: string;         // 作者选择器
  
  // 存储配置
  mongodbCollection: string;       // MongoDB集合名
  indexToEs: boolean;              // 是否索引到ES
  encoding: string;                // 文本编码
  
  // 统计信息
  totalUrls: number;               // URL总数
  successUrls: number;             // 成功URL数
  failedUrls: number;              // 失败URL数
}
```

## 🎯 使用方式

### 1. 访问爬虫任务管理
导航到 `iRas管理 > 爬虫管理 > 爬虫任务` 页面

### 2. 查看任务列表
- 页面加载时自动显示所有爬虫任务的分页列表
- 使用搜索表单筛选任务

### 3. 新增爬虫任务
1. 点击 "新增爬虫任务" 按钮
2. 填写基本信息（任务名称、目标URL、网站类型等）
3. 选择文章分类
4. 配置爬取参数（并发数、延迟、超时等）
5. 配置CSS选择器（标题、内容、日期等）
6. 配置存储信息（MongoDB集合、ES索引等）
7. 点击确认保存

### 4. 编辑爬虫任务
1. 点击任务行的 "编辑" 按钮
2. 修改任务配置
3. 点击确认保存

### 5. 删除爬虫任务
1. 点击任务行的 "删除" 按钮
2. 确认删除操作

## 🌍 国际化支持

支持中英文双语：
- 中文：`zh-CN/iras.json` 中的 `crawlerTask` 配置
- 英文：`en-US/iras.json` 中的 `crawlerTask` 配置

## ⚠️ 注意事项

1. **表单验证**：所有必填字段都有相应的验证规则
2. **默认值**：新增任务时会设置合理的默认值
3. **分页加载**：列表支持分页，提高大数据量时的性能
4. **选择器配置**：CSS选择器需要根据目标网站的实际HTML结构配置
5. **Cron表达式**：定时计划使用标准的Cron表达式格式

## 🔄 扩展建议

1. **任务控制**：添加启动、暂停、停止任务的功能
2. **任务监控**：实时显示任务执行状态和日志
3. **批量操作**：支持批量启用/禁用任务
4. **模板功能**：支持从现有任务创建模板
5. **测试功能**：添加选择器测试功能，验证配置是否正确

