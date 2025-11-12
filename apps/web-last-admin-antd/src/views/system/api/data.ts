import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemApiApi } from '#/api/system/api';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 获取请求方法选项
 */
export function getMethodOptions() {
  return [
    { label: 'GET', value: 'GET', color: 'blue' },
    { label: 'POST', value: 'POST', color: 'green' },
    { label: 'PUT', value: 'PUT', color: 'orange' },
    { label: 'DELETE', value: 'DELETE', color: 'red' },
    { label: 'PATCH', value: 'PATCH', color: 'purple' },
    { label: 'HEAD', value: 'HEAD', color: 'cyan' },
    { label: 'OPTIONS', value: 'OPTIONS', color: 'magenta' },
  ];
}

/**
 * 获取方法颜色映射
 */
export function getMethodColorMap() {
  const map: Record<string, string> = {};
  getMethodOptions().forEach((option) => {
    map[option.value] = option.color;
  });
  return map;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<SystemApiApi.ApiInfo>['columns'] {
  const methodColorMap = getMethodColorMap();

  return [
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('system.api.name'),
    },
    {
      align: 'center',
      field: 'method',
      title: $t('system.api.method'),
      width: 100,
      slots: {
        default: ({ row }) => {
          const color = methodColorMap[row.method] || 'default';
          return h(
            Tag,
            {
              color,
            },
            () => row.method,
          );
        },
      },
    },
    {
      field: 'path',
      title: $t('system.api.path'),
      minWidth: 200,
    },

    {
      field: 'serviceName',
      title: $t('system.api.serviceName'),
      width: 120,
    },
    {
      field: 'apiGroup',
      title: $t('system.api.apiGroup'),
      width: 120,
    },
    {
      field: 'isRequired',
      title: $t('system.api.isRequired'),
      width: 100,
      slots: {
        default: ({ row }) => {
          const color = row.isRequired ? 'red' : 'green';
          const text = row.isRequired ? $t('system.yes') : $t('system.no');
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

/**
 * 搜索表单配置
 */
export function useSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.api.name'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getMethodOptions(),
          placeholder: $t('system.api.method'),
          allowClear: true,
        },
        fieldName: 'method',
        label: $t('system.api.method'),
      },
      {
        component: 'Input',
        fieldName: 'path',
        label: $t('system.api.path'),
      },
      {
        component: 'Input',
        fieldName: 'serviceName',
        label: $t('system.api.serviceName'),
      },
      {
        component: 'Input',
        fieldName: 'apiGroup',
        label: $t('system.api.apiGroup'),
      },
    ],
  };
}
