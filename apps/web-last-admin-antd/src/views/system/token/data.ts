import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemTokenApi } from '#/api/system/token';
import type { SystemUserApi } from '#/api/system/user';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

import { getUserList } from '#/api/system/user';

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
 * 格式化Token值显示
 */
export function formatTokenValue(tokenValue: string): string {
  if (!tokenValue) return '-';
  if (tokenValue.length <= 20) return tokenValue;
  return `${tokenValue.slice(0, 10)}...${tokenValue.slice(Math.max(0, tokenValue.length - 10))}`;
}

/**
 * 检查Token是否过期
 */
export function isTokenExpired(expiresAt?: number): boolean {
  if (!expiresAt) return false;
  return Date.now() > expiresAt * 1000;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<SystemTokenApi.TokenInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      align: 'center',
    },
    {
      field: 'tokenValue',
      title: $t('system.token.tokenValue'),
      minWidth: 200,
      slots: {
        default: ({ row }) => {
          return h(
            'span',
            {
              style: { fontFamily: 'monospace', fontSize: '12px' },
              title: row.tokenValue,
            },
            formatTokenValue(row.tokenValue),
          );
        },
      },
    },
    {
      field: 'userId',
      title: $t('system.token.userId'),
      width: 120,
      align: 'center',
    },
    {
      field: 'username',
      title: $t('system.token.username'),
      width: 120,
      align: 'center',
    },
    {
      field: 'fullName',
      title: $t('system.token.fullName'),
      width: 120,
      align: 'center',
    },
    {
      field: 'providerName',
      title: $t('system.token.providerName'),
      width: 120,
      align: 'center',
    },
    {
      field: 'ipAddress',
      title: $t('system.token.ipAddress'),
      width: 140,
      align: 'center',
    },
    {
      field: 'deviceInfo',
      title: $t('system.token.deviceInfo'),
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'state',
      title: $t('system.token.state'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = stateColorMap[String(row.state)];
          const text = row.state ? $t('system.enable') : $t('system.disable');
          return h(Tag, { color }, () => text);
        },
      },
    },
    {
      field: 'expiresAt',
      title: $t('system.token.expiresAt'),
      width: 180,
      formatter: 'formatDateTime',
      slots: {
        default: ({ row }) => {
          const expired = isTokenExpired(row.expiresAt);
          const formattedTime = row.expiresAt
            ? new Date(row.expiresAt).toLocaleString()
            : '-';

          return h(
            'span',
            {
              style: { color: expired ? '#ff4d4f' : undefined },
            },
            expired ? `${formattedTime} (已过期)` : formattedTime,
          );
        },
      },
    },
    {
      field: 'lastUsedAt',
      title: $t('system.token.lastUsedAt'),
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
        component: 'ApiSelect',
        componentProps: {
          filterOption: false,
          class: 'w-full',
          api: async (params: any) => {
            const result = await getUserList({
              page: { currentPage: 1, pageSize: 100 },
              state: true, // 只获取启用的用户
              ...params,
            });
            return result.list.map((item: SystemUserApi.UserInfo) => ({
              label: `${item.realName || item.username} (${item.username})`,
              value: item.userId,
            }));
          },
          showSearch: true,
          allowClear: true,
          placeholder: $t('system.token.selectUser'),
        },
        fieldName: 'userId',
        label: $t('system.token.userId'),
      },
      {
        component: 'Input',
        fieldName: 'ipAddress',
        label: $t('system.token.ipAddress'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.token.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.token.state'),
      },
    ],
  };
}
