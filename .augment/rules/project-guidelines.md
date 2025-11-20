---
type: "always_apply"
---

# 系统管理模块开发规范 (Augment Rule)

## 📋 概述

本规范基于 `apps/web-last-admin-antd/src/views/system/user/` 模块制定，用于指导后续系统管理模块的开发，确保代码结构一致、功能完整、可维护性强。

## 🏗️ 文件结构规范

### 标准目录结构
```
src/views/system/{module-name}/
├── index.vue           # 主页面 - 列表展示和操作
├── data.ts            # 数据配置 - 表格列和搜索表单配置
├── modules/
│   └── form.vue       # 表单组件 - 新增/编辑表单
└── README.md          # 模块说明文档
```

### API 接口文件
```
src/api/system/
└── {module-name}.ts   # API接口定义和类型声明
```

### 国际化文件
```
src/locales/langs/
├── zh-CN/system.json  # 中文翻译
└── en-US/system.json  # 英文翻译
```

## 🔧 技术栈规范

### 核心依赖
- **表格组件**: `useVbenVxeGrid` + `VxeTableGridOptions`
- **表单组件**: `useVbenForm` + `VbenFormSchema`
- **弹窗组件**: `useVbenModal`
- **页面容器**: `Page` 组件
- **操作按钮**: `TableAction` 组件
- **国际化**: `$t()` 函数
- **验证规则**: `z` (zod) 验证库

### UI 组件库
- **Ant Design Vue**: Button, message, Tag 等基础组件
- **Vben Icons**: Plus 等图标组件

## 📝 代码规范

### 1. API 接口层 (`src/api/system/{module}.ts`)

#### 命名空间规范
```typescript
export namespace System{ModuleName}Api {
  // 主要数据接口
  export interface {ModuleName}Info {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    // 业务字段...
    state: boolean;          // 状态字段 (true=启用, false=禁用)
    description?: string;    // 描述字段
  }

  // 列表请求参数
  export interface {ModuleName}ListRequest extends PageRequest {
    // 搜索字段...
  }

  // 列表响应数据
  export interface {ModuleName}ListInfo {
    total: number;
    list: {ModuleName}Info[];
  }
}
```

#### API 函数规范
```typescript
// 获取列表 - 统一使用 POST 请求
export async function get{ModuleName}List(
  data: System{ModuleName}Api.{ModuleName}ListRequest,
) {
  return requestClient.post<System{ModuleName}Api.{ModuleName}ListInfo>(
    '/sys-api/{module}/list',
    data,
  );
}

// 创建或更新 - 统一接口
export async function createOrUpdate{ModuleName}(
  data: System{ModuleName}Api.{ModuleName}Info,
) {
  return requestClient.post<System{ModuleName}Api.{ModuleName}Info>(
    '/sys-api/{module}/createOrUpdate',
    data,
  );
}

// 删除
export async function delete{ModuleName}(id: number) {
  return requestClient.post<any>('/sys-api/{module}/delete', {
    id,
  });
}
```

### 2. 数据配置层 (`data.ts`)

#### 状态选项配置
```typescript
export function getStateOptions() {
  return [
    { label: $t('system.enable'), value: true, color: 'green' },
    { label: $t('system.disable'), value: false, color: 'red' },
  ];
}

export function getStateColorMap() {
  const map: Record<string, string> = {};
  getStateOptions().forEach((option) => {
    map[String(option.value)] = option.color;
  });
  return map;
}
```

#### 表格列配置
```typescript
export function useColumns(): VxeTableGridOptions<System{ModuleName}Api.{ModuleName}Info>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    // 主要字段列
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('system.{module}.name'),
      minWidth: 200,
    },
    // 状态列 - 使用 Tag 组件
    {
      field: 'state',
      title: $t('system.{module}.state'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = stateColorMap[String(row.state)];
          const text = row.state ? $t('system.enable') : $t('system.disable');
          return h(Tag, { color }, () => text);
        },
      },
    },
    // 时间列 - 使用格式化器
    {
      field: 'createdAt',
      title: $t('system.createdAt'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}
```

#### 搜索表单配置
```typescript
export function useSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.{module}.name'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.{module}.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.{module}.state'),
      },
    ],
  };
}
```

### 3. 主页面组件 (`index.vue`)

#### 基础结构
```vue
<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { VbenFormProps } from '#/adapter/form';
import type { System{ModuleName}Api } from '#/api/system/{module}';

import { h } from 'vue';
import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';
import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delete{ModuleName}, get{ModuleName}List } from '#/api/system/{module}';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns, useSearchFormSchemas } from './data';
import Form from './modules/form.vue';

// Modal 配置
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 搜索表单配置
const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [...(useSearchFormSchemas().schema as any)],
  showCollapseButton: true,
  submitOnEnter: false,
  wrapperClass: 'gap-x-2 flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
};
</script>
```

#### 表格配置规范
```typescript
const gridOptions: VxeTableGridOptions<System{ModuleName}Api.{ModuleName}Info> = {
  columns: [
    ...(useColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      width: 150,
      align: 'center',
      slots: {
        default: ({ row }) => {
          return h(TableAction, {
            align: 'center',
            actions: [
              {
                type: 'link',
                label: $t('system.operation.edit'),
                onClick: () => onEdit(row),
              },
              {
                type: 'link',
                color: 'error',
                label: $t('system.operation.delete'),
                popConfirm: {
                  title: $t('system.tableAction.deleteConfirm'),
                  confirm: () => onDelete(row),
                },
              },
            ],
          });
        },
      },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: true, // 根据需要启用分页
  },
  proxyConfig: {
    ajax: {
      query: async ({page}, formValues) => {
        return await get{ModuleName}List({
          page,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: true,
    zoom: false,
  },
};
```

#### 操作函数规范
```typescript
function onRefresh() {
  gridApi.query();
}

function onEdit(row: System{ModuleName}Api.{ModuleName}Info) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

async function onDelete(row: System{ModuleName}Api.{ModuleName}Info) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await delete{ModuleName}(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除失败:', error);
  }
}
```

#### 模板结构
```vue
<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.{module}.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
```

### 4. 表单组件 (`modules/form.vue`)

#### 基础结构
```vue
<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { System{ModuleName}Api } from '#/api/system/{module}';

import { computed, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdate{ModuleName} } from '#/api/system/{module}';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<System{ModuleName}Api.{ModuleName}Info>();
</script>
```

#### 表单 Schema 规范
```typescript
const schema: VbenFormSchema[] = [
  // 必填文本字段
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.{module}.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.{module}.name')]))
      .max(100, $t('ui.formRules.maxLength', [$t('system.{module}.name'), 100])),
  },
  // 数字字段
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 9999,
      placeholder: $t('system.{module}.sortOrder'),
    },
    fieldName: 'sortOrder',
    label: $t('system.{module}.sortOrder'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.min', [$t('system.{module}.sortOrder'), 0]))
      .max(9999, $t('ui.formRules.max', [$t('system.{module}.sortOrder'), 9999])),
  },
  // 状态单选按钮组
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.{module}.state'),
    rules: 'required',
  },
  // 可选文本域
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.{module}.description'),
    rules: z
      .string()
      .max(500, $t('ui.formRules.maxLength', [$t('system.{module}.description'), 500]))
      .nullable()
      .optional(),
  },
];
```

#### 表单配置
```typescript
const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
  layout: 'vertical',
});
```

#### Modal 配置
```typescript
const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<System{ModuleName}Api.{ModuleName}Info>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          state: true,
          sortOrder: 0,
        });
      }
    }
  },
});
```

#### 提交函数
```typescript
async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<System{ModuleName}Api.{ModuleName}Info>();
    try {
      await createOrUpdate{ModuleName}(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.{module}.name')])
    : $t('ui.actionTitle.create', [$t('system.{module}.name')]),
);
```

#### 模板结构
```vue
<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
```

## 🌍 国际化规范

### 中文翻译 (`zh-CN/system.json`)
```json
{
  "{module}": {
    "name": "{模块名称}",
    "title": "{模块名称}管理",
    "field1": "字段1",
    "field2": "字段2",
    "state": "状态",
    "description": "描述"
  }
}
```

### 英文翻译 (`en-US/system.json`)
```json
{
  "{module}": {
    "name": "{Module Name}",
    "title": "{Module Name} Management",
    "field1": "Field 1",
    "field2": "Field 2",
    "state": "State",
    "description": "Description"
  }
}
```

## 📋 特殊功能规范

### 1. 树形结构支持
当模块需要支持树形结构时：

#### 数据接口扩展
```typescript
export interface {ModuleName}Info {
  // ... 其他字段
  parentId?: null | number;  // 父节点ID
  children?: {ModuleName}Info[];  // 子节点
}
```

#### 表格配置扩展
```typescript
const gridOptions = {
  // ... 其他配置
  pagerConfig: {
    enabled: false, // 树形结构通常禁用分页
  },
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
    expandAll: true,
    accordion: false,
    showLine: true,
  },
};
```

#### 删除保护逻辑
```typescript
function hasChildren(
  row: System{ModuleName}Api.{ModuleName}Info,
  allData: System{ModuleName}Api.{ModuleName}Info[],
): boolean {
  return allData.some((item) => item.parentId === row.id);
}

async function onDelete(row: System{ModuleName}Api.{ModuleName}Info) {
  if (!row.id) return;

  // 获取当前所有数据来检查是否有子节点
  const currentData = gridApi.grid.getTableData()
    .fullData as System{ModuleName}Api.{ModuleName}Info[];

  // 检查是否有子节点
  if (hasChildren(row, currentData)) {
    message.error($t('system.{module}.hasChildrenCannotDelete'));
    return;
  }

  // ... 执行删除逻辑
}
```

### 2. 关联数据选择
当需要选择关联数据时（如用户、部门等）：

#### ApiSelect 组件使用
```typescript
{
  component: 'ApiSelect',
  componentProps: {
    filterOption: false,
    class: 'w-full',
    api: async (params: any) => {
      const result = await getRelatedDataList({
        page: { currentPage: 1, pageSize: 100 },
        state: true, // 只获取启用的数据
        ...params,
      });
      return result.list.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
    showSearch: true,
    allowClear: true,
    placeholder: $t('ui.placeholder.select', [$t('system.{module}.relatedField')]),
  },
  fieldName: 'relatedId',
  label: $t('system.{module}.relatedField'),
  rules: 'required',
},
```

#### ApiTreeSelect 组件使用（树形选择）
```typescript
{
  component: 'ApiTreeSelect',
  componentProps: {
    class: 'w-full',
    allowClear: true,
    api: async () => {
      const result = await getTreeDataList({
        page: { currentPage: 1, pageSize: 1000 },
      });
      return result.list || [];
    },
    fieldNames: {
      children: 'children',
      label: 'name',
      value: 'id',
    },
    placeholder: $t('system.{module}.parentNode'),
    treeDefaultExpandAll: true,
  },
  fieldName: 'parentId',
  label: $t('system.{module}.parentNode'),
},
```

## 📄 文档规范

### README.md 模板
每个模块都应包含完整的 README.md 文档，包含：

1. **功能概述** - 模块的主要功能和特性
2. **主要功能** - 详细的功能列表
3. **文件结构** - 文件组织结构说明
4. **技术实现** - API接口、数据结构、特殊处理逻辑
5. **使用方式** - 操作指南
6. **国际化支持** - 翻译文件说明
7. **注意事项** - 重要的开发和使用注意点
8. **扩展建议** - 未来可能的功能扩展方向

## ⚠️ 开发注意事项

### 1. 命名规范
- **文件名**: 使用 kebab-case (如: `user-management`)
- **组件名**: 使用 PascalCase (如: `UserManagement`)
- **API函数**: 使用 camelCase (如: `getUserList`)
- **类型接口**: 使用 PascalCase (如: `UserInfo`)

### 2. 错误处理
- 所有 API 调用都应包含 try-catch 错误处理
- 使用统一的 loading 和 success 消息提示
- 删除操作必须包含确认对话框

### 3. 性能优化
- 大数据量列表考虑分页加载
- 树形结构数据使用合适的 pageSize
- 搜索功能应支持防抖处理
- `data.ts` 应该只专注定义，对于逻辑处理应当在 `index.vue` 中使用 <template> 模版

### 4. 可访问性
- 所有表单字段都应有适当的 label
- 操作按钮应有明确的文本说明
- 支持键盘导航

### 5. 响应式设计
- 表格在移动端应有适当的显示方式
- 搜索表单应支持不同屏幕尺寸的布局
- 操作按钮在小屏幕上应合理排列

## 🚀 快速开始模板

基于此规范，您可以使用以下命令快速创建新的系统管理模块：

```bash
# 1. 创建目录结构
mkdir -p src/views/system/{module-name}/modules
mkdir -p src/api/system

# 2. 创建基础文件
touch src/views/system/{module-name}/index.vue
touch src/views/system/{module-name}/data.ts
touch src/views/system/{module-name}/modules/form.vue
touch src/views/system/{module-name}/README.md
touch src/api/system/{module-name}.ts

# 3. 更新国际化文件
# 在 src/locales/langs/zh-CN/system.json 和 en-US/system.json 中添加相应翻译
```

然后按照本规范的模板填充各个文件的内容，确保代码结构和功能的一致性。
