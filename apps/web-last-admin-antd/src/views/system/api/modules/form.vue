<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemApiApi } from '#/api/system/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateApi } from '#/api/system/api';

import { getMethodOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemApiApi.ApiInfo>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.api.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.api.name')]))
      .max(100, $t('ui.formRules.maxLength', [$t('system.api.name'), 100])),
  },
  {
    component: 'Select',
    componentProps: {
      options: getMethodOptions(),
    },
    fieldName: 'method',
    label: $t('system.api.method'),
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'path',
    label: $t('system.api.path'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.api.path')]))
      .max(200, $t('ui.formRules.maxLength', [$t('system.api.path'), 200]))
      .refine(
        (value: string) => {
          return value.startsWith('/');
        },
        $t('ui.formRules.startWith', [$t('system.api.path'), '/']),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.api.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [$t('system.api.description'), 500]),
      )
      .optional(),
  },
  {
    component: 'Input',
    fieldName: 'serviceName',
    label: $t('system.api.serviceName'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.api.serviceName')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.api.serviceName'), 100]),
      ),
  },
  {
    component: 'Input',
    fieldName: 'apiGroup',
    label: $t('system.api.apiGroup'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.api.apiGroup')]))
      .max(100, $t('ui.formRules.maxLength', [$t('system.api.apiGroup'), 100])),
  },
  {
    component: 'Checkbox',
    fieldName: 'isRequired',
    help: $t('system.api.isRequiredTip'),
    renderComponentContent() {
      return {
        default: () => $t('system.api.isRequired'),
      };
    },
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
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemApiApi.ApiInfo>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemApiApi.ApiInfo>();
    try {
      await createOrUpdateApi(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.api.name')])
    : $t('ui.actionTitle.create', [$t('system.api.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
