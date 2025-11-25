<script lang="ts" setup>
import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Tree } from 'ant-design-vue';

import { convertMenusToTree } from '#/api/core/menu';
import { getMenuList } from '#/api/system/menu';
import { assignMenuToRole, getRoleMenu } from '#/api/system/role';

const emit = defineEmits<{
  success: [];
}>();

const roleData = ref<SystemRoleApi.RoleInfo>();
const allMenus = ref<any[]>([]);
const checkedKeys = ref<number[]>([]);
const loading = ref(false);

// 获取所有菜单数据
async function loadAllMenus() {
  try {
    loading.value = true;
    const result = await getMenuList();
    allMenus.value = result || [];
  } catch (error) {
    console.error('Failed to load menu list:', error);
    message.error($t('system.role.loadMenusFailed'));
  } finally {
    loading.value = false;
  }
}

// 获取角色已分配的菜单
async function loadRoleMenus(roleValue: string) {
  try {
    const result = await getRoleMenu(roleValue);
    const menuIds = (result || []).map((menu: any) => Number(menu.id));
    checkedKeys.value = menuIds;
  } catch (error) {
    console.error('Failed to load role menus:', error);
    message.error($t('system.role.loadRoleMenusFailed'));
  }
}

// 处理树节点选中变化
function onCheck(checkedKeysValue: any) {
  checkedKeys.value = checkedKeysValue.checked || checkedKeysValue;
}

// 提交菜单分配
async function onSubmit() {
  if (!roleData.value?.id) return;

  try {
    modalApi.lock();
    await assignMenuToRole({
      roleId: roleData.value.id,
      menuIds: checkedKeys.value,
    });
    message.success($t('system.role.assignMenuSuccess'));
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('Failed to assign menu:', error);
    message.error($t('system.role.assignMenuFailed'));
  } finally {
    modalApi.unlock();
  }
}

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemRoleApi.RoleInfo>();
      if (data) {
        roleData.value = data;
        if (data.id) {
          await loadRoleMenus(data.roleCode);
        }
        await loadAllMenus();
      }
    } else {
      // 重置数据
      roleData.value = undefined;
      allMenus.value = [];
      checkedKeys.value = [];
    }
  },
});

const getTitle = computed(() =>
  roleData.value?.roleName
    ? $t('system.role.assignMenuTitle', { roleName: roleData.value.roleName })
    : $t('system.role.assignMenu'),
);

// 转换菜单数据为树形结构
const treeData = computed(() => {
  if (allMenus.value.length === 0) return [];

  // 使用现有的转换函数将平铺数据转换为树形结构
  const treeMenus = convertMenusToTree(allMenus.value);

  // 转换为 Ant Design Tree 组件需要的格式
  const convertToTreeData = (menus: any[]): any[] => {
    return menus.map((menu) => ({
      key: Number(menu.id),
      title: menu.meta?.title || menu.name,
      children: menu.children ? convertToTreeData(menu.children) : [],
    }));
  };

  return convertToTreeData(treeMenus);
});
</script>

<template>
  <Modal :title="getTitle" width="600px">
    <div class="p-4">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="text-gray-500">
          <div
            class="mr-2 inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
          ></div>
          {{ $t('system.role.loadingMenus') }}
        </div>
      </div>
      <div v-else-if="treeData.length === 0" class="py-8 text-center">
        <div class="text-gray-500">{{ $t('system.role.noMenuData') }}</div>
      </div>
      <div v-else>
        <div class="mb-4 text-sm text-gray-600">
          {{ $t('system.role.menuPermissionTip') }}
        </div>
        <div class="max-h-[60vh] overflow-auto">
          <Tree
            v-model:checked-keys="checkedKeys"
            :tree-data="treeData"
            checkable
            default-expand-all
            @check="onCheck"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>
