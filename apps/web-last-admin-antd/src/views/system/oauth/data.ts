import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemOauthApi } from '#/api/system/oauth';

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
 * 获取认证方式选项
 */
export function getAuthStyleOptions() {
  return [
    { label: $t('system.oauth.authStyleAuto'), value: 0 },
    { label: $t('system.oauth.authStyleHeader'), value: 1 },
    { label: $t('system.oauth.authStyleBody'), value: 2 },
  ];
}

/**
 * 获取认证方式映射
 */
export function getAuthStyleMap() {
  const map: Record<string, string> = {};
  getAuthStyleOptions().forEach((option) => {
    map[String(option.value)] = option.label;
  });
  return map;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<SystemOauthApi.OauthInfo>['columns'] {
  const stateColorMap = getStateColorMap();
  const authStyleMap = getAuthStyleMap();

  return [
    {
      align: 'center',
      field: 'providerName',
      fixed: 'left',
      title: $t('system.oauth.providerName'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'providerCode',
      title: $t('system.oauth.providerCode'),
      width: 150,
    },
    {
      align: 'center',
      field: 'clientId',
      title: $t('system.oauth.clientId'),
      width: 200,
    },
    {
      field: 'authStyle',
      title: $t('system.oauth.authStyle'),
      width: 120,
      align: 'center',
      formatter: ({ row }) => {
        return authStyleMap[String(row.authStyle)] || row.authStyle;
      },
    },
    {
      field: 'state',
      title: $t('system.oauth.state'),
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
      field: 'authorizationUrl',
      title: $t('system.oauth.authorizationUrl'),
      minWidth: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'tokenUrl',
      title: $t('system.oauth.tokenUrl'),
      minWidth: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'redirectUri',
      title: $t('system.oauth.redirectUri'),
      minWidth: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'scopes',
      title: $t('system.oauth.scopes'),
      width: 150,
      showOverflow: 'tooltip',
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
        fieldName: 'providerName',
        label: $t('system.oauth.providerName'),
      },
      {
        component: 'Input',
        fieldName: 'providerCode',
        label: $t('system.oauth.providerCode'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStateOptions(),
          placeholder: $t('system.oauth.state'),
          allowClear: true,
        },
        fieldName: 'state',
        label: $t('system.oauth.state'),
      },
    ],
  };
}
