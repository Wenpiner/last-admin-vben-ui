<script setup lang="ts">
import type { ActionItem, TableActionEmits, TableActionProps } from './types';

import { computed, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Dropdown, Popconfirm, Space, Tooltip } from 'ant-design-vue';

import { $t } from '#/locales';

defineOptions({
  name: 'TableAction',
});

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
  gap: 8,
  align: 'end',
  maxVisibleButtons: 2,
  responsive: true,
  responsiveBreakpoint: 768,
});

const emit = defineEmits<TableActionEmits>();

interface Props extends TableActionProps {}

// 响应式状态
const windowWidth = ref(
  typeof window === 'undefined' ? 1024 : window.innerWidth,
);

// 监听窗口大小变化
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
}

/**
 * 判断是否为移动设备
 */
const isMobile = computed(() => {
  return props.responsive && windowWidth.value < props.responsiveBreakpoint;
});

/**
 * 过滤并处理操作项
 */
const processedActions = computed(() => {
  return props.actions
    .filter((action) => {
      // 检查 ifShow 条件
      if (action.ifShow !== undefined) {
        const show =
          typeof action.ifShow === 'function'
            ? action.ifShow(action)
            : action.ifShow;
        if (!show) return false;
      }
      return true;
    })
    .map((action) => ({
      ...action,
      // 如果没有指定 buttonType，默认为 'button'
      buttonType: action.buttonType || 'button',
    }));
});

/**
 * 可见的按钮（非下拉菜单项）
 */
const visibleButtons = computed(() => {
  if (isMobile.value) {
    return [];
  }
  return processedActions.value.filter(
    (action) => action.buttonType === 'button',
  );
});

/**
 * 下拉菜单项
 */
const dropdownItems = computed(() => {
  const items = processedActions.value.filter(
    (action) => action.buttonType === 'dropdown',
  );

  // 如果是移动设备，将所有按钮也加入下拉菜单
  if (isMobile.value) {
    return processedActions.value;
  }

  return items;
});

/**
 * 处理按钮点击
 */
function handleActionClick(action: ActionItem) {
  if (action.disabled) {
    return;
  }

  if (action.popConfirm) {
    // 如果有弹窗确认，先显示弹窗
    return;
  }

  action.onClick?.();
  emit('actionClick', action);
}

/**
 * 处理 Popconfirm 确认
 */
function handlePopconfirmConfirm(action: ActionItem) {
  action.popConfirm?.confirm?.();
  action.onClick?.();
  emit('actionClick', action);
}

/**
 * 处理 Popconfirm 取消
 */
function handlePopconfirmCancel(action: ActionItem) {
  action.popConfirm?.cancel?.();
}
</script>

<template>
  <Space
    :size="gap"
    :align="align"
    class="flex"
    :style="{ justifyContent: align }"
  >
    <!-- 可见的按钮 -->
    <template v-for="action in visibleButtons" :key="action.label">
      <div v-if="action.divider" class="border-border h-6 border-l"></div>
      <Popconfirm
        v-if="action.popConfirm"
        :title="action.popConfirm.title"
        :ok-text="action.popConfirm.okText || $t('system.tableAction.confirm')"
        :cancel-text="
          action.popConfirm.cancelText || $t('system.tableAction.cancel')
        "
        @confirm="() => handlePopconfirmConfirm(action)"
        @cancel="() => handlePopconfirmCancel(action)"
      >
        <Tooltip
          v-if="action.tooltip"
          :title="
            typeof action.tooltip === 'string' ? action.tooltip : undefined
          "
          v-bind="typeof action.tooltip === 'string' ? {} : action.tooltip"
        >
          <Button
            type="link"
            :size="size"
            :disabled="action.disabled"
            :danger="action.color === 'error'"
            class="px-1"
            @click="() => handleActionClick(action)"
          >
            <IconifyIcon
              v-if="action.icon"
              :icon="action.icon"
              class="mr-1 size-4"
            />
            {{ action.label }}
          </Button>
        </Tooltip>
        <Button
          v-else
          type="link"
          :size="size"
          :disabled="action.disabled"
          :danger="action.color === 'error'"
          class="px-1"
          @click="() => handleActionClick(action)"
        >
          <IconifyIcon
            v-if="action.icon"
            :icon="action.icon"
            class="mr-1 size-4"
          />
          {{ action.label }}
        </Button>
      </Popconfirm>
      <Tooltip
        v-else-if="action.tooltip"
        :title="typeof action.tooltip === 'string' ? action.tooltip : undefined"
        v-bind="typeof action.tooltip === 'string' ? {} : action.tooltip"
      >
        <Button
          type="link"
          :size="size"
          :disabled="action.disabled"
          :danger="action.color === 'error'"
          class="px-1"
          @click="() => handleActionClick(action)"
        >
          <IconifyIcon
            v-if="action.icon"
            :icon="action.icon"
            class="mr-1 size-4"
          />
          {{ action.label }}
        </Button>
      </Tooltip>
      <Button
        v-else
        type="link"
        :size="size"
        :disabled="action.disabled"
        :danger="action.color === 'error'"
        class="px-1"
        @click="() => handleActionClick(action)"
      >
        <IconifyIcon
          v-if="action.icon"
          :icon="action.icon"
          class="mr-1 size-4"
        />
        {{ action.label }}
      </Button>
    </template>

    <!-- 下拉菜单 -->
    <Dropdown
      v-if="dropdownItems.length > 0"
      :disabled="dropdownItems.every((item) => item.disabled)"
    >
      <template #overlay>
        <a-menu>
          <template v-for="(item, index) in dropdownItems" :key="index">
            <a-menu-divider v-if="item.divider" />
            <a-menu-item
              :disabled="item.disabled"
              @click="() => handleActionClick(item)"
            >
              <Popconfirm
                v-if="item.popConfirm"
                :title="item.popConfirm.title"
                :ok-text="
                  item.popConfirm.okText || $t('system.tableAction.confirm')
                "
                :cancel-text="
                  item.popConfirm.cancelText || $t('system.tableAction.cancel')
                "
                @confirm="() => handlePopconfirmConfirm(item)"
                @cancel="() => handlePopconfirmCancel(item)"
              >
                <div class="flex items-center">
                  <IconifyIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    class="mr-2 size-4"
                  />
                  {{ item.label }}
                </div>
              </Popconfirm>
              <div v-else class="flex items-center">
                <IconifyIcon
                  v-if="item.icon"
                  :icon="item.icon"
                  class="mr-2 size-4"
                />
                {{ item.label }}
              </div>
            </a-menu-item>
          </template>
        </a-menu>
      </template>
      <Button type="link" size="small" class="px-1">
        {{ $t('system.tableAction.more') }}
      </Button>
    </Dropdown>
  </Space>
</template>

<style scoped>
/* 暗黑模式支持 */
:deep(.ant-btn-link) {
  color: var(--primary);
}

:deep(.dark .ant-btn-link) {
  color: var(--primary);
}

:deep(.ant-btn-link:hover) {
  color: var(--primary);
  opacity: 0.8;
}

:deep(.dark .ant-btn-link:hover) {
  color: var(--primary);
  opacity: 0.8;
}

:deep(.ant-btn-link:disabled) {
  color: var(--muted-foreground);
  cursor: not-allowed;
}

:deep(.dark .ant-btn-link:disabled) {
  color: var(--muted-foreground);
  cursor: not-allowed;
}
</style>
