# 组件开发规范

基于 `LastAdminCaptcha` 组件的最佳实践规范。

## 📁 目录结构

```
components/[component-name]/
├── index.ts                    # 导出文件
├── index.vue                   # 主组件
├── types.ts                    # 类型定义
└── README.md                   # 使用文档
```

## 🔧 类型定义 (types.ts)

```typescript
export interface MyComponentProps {
  /**
   * @description 属性说明
   * @default 'default-value'
   */
  propName?: string | number; // number 必须在 string 之前
}

export interface MyComponentData {
  /**
   * 数据字段说明
   */
  fieldName: string;
}
```

**关键点**：

- 所有 Props 都有 JSDoc 注释（@description 和 @default）
- 类型顺序：`number` 在 `string` 之前（ESLint 规则）
- 在 `index.ts` 中导出：`export type * from './types';`

## 📝 组件实现 (index.vue)

### Script Setup 结构

```typescript
<script setup lang="ts">
import type { MyComponentProps, MyComponentData } from '../types';

import { computed, onMounted, ref } from 'vue';

import { SomeIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenButton } from '@vben-core/shadcn-ui';

// 1. Props 定义
const props = withDefaults(defineProps<MyComponentProps>(), {
  propName: 'default-value',
});

// 2. Emits 定义
const emit = defineEmits<{
  change: [MyComponentData];
  refresh: [];
}>();

// 3. 状态定义
const state = ref<string>('');
const isLoading = ref<boolean>(false);

// 4. 计算属性
const computedValue = computed(() => state.value.toUpperCase());

// 5. 方法定义（带 JSDoc 注释）
/**
 * 方法说明
 */
function handleAction() {
  // 实现
}

// 6. 生命周期钩子
onMounted(() => {
  // 初始化
});

// 7. 暴露公共方法
defineExpose({
  handleAction,
});
</script>
```

### 模板规范

```vue
<template>
  <div class="component-name">
    <!-- 主要内容区域 -->
    <input
      :value="state"
      :placeholder="$t('namespace.field.placeholder')"
      @input="handleChange"
    />

    <!-- 条件渲染区域 -->
    <div v-if="condition" class="conditional">
      <!-- 内容 -->
    </div>

    <!-- 隐藏元素 -->
    <audio ref="audioRef" :src="audioUrl" @ended="handleEnded" />
  </div>
</template>
```

**关键点**：

- 使用 Tailwind CSS 工具类
- 使用 CSS 变量适配主题：`var(--background-deep)`、`var(--border)`
- 所有用户可见文本使用 `$t()` 国际化
- 交互元素有 `aria-label`

### 样式规范

```vue
<style scoped>
.component-name {
  @apply flex items-center gap-2;
  background-color: var(--background-deep);
  border-color: var(--border);
  color: var(--foreground);
}

/* 暗黑模式 */
.component-name {
  @apply dark:bg-slate-900 dark:text-white;
}

/* 动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
```

## 🌍 国际化 (i18n)

### 文件结构

```
packages/locales/src/langs/
├── zh-CN/[componentName].json
└── en-US/[componentName].json
```

### 文件命名规则

- **使用驼峰命名**：`myComponent.json`（不是 `my-component.json`）
- 文件名自动成为命名空间的第一层

### 文件内容

```json
{
  "captcha": {
    "inputPlaceholder": "请输入验证码",
    "loading": "加载中...",
    "refresh": "刷新"
  }
}
```

**关键点**：

- 文件内容不需要再嵌套文件名
- 访问方式：`$t('myComponent.captcha.inputPlaceholder')`

## 📚 导出文件 (index.ts)

```typescript
export { default as MyComponent } from './index.vue';
```

## 📖 文档 (README.md)

```markdown
# MyComponent

## 概述

组件的简要说明

## 特性

- ✅ 特性1
- ✅ 特性2

## 基本用法

\`\`\`vue

<script setup lang="ts">
import { MyComponent } from '@vben/common-ui';

const data = ref();

function handleChange(value) {
  console.log(value);
}
</script>

<template>
  <MyComponent @change="handleChange" />
</template>
\`\`\`

## Props

| 属性     | 类型   | 默认值 | 说明     |
| -------- | ------ | ------ | -------- |
| propName | string | ''     | 属性说明 |

## Events

| 事件名 | 参数            | 说明         |
| ------ | --------------- | ------------ |
| change | MyComponentData | 值变化时触发 |

## Methods

| 方法名         | 说明     |
| -------------- | -------- |
| handleAction() | 方法说明 |
```

## 🔗 注册组件

在 `packages/effects/common-ui/src/components/index.ts` 中添加：

```typescript
export * from './my-component';
```

## ✅ 检查清单

创建新组件时：

- [ ] 目录结构正确
- [ ] types.ts 完整（Props、Data 接口）
- [ ] index.vue 遵循规范结构
- [ ] 所有方法都有 JSDoc 注释
- [ ] 支持暗黑模式（CSS 变量）
- [ ] 国际化文件已创建（zh-CN 和 en-US）
- [ ] 在主导出中注册
- [ ] README.md 文档完整
- [ ] 通过 ESLint 检查：`npm run lint`
- [ ] 通过 TypeScript 检查：`npm run type-check`

## 🎯 最佳实践

### 1. 组件解耦

- 不要直接导入应用层 API
- 通过 `emit` 事件让父组件处理 API 调用
- 使用 `ref` 暴露公共方法

### 2. 类型安全

- 所有 Props 和 Emits 都有类型定义
- 避免使用 `any` 类型
- 类型顺序：`number` 在 `string` 之前

### 3. 暗黑模式

- 使用 CSS 变量：`var(--background-deep)`、`var(--border)`、`var(--foreground)`
- 使用 Tailwind `dark:` 前缀
- 测试暗黑模式下的显示

### 4. 国际化

- 所有用户可见文本都使用 `$t()`
- 文件名使用驼峰命名
- 创建 zh-CN 和 en-US 两个版本

### 5. 代码注释

- 所有方法都有 JSDoc 注释
- 模板中有清晰的注释说明各个区域
- 复杂逻辑有多行注释

## 📋 参考组件

- **LastAdminCaptcha** - 完整的参考实现
  - 支持多种类型（digit、math、string、chinese、audio）
  - 完整的国际化支持
  - 暗黑模式适配
  - 详细的文档

位置：`packages/effects/common-ui/src/components/captcha/last-admin-captcha/`

## 🚀 快速命令

```bash
# ESLint 检查
npm run lint

# TypeScript 检查
npm run type-check

# 修复 ESLint 错误
npm run lint:fix
```

## 💡 常见错误

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| Props 类型错误 | `string \| number` 顺序错误 | 改为 `number \| string` |
| 翻译文件不加载 | 文件名使用了连字符 | 使用驼峰命名：`myComponent.json` |
| 组件不显示 | 没有在主导出中注册 | 在 `components/index.ts` 中添加导出 |
| 暗黑模式不工作 | 没有使用 CSS 变量 | 使用 `var(--background-deep)` 等 |
| API 调用失败 | 在组件中直接调用 API | 通过 emit 让父组件处理 |
