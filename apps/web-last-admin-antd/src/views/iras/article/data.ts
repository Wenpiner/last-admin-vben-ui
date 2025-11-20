import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { IrasArticleApi } from '#/api/iras/article';
import type { IrasArticleCategoryApi } from '#/api/iras/article-category';

import { $t } from '@vben/locales';

/**
 * 获取文章类型选项
 */
export function getArticleTypeOptions() {
  return [
    { label: $t('iras.article.typeNormal'), value: 'normal' },
    { label: $t('iras.article.typeWeekly'), value: 'weekly' },
  ];
}

/**
 * 获取文章状态选项
 */
export function getArticleStatusOptions() {
  return [
    {
      label: $t('iras.article.statusPublished'),
      value: 'published',
      color: 'green',
    },
    {
      label: $t('iras.article.statusUnpublished'),
      value: 'unpublished',
      color: 'orange',
    },
    { label: $t('iras.article.statusDraft'), value: 'draft', color: 'default' },
  ];
}

/**
 * 获取状态颜色映射
 */
export function getStatusColorMap() {
  const map: Record<string, string> = {};
  getArticleStatusOptions().forEach((option) => {
    map[option.value] = option.color;
  });
  return map;
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<IrasArticleApi.ArticleInfo>['columns'] {
  return [
    {
      type: 'checkbox',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      align: 'left',
      field: 'title',
      fixed: 'left',
      title: $t('iras.article.articleTitle'),
      minWidth: 250,
    },
    {
      field: 'status',
      title: $t('iras.article.status'),
      width: 100,
      align: 'center',
    },
    {
      field: 'type',
      title: $t('iras.article.type'),
      width: 100,
      align: 'center',
    },
    {
      field: 'categoryId',
      title: $t('iras.article.category'),
      width: 150,
      align: 'center',
    },
    {
      field: 'country',
      title: $t('iras.article.country'),
      width: 140,
      align: 'center',
    },
    {
      field: 'language',
      title: $t('iras.article.language'),
      width: 160,
      align: 'center',
    },
    {
      field: 'url',
      title: $t('iras.article.url'),
      width: 120,
      align: 'center',
    },
    {
      field: 'publishedAt',
      title: $t('iras.article.publishedAt'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}

/**
 * 搜索表单配置
 * @param statusOptions 状态选项列表
 * @param categoryOptions 分类选项列表
 */
export function useSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'title',
        label: $t('iras.article.articleTitle'),
      },
      {
        component: 'Select',
        componentProps: {
          placeholder: $t('iras.article.status'),
          allowClear: true,
          fieldNames: { label: 'label', value: 'value' },
        },
        fieldName: 'status',
        label: $t('iras.article.status'),
      },
      {
        component: 'Select',
        fieldName: 'country',
        label: $t('iras.article.country'),
        componentProps: {
          placeholder: $t('iras.article.country'),
          allowClear: true,
          fieldNames: { label: 'label', value: 'value' },
        },
      },
      {
        component: 'Input',
        fieldName: 'language',
        label: $t('iras.article.language'),
      },
      {
        component: 'TreeSelect',
        componentProps: {
          placeholder: $t('iras.article.category'),
          allowClear: true,
          fieldNames: {
            children: 'children',
            label: 'name',
            value: 'id',
          },
        },
        fieldName: 'categoryId',
        label: $t('iras.article.category'),
      },
      {
        component: 'Select',
        componentProps: {
          placeholder: $t('iras.article.type'),
          allowClear: true,
          fieldNames: { label: 'label', value: 'value' },
        },
        fieldName: 'type',
        label: $t('iras.article.type'),
      },
    ],
  };
}

// 辅助函数：构建树形结构
export function buildCategoryTree(
  list: IrasArticleCategoryApi.CategoryInfo[],
): IrasArticleCategoryApi.CategoryInfo[] {
  const map = new Map<number, IrasArticleCategoryApi.CategoryInfo>();
  const roots: IrasArticleCategoryApi.CategoryInfo[] = [];

  // 先将所有节点放入 map
  list.forEach((item) => {
    map.set(item.id as number, { ...item, children: [] });
  });

  // 构建树形结构
  list.forEach((item) => {
    const node = map.get(item.id as number);
    if (node) {
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}
