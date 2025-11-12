<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemPositionApi } from '#/api/system/position';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdatePosition } from '#/api/system/position';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemPositionApi.PositionInfo>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'positionName',
    label: $t('system.position.positionName'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.position.positionName')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.position.positionName'), 100]),
      ),
  },
  {
    component: 'Input',
    fieldName: 'positionCode',
    label: $t('system.position.positionCode'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.position.positionCode')]))
      .max(
        50,
        $t('ui.formRules.maxLength', [$t('system.position.positionCode'), 50]),
      ),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 9999,
      placeholder: $t('system.position.sortOrder'),
    },
    fieldName: 'sortOrder',
    label: $t('system.position.sortOrder'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.min', [$t('system.position.sortOrder'), 0]))
      .max(
        9999,
        $t('ui.formRules.max', [$t('system.position.sortOrder'), 9999]),
      ),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.position.state'),
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.position.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [$t('system.position.description'), 500]),
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
      const data = modalApi.getData<SystemPositionApi.PositionInfo>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          state: true,
          sortOrder: 0,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemPositionApi.PositionInfo>();
    try {
      await createOrUpdatePosition(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.position.name')])
    : $t('ui.actionTitle.create', [$t('system.position.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
