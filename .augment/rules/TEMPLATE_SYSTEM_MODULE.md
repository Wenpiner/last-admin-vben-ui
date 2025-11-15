---
type: "always_apply"
---

# 系统管理模块快速开发模板

## 📋 使用说明

本模板基于部门管理模块制作，提供了完整的代码模板，您只需要替换相应的占位符即可快速创建新的系统管理模块。

### 占位符说明
- `{MODULE_NAME}` - 模块名称（PascalCase，如：User, Role, Menu）
- `{module-name}` - 模块名称（kebab-case，如：user, role, menu）
- `{module_name}` - 模块名称（snake_case，如：user, role, menu）
- `{模块中文名}` - 模块的中文名称（如：用户, 角色, 菜单）
- `{Module Name}` - 模块的英文名称（如：User, Role, Menu）

## 📁 1. API 接口文件模板

**文件路径**: `src/api/system/{module-name}.ts`

```typescript
import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace System{MODULE_NAME}Api {
  /**
   * {模块中文名}信息
   */
  export interface {MODULE_NAME}Info {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    name: string;              // 名称
    code?: string;             // 编码
    sortOrder: number;         // 排序
    state: boolean;            // 状态 (true=启用, false=禁用)
    description?: string;      // 描述
    // 根据实际业务需求添加其他字段
  }

  /**
   * {模块中文名}列表请求参数
   */
  export interface {MODULE_NAME}ListRequest extends PageRequest {
    name?: string;
    code?: string;
    state?: boolean;
    // 根据实际业务需求添加其他搜索字段
  }

  /**
   * {模块中文名}列表信息
   */
  export type {MODULE_NAME}ListInfo = BaseListInfo<{MODULE_NAME}Info>;
}

/**
 * 获取{模块中文名}列表
 * @param data 查询参数
 */
export async function get{MODULE_NAME}List(
  data: System{MODULE_NAME}Api.{MODULE_NAME}ListRequest,
) {
  return requestClient.post<System{MODULE_NAME}Api.{MODULE_NAME}ListInfo>(
    '/sys-api/{module_name}/list',
    data,
  );
}

/**
 * 创建或更新{模块中文名}
 * @param data {模块中文名}信息
 */
export async function createOrUpdate{MODULE_NAME}(
  data: System{MODULE_NAME}Api.{MODULE_NAME}Info,
) {
  return requestClient.post<System{MODULE_NAME}Api.{MODULE_NAME}Info>(
    '/sys-api/{module_name}/createOrUpdate',
    data,
  );
}

/**
 * 删除{模块中文名}
 * @param id {模块中文名} ID
 */
export async function delete{MODULE_NAME}(id: number) {
  return requestClient.post<any>('/sys-api/{module_name}/delete', {
    id,
  });
}

export {};
```

## 📊 2. 数据配置文件模板

**文件路径**: `src/views/system/{module-name}/data.ts`

```typescript
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { System{MODULE_NAME}Api } from '#/api/system/{module-name}';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 获取状态选项
 */
export function getStateOptions() {
  return [
    { label: $t('system.enable'), value: true, color: 'green' },
    { label: $t('system.disable'), value: false, color: 'red' },
  ];
}

/**
 * 获取状态颜色映射
 */
export function getStateColorMap() {
  const map: Record<string, string> = {};
  getStateOptions().forEach((option) => {
    map[String(option.value)] = option.color;
  });
  return map;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<System{MODULE_NAME}Api.{MODULE_NAME}Info>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('system.{module_name}.name'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'code',
      title: $t('system.{module_name}.code'),
      width: 150,
    },
    {
      field: 'state',
      title: $t('system.{module_name}.state'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = stateColorMap[String(row.state)];
          const text = row.state ? $t('system.enable') : $t('system.disable');
          return h(
            Tag,
            {
              color,
            },
            () => text,
          );
        },
      },
    },
    {
      field: 'sortOrder',
      title: $t('system.{module_name}.sortOrder'),
      width: 100,
      align: 'center',
    },
    {
      field: 'description',
      title: $t('system.{module_name}.description'),
      minWidth: 150,
    },
    {
      field: 'createdAt',
      title: $t('system.createdAt'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}

/**
 * 搜索表单配置
 */
export function useSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.{module_name}.name'),
      },
      {
        component: 'Input',
        fieldName: 'code',
        label: $t('system.{module_name}.code'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.{module_name}.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.{module_name}.state'),
      },
    ],
  };
}
```

## 🏠 3. 主页面组件模板

**文件路径**: `src/views/system/{module-name}/index.vue`

```vue
<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { System{MODULE_NAME}Api } from '#/api/system/{module-name}';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delete{MODULE_NAME}, get{MODULE_NAME}List } from '#/api/system/{module-name}';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns, useSearchFormSchemas } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [...(useSearchFormSchemas().schema as any)],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
  // class 样式
  wrapperClass:
    'gap-x-2 flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
};

const gridOptions: VxeTableGridOptions<System{MODULE_NAME}Api.{MODULE_NAME}Info> = {
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
                onClick: () => {
                  onEdit(row);
                },
              },
              {
                type: 'link',
                color: 'error',
                label: $t('system.operation.delete'),
                popConfirm: {
                  title: $t('system.tableAction.deleteConfirm'),
                  confirm: () => {
                    onDelete(row);
                  },
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
    enabled: true, // 启用分页
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        const data = await get{MODULE_NAME}List({
          page: { currentPage: 1, pageSize: 20 },
          ...formValues,
        });

        return {
          data: data.list || [],
          total: data.total || 0,
        };
      },
    },
    response: {
      total: 'total',
      list: 'data',
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function onRefresh() {
  gridApi.query();
}

function onEdit(row: System{MODULE_NAME}Api.{MODULE_NAME}Info) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

async function onDelete(row: System{MODULE_NAME}Api.{MODULE_NAME}Info) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await delete{MODULE_NAME}(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除{模块中文名}失败:', error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.{module_name}.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
```

## 📝 4. 表单组件模板

**文件路径**: `src/views/system/{module-name}/modules/form.vue`

```vue
<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { System{MODULE_NAME}Api } from '#/api/system/{module-name}';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdate{MODULE_NAME} } from '#/api/system/{module-name}';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<System{MODULE_NAME}Api.{MODULE_NAME}Info>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.{module_name}.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.{module_name}.name')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.{module_name}.name'), 100]),
      ),
  },
  {
    component: 'Input',
    fieldName: 'code',
    label: $t('system.{module_name}.code'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.{module_name}.code')]))
      .max(
        50,
        $t('ui.formRules.maxLength', [$t('system.{module_name}.code'), 50]),
      ),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 9999,
      placeholder: $t('system.{module_name}.sortOrder'),
    },
    fieldName: 'sortOrder',
    label: $t('system.{module_name}.sortOrder'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.min', [$t('system.{module_name}.sortOrder'), 0]))
      .max(
        9999,
        $t('ui.formRules.max', [$t('system.{module_name}.sortOrder'), 9999]),
      ),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.{module_name}.state'),
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.{module_name}.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [
          $t('system.{module_name}.description'),
          500,
        ]),
      )
      .nullable()
      .optional(),
  },
];

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

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<System{MODULE_NAME}Api.{MODULE_NAME}Info>();
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

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<System{MODULE_NAME}Api.{MODULE_NAME}Info>();
    try {
      await createOrUpdate{MODULE_NAME}(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.{module_name}.name')])
    : $t('ui.actionTitle.create', [$t('system.{module_name}.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
```

## 🌍 5. 国际化配置模板

### 中文翻译 (`src/locales/langs/zh-CN/system.json`)

在现有的 system.json 文件中添加以下内容：

```json
{
  "{module_name}": {
    "name": "{模块中文名}",
    "title": "{模块中文名}管理",
    "code": "编码",
    "sortOrder": "排序",
    "state": "状态",
    "description": "描述"
  }
}
```

### 英文翻译 (`src/locales/langs/en-US/system.json`)

在现有的 system.json 文件中添加以下内容：

```json
{
  "{module_name}": {
    "name": "{Module Name}",
    "title": "{Module Name} Management",
    "code": "Code",
    "sortOrder": "Sort Order",
    "state": "State",
    "description": "Description"
  }
}
```

## 📄 6. README 文档模板

**文件路径**: `src/views/system/{module-name}/README.md`

```markdown
# {模块中文名}管理模块

## 📋 功能概述

{模块中文名}管理模块提供了完整的{模块中文名}信息管理功能，支持增删改查等基本操作。

## 🚀 主要功能

### 1. {模块中文名}列表显示
- ✅ 分页表格展示{模块中文名}信息
- ✅ 显示{模块中文名}基本信息（名称、编码、状态等）
- ✅ 状态标识（启用/禁用）

### 2. {模块中文名}搜索
- ✅ 按{模块中文名}名称搜索
- ✅ 按{模块中文名}编码搜索
- ✅ 按状态筛选

### 3. {模块中文名}管理
- ✅ 新增{模块中文名}
- ✅ 编辑{模块中文名}信息
- ✅ 删除{模块中文名}
- ✅ 状态管理（启用/禁用）

## 📁 文件结构

\`\`\`
src/views/system/{module-name}/
├── index.vue           # 主页面 - {模块中文名}列表和操作
├── data.ts            # 数据配置 - 表格列和搜索表单
├── modules/
│   └── form.vue       # 表单组件 - 新增/编辑{模块中文名}
└── README.md          # 说明文档
\`\`\`

\`\`\`
src/api/system/
└── {module-name}.ts   # API接口定义
\`\`\`

## 🔧 技术实现

### API接口
- \`POST /sys-api/{module_name}/list\` - 获取{模块中文名}列表
- \`POST /sys-api/{module_name}/createOrUpdate\` - 创建或更新{模块中文名}
- \`POST /sys-api/{module_name}/delete\` - 删除{模块中文名}

### 数据结构
\`\`\`typescript
interface {MODULE_NAME}Info {
  id?: number;
  name: string;            // {模块中文名}名称
  code?: string;           // {模块中文名}编码
  sortOrder: number;       // 排序
  state: boolean;          // 状态 (true=启用, false=禁用)
  description?: string;    // 描述
}
\`\`\`

## 🎯 使用方式

### 1. 访问{模块中文名}管理
导航到 \`系统管理 > {模块中文名}管理\` 页面

### 2. 查看{模块中文名}列表
- 页面加载时自动显示所有{模块中文名}的分页列表
- 使用搜索表单筛选{模块中文名}

### 3. 新增{模块中文名}
1. 点击 "新增{模块中文名}" 按钮
2. 填写{模块中文名}信息
3. 设置排序和状态（状态默认启用）
4. 点击确认保存

### 4. 编辑{模块中文名}
1. 点击{模块中文名}行的 "编辑" 按钮
2. 修改{模块中文名}信息
3. 点击确认保存

### 5. 删除{模块中文名}
1. 点击{模块中文名}行的 "删除" 按钮
2. 确认删除操作

## 🌍 国际化支持

支持中英文双语：
- 中文：\`zh-CN/system.json\` 中的 \`{module_name}\` 配置
- 英文：\`en-US/system.json\` 中的 \`{module_name}\` 配置

## ⚠️ 注意事项

1. **表单验证**：所有必填字段都有相应的验证规则
2. **默认值**：新增{模块中文名}时状态默认为启用，排序默认为0
3. **分页加载**：列表支持分页，默认每页20条记录

## 🔄 扩展建议

1. **批量操作**：添加批量启用/禁用功能
2. **导入导出**：支持Excel导入导出{模块中文名}数据
3. **权限控制**：集成角色权限控制
4. **审计日志**：记录{模块中文名}变更历史
```

## 🚀 快速使用指南

### 步骤1：创建文件结构
```bash
# 创建目录
mkdir -p src/views/system/{module-name}/modules
mkdir -p src/api/system

# 创建文件
touch src/views/system/{module-name}/index.vue
touch src/views/system/{module-name}/data.ts
touch src/views/system/{module-name}/modules/form.vue
touch src/views/system/{module-name}/README.md
touch src/api/system/{module-name}.ts
```

### 步骤2：替换占位符
使用您的代码编辑器的"查找替换"功能，将以下占位符替换为实际值：

- `{MODULE_NAME}` → 您的模块名（如：User）
- `{module-name}` → 您的模块名（如：user）
- `{module_name}` → 您的模块名（如：user）
- `{模块中文名}` → 您的模块中文名（如：用户）
- `{Module Name}` → 您的模块英文名（如：User）

### 步骤3：复制模板代码
将上述模板代码复制到对应的文件中，并根据实际业务需求调整字段和逻辑。

### 步骤4：更新国际化文件
在 `src/locales/langs/zh-CN/system.json` 和 `src/locales/langs/en-US/system.json` 中添加相应的翻译配置。

### 步骤5：测试功能
启动项目，测试新创建的模块是否正常工作。

---

**提示**: 这个模板涵盖了大部分常见的系统管理模块需求，您可以根据具体业务需求进行调整和扩展。
