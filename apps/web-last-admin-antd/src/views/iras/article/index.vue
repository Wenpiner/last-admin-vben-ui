<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { IrasArticleApi } from '#/api/iras/article';
import type { IrasArticleCategoryApi } from '#/api/iras/article-category';
import type { SystemDictApi } from '#/api/system/dict';

import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Plus, Wand2 } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message, Modal, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  aiFormatArticle,
  deleteArticle,
  getArticleList,
} from '#/api/iras/article';
import { getArticleCategoryList } from '#/api/iras/article-category';
import { getDictListByIdOrCode } from '#/api/system/dict';
import TableAction from '#/components/table/table-action/table-action.vue';

import { buildCategoryTree, useColumns, useSearchFormSchemas } from './data';

const router = useRouter();

// 分类映射和选项
const categoryMap = ref<Record<number, IrasArticleCategoryApi.CategoryInfo>>(
  {},
);
// 状态映射
const statusMap = ref<Record<string, SystemDictApi.DictItemInfo>>({});
// 文章类型
const articleTypeMap = ref<Record<string, SystemDictApi.DictItemInfo>>({});
// 国家
const countryMap = ref<Record<string, SystemDictApi.DictItemInfo>>({});
// 语言
const languageMap = ref<Record<string, SystemDictApi.DictItemInfo>>({});
// 加载分类数据
async function loadCategories() {
  try {
    const result = await getArticleCategoryList({
      page: { currentPage: 1, pageSize: 1000 },
    });

    // 构建分类映射和选项（只取第一级分类）
    const map: Record<number, IrasArticleCategoryApi.CategoryInfo> = {};

    result.list.forEach((category) => {
      map[category.id!] = category;
    });
    const tree = buildCategoryTree(result.list);

    categoryMap.value = map;
    gridApi.formApi.updateSchema([
      {
        componentProps: {
          treeData: tree,
        },
        fieldName: 'categoryId',
      },
    ]);
  } catch (error) {
    console.error('加载分类失败:', error);
  }
}

// 加载国家字典
async function loadCountryDict() {
  try {
    const items = await getDictListByIdOrCode('country');
    const map: Record<string, SystemDictApi.DictItemInfo> = {};
    const lMap: Record<string, SystemDictApi.DictItemInfo> = {};
    items.forEach((item) => {
      map[item.value] = item;
      if (item.css) {
        lMap[item.css] = item;
      }
    });
    countryMap.value = map;
    languageMap.value = lMap;

    gridApi.formApi.updateSchema([
      {
        componentProps: {
          options: items,
        },
        fieldName: 'country',
      },
    ]);
  } catch (error) {
    console.error('加载国家字典失败:', error);
  }
}

// 加载状态字典
async function loadStatusDict() {
  try {
    // 先通过code获取字典
    const items = await getDictListByIdOrCode('article-status');
    const map: Record<string, SystemDictApi.DictItemInfo> = {};
    items.forEach((item) => {
      map[item.value] = item;
    });
    statusMap.value = map;

    gridApi.formApi.updateSchema([
      {
        componentProps: {
          options: items,
        },
        fieldName: 'status',
      },
    ]);
  } catch (error) {
    console.error('加载状态字典失败:', error);
  }
}

// 加载文章类型字典
async function loadArticleTypeDict() {
  try {
    const items = await getDictListByIdOrCode('article-type');
    const map: Record<string, SystemDictApi.DictItemInfo> = {};
    items.forEach((item) => {
      map[item.value] = item;
    });
    articleTypeMap.value = map;

    gridApi.formApi.updateSchema([
      {
        componentProps: {
          options: items,
        },
        fieldName: 'type',
      },
    ]);
  } catch (error) {
    console.error('加载文章类型字典失败:', error);
  }
}

// 初始化数据
onMounted(async () => {
  Promise.all([
    loadCategories(),
    loadCountryDict(),
    loadStatusDict(),
    loadArticleTypeDict(),
  ]).then();
});

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [...(useSearchFormSchemas().schema as any)],
  showCollapseButton: true,
  submitOnEnter: false,
  wrapperClass:
    'gap-x-2 flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
};

const gridOptions: VxeTableGridOptions<IrasArticleApi.ArticleInfo> = {
  columns: [
    ...(useColumns() as any).map((col: any) => {
      // 为需要自定义渲染的列指定 slots 名称
      if (col.field === 'status') {
        return { ...col, slots: { default: 'status' } };
      }
      if (col.field === 'categoryId') {
        return { ...col, slots: { default: 'category' } };
      }
      if (col.field === 'country') {
        return { ...col, slots: { default: 'country' } };
      }
      if (col.field === 'type') {
        return { ...col, slots: { default: 'type' } };
      }
      if (col.field === 'url') {
        return { ...col, slots: { default: 'url' } };
      }
      // 语言
      if (col.field === 'language') {
        return { ...col, slots: { default: 'language' } };
      }
      return col;
    }),
    {
      field: 'action',
      title: $t('system.action'),
      width: 150,
      align: 'center',
      fixed: 'right',
      slots: {
        default: ({ row }) => {
          return h(TableAction, {
            align: 'center',
            actions: [
              {
                type: 'link',
                label: $t('system.operation.edit'),
                icon: 'lucide:edit',
                onClick: () => {
                  onEdit(row);
                },
              },
              {
                type: 'link',
                color: 'error',
                label: $t('system.operation.delete'),
                popConfirm: {
                  title: $t('system.tableAction.deleteConfirm'),
                  confirm: () => {
                    onDelete(row);
                  },
                },
              },
            ],
          });
        },
      },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getArticleList({
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

function onEdit(row: IrasArticleApi.ArticleInfo) {
  router.push({
    path: '/iras/article/edit',
    query: { id: row.id },
  });
}

function onCreate() {
  router.push('/iras/article/edit');
}

async function onDelete(row: IrasArticleApi.ArticleInfo) {
  if (!row.id) return;

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.title]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteArticle(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.title]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除文章失败:', error);
  }
}

async function onAIFormat() {
  const selectedRows =
    gridApi.grid?.getCheckboxRecords() as IrasArticleApi.ArticleInfo[];

  if (!selectedRows || selectedRows.length === 0) {
    message.warning($t('iras.article.selectArticles'));
    return;
  }

  Modal.confirm({
    title: $t('iras.article.aiFormat'),
    content: $t('iras.article.aiFormatConfirm', [selectedRows.length]),
    onOk: async () => {
      const hideLoading = message.loading({
        content: $t('iras.article.aiFormat'),
        duration: 0,
        key: 'ai_format_msg',
      });

      try {
        const ids = selectedRows.map((row) => row.id!);
        await aiFormatArticle({ ids });
        message.success({
          content: $t('iras.article.aiFormatSuccess'),
          key: 'ai_format_msg',
        });
        onRefresh();
      } catch (error) {
        hideLoading();
        message.error($t('iras.article.aiFormatFailed'));
        console.error('AI格式化失败:', error);
      }
    },
  });
}

// 分割分类，然后返回
const onSplitCategory = (ids?: string) => {
  if (!ids) return '-';
  let str = '';
  // 开始分割
  ids.split('.').forEach((id) => {
    const key = Number(id) || 0;
    if (id && categoryMap.value[key]) {
      str += `${categoryMap.value[key].name}>`;
    }
  });
  return str;
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <div class="flex gap-2">
          <Button type="primary" @click="onCreate">
            <Plus class="size-5" />
            {{ $t('ui.actionTitle.create', [$t('iras.article.name')]) }}
          </Button>
          <Button type="default" @click="onAIFormat">
            <Wand2 class="size-5" />
            {{ $t('iras.article.aiFormatSelected') }}
          </Button>
        </div>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <Tag
          v-if="row.status && statusMap[row.status]"
          :color="statusMap[row.status]?.color || 'default'"
        >
          {{ statusMap[row.status]?.label || row.status }}
        </Tag>
        <span v-else-if="row.status">{{ row.status }}</span>
        <span v-else>-</span>
      </template>

      <!-- 分类列 -->
      <template #category="{ row }">
        {{ onSplitCategory(row.categoryPathIds) || '-' }}
      </template>

      <!-- 国家列 -->
      <template #country="{ row }">
        {{ countryMap[row.country]?.label || row.country }}
      </template>

      <!-- 类型列 -->
      <template #type="{ row }">
        {{ articleTypeMap[row.type]?.label || row.type }}
      </template>
      <!-- 语言列 -->
      <template #language="{ row }">
        <template v-if="row.language">
          {{ `(${row.language}) - ${languageMap[row.language]?.label}` }}
        </template>
        <span v-else>未知</span>
      </template>
      <!-- 原文链接列 -->
      <template #url="{ row }">
        <a
          v-if="row.url"
          :href="row.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800"
        >
          {{ $t('iras.article.viewOriginal') }}
        </a>
        <span v-else>-</span>
      </template>
    </Grid>
  </Page>
</template>
