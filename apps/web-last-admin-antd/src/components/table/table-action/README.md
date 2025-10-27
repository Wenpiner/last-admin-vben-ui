# TableAction 组件

表格操作组件，用于在表格中显示操作按钮和下拉菜单。

## 功能特性

- ✅ 支持按钮和下拉菜单
- ✅ Icon 和文字展示
- ✅ Popconfirm 确认对话框
- ✅ 条件显示（ifShow）
- ✅ 禁用状态
- ✅ 权限编码控制（auth）
- ✅ Tooltip 支持
- ✅ 分割线支持
- ✅ 颜色主题（error、success、warning）
- ✅ 移动端响应式
- ✅ 暗黑模式支持
- ✅ 国际化支持

## 基本用法

```vue
<script setup lang="ts">
import { TableAction } from '@/components/table/table-action';
import type { ActionItem } from '@/components/table/table-action';

const actions: ActionItem[] = [
  {
    label: '编辑',
    icon: 'mdi:pencil',
    buttonType: 'button',
    onClick: () => {
      console.log('编辑');
    },
  },
  {
    label: '删除',
    icon: 'mdi:delete',
    color: 'error',
    buttonType: 'dropdown',
    popConfirm: {
      title: '确定要删除吗？',
      confirm: () => {
        console.log('删除');
      },
    },
  },
];
</script>

<template>
  <TableAction :actions="actions" />
</template>
```

## Props

### actions

- 类型：`ActionItem[]`
- 必需：是
- 说明：操作项列表

### size

- 类型：`'large' | 'middle' | 'small'`
- 默认值：`'small'`
- 说明：按钮大小

### gap

- 类型：`number`
- 默认值：`8`
- 说明：按钮间距

### align

- 类型：`'start' | 'center' | 'end'`
- 默认值：`'end'`
- 说明：对齐方式

### maxVisibleButtons

- 类型：`number`
- 默认值：`2`
- 说明：下拉菜单最多显示的按钮数

### responsive

- 类型：`boolean`
- 默认值：`true`
- 说明：是否响应式（移动端自动转换为下拉菜单）

### responsiveBreakpoint

- 类型：`number`
- 默认值：`768`
- 说明：响应式断点（px）

## ActionItem 配置

### label

- 类型：`string`
- 说明：显示文本

### icon

- 类型：`string`
- 说明：图标（使用 iconify 格式）

### color

- 类型：`'error' | 'success' | 'warning'`
- 说明：颜色主题

### onClick

- 类型：`() => void | Promise<void>`
- 说明：点击回调

### disabled

- 类型：`boolean`
- 说明：是否禁用

### divider

- 类型：`boolean`
- 说明：是否显示分割线

### auth

- 类型：`string[]`
- 说明：权限编码数组

### buttonType

- 类型：`'button' | 'dropdown'`
- 默认值：`'button'`
- 说明：按钮类型

### ifShow

- 类型：`((action: ActionItem) => boolean) | boolean`
- 说明：条件显示函数或布尔值

### tooltip

- 类型：`string | TooltipProps`
- 说明：提示文本或提示配置

### popConfirm

- 类型：`PopConfirm`
- 说明：弹窗确认配置

## PopConfirm 配置

### title

- 类型：`string`
- 必需：是
- 说明：确认标题

### okText

- 类型：`string`
- 说明：确认按钮文本

### cancelText

- 类型：`string`
- 说明：取消按钮文本

### confirm

- 类型：`() => void | Promise<void>`
- 必需：是
- 说明：确认回调

### cancel

- 类型：`() => void`
- 说明：取消回调

### icon

- 类型：`string`
- 说明：图标

## 事件

### actionClick

操作项点击事件

```typescript
@actionClick="(action: ActionItem) => void"
```

## 暗黑模式

组件自动支持暗黑模式，使用 CSS 变量和 Tailwind dark 前缀。

## 国际化

组件使用 `$t()` 进行国际化，支持中文和英文。

国际化文本位置：

- 中文：`src/locales/langs/zh-CN/system.json`
- 英文：`src/locales/langs/en-US/system.json`
