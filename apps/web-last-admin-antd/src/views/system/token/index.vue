<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { SystemTokenApi } from '#/api/system/token';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  blockToken,
  deleteToken,
  getTokenList,
  unblockToken,
} from '#/api/system/token';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns, useSearchFormSchemas } from './data';
import CleanForm from './modules/clean-form.vue';

const [CleanModal, cleanModalApi] = useVbenModal({
  connectedComponent: CleanForm,
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

const gridOptions: VxeTableGridOptions<SystemTokenApi.TokenInfo> = {
  columns: [
    ...(useColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      fixed: 'right',
      width: 180,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const actions = [];

          // 根据状态显示拉黑或解封按钮
          if (row.state) {
            // 启用状态，显示拉黑按钮
            actions.push({
              type: 'link' as const,
              label: $t('system.token.block'),
              color: 'warning' as const,
              onClick: () => {
                onBlock(row);
              },
            });
          } else {
            // 禁用状态，显示解封按钮
            actions.push({
              type: 'link' as const,
              label: $t('system.token.unblock'),
              color: 'success' as const,
              onClick: () => {
                onUnblock(row);
              },
            });
          }

          // 删除按钮
          actions.push({
            type: 'link' as const,
            color: 'error' as const,
            label: $t('system.operation.delete'),
            popConfirm: {
              title: $t('system.tableAction.deleteConfirm'),
              confirm: () => {
                onDelete(row);
              },
            },
          });

          return h(TableAction, {
            align: 'center',
            actions,
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
        return await getTokenList({
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function onRefresh() {
  gridApi.query();
}

function onCleanExpired() {
  cleanModalApi.setData({}).open();
}

async function onBlock(row: SystemTokenApi.TokenInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('system.token.blocking'),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await blockToken({ id: row.id });
    message.success({
      content: $t('system.token.blockSuccess'),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('拉黑Token失败:', error);
  }
}

async function onUnblock(row: SystemTokenApi.TokenInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('system.token.unblocking'),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await unblockToken({ id: row.id });
    message.success({
      content: $t('system.token.unblockSuccess'),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('解封Token失败:', error);
  }
}

async function onDelete(row: SystemTokenApi.TokenInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [
      `${row.tokenValue?.slice(0, 10)}...`,
    ]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteToken(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [
        `${row.tokenValue?.slice(0, 10)}...`,
      ]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除Token失败:', error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <CleanModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" danger @click="onCleanExpired">
          <span class="icon-[mdi--trash-can-outline]"></span>
          {{ $t('system.token.cleanExpired') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
