import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { IrasCrawlerTaskApi } from '#/api/iras/crawler-task';

import { h, ref } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 获取任务状态选项
 */
export function getTaskStatusOptions() {
  return [
    {
      label: $t('iras.crawlerTask.statusPending'),
      value: 'pending',
      color: 'default',
    },
    {
      label: $t('iras.crawlerTask.statusRunning'),
      value: 'running',
      color: 'processing',
    },
    {
      label: $t('iras.crawlerTask.statusPaused'),
      value: 'paused',
      color: 'warning',
    },
    {
      label: $t('iras.crawlerTask.statusCompleted'),
      value: 'completed',
      color: 'success',
    },
    {
      label: $t('iras.crawlerTask.statusFailed'),
      value: 'failed',
      color: 'error',
    },
  ];
}

/**
 * 获取状态颜色映射
 */
export function getStatusColorMap() {
  const map: Record<string, string> = {};
  getTaskStatusOptions().forEach((option) => {
    map[option.value] = option.color;
  });
  return map;
}

/**
 * 获取启用状态选项
 */
export function getEnabledOptions() {
  return [
    { label: $t('system.enable'), value: true, color: 'green' },
    { label: $t('system.disable'), value: false, color: 'red' },
  ];
}

/**
 * 获取网站类型选项
 */
export function getSiteTypeOptions() {
  return [
    { label: $t('iras.crawlerTask.siteTypeNews'), value: 'news' },
    { label: $t('iras.crawlerTask.siteTypeBlog'), value: 'blog' },
    { label: $t('iras.crawlerTask.siteTypeForum'), value: 'forum' },
    { label: $t('iras.crawlerTask.siteTypeEcommerce'), value: 'ecommerce' },
    { label: $t('iras.crawlerTask.siteTypeOther'), value: 'other' },
  ];
}

/**
 * 计算倒计时文本
 */
function getCountdownText(nextRunTime?: string): string {
  if (!nextRunTime) return '-';

  const now = Date.now();
  const targetTime = new Date(nextRunTime).getTime();
  const diff = targetTime - now;

  if (diff <= 0) return '0';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}天${hours}时`;
  if (hours > 0) return `${hours}时${minutes}分`;
  if (minutes > 0) return `${minutes}分${seconds}秒`;
  return `${seconds}秒`;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<IrasCrawlerTaskApi.TaskInfo>['columns'] {
  const statusColorMap = getStatusColorMap();

  // 用于触发倒计时更新
  const updateTrigger = ref(0);
  setInterval(() => {
    updateTrigger.value++;
  }, 1000);

  return [
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('iras.crawlerTask.name'),
      minWidth: 200,
    },
    {
      field: 'targetUrl',
      title: $t('iras.crawlerTask.targetUrl'),
      minWidth: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'categoryInfo',
      title: $t('iras.crawlerTask.categoryId'),
      width: 150,
      align: 'center',
      slots: {
        default: ({ row }) => {
          return row.categoryInfo?.name || '-';
        },
      },
    },
    {
      field: 'enabled',
      title: $t('iras.crawlerTask.enabled'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = row.enabled ? 'green' : 'red';
          const text = row.enabled ? $t('system.enable') : $t('system.disable');
          return h(Tag, { color }, () => text);
        },
      },
    },
    {
      field: 'status',
      title: $t('iras.crawlerTask.status'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = statusColorMap[row.status] || 'default';
          const option = getTaskStatusOptions().find(
            (opt) => opt.value === row.status,
          );
          const text = option?.label || row.status;
          return h(Tag, { color }, () => text);
        },
      },
    },
    {
      field: 'nextRunAt',
      title: $t('iras.crawlerTask.nextRunAt'),
      width: 150,
      align: 'center',
      slots: {
        default: ({ row }) => {
          // 强制响应式更新
          updateTrigger.value;
          return getCountdownText(row.nextRunAt);
        },
      },
    },
    {
      field: 'lastCompletedAt',
      title: $t('iras.crawlerTask.lastCompletedAt'),
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
        label: $t('iras.crawlerTask.name'),
      },
      {
        component: 'Input',
        fieldName: 'targetUrl',
        label: $t('iras.crawlerTask.targetUrl'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getTaskStatusOptions(),
          placeholder: $t('iras.crawlerTask.status'),
          allowClear: true,
        },
        fieldName: 'status',
        label: $t('iras.crawlerTask.status'),
      },
      {
        component: 'Select',
        componentProps: {
          options: getEnabledOptions(),
          placeholder: $t('iras.crawlerTask.enabled'),
          allowClear: true,
        },
        fieldName: 'enabled',
        label: $t('iras.crawlerTask.enabled'),
      },

    ],
  };
}
