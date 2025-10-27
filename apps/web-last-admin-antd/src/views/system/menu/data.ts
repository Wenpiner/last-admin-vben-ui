import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemMenuApi } from '#/api/system/menu';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<SystemMenuApi.SystemMenu>['columns'] {
  return [
    {
      align: 'center',
      field: 'meta.title',
      fixed: 'left',
      title: $t('system.menu.menuTitle'),
      treeNode: true,
      width: 250,
    },
    {
      align: 'center',
      field: 'icon',
      title: $t('system.menu.icon'),
      width: 100,
      slots: { default: 'icon' },
    },
    {
      align: 'center',
      field: 'service',
      title: $t('system.menu.service'),
      width: 100,
    },
    {
      field: 'path',
      title: $t('system.menu.path'),
      width: 200,
      align: 'center',
    },
    {
      field: 'component',
      title: $t('system.menu.component'),
      width: 200,
    },
    {
      field: 'meta.order',
      title: $t('system.menu.order'),
      width: 100,
    },
    {
      field: 'state',
      title: $t('system.menu.state'),
      width: 80,
      slots: {
        default: ({ row }) => {
          const color = row.state ? 'green' : 'red';
          const text = row.state
            ? $t('system.menu.enabled')
            : $t('system.menu.disabled');
          return h(
            Tag,
            {
              color,
            },
            text,
          );
        },
      },
    },
    {
      field: 'hideInMenu',
      title: $t('system.menu.hideInMenu'),
      width: 100,
      slots: {
        default: ({ row }) => {
          const color = row?.meta?.hideInMenu ? 'red' : 'green';
          const text = row?.meta?.hideInMenu
            ? $t('system.yes')
            : $t('system.no');
          return h(
            Tag,
            {
              color,
            },
            text,
          );
        },
      },
    },
    {
      field: 'createdAt',
      title: $t('system.createdAt'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}
