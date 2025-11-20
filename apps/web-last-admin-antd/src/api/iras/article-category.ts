import type { BaseListInfo, PageRequest } from '../system/base';

import { requestClient } from '#/api/request';

export namespace IrasArticleCategoryApi {
  /**
   * 文章分类信息
   */
  export interface CategoryInfo {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    description?: string;
    parentId?: number;
    order: number;
    level: number;
    children?: CategoryInfo[];
  }

  /**
   * 文章分类列表请求参数
   */
  export interface CategoryListRequest extends PageRequest {
    name?: string;
    level?: number;
    parentId?: number;
  }

  /**
   * 文章分类列表信息
   */
  export type CategoryListInfo = BaseListInfo<CategoryInfo>;
}

/**
 * 获取文章分类列表
 * @param data 查询参数
 */
export async function getArticleCategoryList(
  data: IrasArticleCategoryApi.CategoryListRequest,
) {
  return requestClient.post<IrasArticleCategoryApi.CategoryListInfo>(
    '/iras-api/api/v1/article/categories/list',
    data,
  );
}

/**
 * 保存文章分类 (创建/更新)
 * @param data 文章分类信息
 */
export async function saveArticleCategory(
  data: IrasArticleCategoryApi.CategoryInfo,
) {
  return requestClient.post<IrasArticleCategoryApi.CategoryInfo>(
    '/iras-api/api/v1/article/categories/save',
    data,
  );
}

/**
 * 删除文章分类
 * @param id 文章分类 ID
 */
export async function deleteArticleCategory(id: number) {
  return requestClient.delete<any>(
    `/iras-api/api/v1/article/categories/${id}`,
    {
      data: { id },
    },
  );
}

export {};
