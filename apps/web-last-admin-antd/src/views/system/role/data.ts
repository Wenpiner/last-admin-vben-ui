import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemRoleApi } from '#/api/system/role';

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
export function useColumns(): VxeTableGridOptions<SystemRoleApi.RoleInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      align: 'center',
      field: 'roleName',
      fixed: 'left',
      title: $t('system.role.roleName'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'roleCode',
      title: $t('system.role.roleCode'),
      width: 150,
    },
    {
      field: 'state',
      title: $t('system.role.state'),
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
      field: 'description',
      title: $t('system.role.description'),
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
        fieldName: 'roleName',
        label: $t('system.role.roleName'),
      },
      {
        component: 'Input',
        fieldName: 'roleCode',
        label: $t('system.role.roleCode'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.role.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.role.state'),
      },
    ],
  };
}
