<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { IrasCrawlerClientApi } from '#/api/iras/crawler-client';

import { h, onBeforeUnmount, onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCrawlerClient,
  getCrawlerClientList,
} from '#/api/iras/crawler-client';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns, useSearchFormSchemas } from './data';
import Form from './modules/form.vue';

// 自动刷新相关
const autoRefresh = ref(false);
const refreshTimer = ref<null | number>(null);

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

const gridOptions: VxeTableGridOptions<IrasCrawlerClientApi.ClientInfo> = {
  columns: [
    ...(useColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      width: 100,
      align: 'center',
      fixed: 'right',
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
    pageSize: 20,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getCrawlerClientList({
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

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: IrasCrawlerClientApi.ClientInfo) {
  formModalApi.setData(row).open();
}

async function onDelete(row: IrasCrawlerClientApi.ClientInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteCrawlerClient(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除爬虫客户端失败:', error);
  }
}

// 切换自动刷新
function toggleAutoRefresh(checked: any) {
  const isChecked = Boolean(checked);
  autoRefresh.value = isChecked;
  if (isChecked) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
}

// 开始自动刷新
function startAutoRefresh() {
  stopAutoRefresh(); // 先清除之前的定时器
  refreshTimer.value = window.setInterval(() => {
    onRefresh();
  }, 10_000); // 10秒刷新一次
}

// 停止自动刷新
function stopAutoRefresh() {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
}

// 组件挂载时
onMounted(() => {
  // 可以在这里设置默认开启自动刷新
  // toggleAutoRefresh(true);
});

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  stopAutoRefresh();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-sm">{{
              $t('iras.crawlerClient.autoRefresh')
            }}</span>
            <Switch v-model:checked="autoRefresh" @change="toggleAutoRefresh" />
          </div>
          <Button type="primary" @click="onCreate">
            <Plus class="size-5" />
            {{ $t('ui.actionTitle.create', [$t('iras.crawlerClient.name')]) }}
          </Button>
        </div>
      </template>
    </Grid>
  </Page>
</template>
