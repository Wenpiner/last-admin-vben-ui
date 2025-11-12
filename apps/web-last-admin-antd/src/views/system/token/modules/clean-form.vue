<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemTokenApi } from '#/api/system/token';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { cleanExpiredTokens } from '#/api/system/token';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemTokenApi.CleanTokenRequest>();

const schema: VbenFormSchema[] = [
  {
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      showTime: true,
      placeholder: $t('system.token.beforeTime'),
      allowClear: true,
    },
    fieldName: 'beforeTime',
    label: $t('system.token.beforeTime'),
    help: $t('system.token.beforeTimeHelp'),
    rules: z.number().optional().nullable(),
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 gap-x-4',
  layout: 'vertical',
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemTokenApi.CleanTokenRequest>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          beforeTime: undefined,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemTokenApi.CleanTokenRequest>();

    // 转换日期为时间戳
    if (data.beforeTime) {
      data.beforeTime = Math.floor(new Date(data.beforeTime).getTime() / 1000);
    }

    try {
      const result = await cleanExpiredTokens(data);

      message.success({
        content: $t('system.token.cleanSuccess', [result.cleanedCount]),
        duration: 3,
      });

      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('清理Token失败:', error);
      message.error($t('system.token.cleanFailed'));
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() => $t('system.token.cleanExpired'));
</script>

<template>
  <Modal :title="getTitle" width="500px">
    <div class="mx-4">
      <div class="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              {{ $t('system.token.cleanWarningTitle') }}
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>{{ $t('system.token.cleanWarningContent') }}</p>
            </div>
          </div>
        </div>
      </div>
      <Form />
    </div>
  </Modal>
</template>
