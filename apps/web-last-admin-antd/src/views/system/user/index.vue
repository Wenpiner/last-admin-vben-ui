<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { SystemUserApi } from '#/api/system/user';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUser, getUserList } from '#/api/system/user';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns, useSearchFormSchemas } from './data';
import Form from './modules/form.vue';
import TotpManagement from './modules/totp-management.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [TotpModal, totpModalApi] = useVbenModal({
  connectedComponent: TotpManagement,
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

const gridOptions: VxeTableGridOptions<SystemUserApi.UserInfo> = {
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
                label: $t('system.user.totpManagement'),
                onClick: () => {
                  onManageTotp(row);
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
      query: async ({ page }, formValues) => {
        return await getUserList({
          page,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'userId',
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

function onEdit(row: SystemUserApi.UserInfo) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

function onManageTotp(row: SystemUserApi.UserInfo) {
  totpModalApi.setData(row).open();
}

async function onDelete(row: SystemUserApi.UserInfo) {
  if (!row.userId) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.username]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteUser(row.userId);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.username]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除用户失败:', error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <TotpModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.user.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
