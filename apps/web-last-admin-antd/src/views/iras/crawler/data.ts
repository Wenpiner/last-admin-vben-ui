import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { IrasCrawlerClientApi } from '#/api/iras/crawler-client';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 计算相对时间
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return '-';

  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}秒前`;
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else {
    return dateString;
  }
}

/**
 * 获取状态选项
 */
export function getStatusOptions() {
  return [
    {
      label: $t('iras.crawlerClient.statusOnline'),
      value: 'online',
      color: 'green',
    },
    {
      label: $t('iras.crawlerClient.statusOffline'),
      value: 'offline',
      color: 'red',
    },
    {
      label: $t('iras.crawlerClient.statusBusy'),
      value: 'busy',
      color: 'orange',
    },
    {
      label: $t('iras.crawlerClient.statusIdle'),
      value: 'idle',
      color: 'blue',
    },
  ];
}

/**
 * 获取状态颜色映射
 */
export function getStatusColorMap() {
  const map: Record<string, string> = {};
  getStatusOptions().forEach((option) => {
    map[option.value] = option.color;
  });
  return map;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<IrasCrawlerClientApi.ClientInfo>['columns'] {
  const statusColorMap = getStatusColorMap();

  return [
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('iras.crawlerClient.name'),
      minWidth: 150,
    },
    {
      align: 'center',
      field: 'clientId',
      title: $t('iras.crawlerClient.clientId'),
      width: 200,
    },
    {
      field: 'status',
      title: $t('iras.crawlerClient.status'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = statusColorMap[row.status] || 'default';
          const option = getStatusOptions().find(
            (opt) => opt.value === row.status,
          );
          const text = option?.label || row.status;
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
      field: 'last_heartbeat',
      title: $t('iras.crawlerClient.lastHeartbeat'),
      width: 180,
      align: 'center',
      slots: {
        default: ({ row }) => {
          return h(
            'span',
            {
              title: row.last_heartbeat,
            },
            getRelativeTime(row.last_heartbeat),
          );
        },
      },
    },
    {
      field: 'hostname',
      title: $t('iras.crawlerClient.hostname'),
      width: 150,
    },
    {
      field: 'ip_address',
      title: $t('iras.crawlerClient.ipAddress'),
      width: 130,
    },
    {
      field: 'port',
      title: $t('iras.crawlerClient.port'),
      width: 80,
      align: 'center',
    },
    {
      field: 'max_concurrent_tasks',
      title: $t('iras.crawlerClient.maxConcurrentTasks'),
      width: 120,
      align: 'center',
    },
    {
      field: 'current_tasks',
      title: $t('iras.crawlerClient.currentTasks'),
      width: 100,
      align: 'center',
    },
    {
      field: 'cpu_usage',
      title: $t('iras.crawlerClient.cpuUsage'),
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => `${cellValue?.toFixed(1) || 0}%`,
    },
    {
      field: 'memory_usage',
      title: $t('iras.crawlerClient.memoryUsage'),
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => `${cellValue?.toFixed(1) || 0}%`,
    },
    {
      field: 'disk_usage',
      title: $t('iras.crawlerClient.diskUsage'),
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => `${cellValue?.toFixed(1) || 0}%`,
    },
    {
      field: 'total_tasks_completed',
      title: $t('iras.crawlerClient.totalTasksCompleted'),
      width: 120,
      align: 'center',
    },
    {
      field: 'total_urls_processed',
      title: $t('iras.crawlerClient.totalUrlsProcessed'),
      width: 120,
      align: 'center',
    },
    {
      field: 'total_errors',
      title: $t('iras.crawlerClient.totalErrors'),
      width: 100,
      align: 'center',
    },
    {
      field: 'version',
      title: $t('iras.crawlerClient.version'),
      width: 100,
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
        fieldName: 'clientId',
        label: $t('iras.crawlerClient.clientId'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getStatusOptions(),
          placeholder: $t('iras.crawlerClient.status'),
          allowClear: true,
        },
        fieldName: 'status',
        label: $t('iras.crawlerClient.status'),
      },
    ],
  };
}
