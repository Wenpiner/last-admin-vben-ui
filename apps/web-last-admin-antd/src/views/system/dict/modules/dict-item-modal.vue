<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemDictApi } from '#/api/system/dict';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createOrUpdateDictItem,
  deleteDictItem,
  getDictItemList,
} from '#/api/system/dict';

import { useDictItemColumns } from '../data';

const dictData = ref<SystemDictApi.DictInfo>();

const gridOptions: VxeTableGridOptions<SystemDictApi.DictItemInfo> = {
  columns: [
    ...(useDictItemColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      width: 150,
      fixed: 'right',
      align: 'center',
      slots: {
        default: 'action',
      },
    },
  ],
  height: 400,
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!dictData.value?.id) return { data: [], total: 0 };
        return await getDictItemList({
          page,
          dictId: dictData.value.id,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: true,
    zoom: false,
  },
  editConfig: {
    trigger: 'manual',
    mode: 'row',
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

function onRefresh() {
  gridApi.query();
}

function editRowEvent(row: SystemDictApi.DictItemInfo) {
  gridApi.grid?.setEditRow(row);
}

function cancelRowEvent(row: SystemDictApi.DictItemInfo) {
  gridApi.grid?.clearEdit();
  if (!row.id) {
    // 如果是新增的行且没有保存，则删除这一行
    gridApi.grid?.remove(row);
  }
}

function hasEditStatus(row: SystemDictApi.DictItemInfo) {
  return gridApi.grid?.isEditByRow(row);
}

async function saveRowEvent(row: SystemDictApi.DictItemInfo) {
  // 先校验数据
  const errMap = await gridApi.grid?.validate(row, (errMap) => {
    console.warn('校验失败，错误详情：', errMap);
    // 显示具体的校验错误信息
    if (errMap && typeof errMap === 'object') {
      Object.keys(errMap).forEach((field) => {
        const errors = errMap[field];
        if (errors && errors.length > 0) {
          console.warn(
            `字段 ${field} 校验失败:`,
            errors.map((err: any) => err.message).join(', '),
          );
          message.error(`${field}: ${(errors[0] as any).message}`);
        }
      });
    }
  });

  if (errMap && Object.keys(errMap).length > 0) return;

  // 校验通过后，清除编辑状态，这会自动提交编辑的值到行数据中
  await gridApi.grid?.clearEdit();

  try {
    const saveData = {
      ...row,
      dictId: dictData.value!!.id,
    } as SystemDictApi.DictItemInfo;

    console.warn('保存数据:', saveData);
    console.warn('原始行数据:', row);

    await createOrUpdateDictItem(saveData);

    message.success(
      row.id
        ? $t('ui.actionMessage.updateSuccess', [row.label])
        : $t('ui.actionMessage.createSuccess', [row.label]),
    );

    onRefresh();
  } catch (error) {
    console.error('保存字典子项失败:', error);
  }
}

async function onDeleteItem(row: SystemDictApi.DictItemInfo) {
  console.warn('onDeleteItem', row);
  if (!row.id) return;

  // 如果id的类型是string代表是新增未保存的数据，直接移除即可
  if (typeof row.id === 'string') {
    gridApi.grid?.remove(row);
    return;
  }

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.label]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteDictItem(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.label]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除字典子项失败:', error);
  }
}

async function onAddItem() {
  const newRow: SystemDictApi.DictItemInfo = {
    dictId: dictData.value!!.id!,
    label: '',
    value: '',
    sortOrder: 0,
    state: true,
    id: Date.now().toString(),
  };

  // 插入新行
  const result = await gridApi.grid?.insertAt(newRow, -1);
  const row = result?.row;

  // 等待 DOM 更新
  await nextTick();

  // 使用短暂延时确保表格完全渲染
  setTimeout(async () => {
    // 立即进入编辑状态
    await gridApi.grid?.setEditRow(row);
  }, 50);
}

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDictApi.DictInfo>();
      dictData.value = data;
      // 延迟刷新，确保组件已经渲染
      setTimeout(() => {
        onRefresh();
      }, 100);
    }
  },
  class: 'w-[80%]',
});

const getTitle = computed(() =>
  $t('system.dict.item.manageTitle', [dictData.value?.name || '']),
);
</script>

<template>
  <Modal :title="getTitle">
    <div class="p-4">
      <Grid>
        <template #toolbar-tools>
          <Button type="primary" @click="onAddItem">
            <Plus class="size-4" />
            {{ $t('ui.actionTitle.create', [$t('system.dict.item.name')]) }}
          </Button>
        </template>
        <template #action="{ row }">
          <template v-if="hasEditStatus(row)">
            <Button type="link" @click="saveRowEvent(row)">
              {{ $t('system.operation.save') }}
            </Button>
            <Button type="link" @click="cancelRowEvent(row)">
              {{ $t('system.operation.cancel') }}
            </Button>
          </template>
          <template v-else>
            <Button type="link" @click="editRowEvent(row)">
              {{ $t('system.operation.edit') }}
            </Button>
            <Button
              type="link"
              danger
              @click="onDeleteItem(row)"
              :disabled="!row.id"
            >
              {{ $t('system.operation.delete') }}
            </Button>
          </template>
        </template>
      </Grid>
    </div>
  </Modal>
</template>
