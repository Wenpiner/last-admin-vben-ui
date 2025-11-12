import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemDepartmentApi } from '#/api/system/department';

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
export function useColumns(): VxeTableGridOptions<SystemDepartmentApi.DepartmentInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      align: 'center',
      field: 'deptName',
      fixed: 'left',
      title: $t('system.department.deptName'),
      treeNode: true,
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'deptCode',
      title: $t('system.department.deptCode'),
      width: 150,
    },
    {
      align: 'center',
      field: 'leaderUsername',
      title: $t('system.department.leaderUsername'),
      width: 120,
    },
    {
      align: 'center',
      field: 'leaderPhone',
      title: $t('system.department.leaderPhone'),
      width: 130,
    },
    {
      align: 'center',
      field: 'leaderEmail',
      title: $t('system.department.leaderEmail'),
      width: 180,
    },
    {
      field: 'state',
      title: $t('system.department.state'),
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
      title: $t('system.department.sortOrder'),
      width: 100,
      align: 'center',
    },
    {
      field: 'description',
      title: $t('system.department.description'),
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
        fieldName: 'deptName',
        label: $t('system.department.deptName'),
      },
      {
        component: 'Input',
        fieldName: 'deptCode',
        label: $t('system.department.deptCode'),
      },
      {
        component: 'Input',
        fieldName: 'leaderUsername',
        label: $t('system.department.leaderUsername'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.department.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.department.state'),
      },
    ],
  };
}
