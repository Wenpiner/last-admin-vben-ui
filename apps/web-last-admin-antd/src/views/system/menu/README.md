# 菜单列表页面

这是一个只读的菜单列表页实现，使用 `useVbenVxeGrid` 组件展示菜单数据。

## 文件结构

```
menu/
├── index.vue              # 主列表页面
├── data.ts               # 列配置
└── README.md             # 本文件
```

## 文件说明

### 1. `index.vue` - 主列表页面

主要功能：

- 使用 `useVbenVxeGrid` 创建树形表格
- 从 `/menu/all-menus` 接口加载菜单数据
- 使用 `convertMenusToTree` 函数转换成树形结构
- 树形列表展示，无分页

关键特性：

- **树形结构**：通过 `treeConfig` 配置实现菜单树形展示
  - `parentField: 'parentId'` - 父级字段
  - `rowField: 'id'` - 行ID字段
  - `transform: false` - 不转换数据结构
- **工具栏**：包含刷新、缩放等功能
- **自定义渲染**：菜单标题显示图标和多语言支持
- **只读模式**：仅展示菜单数据，无编辑/删除功能

### 2. `data.ts` - 列配置文件

导出的函数：

- `useColumns()` - 返回表格列配置

列配置包括：

- **菜单标题**：显示菜单名称和图标（树形节点）
- **路由路径**：显示菜单路由路径
- **菜单名称**：显示菜单标识名称
- **组件**：显示关联的组件名称

## API 接口

在 `src/api/system/menu.ts` 中定义：

```typescript
// 获取菜单列表（树形结构）
getMenuList(): Promise<MenuRecordRaw[]>
```

接口返回结构与 `src/api/core/menu.ts` 中的 `getAllMenusApi` 相同，自动转换为树形结构。

## 数据结构

菜单数据结构（`MenuRecordRaw`）：

```typescript
interface MenuRecordRaw extends RouteRecordStringComponent {
  children?: MenuRecordRaw[];
  id: number | string;
  parentId?: null | number | string;
  title?: string;
  icon?: string;
  path?: string;
  name?: string;
  component?: string;
  // ... 其他路由属性
}
```

## 使用示例

### 基本使用

页面会自动加载菜单列表并显示为树形结构。

```vue
<template>
  <Page auto-content-height>
    <Grid>
      <template #title="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon v-if="row.icon" :icon="row.icon" class="size-full" />
          </div>
          <span class="flex-auto">{{ $t(row.title) }}</span>
        </div>
      </template>
    </Grid>
  </Page>
</template>
```

## 配置说明

### 表格配置

```typescript
gridOptions: {
  columns: useColumns(),               // 列配置
  height: 'auto',                      // 自动高度
  keepSource: true,                    // 保留源数据
  pagerConfig: { enabled: false },     // 禁用分页
  proxyConfig: {
    ajax: {
      query: async (_params) => {
        return await getMenuList();    // 加载菜单数据
      },
    },
  },
  rowConfig: {
    keyField: 'id',                    // 行键字段
  },
  toolbarConfig: {                     // 工具栏配置
    custom: true,
    export: false,
    refresh: true,
    zoom: true,
  },
  treeConfig: {                        // 树形配置
    parentField: 'parentId',           // 父级字段
    rowField: 'id',                    // 行ID字段
    transform: false,                  // 不转换数据结构
  },
}
```

## 多语言配置

在 `src/locales/langs/zh-CN/system.json` 中声明的翻译键：

```json
{
  "menu": {
    "menuTitle": "菜单标题",
    "path": "路由路径",
    "name": "菜单",
    "component": "组件",
    "type": "菜单类型",
    "typeCatalog": "目录",
    "typeMenu": "菜单",
    "typeButton": "按钮",
    "typeLink": "外链",
    "typeEmbedded": "内嵌"
  }
}
```

## 扩展建议

1. **添加搜索功能**：在 `gridOptions` 中添加 `formOptions` 配置
2. **添加导出功能**：设置 `toolbarConfig.export: true`
3. **自定义样式**：修改列配置中的 `width` 和 `align` 属性
4. **添加更多字段**：在 `data.ts` 中扩展 `useColumns` 函数
5. **添加编辑功能**：集成表单抽屉进行菜单编辑

## 注意事项

- 菜单数据从 `/menu/all-menus` 接口加载
- 使用 `convertMenusToTree` 函数将平铺数据转换为树形结构
- 树形结构基于 `parentId` 字段建立父子关系
- 菜单标题支持多语言，使用 `$t()` 函数翻译
- 菜单图标使用 Iconify 图标库
