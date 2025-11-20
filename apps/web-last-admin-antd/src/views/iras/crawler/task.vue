<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { IrasCrawlerTaskApi } from '#/api/iras/crawler-task';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCrawlerTask, getCrawlerTaskList } from '#/api/iras/crawler-task';
import TableAction from '#/components/table/table-action/table-action.vue';

import Form from './modules/task-form.vue';
import { useColumns, useSearchFormSchemas } from './task-data';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [...(useSearchFormSchemas().schema as any)],
  showCollapseButton: true,
  submitOnEnter: false,
  wrapperClass:
    'gap-x-2 flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
};

const gridOptions: VxeTableGridOptions<IrasCrawlerTaskApi.TaskInfo> = {
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
    enabled: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getCrawlerTaskList({
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

function onEdit(row: IrasCrawlerTaskApi.TaskInfo) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

async function onDelete(row: IrasCrawlerTaskApi.TaskInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteCrawlerTask(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除爬虫任务失败:', error);
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
          {{ $t('ui.actionTitle.create', [$t('iras.crawlerTask.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
