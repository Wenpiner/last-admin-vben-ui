import type { BaseListInfo, PageRequest } from '../system/base';

import { requestClient } from '#/api/request';

export namespace IrasCrawlerTaskApi {
  /**
   * 爬虫任务信息
   */
  export interface TaskInfo {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    description?: string;
    status: string;
    priority: number;
    schedule?: string;
    lastRunAt?: string;
    nextRunAt?: string;
    lastCompletedAt?: string;
    workerId?: string;
    progress: number;
    totalUrls: number;
    fetchedUrls: number;
    successUrls: number;
    failedUrls: number;
    mongodbCollection: string;
    indexToEs: boolean;
    esIndexName?: string;
    parallelism: number;
    delayMs: number;
    randomDelayMs: number;
    timeoutSeconds: number;
    maxRequests: number;
    followRedirects: boolean;
    respectRobotsTxt: boolean;
    maxRetries: number;
    retryDelaySeconds: number;
    userAgent?: string;
    targetUrl: string;
    maxDepth: number;
    twoStageCrawling: boolean;
    listUrlPatterns?: string;
    articleLinkSelector?: string;
    articleUrlPatterns?: string;
    minLinksPerList: number;
    titleSelector: string;
    contentSelector: string;
    dateSelector?: string;
    dateFormat?: string;
    authorSelector?: string;
    tagsSelector?: string;
    summarySelector?: string;
    mainImageSelector?: string;
    categoryId: number;
    categoryInfo?: {
      id: number;
      name: string;
    };
    subCategoryId?: number;
    encoding: string;
    enabled: boolean;
    tags?: string;
    language: string;
    country: string;
    removeElements?: string;
  }

  /**
   * 爬虫任务列表请求参数
   */
  export interface TaskListRequest extends PageRequest {
    name?: string;
    targetUrl?: string;
    status?: string;
    categoryId?: number;
    tags?: string;
    enabled?: boolean;
  }

  /**
   * 爬虫任务列表信息
   */
  export type TaskListInfo = BaseListInfo<TaskInfo>;
}

/**
 * 获取爬虫任务列表
 * @param data 查询参数
 */
export async function getCrawlerTaskList(
  data: IrasCrawlerTaskApi.TaskListRequest,
) {
  return requestClient.post<IrasCrawlerTaskApi.TaskListInfo>(
    '/iras-api/api/v1/crawler/tasks/list',
    data,
  );
}

/**
 * 保存爬虫任务 (创建/更新)
 * @param data 爬虫任务信息
 */
export async function saveCrawlerTask(data: IrasCrawlerTaskApi.TaskInfo) {
  return requestClient.post<IrasCrawlerTaskApi.TaskInfo>(
    '/iras-api/api/v1/crawler/tasks/save',
    data,
  );
}

/**
 * 删除爬虫任务
 * @param id 爬虫任务 ID
 */
export async function deleteCrawlerTask(id: number) {
  return requestClient.delete<any>(`/iras-api/api/v1/crawler/tasks/${id}`, {
    data: { id },
  });
}

export {};
