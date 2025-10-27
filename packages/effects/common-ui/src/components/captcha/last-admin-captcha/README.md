# LastAdminCaptcha 组件

## 概述

`LastAdminCaptcha` 是一个用于显示和输入验证码的组件。它包含一个输入框、验证码图片和刷新按钮。

## 特性

- ✅ 支持多种验证码类型（digit、string、math、chinese、audio）
- ✅ 自动暗黑模式适配
- ✅ 可自定义尺寸和样式
- ✅ 点击图片或刷新按钮可重新生成验证码
- ✅ 提供 TypeScript 类型支持

## 基本用法

### 在表单中使用

```vue
<script setup lang="ts">
import { LastAdminCaptcha } from '@vben/common-ui';
import { generateCaptchaApi } from '@/api/core/auth';

async function handleCaptchaRefresh(setter) {
  try {
    const { data } = await generateCaptchaApi();
    // 通过 setter 函数更新组件内部的验证码数据
    setter(data.id, data.base64Blob);
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  }
}

function handleCaptchaChange(data) {
  console.log('Captcha data:', data);
  // data.id: 验证码 ID
  // data.value: 用户输入的验证码值
}
</script>

<template>
  <div>
    <LastAdminCaptcha
      placeholder="请输入验证码"
      :on-refresh="handleCaptchaRefresh"
      @change="handleCaptchaChange"
    />
  </div>
</template>
```

### 在 VbenForm 中使用

```typescript
import { markRaw } from 'vue';
import { LastAdminCaptcha } from '@vben/common-ui';
import { generateCaptchaApi } from '@/api/core/auth';

const formSchema = [
  {
    component: markRaw(LastAdminCaptcha),
    fieldName: 'captcha',
    rules: z.object({
      id: z.string().min(1, '验证码 ID 不能为空'),
      value: z.string().min(1, '请输入验证码'),
    }),
    componentProps: {
      placeholder: '请输入验证码',
      captchaWidth: '120px',
      captchaHeight: '40px',
    },
  },
];
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `captchaType` | `'digit' \| 'string' \| 'math' \| 'chinese' \| 'audio'` | `'digit'` | 验证码类型 |
| `placeholder` | `string` | `''` | 输入框占位符 |
| `refreshText` | `string` | `'刷新'` | 刷新按钮文本 |
| `width` | `string \| number` | `'100%'` | 组件宽度 |
| `height` | `string \| number` | `'40px'` | 组件高度 |
| `captchaWidth` | `string \| number` | `'100px'` | 验证码图片宽度 |
| `captchaHeight` | `string \| number` | `'40px'` | 验证码图片高度 |
| `onRefresh` | `(setter: CaptchaDataSetter) => Promise<void> \| void` | - | 刷新验证码的回调函数，接收一个 setter 函数用于更新验证码数据 |

## Events

| 事件名    | 参数                   | 说明                             |
| --------- | ---------------------- | -------------------------------- |
| `refresh` | -                      | 当点击刷新按钮或验证码图片时触发 |
| `change`  | `LastAdminCaptchaData` | 当输入框内容变化时触发           |

## Methods

### `setCaptchaData(id: string, base64Blob: string)`

设置验证码数据。

```typescript
captchaRef.value?.setCaptchaData('captcha-id-123', 'data:image/png;base64,...');
```

### `getData(): LastAdminCaptchaData`

获取当前验证码数据（ID 和用户输入的值）。

```typescript
const { id, value } = captchaRef.value?.getData();
```

### `reset()`

重置组件状态。

```typescript
captchaRef.value?.reset();
```

## 类型定义

```typescript
interface LastAdminCaptchaData {
  /**
   * 验证码 ID
   */
  id: string;

  /**
   * 用户输入的验证码值
   */
  value: string;
}

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

## 暗黑模式

组件自动支持暗黑模式，使用 CSS 变量 `--background-deep` 和 `--border` 来适配不同主题。

## 注意事项

1. **API 调用**：组件本身不包含 API 调用逻辑，需要在父组件中处理 `refresh` 事件并调用 `generateCaptchaApi()`。

2. **验证码 ID**：必须通过 `setCaptchaData()` 方法设置验证码 ID，否则提交时无法获取正确的 ID。

3. **表单集成**：在 VbenForm 中使用时，需要确保表单值结构与 `LastAdminCaptchaData` 一致。

## 示例

完整的登录表单示例：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { LastAdminCaptcha } from '@vben/common-ui';
import { generateCaptchaApi, loginApi } from '@/api/core/auth';

const formData = ref({
  username: '',
  password: '',
  captcha: {
    id: '',
    value: '',
  },
});

const captchaRef = ref();

async function handleCaptchaRefresh() {
  try {
    const { data } = await generateCaptchaApi();
    captchaRef.value?.setCaptchaData(data.id, data.base64Blob);
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  }
}

function handleCaptchaChange(data) {
  formData.value.captcha = data;
}

async function handleLogin() {
  try {
    const response = await loginApi({
      username: formData.value.username,
      password: formData.value.password,
      id: formData.value.captcha.id,
      code: formData.value.captcha.value,
    });
    console.log('Login success:', response);
  } catch (error) {
    console.error('Login failed:', error);
    // 重新生成验证码
    handleCaptchaRefresh();
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="formData.username" type="text" placeholder="用户名" />
    <input v-model="formData.password" type="password" placeholder="密码" />
    <LastAdminCaptcha
      ref="captchaRef"
      @refresh="handleCaptchaRefresh"
      @change="handleCaptchaChange"
    />
    <button type="submit">登录</button>
  </form>
</template>
```
