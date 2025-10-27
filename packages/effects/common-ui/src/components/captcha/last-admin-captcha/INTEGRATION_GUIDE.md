# LastAdminCaptcha 组件集成指南

## 概述

本指南说明如何在登录页面中集成 `LastAdminCaptcha` 组件。

## 集成步骤

### 1. 导入必要的模块

```typescript
import type { VbenFormSchema } from '@vben/common-ui';
import type { CaptchaApi } from '#/api/core/captcha';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, LastAdminCaptcha, z } from '@vben/common-ui';
import { generateCaptchaApi } from '#/api/core/captcha';
```

### 2. 定义验证码状态

```typescript
// 验证码数据
const captchaData = ref<CaptchaApi.CaptchaResult | null>(null);
const captchaLoading = ref<boolean>(false);
```

### 3. 实现验证码生成函数

```typescript
/**
 * 生成验证码
 */
async function handleGenerateCaptcha() {
  try {
    captchaLoading.value = true;
    const response = await generateCaptchaApi();
    if (response) {
      captchaData.value = response;
    }
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  } finally {
    captchaLoading.value = false;
  }
}
```

### 4. 在组件挂载时初始化验证码

```typescript
onMounted(() => {
  handleGenerateCaptcha();
});
```

### 5. 在表单 Schema 中配置组件

```typescript
const formSchema = computed((): VbenFormSchema[] => {
  return [
    // ... 其他表单字段 ...
    {
      component: markRaw(LastAdminCaptcha),
      componentProps: {
        // 验证码类型（从 API 响应获取）
        captchaType: captchaData.value?.captchaType || 'digit',
        // 刷新验证码的回调函数，接收 setter 函数用于更新验证码数据
        onRefresh: handleGenerateCaptcha,
        // 验证码值变化的回调函数
        onChange: (_data) => {
          // 验证码数据通过 change 事件传递
          // 表单会自动更新 captcha 字段
        },
      },
      fieldName: 'captcha',
      // 验证规则：验证码必须包含 id 和 value
      rules: z.object({
        id: z.string().min(1),
        value: z.string().min(1),
      }),
    },
  ];
});
```

### 4. 实现验证码生成函数

```typescript
/**
 * 生成验证码
 * @param setter 用于设置验证码数据的函数
 */
async function handleGenerateCaptcha(
  setter: (id: string, base64Blob: string, audioBlob?: string) => void,
) {
  try {
    captchaLoading.value = true;
    const response = await generateCaptchaApi();
    if (response) {
      // 通过 setter 函数更新组件内部的验证码数据
      setter(response.id, response.base64Blob);
    }
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  } finally {
    captchaLoading.value = false;
  }
}
```

## API 响应格式

验证码 API 应返回以下格式的数据：

```typescript
interface CaptchaResult {
  base64Blob: string; // 验证码图片或音频的 base64 数据
  id: string; // 验证码 ID
  captchaType: 'audio' | 'chinese' | 'digit' | 'math' | 'string';
}
```

## 验证码类型说明

| 类型      | 说明           | 输入限制 |
| --------- | -------------- | -------- |
| `digit`   | 数字验证码     | 仅数字   |
| `math`    | 数学题验证码   | 仅数字   |
| `string`  | 字符串验证码   | 无限制   |
| `chinese` | 中文字符验证码 | 无限制   |
| `audio`   | 音频验证码     | 无限制   |

## 组件 Props

| 属性            | 类型             | 默认值  | 说明                   |
| --------------- | ---------------- | ------- | ---------------------- |
| `captchaType`   | string           | 'digit' | 验证码类型             |
| `captchaImage`  | string           | ''      | 验证码图片 base64 数据 |
| `captchaAudio`  | string           | ''      | 验证码音频 base64 数据 |
| `placeholder`   | string           | ''      | 输入框占位符           |
| `width`         | number \| string | '100%'  | 组件宽度               |
| `height`        | number \| string | '40px'  | 组件高度               |
| `captchaWidth`  | number \| string | '100px' | 验证码图片宽度         |
| `captchaHeight` | number \| string | '40px'  | 验证码图片高度         |
| `onRefresh`     | function         | -       | 刷新验证码的回调函数   |
| `onChange`      | function         | -       | 验证码值变化的回调函数 |

## 组件事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `refresh` | - | 刷新验证码（当 `onRefresh` 未提供时触发） |
| `change` | `LastAdminCaptchaData` | 验证码值变化（当 `onChange` 未提供时触发） |

## 表单提交

当表单提交时，验证码字段的值为：

```typescript
{
  id: string; // 验证码 ID
  value: string; // 用户输入的验证码值
}
```

## 完整示例

参考文件：`apps/web-last-admin-antd/src/views/_core/authentication/login.vue`

## 最佳实践

1. **初始化验证码**：在组件挂载时调用 `handleGenerateCaptcha()` 初始化验证码
2. **错误处理**：在 `handleGenerateCaptcha()` 中添加错误处理逻辑
3. **加载状态**：使用 `captchaLoading` 状态来显示加载状态
4. **类型安全**：使用 TypeScript 类型定义确保类型安全
5. **国际化**：所有用户可见文本都使用 `$t()` 进行国际化

## 常见问题

### Q: 如何处理验证码生成失败？

A: 在 `handleGenerateCaptcha()` 函数中添加 try-catch 块来处理错误：

```typescript
async function handleGenerateCaptcha() {
  try {
    captchaLoading.value = true;
    const response = await generateCaptchaApi();
    if (response) {
      captchaData.value = response;
    }
  } catch (error) {
    console.error('Failed to generate captcha:', error);
    // 显示错误提示
  } finally {
    captchaLoading.value = false;
  }
}
```

### Q: 如何自定义验证码的样式？

A: 通过 `componentProps` 中的 `width`、`height`、`captchaWidth`、`captchaHeight` 属性来自定义样式：

```typescript
componentProps: {
  width: '100%',
  height: '50px',
  captchaWidth: '120px',
  captchaHeight: '50px',
}
```

### Q: 如何处理不同的验证码类型？

A: 组件会根据 `captchaType` 自动处理：

- `digit` 和 `math` 类型会限制输入为数字
- `audio` 类型会显示音频播放按钮
- 其他类型显示验证码图片

## 相关文件

- 组件实现：`packages/effects/common-ui/src/components/captcha/last-admin-captcha/index.vue`
- 类型定义：`packages/effects/common-ui/src/components/captcha/types.ts`
- API 定义：`apps/web-last-admin-antd/src/api/core/captcha.ts`
- 登录页面：`apps/web-last-admin-antd/src/views/_core/authentication/login.vue`
