<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemUserApi } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { getDepartmentList } from '#/api/system/department';
import { getRoleList } from '#/api/system/role';
import { createOrUpdateUser } from '#/api/system/user';

import { getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemUserApi.UserInfo>();

// 生成表单 schema 的函数
function getFormSchema(isEdit: boolean): VbenFormSchema[] {
  return [
    // 1. 用户名 - 最重要的基础信息
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: z
        .string()
        .regex(/^\w+$/, '只能包含字母、数字和下划线')
        .min(1, $t('ui.formRules.required', [$t('system.user.username')]))
        .max(
          50,
          $t('ui.formRules.maxLength', [$t('system.user.username'), 50]),
        ),
    },
    // 2. 密码 - 安全相关
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
      rules: isEdit
        ? z.string().min(6, '密码至少6位').optional().or(z.literal(''))
        : z
            .string()
            .min(6, '密码至少6位')
            .min(1, $t('ui.formRules.required', [$t('system.user.password')])),
    },
    // 3. 真实姓名 - 重要的身份信息
    {
      component: 'Input',
      fieldName: 'realName',
      label: $t('system.user.realName'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.user.realName')]))
        .max(
          50,
          $t('ui.formRules.maxLength', [$t('system.user.realName'), 50]),
        ),
    },
    // 4. 所属部门 - 必选，组织架构相关
    {
      component: 'ApiSelect',
      componentProps: {
        class: 'w-full',
        allowClear: false, // 不允许清空，因为是必选
        api: async () => {
          const result = await getDepartmentList({
            page: { currentPage: 1, pageSize: 1000 },
            state: true,
          });
          return result.list.map((dept) => ({
            label: dept.deptName,
            value: dept.id,
          }));
        },
        placeholder: $t('ui.placeholder.select', [
          $t('system.user.departmentName'),
        ]),
      },
      fieldName: 'departmentId',
      label: $t('system.user.departmentName'),
      rules: z
        .number()
        .min(
          1,
          $t('ui.formRules.selectRequired', [$t('system.user.departmentName')]),
        ),
    },
    // 5. 角色 - 必选，权限相关
    {
      component: 'ApiSelect',
      componentProps: {
        class: 'w-full',
        allowClear: false, // 不允许清空，因为是必选
        mode: 'multiple',
        api: async () => {
          const result = await getRoleList({
            page: { currentPage: 1, pageSize: 1000 },
            state: true,
          });
          return result.list.map((role) => ({
            label: role.roleName,
            value: role.id,
          }));
        },
        placeholder: $t('ui.placeholder.select', [$t('system.user.roleNames')]),
      },
      fieldName: 'roleIds',
      label: $t('system.user.roleNames'),
      rules: z
        .array(z.number())
        .min(
          1,
          $t('ui.formRules.selectRequired', [$t('system.user.roleNames')]),
        ),
    },
    // 6. 状态 - 必选，账户状态
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getStateOptions(),
        optionType: 'button',
      },
      fieldName: 'state',
      label: $t('system.user.state'),
      rules: z.boolean(),
    },
    // 7. 邮箱 - 联系方式，可选
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z
        .string()
        .email($t('ui.formRules.email'))
        .optional()
        .or(z.literal('')),
    },
    // 8. 手机号 - 联系方式，可选
    {
      component: 'Input',
      fieldName: 'mobile',
      label: $t('system.user.mobile'),
      rules: z
        .string()
        .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
        .optional()
        .or(z.literal('')),
    },
    // 9. 头像 - 个人信息，可选
    {
      component: 'Input',
      fieldName: 'avatar',
      label: $t('system.user.avatar'),
      rules: z.string().url('请输入有效的链接').optional().or(z.literal('')),
    },
    // 10. 首页路径 - 个性化设置，可选
    {
      component: 'Input',
      fieldName: 'homePath',
      label: $t('system.user.homePath'),
      rules: z
        .string()
        .max(
          200,
          $t('ui.formRules.maxLength', [$t('system.user.homePath'), 200]),
        )
        .optional()
        .or(z.literal('')),
    },
    // 11. 描述 - 备注信息，可选
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
      },
      fieldName: 'desc',
      label: $t('system.user.desc'),
      rules: z
        .string()
        .max(500, $t('ui.formRules.maxLength', [$t('system.user.desc'), 500]))
        .nullable()
        .optional(),
    },
  ];
}

// 初始化表单，默认为新增模式
let [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema: getFormSchema(false),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
  layout: 'vertical',
});

// 重新创建表单的函数
function recreateForm(isEdit: boolean) {
  [Form, formApi] = useVbenForm({
    commonConfig: {
      colon: true,
      formItemClass: 'col-span-2 md:col-span-1',
    },
    schema: getFormSchema(isEdit),
    showDefaultActions: false,
    wrapperClass: 'grid-cols-2 gap-x-4',
    layout: 'vertical',
  });
}

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemUserApi.UserInfo>();
      const isEdit = !!data?.userId;

      // 根据是否为编辑模式重新创建表单
      recreateForm(isEdit);

      if (data) {
        formData.value = data;
        formApi.setValues(formData.value, false);
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          state: true,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<SystemUserApi.UserInfo>();
    try {
      await createOrUpdateUser(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.userId
    ? $t('ui.actionTitle.edit', [$t('system.user.name')])
    : $t('ui.actionTitle.create', [$t('system.user.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
