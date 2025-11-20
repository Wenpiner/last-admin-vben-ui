<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { IrasArticleCategoryApi } from '#/api/iras/article-category';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { saveArticleCategory } from '#/api/iras/article-category';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<IrasArticleCategoryApi.CategoryInfo>();
const categoryList = ref<IrasArticleCategoryApi.CategoryInfo[]>([]);

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('iras.articleCategory.name'),
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.articleCategory.name')]))
      .max(
        100,
        $t('ui.formRules.maxLength', [$t('iras.articleCategory.name'), 100]),
      ),
  },
  {
    component: 'TreeSelect',
    componentProps: {
      class: 'w-full',
      allowClear: true,
      treeData: categoryList,
      fieldNames: {
        children: 'children',
        label: 'name',
        value: 'id',
      },
      placeholder: $t('iras.articleCategory.parentCategory'),
      treeDefaultExpandAll: true,
    },
    fieldName: 'parentId',
    help: '如果不填写则默认为顶级分类',
    label: $t('iras.articleCategory.parentCategory'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 9999,
      placeholder: $t('iras.articleCategory.order'),
    },
    fieldName: 'order',
    label: $t('iras.articleCategory.order'),
    rules: z
      .number()
      .min(0, $t('ui.formRules.min', [$t('iras.articleCategory.order'), 0]))
      .max(
        9999,
        $t('ui.formRules.max', [$t('iras.articleCategory.order'), 9999]),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
    },
    fieldName: 'description',
    label: $t('iras.articleCategory.description'),
    rules: z
      .string()
      .max(
        500,
        $t('ui.formRules.maxLength', [
          $t('iras.articleCategory.description'),
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

const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<{
        categoryList: IrasArticleCategoryApi.CategoryInfo[];
        formData?: IrasArticleCategoryApi.CategoryInfo;
      }>();

      // 更新分类列表数据
      if (data?.categoryList) {
        categoryList.value = data.categoryList;
      }

      if (data?.formData) {
        formData.value = data.formData;
        // 设置完整的表单数据
        formApi.setValues(
          {
            ...formData.value,
            // 如果有 parentId 则保留，否则设为 undefined
            parentId: formData.value.parentId || undefined,
          },
          false,
        );
      } else {
        formApi.resetForm();
        // 设置默认值
        formApi.setValues({
          order: 0,
        });
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = await formApi.getValues<IrasArticleCategoryApi.CategoryInfo>();
    try {
      // 处理 parentId，如果为空则设为 null
      const submitData = {
        ...data,
        parentId: data.parentId || null,
      } as IrasArticleCategoryApi.CategoryInfo;
      await saveArticleCategory(submitData);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  }
}

const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('iras.articleCategory.name')])
    : $t('ui.actionTitle.create', [$t('iras.articleCategory.name')]),
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
