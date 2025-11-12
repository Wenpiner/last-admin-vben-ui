<script lang="ts" setup>
import type { SystemApiApi } from '#/api/system/api';
import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Tree } from 'ant-design-vue';

import { getAllApis } from '#/api/system/api';
import { assignApiToRole, getRoleApi } from '#/api/system/role';

const emit = defineEmits<{
  success: [];
}>();

const loading = ref(false);
const allApis = ref<SystemApiApi.ApiInfo[]>([]);
const checkedKeys = ref<string[]>([]);
const disabledKeys = ref<string[]>([]); // 存储不可选择的必选API
const roleData = ref<SystemRoleApi.RoleInfo>();

// 加载所有API
async function loadAllApis() {
  try {
    loading.value = true;
    const result = await getAllApis();
    allApis.value = result || [];

    // 处理必选API
    const requiredApiIds: string[] = [];
    const disabledApiIds: string[] = [];

    allApis.value.forEach((api) => {
      if (api.isRequired && api.id) {
        const apiId = String(api.id);
        requiredApiIds.push(apiId);
        disabledApiIds.push(apiId);
      }
    });

    // 设置必选API为默认选中且不可取消
    checkedKeys.value = [...new Set([...checkedKeys.value, ...requiredApiIds])];
    disabledKeys.value = disabledApiIds;
  } catch (error) {
    console.error('Failed to load API list:', error);
    message.error($t('system.role.loadApisFailed'));
  } finally {
    loading.value = false;
  }
}

// 加载角色已有的API权限
async function loadRoleApis(roleValue: string) {
  try {
    const result = await getRoleApi(roleValue);
    const apiPaths = result || [];

    // 根据 method|path 格式匹配API
    const matchedApiIds: string[] = [];
    apiPaths.forEach((apiPath: string) => {
      const api = allApis.value.find(
        (item) => `${item.method}|${item.path}` === apiPath,
      );
      if (api && api.id) {
        matchedApiIds.push(String(api.id));
      } else {
        console.warn('No matching API found for:', apiPath);
      }
    });

    // 合并必选API和角色已有API
    const requiredApiIds = disabledKeys.value;
    checkedKeys.value = [...new Set([...matchedApiIds, ...requiredApiIds])];
  } catch (error) {
    console.error('Failed to load role APIs:', error);
    message.error($t('system.role.loadRoleApisFailed'));
  }
}

// 更新父节点选中状态
function updateParentNodesSelection() {
  if (treeData.value.length === 0) return;

  const selectedKeys = new Set(checkedKeys.value);
  const additionalKeys: string[] = [];

  // 遍历服务节点
  treeData.value.forEach((serviceNode) => {
    let allGroupsSelected = true;
    const groupKeys: string[] = [];

    // 遍历API分组节点
    serviceNode.children.forEach((groupNode: any) => {
      let allApisSelected = true;
      const apiKeys: string[] = [];

      // 遍历API节点
      groupNode.children.forEach((apiNode: any) => {
        apiKeys.push(apiNode.key);
        if (!selectedKeys.has(apiNode.key)) {
          allApisSelected = false;
        }
      });

      // 如果分组下所有API都被选中，则选中分组节点
      if (allApisSelected && apiKeys.length > 0) {
        groupKeys.push(groupNode.key);
        if (!selectedKeys.has(groupNode.key)) {
          additionalKeys.push(groupNode.key);
        }
      } else {
        allGroupsSelected = false;
      }
    });

    // 如果服务下所有分组都被选中，则选中服务节点
    if (
      allGroupsSelected &&
      groupKeys.length > 0 &&
      !selectedKeys.has(serviceNode.key)
    ) {
      additionalKeys.push(serviceNode.key);
    }
  });

  // 更新选中的键
  if (additionalKeys.length > 0) {
    checkedKeys.value = [...checkedKeys.value, ...additionalKeys];
  }
}

// 处理树节点选中变化
function onCheck(checkedKeysValue: any) {
  checkedKeys.value = checkedKeysValue.checked || checkedKeysValue;
}

// 提交API权限分配
async function onSubmit() {
  if (!roleData.value?.id) return;

  modalApi.lock();
  try {
    const apiIds = checkedKeys.value.map(Number);
    await assignApiToRole({
      roleId: roleData.value.id,
      apiIds,
    });
    message.success($t('system.role.assignApiSuccess'));
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('Failed to assign API:', error);
    message.error($t('system.role.assignApiFailed'));
  } finally {
    modalApi.unlock();
  }
}

// 将扁平的API数据转换为三层树结构
const treeData = computed(() => {
  if (allApis.value.length === 0) return [];

  const serviceMap = new Map<string, any>();

  allApis.value.forEach((api) => {
    const { serviceName, apiGroup } = api;

    // 第一层：服务名称
    if (!serviceMap.has(serviceName)) {
      serviceMap.set(serviceName, {
        key: `service_${serviceName}`,
        title: serviceName,
        children: new Map<string, any>(),
      });
    }

    const service = serviceMap.get(serviceName);
    const groupMap = service.children;

    // 第二层：API分组
    if (!groupMap.has(apiGroup)) {
      groupMap.set(apiGroup, {
        key: `group_${serviceName}_${apiGroup}`,
        title: apiGroup,
        children: [],
      });
    }

    const group = groupMap.get(apiGroup);

    // 第三层：具体API
    const apiId = String(api.id);
    group.children.push({
      key: apiId,
      title: `${api.method} ${api.path}${api.name ? ` (${api.name})` : ''}${api.isRequired ? ` [${$t('system.role.requiredApi')}]` : ''}`,
      isLeaf: true,
      disabled: api.isRequired, // 必选API不可取消选择
    });
  });

  // 转换为树形结构
  const result: any[] = [];
  serviceMap.forEach((service) => {
    const serviceNode = {
      key: service.key,
      title: service.title,
      children: [] as any[],
    };

    service.children.forEach((group: any) => {
      serviceNode.children.push({
        key: group.key,
        title: group.title,
        children: group.children,
      });
    });

    result.push(serviceNode);
  });

  return result;
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemRoleApi.RoleInfo>();
      if (data) {
        roleData.value = data;
        await loadAllApis();
        if (data.roleCode) {
          await loadRoleApis(data.roleCode);
        }
        // 更新父节点选中状态
        setTimeout(() => {
          updateParentNodesSelection();
        }, 100);
      }
    } else {
      // 重置状态
      allApis.value = [];
      checkedKeys.value = [];
      roleData.value = undefined;
    }
  },
});

const getTitle = computed(() =>
  roleData.value?.roleName
    ? $t('system.role.assignApiTitle', { roleName: roleData.value.roleName })
    : $t('system.role.assignApi'),
);
</script>

<template>
  <Modal :title="getTitle">
    <div class="mx-4">
      <div v-if="loading" class="flex items-center justify-center py-8">
        {{ $t('system.role.loadingApis') }}
      </div>

      <div v-else-if="treeData.length === 0" class="py-8 text-center">
        <div class="text-gray-500">{{ $t('system.role.noApiData') }}</div>
      </div>

      <div v-else>
        <div class="mb-4 text-sm text-gray-600">
          {{ $t('system.role.apiPermissionTip') }}
        </div>

        <div class="h-full max-h-[60vh] overflow-hidden">
          <Tree
            v-model:checked-keys="checkedKeys"
            :tree-data="treeData"
            :disabled-keys="disabledKeys"
            checkable
            :default-expand-all="true"
            @check="onCheck"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>
