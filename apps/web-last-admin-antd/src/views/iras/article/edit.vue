<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { IrasArticleApi } from '#/api/iras/article';
import type { SystemDictApi } from '#/api/system/dict';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { ArrowLeft, Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, Card, message, Upload } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm, z } from '#/adapter/form';
import { getArticleInfo, saveArticle, uploadImage } from '#/api/iras/article';
import { getArticleCategoryList } from '#/api/iras/article-category';
import { getDictListByIdOrCode } from '#/api/system/dict';
import WangEditor from '#/components/editor/wang-editor.vue';

import { buildCategoryTree } from './data';

const route = useRoute();
const router = useRouter();

const articleId = computed(() => route.query.id as string | undefined);
const isEdit = computed(() => !!articleId.value);
const pageTitle = computed(() =>
  isEdit.value
    ? $t('iras.article.editArticle')
    : $t('iras.article.createArticle'),
);

const loading = ref(false);
const coverImageUrl = ref<string>('');
const uploadLoading = ref(false);

// 摘要
const summary = ref<string>('');

// 富文本编辑器内容
const rawHTMLContent = ref<string>('');

// 字典数据
const statusOptions = ref<SystemDictApi.DictItemInfo[]>([]);
const articleTypeOptions = ref<SystemDictApi.DictItemInfo[]>([]);
const countryOptions = ref<SystemDictApi.DictItemInfo[]>([]);
const languageOptions = ref<SystemDictApi.DictItemInfo[]>([]);

// 表单Schema
const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    componentProps: {
      class: 'col-span-2',
    },
    fieldName: 'title',
    label: $t('iras.article.articleTitle'),
    defaultValue: '',
    rules: z
      .string()
      .min(1, $t('ui.formRules.required', [$t('iras.article.articleTitle')]))
      .max(
        200,
        $t('ui.formRules.maxLength', [$t('iras.article.articleTitle'), 200]),
      ),
  },
  {
    component: 'Input',
    fieldName: 'author',
    label: $t('iras.article.author'),
    defaultValue: '',
    rules: z
      .string()
      .max(100, $t('ui.formRules.maxLength', [$t('iras.article.author'), 100]))
      .nullable()
      .optional(),
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      class: 'w-full',
      api: async () => {
        const result = await getArticleCategoryList({
          page: { currentPage: 1, pageSize: 1000 },
        });
        // 构建树形结构
        return buildCategoryTree(result.list);
      },
      fieldNames: {
        children: 'children',
        label: 'name',
        value: 'id',
      },
      placeholder: $t('ui.placeholder.select', [$t('iras.article.categoryId')]),
      allowClear: false,
      treeDefaultExpandAll: true,
      onChange: (_value: number, _label: any, extra: any) => {
        // 获取选中节点
        const selectedNode = extra.triggerNode?.props?.dataRef;
        if (selectedNode?.id) {
          // 设置 categoryLastId 为选中的节点ID
          formApi.setFieldValue('categoryLastId', selectedNode.id);
        }
      },
    },
    fieldName: 'categoryId',
    label: $t('iras.article.categoryId'),
    rules: z
      .number()
      .min(
        1,
        $t('ui.formRules.selectRequired', [$t('iras.article.categoryId')]),
      ),
  },
  {
    component: 'Input',
    componentProps: {
      style: { display: 'none' },
    },
    fieldName: 'categoryLastId',
    label: '',
    formItemClass: 'hidden',
    defaultValue: null,
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      placeholder: $t('ui.placeholder.select', [$t('iras.article.type')]),
      allowClear: true,
      options: articleTypeOptions,
      fieldNames: {
        label: 'label',
        value: 'value',
      },
    },
    fieldName: 'type',
    label: $t('iras.article.type'),
    defaultValue: '',
  },
  {
    component: 'Select',
    componentProps: {
      mode: 'tags',
      placeholder: $t('iras.article.tagsPlaceholder'),
      tokenSeparators: [',', ' '],
      class: 'w-full',
    },
    fieldName: 'tags',
    label: $t('iras.article.tags'),
    defaultValue: [],
  },
  {
    component: 'Input',
    fieldName: 'url',
    label: $t('iras.article.url'),
    defaultValue: '',
    rules: z
      .string()
      .max(500, $t('ui.formRules.maxLength', [$t('iras.article.url'), 500]))
      .nullable()
      .optional(),
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      placeholder: $t('iras.article.readCount'),
    },
    fieldName: 'readCount',
    label: $t('iras.article.readCount'),
    defaultValue: 0,
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      placeholder: $t('ui.placeholder.select', [$t('iras.article.country')]),
      allowClear: true,
      options: countryOptions,
      fieldNames: {
        label: 'label',
        value: 'value',
      },
    },
    fieldName: 'country',
    label: $t('iras.article.country'),
    defaultValue: '',
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      placeholder: $t('ui.placeholder.select', [$t('iras.article.language')]),
      allowClear: true,
      options: languageOptions,
      fieldNames: {
        label: 'label',
        value: 'value',
      },
    },
    fieldName: 'language',
    label: $t('iras.article.language'),
    defaultValue: '',
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      placeholder: $t('ui.placeholder.select', [$t('iras.article.status')]),
      allowClear: true,
      options: statusOptions,
      fieldNames: {
        label: 'label',
        value: 'value',
      },
    },
    fieldName: 'status',
    label: $t('iras.article.status'),
    defaultValue: '',
  },
  {
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: $t('iras.article.publishedAt'),
    },
    fieldName: 'publishedAt',
    label: $t('iras.article.publishedAt'),
    defaultValue: null,
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4',
  layout: 'vertical',
});

// 加载文章数据
async function loadArticle() {
  if (!articleId.value) return;

  loading.value = true;
  try {
    const article = await getArticleInfo(articleId.value);

    if (article) {
      // 处理时间格式 - 将 ISO 格式转换为 dayjs 对象
      const formData = { ...article };
      if (formData.publishedAt) {
        formData.publishedAt = dayjs(formData.publishedAt) as any;
      }

      // 如果 categoryLastId 不存在，则使用 categoryId
      if (!formData.categoryLastId && formData.categoryId) {
        formData.categoryLastId = formData.categoryId;
      }

      // 设置表单值（不要 await，让它异步执行）
      formApi.setValues(formData);
      if (article.cover) {
        coverImageUrl.value = article.cover;
      }
      // 加载摘要
      if (article.summary) {
        summary.value = article.summary;
      }
      // 加载富文本编辑器内容
      if (article.rawHTML) {
        rawHTMLContent.value = article.rawHTML;
      }
    }
  } catch (error) {
    console.error('加载文章失败:', error);
    message.error($t('iras.article.saveFailed'));
  } finally {
    loading.value = false;
  }
}

// 保存文章
async function onSave() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // 直接使用 form.values，自己做浅拷贝
    const values = { ...formApi.form.values };

    console.warn('表单值:', values);

    // 添加封面图片URL
    values.cover = coverImageUrl.value || '';

    // 添加摘要
    values.summary = summary.value || '';

    // 添加富文本编辑器内容
    values.rawHTML = rawHTMLContent.value || '';

    // categoryLastId 应该已经在 values 中了（通过隐藏字段）
    // 如果没有，则使用 categoryId
    if (!values.categoryLastId && values.categoryId) {
      values.categoryLastId = values.categoryId;
    }

    // 删除 categoryId，只提交 categoryLastId
    const { categoryId: _categoryId, ...submitData } = values;

    // 处理时间格式 - 将 dayjs 对象转换为 ISO 格式字符串
    if (submitData.publishedAt && dayjs.isDayjs(submitData.publishedAt)) {
      submitData.publishedAt = (submitData.publishedAt as any).toISOString();
    }

    // 遍历零值，将其转换为 null
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '') {
        submitData[key] = undefined;
      }
    });

    // 如果是编辑模式，添加ID
    if (articleId.value) {
      submitData.id = articleId.value;
    }

    console.warn('准备提交的数据:', submitData);

    await saveArticle(submitData as IrasArticleApi.ArticleInfo);
    message.success($t('iras.article.saveSuccess'));
    router.push('/iras/article');
  } catch (error) {
    console.error('保存文章失败:', error);
    message.error($t('iras.article.saveFailed'));
  } finally {
    loading.value = false;
  }
}

// 返回列表
function onBack() {
  router.push({
    name: 'Article',
  });
}

// 图片上传
async function handleUpload(file: File) {
  uploadLoading.value = true;
  try {
    const response = await uploadImage(file);
    // 检查响应码
    if (response.code === 0 || response.code === 200) {
      coverImageUrl.value = response.data;
      message.success('上传成功');
    } else {
      message.error(response.message || '上传失败');
    }
    return false; // 阻止默认上传行为
  } catch (error) {
    console.error('上传图片失败:', error);
    message.error('上传失败');
    return false;
  } finally {
    uploadLoading.value = false;
  }
}

// 加载国家字典
async function loadCountryDict() {
  try {
    const items = await getDictListByIdOrCode('country');
    countryOptions.value = items;
  } catch (error) {
    console.error('加载国家字典失败:', error);
  }
}

// 加载语言字典（从国家字典的 css 字段获取）
async function loadLanguageDict() {
  try {
    const items = await getDictListByIdOrCode('country');
    const languageItems = items
      .filter((item) => item.css)
      .map((item) => ({
        label: `(${item.css}) - ${item.label}`,
        value: item.css!,
      }));
    languageOptions.value = languageItems as any;
  } catch (error) {
    console.error('加载语言字典失败:', error);
  }
}

// 加载状态字典
async function loadStatusDict() {
  try {
    const items = await getDictListByIdOrCode('article-status');
    statusOptions.value = items;
  } catch (error) {
    console.error('加载状态字典失败:', error);
  }
}

// 加载文章类型字典
async function loadArticleTypeDict() {
  try {
    const items = await getDictListByIdOrCode('article-type');
    articleTypeOptions.value = items;
  } catch (error) {
    console.error('加载文章类型字典失败:', error);
  }
}

onMounted(() => {
  // 异步加载字典数据（不阻塞页面）
  loadCountryDict();
  loadLanguageDict();
  loadStatusDict();
  loadArticleTypeDict();

  // 加载文章数据（会显示 loading）
  loadArticle();
});
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <!-- 页面标题和操作按钮 -->
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold">{{ pageTitle }}</h2>
        <div class="flex gap-2">
          <Button @click="onBack">
            <ArrowLeft class="size-4" />
            {{ $t('iras.article.backToList') }}
          </Button>
          <Button type="primary" :loading="loading" @click="onSave">
            {{ $t('common.confirm') }}
          </Button>
        </div>
      </div>

      <!-- 表单内容 -->
      <Card :loading="loading">
        <Form />

        <!-- 封面图片上传 -->
        <div class="mt-4">
          <div class="mb-2 text-sm font-medium">
            {{ $t('iras.article.cover') }}
          </div>
          <Upload
            :before-upload="handleUpload"
            :show-upload-list="false"
            accept="image/*"
            list-type="picture-card"
          >
            <div v-if="coverImageUrl" class="relative">
              <img
                :src="coverImageUrl"
                alt="cover"
                class="h-full w-full object-cover"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100"
              >
                <span class="text-white">{{
                  $t('iras.article.coverUpload')
                }}</span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center">
              <Plus class="size-8 text-gray-400" />
              <div class="mt-2 text-sm text-gray-500">
                {{ $t('iras.article.coverUpload') }}
              </div>
            </div>
          </Upload>
        </div>

        <!-- 摘要 -->
        <div class="mt-6">
          <div class="mb-2 text-sm font-medium">
            {{ $t('iras.article.summary') }}
          </div>
          <textarea
            v-model="summary"
            :placeholder="$t('iras.article.summary')"
            rows="3"
            class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <!-- 内容编辑器 -->
        <div class="mt-6">
          <div class="mb-2 text-sm font-medium">
            {{ $t('iras.article.content') }}
          </div>
          <WangEditor v-model="rawHTMLContent" :height="400" />
        </div>
      </Card>
    </div>
  </Page>
</template>
