<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { IrasCrawlerClientApi } from '#/api/iras/crawler-client';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateCrawlerClient } from '#/api/iras/crawler-client';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<IrasCrawlerClientApi.ClientInfo>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'clientId',
    label: $t('iras.crawlerClient.clientId'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.crawlerClient.clientId')]))
      .max(
        50,
        $t('ui.formRules.maxLength', [$t('iras.crawlerClient.clientId'), 50]),
      ),
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('iras.crawlerClient.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.crawlerClient.name')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('iras.crawlerClient.name'), 100]),
      ),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 100,
      placeholder: $t('iras.crawlerClient.maxConcurrentTasks'),
    },
    fieldName: 'max_concurrent_tasks',
    label: $t('iras.crawlerClient.maxConcurrentTasks'),
    rules: z
      .number()
      .min(
        1,
        $t('ui.formRules.min', [
          $t('iras.crawlerClient.maxConcurrentTasks'),
          1,
        ]),
      )
      .max(
        100,
        $t('ui.formRules.max', [
          $t('iras.crawlerClient.maxConcurrentTasks'),
          100,
        ]),
      ),
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
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
      const data = modalApi.getData<IrasCrawlerClientApi.ClientInfo>();
      if (data) {
        formData.value = data;
        formApi.setValues(
          {
            id: data.id,
            clientId: data.clientId,
            name: data.name,
            hostname: data.hostname,
            ip_address: data.ip_address,
            port: data.port,
            max_concurrent_tasks: data.max_concurrent_tasks,
            tags: data.tags,
          },
          false,
        );
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          max_concurrent_tasks: 5,
          port: 8080,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data =
      await formApi.getValues<IrasCrawlerClientApi.CreateOrUpdateClientRequest>();
    try {
      await createOrUpdateCrawlerClient(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('iras.crawlerClient.name')])
    : $t('ui.actionTitle.create', [$t('iras.crawlerClient.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
