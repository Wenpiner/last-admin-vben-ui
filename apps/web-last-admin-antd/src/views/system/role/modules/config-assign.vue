<script lang="ts" setup>
import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Radio } from 'ant-design-vue';

import {
  assignConfigurationGroupToRole,
  getConfigurationGroupList,
  getRoleConfigurationGroup,
} from '#/api/system/role';

const emit = defineEmits<{
  success: [];
}>();

const loading = ref(false);
const allConfigurationGroups = ref<string[]>([]);
const roleData = ref<SystemRoleApi.RoleInfo>();

// 权限状态管理：key -> 'read' | 'write' | 'none'
const permissions = ref<Map<string, 'none' | 'read' | 'write'>>(new Map());

// 获取所有配置分组数据
async function loadAllConfigurationGroups() {
  try {
    loading.value = true;
    const result = await getConfigurationGroupList();
    allConfigurationGroups.value = result || [];
  } catch (error) {
    console.error('Failed to load configuration group list:', error);
    message.error($t('system.role.loadConfigurationsFailed'));
  } finally {
    loading.value = false;
  }
}

// 获取角色已分配的配置项权限
async function loadRoleConfigurationGroups(roleValue: string) {
  try {
    const result = await getRoleConfigurationGroup(roleValue);
    const configGroups = result || [];

    const newPermissions = new Map<string, 'none' | 'read' | 'write'>();

    configGroups.forEach((configGroup: string) => {
      if (configGroup.endsWith(':read')) {
        const key = configGroup.replace(':read', '');
        newPermissions.set(key, 'read');
      } else if (configGroup.endsWith(':write')) {
        const key = configGroup.replace(':write', '');
        newPermissions.set(key, 'write');
      }
    });

    permissions.value = newPermissions;
  } catch (error) {
    console.error('Failed to load role configuration groups:', error);
    message.error($t('system.role.loadRoleConfigurationGroupsFailed'));
  }
}

// 构建路径树结构
const pathTree = computed(() => {
  if (allConfigurationGroups.value.length === 0) return [];

  // 收集所有路径（包括父路径）
  const pathSet = new Set<string>();
  allConfigurationGroups.value.forEach((groupPath) => {
    if (groupPath.startsWith('/')) {
      // 添加所有父路径
      const parts = groupPath.split('/').filter(Boolean);
      for (let i = 1; i <= parts.length; i++) {
        pathSet.add(`/${parts.slice(0, i).join('/')}`);
      }
    }
  });

  // 构建树形结构
  const pathArray = [...pathSet].sort();
  const tree: any[] = [];
  const nodeMap = new Map<string, any>();

  pathArray.forEach((path) => {
    const parts = path.split('/').filter(Boolean);
    const parentPath =
      parts.length > 1 ? `/${parts.slice(0, -1).join('/')}` : null;

    const node = {
      key: path,
      title: parts[parts.length - 1] || 'root',
      children: [],
      isLeaf: !pathArray.some((p) => p.startsWith(`${path}/`) && p !== path),
    };

    nodeMap.set(path, node);

    if (parentPath && nodeMap.has(parentPath)) {
      nodeMap.get(parentPath)!.children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
});

// 获取所有子路径
function getChildPaths(parentPath: string): string[] {
  const children: string[] = [];
  allConfigurationGroups.value.forEach((groupPath) => {
    if (groupPath.startsWith(`${parentPath}/`)) {
      children.push(groupPath);
    }
  });
  return children;
}

// 获取所有父路径
function getParentPaths(childPath: string): string[] {
  const parents: string[] = [];
  const parts = childPath.split('/').filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    parents.push(`/${parts.slice(0, i).join('/')}`);
  }
  return parents;
}

// 处理权限变更
function onPermissionChange(
  path: string,
  permission: 'none' | 'read' | 'write',
) {
  const newPermissions = new Map(permissions.value);

  if (permission === 'none') {
    newPermissions.delete(path);

    // 如果是父级节点，也清除所有子级权限
    const childPaths = getChildPaths(path);
    childPaths.forEach((childPath) => {
      newPermissions.delete(childPath);
    });
  } else {
    // 设置当前路径权限
    newPermissions.set(path, permission);

    // 如果有子路径，为所有子路径设置相同权限
    const childPaths = getChildPaths(path);
    if (childPaths.length > 0) {
      childPaths.forEach((childPath) => {
        newPermissions.set(childPath, permission);
      });
    }
  }

  permissions.value = newPermissions;
}

// 获取路径的有效权限
function getEffectivePermission(path: string): 'none' | 'read' | 'write' {
  return permissions.value.get(path) || 'none';
}

// 检查权限是否是通过父级设置的（用于显示提示）
function isSetByParent(path: string): boolean {
  // 检查是否有父路径也设置了相同权限
  const currentPermission = permissions.value.get(path);
  if (!currentPermission) return false;

  const parentPaths = getParentPaths(path);
  for (const parentPath of parentPaths.reverse()) {
    if (permissions.value.get(parentPath) === currentPermission) {
      // 检查该父路径是否有子路径，如果有则说明是通过父级设置的
      const childPaths = getChildPaths(parentPath);
      if (childPaths.includes(path)) {
        return true;
      }
    }
  }

  return false;
}

// 提交权限配置
async function onSubmit() {
  if (!roleData.value?.roleCode) return;

  modalApi.lock();
  try {
    const configurationGroups: string[] = [];

    // 提交所有设置了权限的路径
    permissions.value.forEach((permission, key) => {
      if (permission !== 'none') {
        configurationGroups.push(`${key}:${permission}`);
      }
    });

    await assignConfigurationGroupToRole({
      roleValue: roleData.value.roleCode,
      configurationGroups,
    });

    message.success($t('system.role.assignConfigurationGroupSuccess'));
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('Failed to assign configuration group:', error);
    message.error($t('system.role.assignConfigurationGroupFailed'));
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
        await loadAllConfigurationGroups();
        if (data.roleCode) {
          await loadRoleConfigurationGroups(data.roleCode);
        }
      }
    } else {
      roleData.value = undefined;
      allConfigurationGroups.value = [];
      permissions.value.clear();
    }
  },
});

const getTitle = computed(() =>
  roleData.value?.roleName
    ? $t('system.role.assignConfigurationGroupTitle', {
        roleName: roleData.value.roleName,
      })
    : $t('system.role.assignConfigurationGroup'),
);

// 扁平化路径树，便于渲染
const flatPaths = computed(() => {
  const result: Array<{ key: string; level: number }> = [];

  function flatten(nodes: any[], level = 0) {
    nodes.forEach((node) => {
      result.push({ key: node.key, level });
      if (node.children && node.children.length > 0) {
        flatten(node.children, level + 1);
      }
    });
  }

  flatten(pathTree.value);
  return result;
});
</script>

<template>
  <Modal :title="getTitle" width="800px">
    <div class="p-4">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="text-gray-500">
          <div
            class="mr-2 inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
          ></div>
          {{ $t('system.role.loadingConfigurations') }}
        </div>
      </div>

      <div v-else-if="pathTree.length === 0" class="py-8 text-center">
        <div class="text-gray-500">
          {{ $t('system.role.noConfigurationData') }}
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="text-sm text-gray-600">
          {{ $t('system.role.pathPermissionTip') }}
        </div>

        <div class="max-h-[60vh] overflow-auto rounded-lg border p-4">
          <div v-for="item in flatPaths" :key="item.key" class="mb-3">
            <div
              class="space-y-2"
              :style="{ marginLeft: `${item.level * 20}px` }"
            >
              <div class="text-sm font-medium text-gray-800">
                {{ item.key }}
              </div>
              <div class="ml-4">
                <div class="flex items-center space-x-4">
                  <Radio.Group
                    :value="getEffectivePermission(item.key)"
                    @change="
                      (e) => onPermissionChange(item.key, e.target.value)
                    "
                    size="small"
                  >
                    <Radio value="none">
                      {{ $t('system.role.noPermission') }}
                    </Radio>
                    <Radio value="read">
                      {{ $t('system.role.readPermission') }}
                    </Radio>
                    <Radio value="write">
                      {{ $t('system.role.writePermission') }}
                    </Radio>
                  </Radio.Group>
                  <span
                    v-if="isSetByParent(item.key)"
                    class="text-xs text-blue-500"
                  >
                    ({{ $t('system.role.setByParent') }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
