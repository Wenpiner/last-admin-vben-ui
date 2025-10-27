<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, h, markRaw, ref } from 'vue';

import { AuthenticationRegister, LastAdminCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { registerApi } from '#/api/core/auth';
import { generateCaptchaApi } from '#/api/core/captcha';
import { router } from '#/router';

defineOptions({ name: 'Register' });

const loading = ref(false);
// 验证码加载状态
const captchaLoading = ref<boolean>(false);
// 表单api
const registerRef = ref<InstanceType<typeof AuthenticationRegister>>();
/**
 * 生成验证码
 */
async function handleGenerateCaptcha(
  setter: (id: string, base64Blob: string, captchaType: string) => void,
) {
  try {
    captchaLoading.value = true;
    const response = await generateCaptchaApi();
    if (response) {
      // 通过 setter 函数更新组件内部的验证码数据
      setter(response.id, response.base64Blob, response.captchaType);
    }
  } catch (error) {
    console.error('Failed to generate captcha:', error);
  } finally {
    captchaLoading.value = false;
  }
}

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.confirmPassword'),
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ required_error: $t('authentication.passwordTip') })
            .min(1, { message: $t('authentication.passwordTip') })
            .refine((value) => value === password, {
              message: $t('authentication.confirmPasswordTip'),
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: $t('authentication.confirmPassword'),
    },
    {
      component: markRaw(LastAdminCaptcha),
      componentProps: {
        onRefresh: handleGenerateCaptcha,
      },
      fieldName: 'captcha',
      rules: z.object({
        id: z.string().min(1),
        value: z.string().min(1),
      }),
    },
    {
      component: 'VbenCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            $t('authentication.agree'),
            h(
              'a',
              {
                class: 'vben-link ml-1 ',
                href: '',
              },
              `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
            ),
          ]),
      }),
      rules: z.boolean().refine((value) => !!value, {
        message: $t('authentication.agreeTip'),
      }),
    },
  ];
});

function handleSubmit(value: Recordable<any>) {
  loading.value = true;
  registerApi({
    id: value.captcha.id,
    value: value.captcha.value,
    password: value.password,
    username: value.username,
  })
    .then(() => {
      message.info($t('api.authentication.registerSuccess'));
      router.push('/auth/login');
    })
    .catch(() => {
      const formApi = registerRef.value?.getFormApi();
      const captchaRef = formApi?.getFieldComponentRef('captcha');
      (captchaRef as any)?.generateCaptcha?.();
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <AuthenticationRegister
    ref="registerRef"
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
