# LastAdminCaptcha 组件重构说明

## 重构背景

原始设计中，外部调用者需要通过多个 props（`captchaImage`、`captchaAudio`、`captchaId`）来传递验证码数据，这导致：

1. **Props 过多**：组件接收过多的动态数据 props
2. **数据同步困难**：外部需要同时更新多个 props 来保持数据一致
3. **职责不清**：组件内部状态和外部 props 的关系不明确

## 重构方案

### 核心思想

**将数据更新的职责从 props 传递改为通过回调函数的参数传递**

### 设计变更

#### 1. 新增 `CaptchaDataSetter` 类型

```typescript
export interface CaptchaDataSetter {
  (id: string, base64Blob: string, audioBlob?: string): void;
}
```

这是一个函数类型，用于在 `onRefresh` 回调中设置验证码数据。

#### 2. 修改 `onRefresh` 回调签名

**修改前**：

```typescript
onRefresh?: () => Promise<void> | void;
```

**修改后**：

```typescript
onRefresh?: (setter: CaptchaDataSetter) => Promise<void> | void;
```

#### 3. 移除不必要的 Props

移除以下 props，因为数据现在通过 setter 函数传递：

- `captchaImage`
- `captchaAudio`
- `captchaId`

#### 4. 更新组件内部逻辑

在 `generateCaptcha` 函数中，将 `setCaptchaData` 方法作为参数传递给 `onRefresh` 回调：

```typescript
async function generateCaptcha() {
  try {
    isLoading.value = true;
    if (props.onRefresh) {
      // 传递 setter 函数给回调
      await props.onRefresh(setCaptchaData);
    } else {
      emit('refresh');
    }
  } finally {
    isLoading.value = false;
  }
}
```

## 优势

### 1. **更清晰的数据流**

```
外部调用 onRefresh(setter)
    ↓
获取验证码数据
    ↓
通过 setter 更新组件内部状态
    ↓
组件自动更新 UI
```

### 2. **减少 Props 数量**

- 移除了 3 个动态数据 props（`captchaImage`、`captchaAudio`、`captchaId`）
- 组件接口更简洁

### 3. **一次性更新所有数据**

外部调用者只需一次调用 setter 函数，就能同时更新 ID、图片和音频数据：

```typescript
setter(data.id, data.base64Blob);
```

### 4. **避免 Props 同步问题**

不再需要担心多个 props 之间的同步问题，所有数据通过一个函数调用原子性地更新。

### 5. **更好的类型安全**

`CaptchaDataSetter` 类型明确定义了 setter 函数的签名，提供更好的 IDE 支持和类型检查。

## 使用示例

### 基本用法

```typescript
async function handleCaptchaRefresh(setter) {
  try {
    const { data } = await generateCaptchaApi();
    // 通过 setter 函数一次性更新所有验证码数据
    setter(data.id, data.base64Blob);
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  }
}
```

### 在表单中使用

```typescript
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: markRaw(LastAdminCaptcha),
      componentProps: {
        captchaType: 'digit',
        onRefresh: handleCaptchaRefresh,
      },
      fieldName: 'captcha',
      rules: z.object({
        id: z.string().min(1),
        value: z.string().min(1),
      }),
    },
  ];
});
```

## 迁移指南

如果你的代码使用了旧的 props 方式，需要进行以下更改：

### 旧方式（已废弃）

```typescript
componentProps: {
  captchaImage: data.base64Blob,
  captchaAudio: data.base64Blob,
  captchaId: data.id,
  onRefresh: handleGenerateCaptcha,
}
```

### 新方式

```typescript
async function handleGenerateCaptcha(setter) {
  const { data } = await generateCaptchaApi();
  setter(data.id, data.base64Blob);
}

componentProps: {
  onRefresh: handleGenerateCaptcha,
}
```

## 向后兼容性

- ✅ `setCaptchaData` 方法仍然可用，用于手动设置验证码数据
- ✅ `getData` 和 `reset` 方法保持不变
- ✅ `@refresh` 事件仍然可用（当不提供 `onRefresh` 时）

## 总结

这次重构通过将数据更新从 props 传递改为通过回调函数参数传递，使组件接口更清晰、更易用，同时减少了 props 的数量和复杂性。
