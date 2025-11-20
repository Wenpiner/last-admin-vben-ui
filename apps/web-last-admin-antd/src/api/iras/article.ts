import type { BaseListInfo, PageRequest } from '../system/base';

import { requestClient } from '#/api/request';

export namespace IrasArticleApi {
  /**
   * 文章信息
   */
  export interface ArticleInfo {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    title: string;
    summary?: string; // 摘要
    author?: string;
    content?: string;
    markdown?: string;
    rawHTML?: string;
    categoryId: number;
    categoryLastId?: number; // 最后一级分类ID
    tags: string[];
    type: string; // 文章类型
    country: string; // 国家
    language: string; // 语言
    cover: string; // 封面图片
    url: string; // URL
    publishedAt: string; // 发布时间
    status?: string; // 状态 (published/unpublished/draft)
    categoryPathIds?: string;
  }

  /**
   * 文章列表请求参数
   */
  export interface ArticleListRequest extends PageRequest {
    title?: string;
    type?: string;
    categoryId?: number;
    status?: string;
    country?: string;
    language?: string;
  }

  /**
   * 文章列表信息
   */
  export type ArticleListInfo = BaseListInfo<ArticleInfo>;

  /**
   * AI格式化请求参数
   */
  export interface AIFormatRequest {
    ids: string[];
  }

  /**
   * 图片上传响应
   */
  export interface UploadImageResponse {
    code: number;
    data: string; // 图片URL
    message: string;
  }
}

/**
 * 获取文章列表
 * @param data 查询参数
 */
export async function getArticleList(data: IrasArticleApi.ArticleListRequest) {
  return requestClient.post<IrasArticleApi.ArticleListInfo>(
    '/iras-api/api/v1/article/list',
    data,
  );
}

/**
 * 保存文章 (创建/更新)
 * @param data 文章信息
 */
export async function saveArticle(data: IrasArticleApi.ArticleInfo) {
  return requestClient.post<IrasArticleApi.ArticleInfo>(
    '/iras-api/api/v1/article/save',
    data,
  );
}

/**
 * 删除文章
 * @param id 文章 ID
 */
export async function deleteArticle(id: string) {
  return requestClient.delete<any>(`/iras-api/api/v1/article/${id}`);
}

/**
 * 使用AI格式化文章
 * @param data AI格式化请求参数
 */
export async function aiFormatArticle(data: IrasArticleApi.AIFormatRequest) {
  return requestClient.post<{ code: number; data: string; message: string }>(
    '/iras-api/api/v1/article/ai/format',
    data,
  );
}

/**
 * 获取文章详情
 * @param id 文章 ID
 */
export async function getArticleInfo(id: string) {
  return requestClient.get<IrasArticleApi.ArticleInfo>(
    `/iras-api/api/v1/article/info?id=${id}`,
  );
}

/**
 * 上传图片
 * @param file 图片文件
 */
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  return requestClient.post<IrasArticleApi.UploadImageResponse>(
    '/iras-api/api/v1/upload/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export {};
