# LastAdminCaptcha 翻译结构说明

## 核心原理

在 i18n 系统中，文件名（不含 `.json` 扩展名）会直接作为翻译的命名空间键。

例如：

- 文件 `zh-CN/ui.json` → 命名空间 `ui`
- 文件 `zh-CN/authentication.json` → 命名空间 `authentication`
- 文件 `zh-CN/lastAdmin.json` → 命名空间 `lastAdmin`

## 错误的做法 ❌

```
文件名: last-admin-captcha.json
↓
命名空间: last-admin-captcha (包含连字符)
↓
文件内容: { "lastAdminCaptcha": { "captcha": { ... } } }
↓
访问方式: $t('last-admin-captcha.lastAdminCaptcha.captcha.inputPlaceholder')
↓
问题: 过度嵌套，且文件名包含连字符导致解析错误
```

## 正确的做法 ✅

```
文件名: lastAdmin.json
↓
命名空间: lastAdmin (驼峰命名，作为第一层)
↓
文件内容: { "captcha": { "inputPlaceholder": "..." } }
↓
访问方式: $t('lastAdmin.captcha.inputPlaceholder')
↓
结果: 正确解析为 { lastAdmin: { captcha: { inputPlaceholder: "..." } } }
```

## 文件结构

```
packages/locales/src/langs/
├── zh-CN/
│   ├── authentication.json
│   ├── common.json
│   ├── preferences.json
│   ├── ui.json
│   └── lastAdmin.json              ✨ 新增（驼峰命名）
└── en-US/
    ├── authentication.json
    ├── common.json
    ├── preferences.json
    ├── ui.json
    └── lastAdmin.json              ✨ 新增（驼峰命名）
```

## 翻译文件内容

### zh-CN/lastAdmin.json

```json
{
  "captcha": {
    "inputPlaceholder": "请输入验证码",
    "loading": "加载中...",
    "refresh": "刷新"
  }
}
```

### en-US/lastAdmin.json

```json
{
  "captcha": {
    "inputPlaceholder": "Please enter captcha",
    "loading": "Loading...",
    "refresh": "Refresh"
  }
}
```

**说明**：文件名 `lastAdmin` 已经作为第一层命名空间，所以文件内容只需包含 `captcha` 块即可。

## 组件中的使用

```vue
<template>
  <VbenInput
    :placeholder="placeholder || $t('lastAdmin.captcha.inputPlaceholder')"
  />
  <div v-else>
    {{ $t('lastAdmin.captcha.loading') }}
  </div>
  <VbenIconButton :aria-label="$t('lastAdmin.captcha.refresh')" />
</template>
```

## 关键要点

1. **文件命名**：使用驼峰命名法（`lastAdmin`），不使用连字符（`last-admin-captcha`）
2. **命名空间**：文件名直接成为第一层命名空间，`lastAdmin.json` → `lastAdmin` 命名空间
3. **文件内容**：文件内容只需包含块名称（如 `captcha`），不需要再嵌套文件名
4. **访问方式**：`$t('lastAdmin.captcha.inputPlaceholder')` = 文件名 + 文件内块名 + 键名
5. **自动加载**：i18n 系统会自动加载 `langs/**/*.json` 下的所有文件
6. **可扩展性**：可以在 `lastAdmin.json` 中添加其他块（如 `form`, `table`），访问方式为 `lastAdmin.form.*`, `lastAdmin.table.*`

## 添加新语言

```json
// packages/locales/src/langs/ja-JP/lastAdmin.json
{
  "captcha": {
    "inputPlaceholder": "認証コードを入力してください",
    "loading": "読み込み中...",
    "refresh": "更新"
  }
}
```

## 避免冲突

- ✅ 不修改 `ui.json`，避免与上游冲突
- ✅ 使用独立的 `lastAdmin.json` 文件
- ✅ 所有 lastAdmin 相关的翻译集中在一个文件中
- ✅ 上游更新时不会产生合并冲突

## 参考

- i18n 配置：`packages/locales/src/i18n.ts`
- 文件加载规则：第 82-83 行的 `loadLocalesMapFromDir` 函数
  ```typescript
  for (const [fileName, importFn] of Object.entries(files)) {
    messages[fileName] = ((await importFn()) as any)?.default;
  }
  ```
  文件名（不含 `.json`）直接作为 `messages` 对象的键
