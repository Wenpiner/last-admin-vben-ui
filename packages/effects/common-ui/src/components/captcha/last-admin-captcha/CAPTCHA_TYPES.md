# LastAdminCaptcha 验证码类型支持

## 概述

LastAdminCaptcha 组件支持多种验证码类型，每种类型都有不同的输入限制和 UI 表现。

## 支持的验证码类型

### 1. `digit` - 数字验证码

**特点**：

- 输入框类型为 `number`
- 只允许输入数字 (0-9)
- 自动过滤非数字字符
- 显示验证码图片

**使用示例**：

```vue
<LastAdminCaptcha
  :captcha-type="'digit'"
  @refresh="handleRefresh"
  @change="handleChange"
/>
```

**API 响应示例**：

```json
{
  "code": 0,
  "data": {
    "base64Blob": "data:image/png;base64,...",
    "id": "captcha_123",
    "captchaType": "digit"
  }
}
```

---

### 2. `math` - 数学验证码

**特点**：

- 输入框类型为 `number`
- 只允许输入数字 (0-9)
- 自动过滤非数字字符
- 显示数学题目图片（如：3 + 5 = ?）

**使用示例**：

```vue
<LastAdminCaptcha
  :captcha-type="'math'"
  @refresh="handleRefresh"
  @change="handleChange"
/>
```

**API 响应示例**：

```json
{
  "code": 0,
  "data": {
    "base64Blob": "data:image/png;base64,...",
    "id": "captcha_456",
    "captchaType": "math"
  }
}
```

---

### 3. `string` - 字符串验证码

**特点**：

- 输入框类型为 `text`
- 允许输入任何字符
- 显示字符组合图片

**使用示例**：

```vue
<LastAdminCaptcha
  :captcha-type="'string'"
  @refresh="handleRefresh"
  @change="handleChange"
/>
```

---

### 4. `chinese` - 中文验证码

**特点**：

- 输入框类型为 `text`
- 允许输入任何字符
- 显示中文字符图片

**使用示例**：

```vue
<LastAdminCaptcha
  :captcha-type="'chinese'"
  @refresh="handleRefresh"
  @change="handleChange"
/>
```

---

### 5. `audio` - 音频验证码

**特点**：

- 隐藏验证码图片
- 显示音频播放按钮（音量图标）
- 点击按钮播放音频验证码
- 音频播放时按钮显示脉冲动画
- 输入框类型为 `text`
- 允许输入任何字符

**使用示例**：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { LastAdminCaptcha } from '@vben/common-ui';

const captchaRef = ref();

async function handleCaptchaRefresh() {
  const { data } = await generateCaptchaApi();
  // 对于音频验证码，需要传递音频数据
  captchaRef.value?.setCaptchaData(
    data.id,
    data.base64Blob, // 音频数据（base64 或 URL）
  );
}

function handleCaptchaChange(data) {
  console.log('用户输入:', data.value);
}
</script>

<template>
  <LastAdminCaptcha
    ref="captchaRef"
    :captcha-type="'audio'"
    @refresh="handleCaptchaRefresh"
    @change="handleCaptchaChange"
  />
</template>
```

**API 响应示例**：

```json
{
  "code": 0,
  "data": {
    "base64Blob": "data:audio/mp3;base64,...",
    "id": "captcha_789",
    "captchaType": "audio"
  }
}
```

---

## 输入限制规则

| 类型      | 输入框类型 | 允许的字符 | 自动过滤   |
| --------- | ---------- | ---------- | ---------- |
| `digit`   | number     | 0-9        | 非数字字符 |
| `math`    | number     | 0-9        | 非数字字符 |
| `string`  | text       | 任意       | 无         |
| `chinese` | text       | 任意       | 无         |
| `audio`   | text       | 任意       | 无         |

---

## 组件方法

### `setCaptchaData(id: string, base64Blob: string, audioBlob?: string)`

设置验证码数据。

**参数**：

- `id` (string): 验证码 ID
- `base64Blob` (string): 验证码数据（图片 base64 或音频 base64/URL）
- `audioBlob` (string, 可选): 音频数据（仅用于音频类型）

**示例**：

```typescript
// 图片类型
captchaRef.value?.setCaptchaData(data.id, data.base64Blob);

// 音频类型
captchaRef.value?.setCaptchaData(data.id, data.base64Blob);
```

---

## 事件

### `refresh`

用户点击刷新按钮或点击验证码图片时触发。

```vue
<LastAdminCaptcha @refresh="handleRefresh" />
```

### `change`

用户输入内容时触发。

```vue
<LastAdminCaptcha @change="handleChange" />
```

**回调参数**：

```typescript
interface LastAdminCaptchaData {
  id: string; // 验证码 ID
  value: string; // 用户输入的值
}
```

---

## 完整使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { LastAdminCaptcha } from '@vben/common-ui';
import { generateCaptchaApi } from '@/api/core/auth';

const captchaRef = ref();
const captchaType = ref('digit');
const captchaData = ref({ id: '', value: '' });

async function handleCaptchaRefresh() {
  try {
    const { data } = await generateCaptchaApi({ type: captchaType.value });
    captchaRef.value?.setCaptchaData(data.id, data.base64Blob);
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  }
}

function handleCaptchaChange(data) {
  captchaData.value = data;
  console.log('Current captcha data:', data);
}

function handleSubmit() {
  console.log('Submitting with captcha:', captchaData.value);
}
</script>

<template>
  <div>
    <!-- 验证码类型选择 -->
    <select v-model="captchaType">
      <option value="digit">数字</option>
      <option value="math">数学</option>
      <option value="string">字符串</option>
      <option value="chinese">中文</option>
      <option value="audio">音频</option>
    </select>

    <!-- 验证码组件 -->
    <LastAdminCaptcha
      ref="captchaRef"
      :captcha-type="captchaType"
      @refresh="handleCaptchaRefresh"
      @change="handleCaptchaChange"
    />

    <!-- 提交按钮 -->
    <button @click="handleSubmit">
      提交 (验证码: {{ captchaData.value }})
    </button>
  </div>
</template>
```

---

## 注意事项

1. **数字类型限制**：`digit` 和 `math` 类型会自动过滤非数字字符，用户无法输入其他字符
2. **音频播放**：音频类型需要后端返回有效的音频数据（base64 或 URL）
3. **跨域问题**：如果音频数据来自不同域，需要配置 CORS
4. **浏览器兼容性**：音频播放依赖浏览器的 HTML5 Audio API
5. **无障碍访问**：所有按钮都有 aria-label 属性，支持屏幕阅读器
