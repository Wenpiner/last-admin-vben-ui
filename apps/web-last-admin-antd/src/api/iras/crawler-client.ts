import type { BaseListInfo, PageRequest } from '../system/base';

import { requestClient } from '#/api/request';

export namespace IrasCrawlerClientApi {
  /**
   * 爬虫客户端信息
   */
  export interface ClientInfo {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    clientId: string;
    hostname: string;
    ip_address: string;
    port: number;
    status: string;
    max_concurrent_tasks: number;
    current_tasks: number;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_rx: number;
    network_tx: number;
    last_heartbeat: string;
    last_task_finished: string;
    total_tasks_completed: number;
    total_urls_processed: number;
    total_errors: number;
    version: string;
    capabilities: string;
    error_message: string;
    tags: string;
  }

  /**
   * 爬虫客户端列表请求参数
   */
  export interface ClientListRequest extends PageRequest {
    clientId?: string;
    status?: string;
  }

  /**
   * 爬虫客户端列表信息
   */
  export type ClientListInfo = BaseListInfo<ClientInfo>;

  /**
   * 创建或修改爬虫客户端请求参数
   */
  export interface CreateOrUpdateClientRequest {
    id?: number;
    clientId: string;
    name: string;
    hostname?: string;
    ip_address?: string;
    port?: number;
    max_concurrent_tasks: number;
    tags?: string;
  }
}

/**
 * 获取爬虫客户端列表
 * @param data 查询参数
 */
export async function getCrawlerClientList(
  data: IrasCrawlerClientApi.ClientListRequest,
) {
  return requestClient.post<IrasCrawlerClientApi.ClientListInfo>(
    '/iras-api/api/v1/crawler/clients/list',
    data,
  );
}

/**
 * 创建或修改爬虫客户端
 * @param data 爬虫客户端信息
 */
export async function createOrUpdateCrawlerClient(
  data: IrasCrawlerClientApi.CreateOrUpdateClientRequest,
) {
  return requestClient.post<IrasCrawlerClientApi.ClientInfo>(
    '/iras-api/api/v1/crawler/clients/modify',
    data,
  );
}

/**
 * 删除爬虫客户端
 * @param id 客户端 ID
 */
export async function deleteCrawlerClient(id: number) {
  return requestClient.delete<any>(
    `/iras-api/api/v1/crawler/clients/${id}`,
  );
}

export {};

