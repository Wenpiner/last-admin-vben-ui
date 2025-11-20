<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { IrasArticleCategoryApi } from '#/api/iras/article-category';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteArticleCategory,
  getArticleCategoryList,
} from '#/api/iras/article-category';
import TableAction from '#/components/table/table-action/table-action.vue';

import { useColumns, useSearchFormSchemas } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [...(useSearchFormSchemas().schema as any)],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
  // class 样式
  wrapperClass:
    'gap-x-2 flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
};

/**
 * 检查是否有子分类
 */
function hasChildren(
  row: IrasArticleCategoryApi.CategoryInfo,
  allData: IrasArticleCategoryApi.CategoryInfo[],
): boolean {
  return allData.some((item) => item.parentId === row.id);
}

const gridOptions: VxeTableGridOptions<IrasArticleCategoryApi.CategoryInfo> = {
  columns: [
    ...(useColumns() as any),
    {
      field: 'action',
      title: $t('system.action'),
      fixed: 'right',
      width: 200,
      align: 'center',
      slots: {
        default: ({ row }) => {
          return h(TableAction, {
            align: 'center',
            actions: [
              {
                type: 'link',
                label: $t('system.operation.edit'),
                onClick: () => {
                  onEdit(row);
                },
              },
              {
                type: 'link',
                label: $t('iras.articleCategory.addChild'),
                onClick: () => {
                  onAddChild(row);
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
    enabled: true, // 禁用分页，加载所有数据
    pageSize: 100,
    pageSizes: [
      { value: 100, label: '100条/页' },
      { value: 200, label: '200条/页' },
      { value: 500, label: '500条/页' },
      { value: 1000, label: '1000条/页' },
    ],
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getArticleCategoryList({
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
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
    expandAll: true,
    accordion: false,
    showLine: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function onRefresh() {
  gridApi.query();
}

function onEdit(row: IrasArticleCategoryApi.CategoryInfo) {
  // 获取完整的分类列表数据
  const categoryList = gridApi.grid.getTableData()
    .fullData as IrasArticleCategoryApi.CategoryInfo[];

  formModalApi
    .setData({
      formData: row,
      categoryList,
    })
    .open();
}

function onCreate() {
  // 获取完整的分类列表数据
  const categoryList = gridApi.grid.getTableData()
    .fullData as IrasArticleCategoryApi.CategoryInfo[];

  formModalApi
    .setData({
      categoryList,
    })
    .open();
}

function onAddChild(row: IrasArticleCategoryApi.CategoryInfo) {
  // 获取完整的分类列表数据
  const categoryList = gridApi.grid.getTableData()
    .fullData as IrasArticleCategoryApi.CategoryInfo[];

  formModalApi
    .setData({
      formData: {
        parentId: row.id, // 设置父级ID为当前行的ID
      },
      categoryList,
    })
    .open();
}

async function onDelete(row: IrasArticleCategoryApi.CategoryInfo) {
  if (!row.id) return;

  // 获取当前所有数据来检查是否有子分类
  const currentData = gridApi.grid.getTableData()
    .fullData as IrasArticleCategoryApi.CategoryInfo[];

  // 检查是否有子分类
  if (hasChildren(row, currentData)) {
    message.error($t('iras.articleCategory.hasChildrenCannotDelete'));
    return;
  }

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteArticleCategory(row.id);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch (error) {
    hideLoading();
    console.error('删除文章分类失败:', error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('iras.articleCategory.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
