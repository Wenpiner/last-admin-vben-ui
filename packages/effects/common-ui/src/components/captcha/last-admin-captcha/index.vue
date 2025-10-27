<script setup lang="ts">
import type { LastAdminCaptchaData, LastAdminCaptchaProps } from '../types';

import { computed, onMounted, ref } from 'vue';

import { RotateCw } from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenIconButton, Input as VbenInput } from '@vben-core/shadcn-ui';

const props = withDefaults(defineProps<LastAdminCaptchaProps>(), {
  captchaHeight: '40px',
  captchaWidth: '100px',
  height: '40px',
  placeholder: '',
  refreshText: '',
  width: '100%',
});

const emit = defineEmits<{
  change: [LastAdminCaptchaData];
  refresh: [];
}>();

const modelValue = defineModel<LastAdminCaptchaData>({
  default: () => ({ id: '', value: '' }),
});

const localCaptchaImage = ref<string>('');
const localCaptchaAudio = ref<string>('');
const isLoading = ref<boolean>(false);
const isPlayingAudio = ref<boolean>(false);
const audioRef = ref<HTMLAudioElement | null>(null);
const localCaptchaType = ref<string>('digit');

const containerStyle = computed(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  width: props.width,
  height: props.height,
}));

const inputStyle = computed(() => ({
  flex: 1,
  height: '100%',
}));

const captchaImageStyle = computed(() => ({
  height: props.captchaHeight,
  width: props.captchaWidth,
  cursor: 'pointer',
  borderRadius: '4px',
  backgroundColor: 'var(--background-deep)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

/**
 * 生成验证码
 */
async function generateCaptcha() {
  try {
    isLoading.value = true;
    // 优先调用 onRefresh 回调函数，传递 setter 函数
    if (props.onRefresh) {
      await props.onRefresh(setCaptchaData);
    } else {
      // 否则通过 emit 事件让父组件处理
      emit('refresh');
    }
  } finally {
    isLoading.value = false;
  }
}

/**
 * 处理输入变化
 */
function handleInputChange(value: number | string) {
  let newValue = String(value);

  // 根据验证码类型限制输入
  if (localCaptchaType.value === 'digit' || localCaptchaType.value === 'math') {
    // 只允许数字输入
    newValue = newValue.replaceAll(/\D/g, '');
  }

  modelValue.value.value = newValue;
  emitChange();
}

/**
 * 发送数据变化事件
 */
function emitChange() {
  const data = modelValue.value;
  // 优先调用 onChange 回调函数
  if (props.onChange) {
    props.onChange(data);
  } else {
    // 否则通过 emit 事件
    emit('change', data);
  }
}

/**
 * 点击验证码图片刷新
 */
function handleCaptchaClick() {
  generateCaptcha();
}

/**
 * 播放音频
 */
function playAudio() {
  if (localCaptchaAudio.value && audioRef.value) {
    isPlayingAudio.value = true;
    audioRef.value.play().catch(() => {
      isPlayingAudio.value = false;
    });
  }
}

/**
 * 处理音频播放结束
 */
function handleAudioEnded() {
  isPlayingAudio.value = false;
}

/**
 * 设置验证码数据
 * @param id 验证码 ID
 * @param base64Blob 验证码图片或音频的 base64 数据
 * @param captchaType 验证码类型
 */
function setCaptchaData(id: string, base64Blob: string, captchaType: string) {
  modelValue.value.id = id;
  localCaptchaType.value = captchaType;
  if (captchaType === 'audio') {
    localCaptchaAudio.value = base64Blob;
  } else {
    localCaptchaImage.value = base64Blob;
  }
  modelValue.value.value = '';
}

/**
 * 重置组件
 */
function reset() {
  modelValue.value.id = '';
  localCaptchaImage.value = '';
  modelValue.value.value = '';
}

/**
 * 获取当前数据
 */
function getData(): LastAdminCaptchaData {
  return modelValue.value;
}

onMounted(() => {
  generateCaptcha();
});

defineExpose({
  getData,
  reset,
  setCaptchaData,
  generateCaptcha,
});
</script>

<template>
  <div :style="containerStyle" class="last-admin-captcha">
    <!-- 输入框 -->
    <VbenInput
      :model-value="modelValue.value"
      :placeholder="placeholder || $t('lastAdmin.captcha.inputPlaceholder')"
      :style="inputStyle"
      class="flex-1"
      :type="
        localCaptchaType === 'digit' || localCaptchaType === 'math'
          ? 'number'
          : 'text'
      "
      @update:model-value="handleInputChange"
    />

    <!-- 验证码图片 (图片类型) -->
    <div
      v-if="localCaptchaType !== 'audio'"
      :style="captchaImageStyle"
      class="bg-background-deep border-border border"
      @click="handleCaptchaClick"
    >
      <img
        v-if="localCaptchaImage"
        alt="验证码"
        :src="localCaptchaImage"
        class="h-full w-full object-contain"
      />
      <div v-else class="text-foreground/50 text-xs">
        {{ $t('lastAdmin.captcha.loading') }}
      </div>
    </div>

    <!-- 音频播放按钮 (音频类型) -->
    <VbenIconButton
      v-if="localCaptchaType === 'audio'"
      :aria-label="$t('lastAdmin.captcha.refresh')"
      :disabled="isPlayingAudio"
      @click="playAudio"
    >
      <span
        :class="{ 'animate-pulse': isPlayingAudio }"
        class="icon-[mdi--volume-high] size-4"
      ></span>
    </VbenIconButton>

    <!-- 隐藏的音频元素 -->
    <audio
      v-if="localCaptchaType === 'audio'"
      ref="audioRef"
      :src="localCaptchaAudio"
      @ended="handleAudioEnded"
    ></audio>

    <!-- 刷新按钮 -->
    <VbenIconButton
      :aria-label="$t('lastAdmin.captcha.refresh')"
      :disabled="isLoading"
      @click="generateCaptcha"
    >
      <RotateCw :class="{ 'animate-spin': isLoading }" class="size-4" />
    </VbenIconButton>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
