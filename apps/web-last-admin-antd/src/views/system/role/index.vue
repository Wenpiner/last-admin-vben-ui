<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { SystemRoleApi } from '#/api/system/role';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, Dropdown, Menu, MenuItem, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRole, getRoleList } from '#/api/system/role';

import { useColumns, useSearchFormSchemas } from './data';
import ApiAssign from './modules/api-assign.vue';
import Form from './modules/form.vue';
import MenuAssign from './modules/menu-assign.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [MenuAssignModal, menuAssignModalApi] = useVbenModal({
  connectedComponent: MenuAssign,
  destroyOnClose: true,
});

const [ApiAssignModal, apiAssignModalApi] = useVbenModal({
  connectedComponent: ApiAssign,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [...(useSearchFormSchemas().schema as any)],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
  // class 样式
  wrapperClass:
    'gap-x-2 flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
};

const gridOptions: VxeTableGridOptions<SystemRoleApi.RoleInfo> = {
  columns: [
    ...(useColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      fixed: 'right',
      width: 200,
      align: 'center',
      slots: {
        default: ({ row }) => {
          return h('div', { class: 'flex items-center justify-center gap-2' }, [
            h(
              Button,
              {
                type: 'link',
                size: 'small',
                onClick: () => onEdit(row),
              },
              () => $t('system.operation.edit'),
            ),
            h(
              Dropdown,
              {
                trigger: ['click'],
              },
              {
                default: () =>
                  h(
                    Button,
                    {
                      type: 'link',
                      size: 'small',
                    },
                    () => $t('system.role.permissionOperation'),
                  ),
                overlay: () =>
                  h(Menu, {}, () => [
                    h(
                      MenuItem,
                      {
                        key: 'menu',
                        onClick: () => onMenuAssign(row),
                      },
                      () => $t('system.role.menuManagement'),
                    ),
                    h(
                      MenuItem,
                      {
                        key: 'api',
                        onClick: () => onApiAssign(row),
                      },
                      () => $t('system.role.apiManagement'),
                    ),
                  ]),
              },
            ),
            h(
              Button,
              {
                type: 'link',
                size: 'small',
                danger: true,
                onClick: () => onDelete(row),
              },
              () => $t('system.operation.delete'),
            ),
          ]);
        },
      },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: true, // 启用分页
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getRoleList({
          page,
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
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function onRefresh() {
  gridApi.query();
}

function onEdit(row: SystemRoleApi.RoleInfo) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

function onMenuAssign(row: SystemRoleApi.RoleInfo) {
  menuAssignModalApi.setData(row).open();
}

function onApiAssign(row: SystemRoleApi.RoleInfo) {
  apiAssignModalApi.setData(row).open();
}

async function onDelete(row: SystemRoleApi.RoleInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.roleName]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteRole(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.roleName]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('Failed to delete role:', error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <MenuAssignModal @success="onRefresh" />
    <ApiAssignModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.role.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
