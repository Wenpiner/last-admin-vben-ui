<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemDepartmentApi } from '#/api/system/department';
import type { SystemUserApi } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import {
  createOrUpdateDepartment,
  getDepartmentList,
} from '#/api/system/department';
import { getUserList } from '#/api/system/user';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemDepartmentApi.DepartmentInfo>();

const keyword = ref('');

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'deptName',
    label: $t('system.department.deptName'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.department.deptName')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.department.deptName'), 100]),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('system.department.deptCodePlaceholder'),
    },
    fieldName: 'deptCode',
    label: $t('system.department.deptCode'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.department.deptCode')]))
      .max(
        50,
        $t('ui.formRules.maxLength', [$t('system.department.deptCode'), 50]),
      )
      .regex(/^[0-9a-z_-]+$/, $t('system.department.deptCodeFormatError')),
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      class: 'w-full',
      allowClear: true,
      api: async () => {
        const result = await getDepartmentList({
          page: { currentPage: 1, pageSize: 1000 },
        });
        return result.list || [];
      },
      fieldNames: {
        children: 'children',
        label: 'deptName',
        value: 'id',
      },
      placeholder: $t('system.department.parentDept'),
      treeDefaultExpandAll: true,
    },
    fieldName: 'parentId',
    label: $t('system.department.parentDept'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 9999,
      placeholder: $t('system.department.sortOrder'),
    },
    fieldName: 'sortOrder',
    label: $t('system.department.sortOrder'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.min', [$t('system.department.sortOrder'), 0]))
      .max(
        9999,
        $t('ui.formRules.max', [$t('system.department.sortOrder'), 9999]),
      ),
  },
  {
    component: 'ApiSelect',
    componentProps: {
      // 禁止本地过滤
      filterOption: false,
      class: 'w-full',
      // 用户接口 - 初始加载
      api: async (params: any) => {
        console.warn('api params', params);
        const result = await getUserList({
          page: { currentPage: 1, pageSize: 100 },
          state: true, // 只获取启用的用户
          ...params,
        });
        return result.list.map((user: SystemUserApi.UserInfo) => ({
          label: `${user.realName || user.username} (${user.realName})`,
          value: user.userId,
        }));
      },
      // 搜索时重新加载数据
      onSearch: async (value?: string) => {
        console.warn('onSearch', value);
        if (value) {
          keyword.value = value;
        }
      },

      showSearch: true,
      allowClear: true,
      placeholder: $t('ui.placeholder.select', [
        $t('system.department.leaderUserId'),
      ]),
    },

    fieldName: 'leaderUserId',
    label: $t('system.department.leaderUserId'),
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      readonly: true,
      placeholder: $t('system.department.leaderUsername'),
      disabled: true,
    },
    fieldName: 'leaderUsername',
    label: $t('system.department.leaderUsername'),
    dependencies: {
      triggerFields: ['leaderUserId'],
      show: ({ leaderUserId }) => !!leaderUserId,
    },
  },
  {
    component: 'Input',
    componentProps: {
      readonly: true,
      placeholder: $t('system.department.leaderPhone'),
      disabled: true,
    },
    fieldName: 'leaderPhone',
    label: $t('system.department.leaderPhone'),
    dependencies: {
      triggerFields: ['leaderUserId'],
      show: ({ leaderUserId }) => !!leaderUserId,
    },
  },
  {
    component: 'Input',
    componentProps: {
      readonly: true,
      placeholder: $t('system.department.leaderEmail'),
      disabled: true,
    },
    fieldName: 'leaderEmail',
    label: $t('system.department.leaderEmail'),
    dependencies: {
      triggerFields: ['leaderUserId'],
      show: ({ leaderUserId }) => !!leaderUserId,
    },
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    fieldName: 'state',
    label: $t('system.department.state'),
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.department.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [
          $t('system.department.description'),
          500,
        ]),
      )
      .nullable()
      .optional(),
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
  layout: 'vertical',
});

// 监听负责人选择变化，自动填充相关信息
const handleLeaderChange = async (newUserId: string | undefined) => {
  if (newUserId) {
    try {
      // 获取用户详细信息
      const result = await getUserList({
        page: { currentPage: 1, pageSize: 1 },
        userId: newUserId,
      });

      if (result.list.length > 0) {
        const user = result.list[0];
        if (user) {
          // 自动填充负责人相关信息
          formApi.setValues({
            leaderUsername: user.realName || user.username,
            leaderPhone: user.mobile || '',
            leaderEmail: user.email || '',
          });
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  } else {
    // 清空负责人相关信息
    formApi.setValues({
      leaderUsername: '',
      leaderPhone: '',
      leaderEmail: '',
    });
  }
};

// 编辑时加载当前负责人信息
const loadCurrentLeaderInfo = async (userId: string) => {
  try {
    // 通过 userId 查询用户信息
    const result = await getUserList({
      page: { currentPage: 1, pageSize: 1 },
      userId,
    });

    if (result.list.length > 0) {
      const user = result.list[0];
      if (user) {
        // 填充负责人相关信息
        formApi.setValues({
          leaderUsername: user.realName || user.username,
          leaderPhone: user.mobile || '',
          leaderEmail: user.email || '',
        });
      }
    }
  } catch (error) {
    console.error('获取当前负责人信息失败:', error);
  }
};

// 使用 handleValuesChange 来监听字段变化
const originalHandleValuesChange = formApi.state?.handleValuesChange;
formApi.setState({
  handleValuesChange: async (values, fieldsChanged) => {
    // 调用原有的处理函数
    if (originalHandleValuesChange) {
      originalHandleValuesChange(values, fieldsChanged);
    }

    // 如果负责人字段发生变化，自动填充相关信息
    if (fieldsChanged?.includes('leaderUserId')) {
      await handleLeaderChange(values.leaderUserId);
    }
  },
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDepartmentApi.DepartmentInfo>();
      if (data) {
        formData.value = data;
        console.warn('formData.value', formData.value);
        // 设置完整的表单数据，包括 id（filterFields: false 允许设置 schema 中未定义的字段）
        formApi.setValues(
          {
            ...formData.value,
            // 处理 parentId 为 null 或 0 的情况
            parentId: formData.value.parentId || undefined,
          },
          false,
        ); // filterFields: false 允许设置额外字段如 id

        // 如果有负责人ID，获取负责人详细信息并设置到ApiSelect的选项中
        if (formData.value.leaderUserId) {
          await loadCurrentLeaderInfo(formData.value.leaderUserId);
        }
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          state: true,
          sortOrder: 0,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemDepartmentApi.DepartmentInfo>();
    try {
      // 处理 parentId，如果为空则设为 null
      // 处理提交数据
      const submitData = {
        ...data,
        parentId: data.parentId || null,
      } as SystemDepartmentApi.DepartmentInfo;
      console.warn('submitData', submitData);
      await createOrUpdateDepartment(submitData);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.department.name')])
    : $t('ui.actionTitle.create', [$t('system.department.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
