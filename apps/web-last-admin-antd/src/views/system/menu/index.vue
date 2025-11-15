<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemMenuApi } from '#/api/system/menu';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon, Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenu, getMenuList } from '#/api/system/menu';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid<SystemMenuApi.SystemMenu>({
  gridOptions: {
    columns: [
      ...(useColumns() as any),
      {
        field: 'action',
        fixed: 'right',
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
    keepSource: false,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params) => {
          const data = await getMenuList();
          return {
            data,
            total: data.length,
          };
        },
      },
      response: {
        result: 'data',
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
      parentField: 'parentId',
      rowField: 'id',
      transform: true,
    },
  } as VxeTableGridOptions,
});

async function onRefresh() {
  await gridApi.query();
}

function onEdit(row: SystemMenuApi.SystemMenu) {
  const treeData = gridApi.grid.getFullData() || [];
  formModalApi
    .setData({
      ...row,
      menuTreeData: treeData,
    })
    .open();
}

function onCreate() {
  const treeData = gridApi.grid.getFullData() || [];
  console.warn('treeData', treeData);
  formModalApi
    .setData({
      menuTreeData: treeData,
    })
    .open();
}

async function onDelete(row: SystemMenuApi.SystemMenu) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.meta?.title || row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteMenu(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [
        row.meta?.title || row.name,
      ]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('Delete menu failed:', error);
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
          {{ $t('ui.actionTitle.create', [$t('system.menu.name')]) }}
        </Button>
      </template>
      <template #icon="{ row }">
        <div class="flex-center">
          <IconifyIcon v-if="row.meta?.icon" :icon="row.meta?.icon as string" />
        </div>
      </template>
    </Grid>
  </Page>
</template>
