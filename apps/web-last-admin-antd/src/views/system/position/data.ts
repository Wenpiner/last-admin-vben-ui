import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemPositionApi } from '#/api/system/position';

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
export function useColumns(): VxeTableGridOptions<SystemPositionApi.PositionInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      align: 'center',
      field: 'positionName',
      fixed: 'left',
      title: $t('system.position.positionName'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'positionCode',
      title: $t('system.position.positionCode'),
      width: 150,
    },
    {
      field: 'state',
      title: $t('system.position.state'),
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
      title: $t('system.position.sortOrder'),
      width: 100,
      align: 'center',
    },
    {
      field: 'description',
      title: $t('system.position.description'),
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
        fieldName: 'positionName',
        label: $t('system.position.positionName'),
      },
      {
        component: 'Input',
        fieldName: 'positionCode',
        label: $t('system.position.positionCode'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.position.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.position.state'),
      },
    ],
  };
}
