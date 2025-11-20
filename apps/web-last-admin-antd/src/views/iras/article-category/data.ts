import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { IrasArticleCategoryApi } from '#/api/iras/article-category';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 获取分类级别颜色映射
 */
export function getLevelColorMap() {
  return {
    1: 'blue', // 一级分类 - 蓝色
    2: 'green', // 二级分类 - 绿色
    3: 'orange', // 三级分类 - 橙色
    4: 'purple', // 四级分类 - 紫色
    5: 'cyan', // 五级分类 - 青色
    6: 'magenta', // 六级分类 - 品红
    7: 'volcano', // 七级分类 - 火山红
    8: 'gold', // 八级分类 - 金色
    9: 'lime', // 九级分类 - 青柠
    10: 'geekblue', // 十级分类 - 极客蓝
  };
}

/**
 * 表格列配置
 */
export function useColumns(): VxeTableGridOptions<IrasArticleCategoryApi.CategoryInfo>['columns'] {
  const levelColorMap = getLevelColorMap();

  return [
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: $t('iras.articleCategory.name'),
      treeNode: true,
      width: 280,
    },
    {
      align: 'center',
      field: 'level',
      title: $t('iras.articleCategory.level'),
      width: 120,
      slots: {
        default: ({ row }) => {
          const color =
            levelColorMap[row.level as keyof typeof levelColorMap] || 'default';
          return h(
            Tag,
            {
              color,
            },
            () => `${$t('iras.articleCategory.levelPrefix')} ${row.level}`,
          );
        },
      },
    },
    {
      field: 'order',
      title: $t('iras.articleCategory.order'),
      width: 100,
      align: 'center',
    },
    {
      field: 'description',
      title: $t('iras.articleCategory.description'),
      minWidth: 200,
    },
    {
      field: 'createdAt',
      title: $t('system.createdAt'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}

/**
 * 搜索表单配置
 */
export function useSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('iras.articleCategory.name'),
      },
      {
        component: 'InputNumber',
        componentProps: {
          class: 'w-full',
          min: 1,
          placeholder: $t('iras.articleCategory.level'),
        },
        fieldName: 'level',
        label: $t('iras.articleCategory.level'),
      },
    ],
  };
}
