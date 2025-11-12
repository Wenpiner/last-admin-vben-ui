<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemOauthApi } from '#/api/system/oauth';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateOauth } from '#/api/system/oauth';

import { getAuthStyleOptions, getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemOauthApi.OauthInfo>();

// URL验证规则
const urlValidation = z
  .string()
  .min(1, $t('ui.formRules.required'))
  .url($t('system.oauth.urlFormatError'));

// 可选URL验证规则
const optionalUrlValidation = z
  .string()
  .url($t('system.oauth.urlFormatError'))
  .nullable()
  .optional()
  .or(z.literal(''));

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'providerName',
    label: $t('system.oauth.providerName'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.oauth.providerName')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.oauth.providerName'), 100]),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('system.oauth.providerCodePlaceholder'),
    },
    fieldName: 'providerCode',
    label: $t('system.oauth.providerCode'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.oauth.providerCode')]))
      .max(
        50,
        $t('ui.formRules.maxLength', [$t('system.oauth.providerCode'), 50]),
      )
      .regex(/^[0-9a-z_-]+$/, $t('system.oauth.providerCodeFormatError')),
  },
  {
    component: 'Input',
    fieldName: 'clientId',
    label: $t('system.oauth.clientId'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.oauth.clientId')]))
      .max(
        200,
        $t('ui.formRules.maxLength', [$t('system.oauth.clientId'), 200]),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      type: 'password',
      placeholder: $t('system.oauth.clientSecretPlaceholder'),
    },
    fieldName: 'clientSecret',
    label: $t('system.oauth.clientSecret'),
    dependencies: {
      triggerFields: ['id'],
      // 创建时必填，更新时非必填
      rules: ({ id }) =>
        id
          ? // 更新时非必填，允许空字符串（表示不修改）
            z
              .string()
              .max(
                200,
                $t('ui.formRules.maxLength', [
                  $t('system.oauth.clientSecret'),
                  200,
                ]),
              )
              .optional()
          : // 创建时必填
            z
              .string()
              .min(
                1,
                $t('ui.formRules.required', [$t('system.oauth.clientSecret')]),
              )
              .max(
                200,
                $t('ui.formRules.maxLength', [
                  $t('system.oauth.clientSecret'),
                  200,
                ]),
              ),
    },
  },
  {
    component: 'Input',
    fieldName: 'authorizationUrl',
    label: $t('system.oauth.authorizationUrl'),
    rules: urlValidation,
  },
  {
    component: 'Input',
    fieldName: 'tokenUrl',
    label: $t('system.oauth.tokenUrl'),
    rules: urlValidation,
  },
  {
    component: 'Input',
    fieldName: 'userinfoUrl',
    label: $t('system.oauth.userinfoUrl'),
    rules: urlValidation,
  },
  {
    component: 'Input',
    fieldName: 'redirectUri',
    label: $t('system.oauth.redirectUri'),
    rules: urlValidation,
  },
  {
    component: 'Input',
    fieldName: 'logoutUrl',
    label: $t('system.oauth.logoutUrl'),
    rules: optionalUrlValidation,
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('system.oauth.scopesPlaceholder'),
    },
    fieldName: 'scopes',
    label: $t('system.oauth.scopes'),
    rules: z
      .string()
      .max(200, $t('ui.formRules.maxLength', [$t('system.oauth.scopes'), 200]))
      .nullable()
      .optional(),
  },
  {
    component: 'Select',
    componentProps: {
      options: getAuthStyleOptions(),
      placeholder: $t('system.oauth.authStyle'),
    },
    fieldName: 'authStyle',
    label: $t('system.oauth.authStyle'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.required', [$t('system.oauth.authStyle')]))
      .max(2, $t('ui.formRules.required', [$t('system.oauth.authStyle')])),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.oauth.state'),
    rules: 'required',
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
      const data = modalApi.getData<SystemOauthApi.OauthInfo>();
      if (data) {
        formData.value = data;
        // 编辑时不显示clientSecret的值，保持为空
        const formValues = { ...formData.value };
        delete formValues.clientSecret; // 不显示现有的clientSecret
        formApi.setValues(formValues, false);
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          state: true,
          authStyle: 0, // 默认自动检测
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemOauthApi.OauthInfo>();
    try {
      // 如果是编辑且clientSecret为空，则不传递该字段
      const submitData = { ...data };
      if (formData.value?.id && !submitData.clientSecret) {
        delete submitData.clientSecret;
      }

      await createOrUpdateOauth(submitData);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.oauth.name')])
    : $t('ui.actionTitle.create', [$t('system.oauth.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
