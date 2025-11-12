<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { SystemDepartmentApi } from '#/api/system/department';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDepartment, getDepartmentList } from '#/api/system/department';
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

/**
 * 检查是否有子部门
 */
function hasChildren(
  row: SystemDepartmentApi.DepartmentInfo,
  allData: SystemDepartmentApi.DepartmentInfo[],
): boolean {
  return allData.some((item) => item.parentId === row.id);
}

const gridOptions: VxeTableGridOptions<SystemDepartmentApi.DepartmentInfo> = {
  columns: [
    ...(useColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      fixed: 'right',
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
    enabled: false, // 禁用分页，加载所有数据
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        const data = await getDepartmentList({
          page: { currentPage: 1, pageSize: 1000 }, // 使用大的 pageSize 加载所有数据
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
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
    expandAll: true,
    accordion: false,
    showLine: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function onRefresh() {
  gridApi.query();
}

function onEdit(row: SystemDepartmentApi.DepartmentInfo) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

async function onDelete(row: SystemDepartmentApi.DepartmentInfo) {
  if (!row.id) return;

  // 获取当前所有数据来检查是否有子部门
  const currentData = gridApi.grid.getTableData()
    .fullData as SystemDepartmentApi.DepartmentInfo[];

  // 检查是否有子部门
  if (hasChildren(row, currentData)) {
    message.error($t('system.department.hasChildrenCannotDelete'));
    return;
  }

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.deptName]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteDepartment(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.deptName]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除部门失败:', error);
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
          {{ $t('ui.actionTitle.create', [$t('system.department.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
