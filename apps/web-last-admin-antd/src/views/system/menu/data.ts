import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemMenuApi } from '#/api/system/menu';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 获取菜单类型选项
 */
export function getMenuTypeOptions() {
  return [
    { label: $t('system.menu.typeMenu'), value: 'menu', color: 'blue' },
    { label: $t('system.menu.typeButton'), value: 'button', color: 'green' },
    {
      label: $t('system.menu.typeCatalog'),
      value: 'directory',
      color: 'orange',
    },
  ];
}

/**
 * 获取菜单类型颜色映射
 */
export function getMenuTypeColorMap() {
  const map: Record<string, string> = {};
  getMenuTypeOptions().forEach((option) => {
    map[option.value] = option.color;
  });
  return map;
}

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
export function useColumns(): VxeTableGridOptions<SystemMenuApi.SystemMenu>['columns'] {
  const stateColorMap = getStateColorMap();
  const typeColorMap = getMenuTypeColorMap();

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
      field: 'type',
      title: $t('system.menu.type'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = typeColorMap[row.type];
          const typeOptions = getMenuTypeOptions();
          const typeOption = typeOptions.find(
            (option) => option.value === row.type,
          );
          const text = typeOption?.label || row.type;
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
      align: 'center',
      field: 'service',
      title: $t('system.menu.service'),
      width: 120,
    },
    {
      field: 'path',
      title: $t('system.menu.path'),
      align: 'center',
      minWidth: 150,
    },
    {
      field: 'component',
      title: $t('system.menu.component'),
      minWidth: 150,
    },
    {
      field: 'permission',
      title: $t('system.menu.authCode'),
      width: 120,
    },
    {
      field: 'meta.order',
      title: $t('system.menu.order'),
      width: 80,
      align: 'center',
    },
    {
      field: 'state',
      title: $t('system.menu.state'),
      width: 80,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = stateColorMap[String(row.state)];
          const text = row.state
            ? $t('system.menu.enabled')
            : $t('system.menu.disabled');
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
      field: 'hideInMenu',
      title: $t('system.menu.hideInMenu'),
      width: 100,
      align: 'center',
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
            () => text,
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
