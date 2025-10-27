# LastAdminCaptcha 组件实现说明

## 📋 实现概述

`LastAdminCaptcha` 是一个用于显示和输入验证码的 Vue 3 组件，遵循项目中其他 captcha 组件的规范。

## 🏗️ 架构设计

### 组件结构

```
last-admin-captcha/
├── index.vue          # 主组件文件
├── README.md          # 使用文档
└── IMPLEMENTATION.md  # 本文件
```

### 组件组成

组件由三个主要部分组成：

1. **输入框** (`VbenInput`)
   - 用于用户输入验证码
   - 支持自定义占位符
   - 自动适配暗黑模式

2. **验证码图片**
   - 显示 base64 编码的验证码图片
   - 点击可刷新验证码
   - 加载状态提示

3. **刷新按钮** (`VbenIconButton`)
   - 手动刷新验证码
   - 加载状态动画
   - 禁用状态管理

## 🔄 数据流

### 初始化流程

```
组件挂载 (onMounted)
    ↓
触发 refresh 事件
    ↓
父组件调用 generateCaptchaApi()
    ↓
父组件调用 setCaptchaData(id, base64Blob)
    ↓
组件显示验证码
```

### 用户交互流程

```
用户输入验证码
    ↓
触发 change 事件
    ↓
父组件接收 { id, value }
    ↓
父组件可用于表单验证或提交
```

### 刷新流程

```
用户点击图片或刷新按钮
    ↓
触发 refresh 事件
    ↓
设置 isLoading = true
    ↓
父组件调用 generateCaptchaApi()
    ↓
父组件调用 setCaptchaData()
    ↓
设置 isLoading = false
```

## 📦 Props 设计

| 属性            | 类型           | 默认值    | 用途                       |
| --------------- | -------------- | --------- | -------------------------- |
| `captchaType`   | enum           | `'digit'` | 标识验证码类型（用于后端） |
| `placeholder`   | string         | `''`      | 输入框占位符               |
| `refreshText`   | string         | `'刷新'`  | 刷新按钮文本               |
| `width`         | string\|number | `'100%'`  | 容器宽度                   |
| `height`        | string\|number | `'40px'`  | 容器高度                   |
| `captchaWidth`  | string\|number | `'100px'` | 图片宽度                   |
| `captchaHeight` | string\|number | `'40px'`  | 图片高度                   |

## 🎯 Events 设计

### `onRefresh` 回调函数

**触发时机**：

- 组件挂载时
- 用户点击验证码图片
- 用户点击刷新按钮
- 组件挂载时

**用途**：通知父组件需要生成新的验证码，并通过 setter 函数更新验证码数据

**参数**：`setter: (id: string, base64Blob: string, audioBlob?: string) => void`

**处理示例**：

```typescript
async function handleCaptchaRefresh(setter) {
  try {
    const { data } = await generateCaptchaApi();
    // 通过 setter 函数更新组件内部的验证码数据
    setter(data.id, data.base64Blob);
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  }
}
```

### `refresh` 事件（备选方案）

如果不提供 `onRefresh` 回调函数，组件会触发 `refresh` 事件，由父组件通过 `@refresh` 监听并处理。

### `change` 事件

**触发时机**：用户在输入框中输入内容

**参数**：`LastAdminCaptchaData { id: string, value: string }`

**用途**：通知父组件验证码数据已更新

**处理示例**：

```typescript
function handleCaptchaChange(data) {
  formData.captcha = data;
}
```

## 🔧 Methods 设计

### `setCaptchaData(id: string, base64Blob: string)`

**用途**：设置验证码数据

**参数**：

- `id`: 验证码 ID（由后端返回）
- `base64Blob`: base64 编码的验证码图片

**调用时机**：在 `refresh` 事件处理中调用

### `getData(): LastAdminCaptchaData`

**用途**：获取当前验证码数据

**返回值**：`{ id: string, value: string }`

**调用时机**：表单提交时

### `reset()`

**用途**：重置组件状态

**调用时机**：登录失败、需要重新输入时

## 🎨 样式设计

### CSS 变量使用

- `--background-deep`: 验证码图片背景色
- `--border`: 验证码图片边框色
- `--foreground`: 文本颜色

### 暗黑模式

组件自动适配暗黑模式，通过 CSS 变量实现：

```css
/* 亮色模式 */
--background-deep: 216 20.11% 95.47%; /* 浅灰色 */

/* 暗色模式 */
--background-deep: 220deg 13.06% 9%; /* 深灰色 */
```

### 动画

- **加载动画**：旋转图标，1s 线性循环
- **过渡效果**：无（保持简洁）

## 📝 类型定义

### `LastAdminCaptchaProps`

```typescript
interface LastAdminCaptchaProps {
  captchaType?: 'digit' | 'string' | 'math' | 'chinese' | 'audio';
  placeholder?: string;
  refreshText?: string;
  width?: string | number;
  height?: string | number;
  captchaWidth?: string | number;
  captchaHeight?: string | number;
}
```

### `LastAdminCaptchaData`

```typescript
interface LastAdminCaptchaData {
  id: string; // 验证码 ID
  value: string; // 用户输入的验证码值
}
```

## 🔌 集成指南

### 1. 在应用层导入

```typescript
import { LastAdminCaptcha } from '@vben/common-ui';
```

### 2. 在模板中使用

```vue
<LastAdminCaptcha
  ref="captchaRef"
  placeholder="请输入验证码"
  @refresh="handleCaptchaRefresh"
  @change="handleCaptchaChange"
/>
```

### 3. 处理事件

```typescript
async function handleCaptchaRefresh() {
  try {
    const { data } = await generateCaptchaApi();
    captchaRef.value?.setCaptchaData(data.id, data.base64Blob);
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  }
}

function handleCaptchaChange(data) {
  // 更新表单数据
  formData.captcha = data;
}
```

### 4. 提交表单

```typescript
async function handleSubmit() {
  const captchaData = captchaRef.value?.getData();
  await loginApi({
    username: formData.username,
    password: formData.password,
    id: captchaData.id,
    code: captchaData.value,
  });
}
```

## ✅ 规范遵循

### 与其他 captcha 组件的一致性

- ✅ 使用相同的 UI 组件库（VbenInput、VbenIconButton）
- ✅ 使用相同的图标库（@vben/icons）
- ✅ 使用相同的国际化方案（@vben/locales）
- ✅ 使用相同的样式系统（Tailwind CSS + CSS 变量）
- ✅ 使用相同的类型定义位置（types.ts）
- ✅ 使用相同的导出方式（captcha/index.ts）

### 与项目架构的一致性

- ✅ 放在 `packages/effects/common-ui` 中（共享组件库）
- ✅ 不依赖应用层的 API（通过 emit 事件解耦）
- ✅ 支持三种 UI 框架（web-naive、web-ele、web-antd）
- ✅ 完整的 TypeScript 类型支持
- ✅ 自动暗黑模式适配

## 🚀 使用场景

1. **登录表单**：在登录页面中使用
2. **注册表单**：在注册页面中使用
3. **敏感操作验证**：在需要额外验证的操作中使用
4. **表单字段**：在 VbenForm 中作为自定义字段使用

## 📚 相关文件

- `index.vue`: 组件实现
- `types.ts`: 类型定义（已更新）
- `index.ts`: 组件导出（已更新）
- `README.md`: 使用文档
- `IMPLEMENTATION.md`: 本文件
