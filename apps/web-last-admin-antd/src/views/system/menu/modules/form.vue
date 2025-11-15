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
const treeData = ref<any[]>([]);

/**
 * 将菜单数据转换为树形结构，并添加 label 字段
 */
function transformMenuTreeData(menus: any[]): any[] {
  return menus.map((menu) => ({
    ...menu,
    label: menu.meta?.title || menu.name,
    children: menu.children ? transformMenuTreeData(menu.children) : undefined,
  }));
}

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
    label: $t('system.menu.menuName'),
    help: $t('system.menu.menuNameHelp'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.menu.name')]))
      .max(50, $t('ui.formRules.maxLength', [$t('system.menu.name'), 50]))
      .regex(/^[a-z0-9]+$/i),
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
  // 父级菜单
  {
    component: 'TreeSelect',
    componentProps: {
      allowClear: true,
      class: 'w-full',
      fieldNames: {
        children: 'children',
        label: 'label',
        value: 'id',
      },
      placeholder: $t('system.menu.parentMenu'),
      treeData,
      treeDefaultExpandAll: true,
    },
    fieldName: 'parentId',
    label: $t('system.menu.parentMenu'),
  },
  // 菜单标题
  {
    component: 'Input',
    fieldName: 'title',
    label: $t('system.menu.menuTitle'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('system.menu.menuTitle')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('system.menu.menuTitle'), 100]),
      ),
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
  // 菜单路径 - menu 和 directory 类型需要，但当菜单模式为外链时不显示
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        // 当菜单模式为外链时，不显示路由路径字段
        const isLinkMode = values.type === 'menu' && values.menuMode === 'link';
        return ['directory', 'menu'].includes(values.type) && !isLinkMode;
      },
      rules: (values) => {
        // 当菜单模式为外链时，路由路径不需要
        const isLinkMode = values.type === 'menu' && values.menuMode === 'link';

        if (!['directory', 'menu'].includes(values.type) || isLinkMode) {
          return null;
        }

        // 其他模式下，路由路径必填
        return z
          .string()
          .min(1, $t('ui.formRules.required', [$t('system.menu.path')]))
          .max(200, $t('ui.formRules.maxLength', [$t('system.menu.path'), 200]))
          .refine(
            (value: string) => value.startsWith('/'),
            $t('ui.formRules.startWith', [$t('system.menu.path'), '/']),
          );
      },
      triggerFields: ['type', 'menuMode'],
    },
    fieldName: 'path',
    label: $t('system.menu.path'),
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
    fieldName: 'iframeSrc',
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
    fieldName: 'link',
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
    fieldName: 'icon',
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
    fieldName: 'order',
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
    fieldName: 'hideInMenu',
    label: $t('system.menu.hideInMenu'),
  },
  // 是否缓存 - menu 类型且不是外链模式时显示
  {
    component: 'Switch',
    dependencies: {
      show: (values) => {
        // 菜单类型且不是外链模式时显示
        const isLinkMode = values.type === 'menu' && values.menuMode === 'link';
        return values.type === 'menu' && !isLinkMode;
      },
      triggerFields: ['type', 'menuMode'],
    },
    fieldName: 'keepAlive',
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
      const data = modalApi.getData<
        SystemMenuApi.SystemMenu & { menuTreeData?: SystemMenuApi.SystemMenu[] }
      >();
      // 从 setData 中获取菜单树数据，并转换为包含 label 字段的格式
      if (data?.menuTreeData) {
        treeData.value = transformMenuTreeData(data.menuTreeData);
      }
      if (data && Object.keys(data).length > 0 && data.id) {
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
            title: data.meta?.title || '',
            icon: data.meta?.icon || '',
            order: data.meta?.order || 0,
            hideInMenu: data.meta?.hideInMenu || false,
            keepAlive: data.meta?.keepAlive || false,
            iframeSrc: data.meta?.iframeSrc || '',
            link: data.meta?.link || '',
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
          order: 0,
          hideInMenu: false,
          keepAlive: false,
          iframeSrc: '',
          link: '',
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

    // 根据菜单类型和菜单模式清空不相关的字段
    let component = '';
    let path = '';
    let permission = '';
    let iframeSrc: string | undefined;
    let link: string | undefined;
    let title = '';
    let icon = '';
    let hideInMenu = false;
    let keepAlive = false;

    switch (formValues.type) {
      case 'button': {
        // 按钮类型：只保留 permission，清空其他所有字段
        permission = formValues.permission || '';
        component = '';
        path = '';
        iframeSrc = undefined;
        link = undefined;
        title = '';
        icon = '';
        hideInMenu = false;
        keepAlive = false;

        break;
      }
      case 'directory': {
        // 目录类型：保留 path 和 icon，清空 iframe、link 等
        path = formValues.path || '';
        title = formValues.title || '';
        icon = formValues.icon || '';
        hideInMenu = formValues.hideInMenu || false;
        component = '';
        iframeSrc = undefined;
        link = undefined;
        keepAlive = false;

        break;
      }
      case 'menu': {
        // 菜单类型
        title = formValues.title || '';
        icon = formValues.icon || '';
        hideInMenu = formValues.hideInMenu || false;
        keepAlive = formValues.keepAlive || false;

        switch (formValues.menuMode) {
          case 'component': {
            // 组件模式：保留 component 和 path，清空 iframe 和 link
            component = formValues.component || '';
            path = formValues.path || '';
            iframeSrc = undefined;
            link = undefined;
            break;
          }
          case 'iframe': {
            // IFrame 模式：设置 component 为 IFrameView，保留 iframeSrc，清空 link 和 path
            component = 'IFrameView';
            iframeSrc = formValues.iframeSrc || undefined;
            path = formValues.path || '';
            link = undefined;
            break;
          }
          case 'link': {
            // 外链模式：设置 component 为外链组件，保留 link，清空 path、iframe 和 keepAlive
            component = '#/layouts/external-link';
            link = formValues.link || undefined;
            path = '';
            iframeSrc = undefined;
            keepAlive = false;
            break;
          }
          // No default
        }

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
      path,
      component,
      permission,
      description: formValues.description || '',
      parentId: formValues.parentId ? Number(formValues.parentId) : null,
      meta: {
        title,
        icon,
        order: formValues.order || 0,
        hideInMenu,
        keepAlive,
        // 添加 iframe 和 link 支持
        iframeSrc,
        link,
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
