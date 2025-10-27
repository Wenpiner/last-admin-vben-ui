# LastAdminCaptcha 组件修复说明

## 最新更新 (2025-10-20)

### 功能增强：验证码类型特定处理

#### 1. 数字输入限制 (digit & math)

- **问题**：`digit` 和 `math` 类型应该只允许输入数字
- **解决方案**：
  - 在 `handleInputChange` 中添加类型检查
  - 使用正则表达式 `/\D/g` 过滤非数字字符
  - 设置输入框 `type="number"` 属性

#### 2. 音频验证码支持 (audio)

- **问题**：音频类型需要特殊的 UI 和交互处理
- **解决方案**：
  - 隐藏验证码图片，显示音频播放按钮
  - 添加 `captchaAudio` 状态存储音频数据
  - 添加 `isPlayingAudio` 状态跟踪播放状态
  - 实现 `playAudio()` 方法播放音频
  - 实现 `handleAudioEnded()` 方法处理播放结束

#### 3. 模板更新

- 条件渲染：根据 `captchaType` 显示不同的 UI
- 输入框类型：根据 `captchaType` 设置输入框类型
- 音频播放按钮：使用音量图标，播放时显示脉冲动画

#### 4. 样式增强

- 新增 `pulse` 动画：用于音频播放时的脉冲效果

#### 5. 文档

- 创建 `CAPTCHA_TYPES.md`：详细说明各种验证码类型的特点和使用方法

---

## 修复内容

### 1. 类型定义修复 (types.ts)

**问题**：TypeScript 类型顺序不符合规范，出现 "Expected 'number' to come before 'string'" 错误

**修复方案**：将所有 `string | number` 改为 `number | string`

```typescript
// 修复前
width?: string | number;
height?: string | number;
captchaWidth?: string | number;
captchaHeight?: string | number;

// 修复后
width?: number | string;
height?: number | string;
captchaWidth?: number | string;
captchaHeight?: number | string;
```

**原因**：TypeScript 类型检查器要求联合类型按字母顺序排列，`number` 在 `string` 之前。

---

### 2. 多语言支持实现

#### 2.1 创建独立的翻译文件

为了避免与上游仓库同步时出现冲突，创建了独立的翻译文件 `lastAdmin.json` 而不是修改 `ui.json`。

**关键点**：文件名（不含 `.json` 扩展名）会直接作为翻译的命名空间键，因此使用 `lastAdmin` 而不是 `last-admin-captcha`。

**中文翻译** (packages/locales/src/langs/zh-CN/lastAdmin.json)

```json
{
  "captcha": {
    "inputPlaceholder": "请输入验证码",
    "loading": "加载中...",
    "refresh": "刷新"
  }
}
```

**英文翻译** (packages/locales/src/langs/en-US/lastAdmin.json)

```json
{
  "captcha": {
    "inputPlaceholder": "Please enter captcha",
    "loading": "Loading...",
    "refresh": "Refresh"
  }
}
```

#### 2.2 组件更新 (index.vue)

**修改点 1**：移除硬编码的默认值

```typescript
// 修复前
refreshText: '刷新',

// 修复后
refreshText: '',
```

**修改点 2**：使用多语言替换硬编码文本

```vue
<!-- 修复前 -->
<VbenInput :placeholder="placeholder || '请输入验证码'" />
<div v-else class="text-foreground/50 text-xs">加载中...</div>
<img :alt="'验证码'" />

<!-- 修复后 -->
<VbenInput
  :placeholder="placeholder || $t('lastAdmin.captcha.inputPlaceholder')"
/>
<div v-else class="text-foreground/50 text-xs">
  {{ $t('lastAdmin.captcha.loading') }}
</div>
<img alt="验证码" />
```

---

## 多语言支持详情

### 支持的语言

- ✅ 中文 (zh-CN)
- ✅ 英文 (en-US)

### 翻译键映射

| 键                                   | 中文         | 英文                 |
| ------------------------------------ | ------------ | -------------------- |
| `lastAdmin.captcha.inputPlaceholder` | 请输入验证码 | Please enter captcha |
| `lastAdmin.captcha.loading`          | 加载中...    | Loading...           |
| `lastAdmin.captcha.refresh`          | 刷新         | Refresh              |

### 使用方式

组件会自动根据当前语言环境显示对应的文本：

```typescript
// 当前语言为中文时
$t('lastAdmin.captcha.inputPlaceholder'); // "请输入验证码"

// 当前语言为英文时
$t('lastAdmin.captcha.inputPlaceholder'); // "Please enter captcha"
```

### 独立翻译文件的优势

- ✅ **避免上游冲突**：不修改 `ui.json`，上游更新时不会产生冲突
- ✅ **易于维护**：lastAdmin 相关翻译集中在一个文件中
- ✅ **易于扩展**：可以在 `lastAdmin.json` 中添加其他 lastAdmin 相关的翻译块
- ✅ **自动加载**：i18n 系统会自动加载所有 `*.json` 文件
- ✅ **正确的命名空间**：使用 `lastAdmin` 而不是 `last-admin-captcha`，避免文件名解析错误

---

## 验证清单

- ✅ TypeScript 类型检查通过
- ✅ 所有硬编码文本已替换为多语言
- ✅ 中文翻译已添加
- ✅ 英文翻译已添加
- ✅ 组件正确使用 `$t()` 函数
- ✅ 无诊断错误

---

## 相关文件修改

1. **packages/effects/common-ui/src/components/captcha/types.ts**
   - 修复 `LastAdminCaptchaProps` 中的类型顺序

2. **packages/effects/common-ui/src/components/captcha/last-admin-captcha/index.vue**
   - 移除硬编码文本
   - 使用 `$t()` 函数进行多语言支持

3. **packages/locales/src/langs/zh-CN/lastAdmin.json** (新建)
   - 添加中文翻译
   - 包含 `lastAdmin.captcha.*` 翻译块

4. **packages/locales/src/langs/en-US/lastAdmin.json** (新建)
   - 添加英文翻译
   - 包含 `lastAdmin.captcha.*` 翻译块

---

## 后续扩展

### 添加新语言

如需添加更多语言支持，只需创建新的翻译文件即可：

```json
// packages/locales/src/langs/[lang]/lastAdmin.json
{
  "captcha": {
    "inputPlaceholder": "...",
    "loading": "...",
    "refresh": "..."
  }
}
```

组件会自动使用新添加的翻译。无需修改任何其他文件，i18n 系统会自动加载新的翻译文件。

### 添加其他 lastAdmin 相关的翻译

可以在 `lastAdmin.json` 中添加其他块，例如：

```json
{
  "captcha": { ... },
  "form": { ... },
  "table": { ... }
}
```

访问方式：

- `$t('lastAdmin.captcha.inputPlaceholder')`
- `$t('lastAdmin.form.title')`
- `$t('lastAdmin.table.empty')`

这样可以保持所有 lastAdmin 相关的翻译集中在一个文件中，便于维护。
