<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemMenuApi } from '#/api/system/menu';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { createOrUpdateMenu } from '#/api/system/menu';

import { getMenuTypeOptions, getStateOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemMenuApi.SystemMenu>();

const schema: VbenFormSchema[] = [
  // 菜单类型
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getMenuTypeOptions(),
      optionType: 'button',
    },
    defaultValue: 'menu',
    fieldName: 'type',
    formItemClass: 'col-span-2 md:col-span-2',
    label: $t('system.menu.type'),
    rules: 'required',
  },
  // 菜单名称 (MenuName) - 任何情况都需要
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.menu.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.menu.name')]))
      .max(50, $t('ui.formRules.maxLength', [$t('system.menu.name'), 50])),
  },
  // 服务名称 (ServiceName) - 任何情况都需要
  {
    component: 'Input',
    fieldName: 'service',
    label: $t('system.menu.service'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.menu.service')]))
      .max(50, $t('ui.formRules.maxLength', [$t('system.menu.service'), 50])),
  },
  // 菜单标题
  {
    component: 'Input',
    fieldName: 'meta.title',
    label: $t('system.menu.menuTitle'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.menu.menuTitle')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.menu.menuTitle'), 100]),
      ),
  },
  // 菜单路径 - menu 和 directory 类型需要
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return ['directory', 'menu'].includes(values.type);
      },
      rules: (values) => {
        return ['directory', 'menu'].includes(values.type)
          ? z
              .string()
              .min(1, $t('ui.formRules.required', [$t('system.menu.path')]))
              .max(
                200,
                $t('ui.formRules.maxLength', [$t('system.menu.path'), 200]),
              )
              .refine(
                (value: string) => value.startsWith('/'),
                $t('ui.formRules.startWith', [$t('system.menu.path'), '/']),
              )
          : null;
      },
      triggerFields: ['type'],
    },
    fieldName: 'path',
    label: $t('system.menu.path'),
  },
  // 菜单模式选择 - menu 类型显示
  {
    component: 'RadioGroup',
    dependencies: {
      show: (values) => {
        return values.type === 'menu';
      },
      triggerFields: ['type'],
    },
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: $t('system.menu.menuModeComponent'), value: 'component' },
        { label: $t('system.menu.menuModeIframe'), value: 'iframe' },
        { label: $t('system.menu.menuModeLink'), value: 'link' },
      ],
      optionType: 'button',
    },
    defaultValue: 'component',
    fieldName: 'menuMode',
    label: $t('system.menu.menuMode'),
    rules: 'required',
  },
  // 组件路径 - 组件模式显示
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return values.type === 'menu' && values.menuMode === 'component';
      },
      rules: (values) => {
        return values.type === 'menu' && values.menuMode === 'component'
          ? z
              .string()
              .min(
                1,
                $t('ui.formRules.required', [$t('system.menu.component')]),
              )
              .max(
                200,
                $t('ui.formRules.maxLength', [
                  $t('system.menu.component'),
                  200,
                ]),
              )
              .refine(
                (value: string) => value.startsWith('/'),
                $t('ui.formRules.startWith', [
                  $t('system.menu.component'),
                  '/',
                ]),
              )
          : z.string().optional();
      },
      triggerFields: ['type', 'menuMode'],
    },
    fieldName: 'component',
    label: $t('system.menu.component'),
    help: $t('system.menu.componentHelp', ['/views/system/user/index']),
  },
  // IFrame 地址 - IFrame 模式必填
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return values.type === 'menu' && values.menuMode === 'iframe';
      },
      rules: (values) => {
        return values.type === 'menu' && values.menuMode === 'iframe'
          ? z
              .string()
              .min(
                1,
                $t('ui.formRules.required', [$t('system.menu.iframeAddress')]),
              )
              .url($t('ui.formRules.url'))
          : z.string().optional();
      },
      triggerFields: ['type', 'menuMode'],
    },
    fieldName: 'meta.iframeSrc',
    label: $t('system.menu.iframeAddress'),
    help: $t('system.menu.iframeAddressHelp', ['https://example.com']),
  },
  // 外链地址 - 外链模式必填
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return values.type === 'menu' && values.menuMode === 'link';
      },
      rules: (values) => {
        return values.type === 'menu' && values.menuMode === 'link'
          ? z
              .string()
              .min(
                1,
                $t('ui.formRules.required', [$t('system.menu.linkAddress')]),
              )
              .url($t('ui.formRules.url'))
          : z.string().optional();
      },
      triggerFields: ['type', 'menuMode'],
    },
    fieldName: 'meta.link',
    label: $t('system.menu.linkAddress'),
    help: $t('system.menu.linkAddressHelp', ['https://example.com']),
  },
  // 权限标识 - button 类型必填
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return values.type === 'button';
      },
      rules: (values) => {
        return values.type === 'button'
          ? z
              .string()
              .min(
                1,
                $t('ui.formRules.required', [$t('system.menu.permission')]),
              )
              .max(
                100,
                $t('ui.formRules.maxLength', [
                  $t('system.menu.permission'),
                  100,
                ]),
              )
              .regex(/^[a-z0-9_-]+$/, $t('system.menu.permissionRegexError'))
          : z
              .string()
              .max(
                100,
                $t('ui.formRules.maxLength', [
                  $t('system.menu.permission'),
                  100,
                ]),
              )
              .optional();
      },
      triggerFields: ['type'],
    },
    fieldName: 'permission',
    label: $t('system.menu.authCode'),
    help: $t('system.menu.authCodeHelp'),
  },
  // 菜单图标 - directory 和 menu 类型必填
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return ['directory', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.icon',
    label: $t('system.menu.icon'),
    help: $t('system.menu.iconHelp', ['mdi:home']),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.menu.icon')]))
      .max(100, $t('ui.formRules.maxLength', [$t('system.menu.icon'), 100])),
  },
  // 排序
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 9999,
      placeholder: $t('system.menu.order'),
    },
    defaultValue: 0,
    fieldName: 'meta.order',
    label: $t('system.menu.order'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.min', [$t('system.menu.order'), 0]))
      .max(9999, $t('ui.formRules.max', [$t('system.menu.order'), 9999]))
      .optional(),
  },
  // 状态
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getStateOptions(),
      optionType: 'button',
    },
    defaultValue: true,
    fieldName: 'state',
    label: $t('system.menu.state'),
    rules: 'required',
  },
  // 是否隐藏菜单
  {
    component: 'Switch',
    dependencies: {
      show: (values) => {
        return ['directory', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.hideInMenu',
    label: $t('system.menu.hideInMenu'),
  },
  // 是否缓存
  {
    component: 'Switch',
    dependencies: {
      show: (values) => {
        return values.type === 'menu';
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.keepAlive',
    label: $t('system.menu.keepAlive'),
  },
  // 描述
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('system.description'),
    rules: z
      .string()
      .max(500, $t('ui.formRules.maxLength', [$t('system.description'), 500]))
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

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemMenuApi.SystemMenu>();
      if (data) {
        formData.value = data;
        // 设置表单值
        // 根据现有数据推断菜单模式
        let menuMode = 'component';
        if (data.meta?.iframeSrc) {
          menuMode = 'iframe';
        } else if (data.meta?.link) {
          menuMode = 'link';
        }

        formApi.setValues(
          {
            ...data,
            menuMode,
            'meta.title': data.meta?.title || '',
            'meta.icon': data.meta?.icon || '',
            'meta.order': data.meta?.order || 0,
            'meta.hideInMenu': data.meta?.hideInMenu || false,
            'meta.keepAlive': data.meta?.keepAlive || false,
            'meta.iframeSrc': data.meta?.iframeSrc || '',
            'meta.link': data.meta?.link || '',
          },
          false,
        );
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          type: 'menu',
          state: true,
          menuMode: 'component',
          'meta.order': 0,
          'meta.hideInMenu': false,
          'meta.keepAlive': false,
          'meta.iframeSrc': '',
          'meta.link': '',
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const formValues = await formApi.getValues();

    // 构建提交数据
    let component = '';

    // 根据菜单模式设置组件
    switch (formValues.menuMode) {
      case 'component': {
        component = formValues.component || '';

        break;
      }
      case 'iframe': {
        component = '#/layouts/iframe-view';

        break;
      }
      case 'link': {
        component = '#/layouts/external-link';

        break;
      }
      // No default
    }

    const data: SystemMenuApi.MenuCreateOrUpdateRequest = {
      id: formData.value?.id ? Number(formData.value.id) : undefined,
      name: formValues.name,
      service: formValues.service,
      type: formValues.type,
      state: formValues.state,
      path: formValues.path || '',
      component,
      permission: formValues.permission || '',
      description: formValues.description || '',
      parentId: formData.value?.parentId
        ? Number(formData.value.parentId)
        : null,
      meta: {
        title: formValues['meta.title'],
        icon: formValues['meta.icon'],
        order: formValues['meta.order'] || 0,
        hideInMenu: formValues['meta.hideInMenu'] || false,
        keepAlive: formValues['meta.keepAlive'] || false,
        // 添加 iframe 和 link 支持
        iframeSrc: formValues['meta.iframeSrc'] || undefined,
        link: formValues['meta.link'] || undefined,
        // 设置其他默认值
        affixTab: false,
        affixTabOrder: 0,
        hideInBreadcrumb: false,
        hideInTab: false,
        ignoreAccess: false,
        maxNumOfOpenTab: -1,
      },
    };

    try {
      await createOrUpdateMenu(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.menu.name')])
    : $t('ui.actionTitle.create', [$t('system.menu.name')]),
);
</script>

<template>
  <Modal :title="getTitle" width="800px">
    <Form class="mx-4" />
  </Modal>
</template>
