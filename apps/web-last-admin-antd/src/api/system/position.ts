import type { PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemPositionApi {
  /**
   * 岗位信息
   */
  export interface PositionInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    positionName: string; // 岗位名称
    positionCode: string; // 岗位编码
    sortOrder: number; // 排序
    state: boolean; // 状态 (true=启用, false=禁用)
    description?: string; // 岗位描述
  }

  /**
   * 岗位列表请求参数
   */
  export interface PositionListRequest extends PageRequest {
    positionName?: string;
    positionCode?: string;
    state?: boolean;
  }

  /**
   * 岗位列表信息
   */
  export interface PositionListInfo {
    total: number;
    list: PositionInfo[];
  }
}

/**
 * 获取岗位列表
 * @param data 查询参数
 */
export async function getPositionList(
  data: SystemPositionApi.PositionListRequest,
) {
  const response = await requestClient.post<
    SystemPositionApi.PositionListInfo[]
  >('/sys-api/position/list', data);
  // API 返回的是数组格式，取第一个元素
  return response[0] || { total: 0, list: [] };
}

/**
 * 创建或更新岗位
 * @param data 岗位信息
 */
export async function createOrUpdatePosition(
  data: SystemPositionApi.PositionInfo,
) {
  return requestClient.post<SystemPositionApi.PositionInfo>(
    '/sys-api/position/createOrUpdate',
    data,
  );
}

/**
 * 删除岗位
 * @param id 岗位 ID
 */
export async function deletePosition(id: number) {
  return requestClient.post<any>('/sys-api/position/delete', {
    id,
  });
}

export {};
