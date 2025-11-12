<script lang="ts" setup>
import type { SystemUserApi } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  Button,
  Card,
  Divider,
  Input,
  message,
  QRCode,
  Space,
  Tag,
} from 'ant-design-vue';

import { disableTotp, enableTotp, verifyTotp } from '#/api/system/user';

const emit = defineEmits<{
  success: [];
}>();

const userInfo = ref<SystemUserApi.UserInfo>();
const qrText = ref<string>('');
const verificationCode = ref<string>('');
const loading = ref(false);
const step = ref<'setup' | 'verify' | 'view'>('view');

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemUserApi.UserInfo>();
      if (data) {
        userInfo.value = data;
        determineStep();
      }
    } else {
      // 重置状态
      qrText.value = '';
      verificationCode.value = '';
      step.value = 'view';
    }
  },
});

function determineStep() {
  if (!userInfo.value?.totpInfo) {
    step.value = 'view';
  } else if (userInfo.value.totpInfo.isVerified) {
    step.value = 'view';
  } else {
    step.value = 'verify';
  }
}

const getTitle = computed(() => {
  return `${$t('system.user.totpManagement')} - ${
    userInfo.value?.realName || userInfo.value?.username
  }`;
});

const totpStatus = computed(() => {
  if (!userInfo.value?.totpInfo) {
    return {
      text: $t('system.user.totpNotEnabled'),
      color: 'default',
    };
  }

  if (!userInfo.value.totpInfo.isVerified) {
    return {
      text: $t('system.user.totpNotVerified'),
      color: 'orange',
    };
  }

  return {
    text: userInfo.value.totpInfo.state
      ? $t('system.user.totpEnabled')
      : $t('system.user.totpDisabled'),
    color: userInfo.value.totpInfo.state ? 'green' : 'red',
  };
});

// 计算属性用于翻译文本，避免模板中的长文本导致格式化问题
const labels = computed(() => ({
  deviceName: $t('system.user.totpDeviceName'),
  issuer: $t('system.user.totpIssuer'),
  lastUsedAt: $t('system.user.totpLastUsedAt'),
  enableTotp: $t('system.user.enableTotp'),
  verifyTotp: $t('system.user.verifyTotp'),
  resetTotp: $t('system.user.resetTotp'),
  disableTotp: $t('system.user.disableTotp'),
  setupTitle: $t('system.user.totpSetupTitle'),
  verifyTitle: $t('system.user.totpVerifyTitle'),
  verifyAndComplete: $t('system.user.verifyAndComplete'),
  verify: $t('system.user.verify'),
  codePlaceholder: $t('system.user.totpCodePlaceholder'),
}));

async function handleEnableTotp() {
  if (!userInfo.value?.userId) return;

  loading.value = true;
  try {
    const result = await enableTotp({
      userId: userInfo.value.userId,
      issuer: 'Last Admin',
      domain: window.location.hostname,
    });

    qrText.value = result.qrText;
    step.value = 'setup';

    message.success($t('system.user.totpSetupSuccess'));
  } catch (error) {
    console.error('启用TOTP失败:', error);
    message.error($t('system.user.totpSetupFailed'));
  } finally {
    loading.value = false;
  }
}

async function handleVerifyTotp() {
  if (!userInfo.value?.userId || !verificationCode.value) {
    message.error($t('system.user.totpCodeRequired'));
    return;
  }

  loading.value = true;
  try {
    await verifyTotp({
      userId: userInfo.value.userId,
      code: verificationCode.value,
    });

    message.success($t('system.user.totpVerifySuccess'));
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('验证TOTP失败:', error);
    message.error($t('system.user.totpVerifyFailed'));
  } finally {
    loading.value = false;
  }
}

async function handleDisableTotp() {
  if (!userInfo.value?.totpInfo?.id) return;

  loading.value = true;
  try {
    await disableTotp({
      id: userInfo.value.totpInfo.id,
    });

    message.success($t('system.user.totpDisableSuccess'));
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('禁用TOTP失败:', error);
    message.error($t('system.user.totpDisableFailed'));
  } finally {
    loading.value = false;
  }
}

function handleBackToView() {
  step.value = 'view';
  qrText.value = '';
  verificationCode.value = '';
}
</script>

<template>
  <Modal :title="getTitle" width="600px">
    <div class="p-4">
      <!-- 查看状态 -->
      <div v-if="step === 'view'">
        <Card :title="$t('system.user.totpCurrentStatus')" size="small">
          <div class="mb-4">
            <Space>
              <span>{{ $t('system.user.totpStatus') }}:</span>
              <Tag :color="totpStatus.color">{{ totpStatus.text }}</Tag>
            </Space>
          </div>

          <div v-if="userInfo?.totpInfo" class="mb-4">
            <div class="mb-2">
              <span class="font-medium">{{ labels.deviceName }}:</span>
              {{ userInfo.totpInfo.deviceName || '-' }}
            </div>
            <div class="mb-2">
              <span class="font-medium">{{ labels.issuer }}:</span>
              {{ userInfo.totpInfo.issuer || '-' }}
            </div>
            <div class="mb-2">
              <span class="font-medium">{{ labels.lastUsedAt }}:</span>
              {{
                userInfo.totpInfo.lastUsedAt
                  ? new Date(
                      userInfo.totpInfo.lastUsedAt * 1000,
                    ).toLocaleString()
                  : '-'
              }}
            </div>
          </div>

          <Space>
            <Button
              v-if="!userInfo?.totpInfo"
              type="primary"
              :loading="loading"
              @click="handleEnableTotp"
            >
              {{ labels.enableTotp }}
            </Button>

            <Button
              v-if="userInfo?.totpInfo && !userInfo.totpInfo.isVerified"
              type="primary"
              @click="step = 'verify'"
            >
              {{ labels.verifyTotp }}
            </Button>

            <Button
              v-if="userInfo?.totpInfo && userInfo.totpInfo.isVerified"
              type="primary"
              :loading="loading"
              @click="handleEnableTotp"
            >
              {{ labels.resetTotp }}
            </Button>

            <Button
              v-if="userInfo?.totpInfo"
              danger
              :loading="loading"
              @click="handleDisableTotp"
            >
              {{ labels.disableTotp }}
            </Button>
          </Space>
        </Card>
      </div>

      <!-- 设置TOTP -->
      <div v-else-if="step === 'setup'">
        <Card :title="labels.setupTitle" size="small">
          <div class="mb-4 text-center">
            <QRCode :value="qrText" :size="200" />
          </div>

          <div class="mb-4">
            <p class="mb-2">{{ $t('system.user.totpSetupInstructions') }}</p>
            <ol
              class="list-inside list-decimal space-y-1 text-sm text-gray-600"
            >
              <li>{{ $t('system.user.totpStep1') }}</li>
              <li>{{ $t('system.user.totpStep2') }}</li>
              <li>{{ $t('system.user.totpStep3') }}</li>
            </ol>
          </div>

          <Divider />

          <div class="mb-4">
            <label class="mb-2 block font-medium">{{
              $t('system.user.totpVerificationCode')
            }}</label>
            <Input
              v-model:value="verificationCode"
              :placeholder="labels.codePlaceholder"
              :maxlength="6"
              @press-enter="handleVerifyTotp"
            />
          </div>

          <Space>
            <Button type="primary" :loading="loading" @click="handleVerifyTotp">
              {{ labels.verifyAndComplete }}
            </Button>
            <Button @click="handleBackToView">
              {{ $t('ui.common.cancel') }}
            </Button>
          </Space>
        </Card>
      </div>

      <!-- 验证TOTP -->
      <div v-else-if="step === 'verify'">
        <Card :title="labels.verifyTitle" size="small">
          <div class="mb-4">
            <p>{{ $t('system.user.totpVerifyInstructions') }}</p>
          </div>

          <div class="mb-4">
            <label class="mb-2 block font-medium">{{
              $t('system.user.totpVerificationCode')
            }}</label>
            <Input
              v-model:value="verificationCode"
              :placeholder="labels.codePlaceholder"
              :maxlength="6"
              @press-enter="handleVerifyTotp"
            />
          </div>

          <Space>
            <Button type="primary" :loading="loading" @click="handleVerifyTotp">
              {{ labels.verify }}
            </Button>
            <Button @click="handleBackToView">
              {{ $t('ui.common.back') }}
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  </Modal>
</template>
