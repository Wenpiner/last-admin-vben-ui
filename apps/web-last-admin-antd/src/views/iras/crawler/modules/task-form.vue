<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { IrasCrawlerTaskApi } from '#/api/iras/crawler-task';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { getArticleCategoryList } from '#/api/iras/article-category';
import { saveCrawlerTask } from '#/api/iras/crawler-task';

import { getEnabledOptions } from '../task-data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<IrasCrawlerTaskApi.TaskInfo>();

const schema: VbenFormSchema[] = [
  // ========== 1. 基本信息（必填） ==========
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('iras.crawlerTask.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.crawlerTask.name')]))
      .max(
        200,
        $t('ui.formRules.maxLength', [$t('iras.crawlerTask.name'), 200]),
      ),
  },
  {
    component: 'Input',
    fieldName: 'targetUrl',
    label: $t('iras.crawlerTask.targetUrl'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.crawlerTask.targetUrl')]))
      .url($t('ui.formRules.url')),
  },
  {
    component: 'Input',
    fieldName: 'schedule',
    label: $t('iras.crawlerTask.schedule'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.crawlerTask.schedule')])),
    componentProps: {
      placeholder: '0 0 * * * (Cron表达式)',
    },
  },

  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getEnabledOptions(),
      optionType: 'button',
    },
    fieldName: 'enabled',
    label: $t('iras.crawlerTask.enabled'),
  },
  {
    component: 'InputNumber',
    componentProps: { class: 'w-full', min: 1, max: 10 },
    fieldName: 'priority',
    label: $t('iras.crawlerTask.priority'),
    rules: z.number().min(1).max(10),
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2,
      placeholder: $t('iras.crawlerTask.description'),
    },
    formItemClass: 'col-span-2',
    fieldName: 'description',
    label: $t('iras.crawlerTask.description'),
    rules: z.string().max(500).nullable().optional(),
  },

  // ========== 2. 核心选择器（必填） ==========
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: $t('iras.crawlerTask.listUrlPatterns'), value: 'list' },
        { label: $t('iras.crawlerTask.articleUrlPatterns'), value: 'article' },
        { label: '取消', value: '' },
      ],
      optionType: 'button',
    },
    fieldName: 'urlPatternType',
    label: $t('iras.crawlerTask.urlPatternType'),
    formItemClass: 'col-span-2',
  },
  {
    component: 'Input',
    fieldName: 'titleSelector',
    label: $t('iras.crawlerTask.titleSelector'),
    rules: 'required',
    componentProps: { placeholder: '默认: h1' },
  },
  {
    component: 'Input',
    fieldName: 'contentSelector',
    label: $t('iras.crawlerTask.contentSelector'),
    rules: 'required',
    componentProps: { placeholder: '.article-content, #content' },
  },
  {
    component: 'Input',
    fieldName: 'articleLinkSelector',
    label: $t('iras.crawlerTask.articleLinkSelector'),
    componentProps: { placeholder: '默认: a.article-link' },
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      class: 'w-full',
      allowClear: true,
      api: async () => {
        const result = await getArticleCategoryList({
          page: { currentPage: 1, pageSize: 1000 },
          level: 1,
        });
        return result.list || [];
      },
      fieldNames: { children: 'children', label: 'name', value: 'id' },
      placeholder: $t('iras.crawlerTask.categoryId'),
      treeDefaultExpandAll: true,
    },
    fieldName: 'categoryId',
    label: $t('iras.crawlerTask.categoryId'),
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'mongodbCollection',
    label: $t('iras.crawlerTask.mongodbCollection'),
    componentProps: {
      disabled: true,
      placeholder: 'articles',
    },
  },
  {
    component: 'Switch',
    fieldName: 'indexToEs',
    label: $t('iras.crawlerTask.indexToEs'),
    componentProps: {
      disabled: true,
    },
  },

  // ========== 3. 爬取配置（可选） ==========
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 100,
      placeholder: '默认: 2',
    },
    fieldName: 'parallelism',
    label: $t('iras.crawlerTask.parallelism'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 10_000,
      placeholder: '默认: 1000',
    },
    fieldName: 'delayMs',
    label: $t('iras.crawlerTask.delayMs'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 10_000,
      placeholder: '默认: 500',
    },
    fieldName: 'randomDelayMs',
    label: $t('iras.crawlerTask.randomDelayMs'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 300,
      placeholder: '默认: 10',
    },
    fieldName: 'timeoutSeconds',
    label: $t('iras.crawlerTask.timeoutSeconds'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 1_000_000,
      placeholder: '默认: 0 (无限制)',
    },
    fieldName: 'maxRequests',
    label: $t('iras.crawlerTask.maxRequests'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 10,
      placeholder: '默认: 3',
    },
    fieldName: 'maxDepth',
    label: $t('iras.crawlerTask.maxDepth'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 10,
      placeholder: '默认: 3',
    },
    fieldName: 'maxRetries',
    label: $t('iras.crawlerTask.maxRetries'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 300,
      placeholder: '默认: 5',
    },
    fieldName: 'retryDelaySeconds',
    label: $t('iras.crawlerTask.retryDelaySeconds'),
  },
  {
    component: 'Switch',
    fieldName: 'followRedirects',
    label: $t('iras.crawlerTask.followRedirects'),
  },
  {
    component: 'Switch',
    fieldName: 'respectRobotsTxt',
    label: $t('iras.crawlerTask.respectRobotsTxt'),
  },
  {
    component: 'Switch',
    fieldName: 'twoStageCrawling',
    label: $t('iras.crawlerTask.twoStageCrawling'),
  },

  // ========== 4. 高级选择器（可选） ==========
  {
    component: 'Input',
    fieldName: 'dateSelector',
    label: $t('iras.crawlerTask.dateSelector'),
    componentProps: { placeholder: '.publish-date, time' },
  },
  {
    component: 'Input',
    fieldName: 'dateFormat',
    label: $t('iras.crawlerTask.dateFormat'),
    componentProps: { placeholder: '2006-01-02 15:04:05' },
  },
  {
    component: 'Input',
    fieldName: 'authorSelector',
    label: $t('iras.crawlerTask.authorSelector'),
    componentProps: { placeholder: '.author-name' },
  },
  {
    component: 'Input',
    fieldName: 'tagsSelector',
    label: $t('iras.crawlerTask.tagsSelector'),
    componentProps: { placeholder: '.tags, .tag-list' },
  },
  {
    component: 'Input',
    fieldName: 'summarySelector',
    label: $t('iras.crawlerTask.summarySelector'),
    componentProps: { placeholder: '.summary, .excerpt' },
  },
  {
    component: 'Input',
    fieldName: 'mainImageSelector',
    label: $t('iras.crawlerTask.mainImageSelector'),
    componentProps: { placeholder: '.main-image img' },
  },

  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2,
      placeholder: '列表/首页URL模式，用于第一阶段',
    },
    formItemClass: 'col-span-2',
    fieldName: 'listUrlPatterns',
    label: $t('iras.crawlerTask.listUrlPatterns'),
    dependencies: {
      triggerFields: ['urlPatternType'],
      if(values) {
        return values.urlPatternType === 'list';
      },
    },
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2,
      placeholder: '文章URL的正则表达式模式',
    },
    formItemClass: 'col-span-2',
    fieldName: 'articleUrlPatterns',
    label: $t('iras.crawlerTask.articleUrlPatterns'),
    dependencies: {
      triggerFields: ['urlPatternType'],
      if(values) {
        return values.urlPatternType === 'article';
      },
    },
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 100,
      placeholder: '默认: 5',
    },
    fieldName: 'minLinksPerList',
    label: $t('iras.crawlerTask.minLinksPerList'),
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2,
      placeholder:
        'content[script,style,noscript,iframe]|author[]|date[]|tags[]|summary[]|main_image[]',
    },
    formItemClass: 'col-span-2',
    fieldName: 'removeElements',
    label: $t('iras.crawlerTask.removeElements'),
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
  layout: 'vertical',
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<IrasCrawlerTaskApi.TaskInfo>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
      } else {
        formApi.resetForm();
        // 设置默认值（根据后端 ent schema）
        formApi.setValues({
          enabled: true,
          priority: 5,
          siteType: 'general',
          parallelism: 2,
          delayMs: 1000,
          randomDelayMs: 500,
          timeoutSeconds: 10,
          maxRequests: 0,
          maxDepth: 3,
          maxRetries: 3,
          retryDelaySeconds: 5,
          followRedirects: true,
          respectRobotsTxt: true,
          twoStageCrawling: true,
          indexToEs: true,
          language: 'zh-CN',
          country: 'CN',
          minLinksPerList: 5,
          titleSelector: 'h1',
          articleLinkSelector: 'a.article-link',
          mongodbCollection: 'articles',
          urlPatternType: 'list',
          progress: 0,
          totalUrls: 0,
          fetchedUrls: 0,
          successUrls: 0,
          failedUrls: 0,
          removeElements:
            'content[script,style,noscript,iframe]|author[]|date[]|tags[]|summary[]|main_image[]',
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<IrasCrawlerTaskApi.TaskInfo>();
    try {
      await saveCrawlerTask(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('iras.crawlerTask.name')])
    : $t('ui.actionTitle.create', [$t('iras.crawlerTask.name')]),
);
</script>

<template>
  <Modal :title="getTitle" class="w-[900px]">
    <Form class="mx-4" />
  </Modal>
</template>
