import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemApiApi {
  /**
   * API 信息
   */
  export interface ApiInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    name?: string;
    method: string;
    path: string;
    description?: string;
    isRequired: boolean;
    serviceName: string;
    apiGroup: string;
  }

  /**
   * API 列表请求参数
   */
  export interface ApiListRequest extends PageRequest {
    serviceName?: string;
    apiGroup?: string;
    method?: string;
    description?: string;
  }

  /**
   * API 列表信息
   */
  export type ApiListInfo = BaseListInfo<ApiInfo>;

  /**
   * API 列表响应
   */
  export interface ApiListResponse {
    code?: number;
    message?: string;
    data: ApiListInfo;
  }

  /**
   * 基础响应
   */
  export interface BaseResponse {
    code?: number;
    message?: string;
  }
}

/**
 * 获取API列表
 * @param params 查询参数
 */
export async function getApiList(data: SystemApiApi.ApiListRequest) {
  return requestClient.post<SystemApiApi.ApiListInfo>(
    '/sys-api/api/list',
    data,
  );
}

/**
 * 创建或更新API
 * @param data API信息
 */
export async function createOrUpdateApi(data: SystemApiApi.ApiInfo) {
  return requestClient.post<SystemApiApi.ApiInfo>(
    '/sys-api/api/createOrUpdate',
    data,
  );
}

/**
 * 删除API
 * @param id API ID
 */
export async function deleteApi(id: number) {
  return requestClient.post<SystemApiApi.BaseResponse>('/sys-api/api/delete', {
    id,
  });
}

/**
 * 获取所有API
 */
export async function getAllApis() {
  return requestClient.get<SystemApiApi.ApiInfo[]>('/sys-api/api/all');
}

export {};
