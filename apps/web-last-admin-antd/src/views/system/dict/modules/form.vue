<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemDictApi } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateDict } from '#/api/system/dict';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemDictApi.DictInfo>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.dict.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.dict.name')]))
      .max(100, $t('ui.formRules.maxLength', [$t('system.dict.name'), 100])),
  },
  {
    component: 'Input',
    fieldName: 'code',
    label: $t('system.dict.code'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.dict.code')]))
      .max(50, $t('ui.formRules.maxLength', [$t('system.dict.code'), 50])),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.dict.state'),
    rules: 'required',
    defaultValue: true,
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.dict.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [$t('system.dict.description'), 500]),
      )
      .nullable()
      .optional(),
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
      const data = modalApi.getData<SystemDictApi.DictInfo>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          state: true,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemDictApi.DictInfo>();
    try {
      await createOrUpdateDict(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.dict.name')])
    : $t('ui.actionTitle.create', [$t('system.dict.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
