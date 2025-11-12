import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemUserApi } from '#/api/system/user';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Avatar, Tag } from 'ant-design-vue';

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
export function useColumns(): VxeTableGridOptions<SystemUserApi.UserInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      field: 'avatar',
      title: $t('system.user.avatar'),
      width: 80,
      align: 'center',
      slots: {
        default: ({ row }) => {
          return h(
            Avatar,
            {
              src: row.avatar,
              size: 32,
            },
            () => row.realName?.charAt(0) || row.username?.charAt(0) || 'U',
          );
        },
      },
    },
    {
      align: 'center',
      field: 'username',
      fixed: 'left',
      title: $t('system.user.username'),
      minWidth: 120,
    },
    {
      align: 'center',
      field: 'realName',
      title: $t('system.user.realName'),
      minWidth: 100,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      minWidth: 180,
    },
    {
      field: 'mobile',
      title: $t('system.user.mobile'),
      width: 120,
      align: 'center',
    },
    {
      field: 'departmentName',
      title: $t('system.user.departmentName'),
      minWidth: 120,
    },
    {
      field: 'roleNames',
      title: $t('system.user.roleNames'),
      minWidth: 150,
      slots: {
        default: ({ row }) => {
          if (!row.roleNames || row.roleNames.length === 0) {
            return '-';
          }
          return row.roleNames.map((role: string) =>
            h(
              Tag,
              { key: role, color: 'blue', style: { marginRight: '4px' } },
              () => role,
            ),
          );
        },
      },
    },
    {
      field: 'state',
      title: $t('system.user.state'),
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
      field: 'totpInfo',
      title: $t('system.user.totpStatus'),
      width: 120,
      align: 'center',
      slots: {
        default: ({ row }) => {
          if (!row.totpInfo) {
            return h(Tag, { color: 'default' }, () =>
              $t('system.user.totpNotEnabled'),
            );
          }

          if (!row.totpInfo.isVerified) {
            return h(Tag, { color: 'orange' }, () =>
              $t('system.user.totpNotVerified'),
            );
          }

          const color = row.totpInfo.state ? 'green' : 'red';
          const text = row.totpInfo.state
            ? $t('system.user.totpEnabled')
            : $t('system.user.totpDisabled');
          return h(Tag, { color }, () => text);
        },
      },
    },
    {
      field: 'lastLoginAt',
      title: $t('system.user.lastLoginAt'),
      width: 180,
      formatter: 'formatDateTime',
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
        fieldName: 'username',
        label: $t('system.user.username'),
      },
      {
        component: 'Input',
        fieldName: 'realName',
        label: $t('system.user.realName'),
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: $t('system.user.email'),
      },
      {
        component: 'Input',
        fieldName: 'mobile',
        label: $t('system.user.mobile'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.user.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.user.state'),
      },
    ],
  };
}
