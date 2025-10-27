<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption } from '@vben/types';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, LastAdminCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { generateCaptchaApi } from '#/api/core/captcha';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'vben',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'jack',
  },
];

// 验证码加载状态
const captchaLoading = ref<boolean>(false);

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

/**
 * 组件挂载时初始化验证码
 */
onMounted(() => {});

const loginRef = ref<InstanceType<typeof AuthenticationLogin>>();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        trigger(values, form) {
          if (values.selectAccount) {
            const findUser = MOCK_USER_OPTIONS.find(
              (item) => item.value === values.selectAccount,
            );
            if (findUser) {
              form.setValues({
                password: '123456',
                username: findUser.value,
              });
            }
          }
        },
        triggerFields: ['selectAccount'],
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
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
  ];
});

const onFailed = (_: any) => {
  const formApi = loginRef.value?.getFormApi();
  const captchaRef = formApi?.getFieldComponentRef('captcha');
  (captchaRef as any)?.generateCaptcha?.();
};
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin($event, undefined, onFailed)"
  />
</template>
