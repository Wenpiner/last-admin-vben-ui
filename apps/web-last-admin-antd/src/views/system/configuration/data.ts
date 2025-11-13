import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemConfigurationApi } from '#/api/system/configuration';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag, Tooltip } from 'ant-design-vue';

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<SystemConfigurationApi.ConfigurationInfo>['columns'] {
  return [
    {
      align: 'center',
      field: 'key',
      fixed: 'left',
      title: $t('system.configuration.key'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'name',
      title: $t('system.configuration.name'),
      minWidth: 150,
    },
    {
      align: 'center',
      field: 'group',
      title: $t('system.configuration.group'),
      width: 120,
      slots: {
        default: ({ row }) => {
          return h(
            Tag,
            {
              color: 'blue',
            },
            () => row.group,
          );
        },
      },
    },
    {
      field: 'value',
      title: $t('system.configuration.value'),
      minWidth: 200,
      slots: {
        default: ({ row }) => {
          const value = row.value || '';
          // 如果值太长，显示省略号并提供 tooltip
          if (value.length > 50) {
            return h(
              Tooltip,
              {
                title: value,
                placement: 'topLeft',
              },
              () => h('span', {}, `${value.slice(0, 50)}...`),
            );
          }
          return h('span', {}, value);
        },
      },
    },
    {
      field: 'description',
      title: $t('system.configuration.description'),
      minWidth: 150,
      slots: {
        default: ({ row }) => {
          const description = row.description || '';
          if (description.length > 30) {
            return h(
              Tooltip,
              {
                title: description,
                placement: 'topLeft',
              },
              () => h('span', {}, `${description.slice(0, 30)}...`),
            );
          }
          return h('span', {}, description);
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
        fieldName: 'key',
        label: $t('system.configuration.key'),
      },
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.configuration.name'),
      },
      {
        component: 'Input',
        fieldName: 'group',
        label: $t('system.configuration.group'),
      },
    ],
  };
}
