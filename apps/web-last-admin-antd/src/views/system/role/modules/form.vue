<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateRole } from '#/api/system/role';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemRoleApi.RoleInfo>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'roleName',
    label: $t('system.role.roleName'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.role.roleName')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.role.roleName'), 100]),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('system.role.roleCodePlaceholder'),
    },
    fieldName: 'roleCode',
    label: $t('system.role.roleCode'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.role.roleCode')]))
      .max(50, $t('ui.formRules.maxLength', [$t('system.role.roleCode'), 50]))
      .regex(/^[0-9a-z_-]+$/, $t('system.role.roleCodeFormatError')),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.role.state'),
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
    label: $t('system.role.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [$t('system.role.description'), 500]),
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
      const data = modalApi.getData<SystemRoleApi.RoleInfo>();
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
    const data = await formApi.getValues<SystemRoleApi.RoleInfo>();
    try {
      await createOrUpdateRole(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.role.name')])
    : $t('ui.actionTitle.create', [$t('system.role.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
