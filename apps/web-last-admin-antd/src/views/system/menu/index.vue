<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemMenuApi } from '#/api/system/menu';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMenuList } from '#/api/system/menu';

import { useColumns } from './data';

const [Grid] = useVbenVxeGrid<SystemMenuApi.SystemMenu>({
  gridOptions: {
    columns: [
      ...(useColumns() as any),
      {
        field: 'action',
        title: $t('system.action'),
        width: 100,
        slots: {
          default: ({ _row }) => {},
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
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #icon="{ row }">
        <div class="flex-center">
          <IconifyIcon v-if="row.meta?.icon" :icon="row.meta?.icon" />
        </div>
      </template>
    </Grid>
  </Page>
</template>
