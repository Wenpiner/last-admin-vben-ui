<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemConfigurationApi } from '#/api/system/configuration';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateConfiguration } from '#/api/system/configuration';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemConfigurationApi.ConfigurationInfo>();

// 生成表单 schema 的函数
function getFormSchema(isEdit: boolean): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'key',
      label: $t('system.configuration.key'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.configuration.key')]))
        .max(
          100,
          $t('ui.formRules.maxLength', [$t('system.configuration.key'), 100]),
        )
        .regex(/^[\w.-]+$/, $t('system.configuration.keyFormatError')),
      componentProps: {
        placeholder: $t('system.configuration.keyPlaceholder'),
        disabled: isEdit, // 编辑时禁用配置键
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.configuration.name'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.configuration.name')]))
        .max(
          100,
          $t('ui.formRules.maxLength', [$t('system.configuration.name'), 100]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'group',
      label: $t('system.configuration.group'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.configuration.group')]))
        .max(
          50,
          $t('ui.formRules.maxLength', [$t('system.configuration.group'), 50]),
        ),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: $t('system.configuration.valuePlaceholder'),
      },
      fieldName: 'value',
      label: $t('system.configuration.value'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.configuration.value')]))
        .max(
          2000,
          $t('ui.formRules.maxLength', [
            $t('system.configuration.value'),
            2000,
          ]),
        ),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
      },
      fieldName: 'description',
      label: $t('system.configuration.description'),
      rules: z
        .string()
        .max(
          500,
          $t('ui.formRules.maxLength', [
            $t('system.configuration.description'),
            500,
          ]),
        )
        .nullable()
        .optional(),
    },
  ];
}

// 初始化表单，默认为新增模式
let [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema: getFormSchema(false),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
  layout: 'vertical',
});

// 重新创建表单的函数
function recreateForm(isEdit: boolean) {
  [Form, formApi] = useVbenForm({
    commonConfig: {
      colon: true,
      formItemClass: 'col-span-2 md:col-span-1',
    },
    schema: getFormSchema(isEdit),
    showDefaultActions: false,
    wrapperClass: 'grid-cols-2 gap-x-4',
    layout: 'vertical',
  });
}

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemConfigurationApi.ConfigurationInfo>();
      const isEdit = !!data?.key;

      // 根据是否为编辑模式重新创建表单
      recreateForm(isEdit);

      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
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
    const data =
      await formApi.getValues<SystemConfigurationApi.ConfigurationInfo>();
    try {
      await createOrUpdateConfiguration(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.key
    ? $t('ui.actionTitle.edit', [$t('system.configuration.name')])
    : $t('ui.actionTitle.create', [$t('system.configuration.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
