import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemDepartmentApi {
  /**
   * 部门信息
   */
  export interface DepartmentInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    deptName: string;
    deptCode: string;
    parentId?: null | number;
    sortOrder: number;
    leaderUserId?: string;
    leaderUsername?: string;
    leaderPhone?: string;
    leaderEmail?: string;
    state: boolean;
    description?: string;
    children?: DepartmentInfo[];
  }

  /**
   * 部门列表请求参数
   */
  export interface DepartmentListRequest extends PageRequest {
    deptName?: string;
    deptCode?: string;
    leaderUsername?: string;
    parentId?: number;
  }

  /**
   * 部门列表信息
   */
  export type DepartmentListInfo = BaseListInfo<DepartmentInfo>;
}

/**
 * 获取部门列表
 * @param data 查询参数
 */
export async function getDepartmentList(
  data: SystemDepartmentApi.DepartmentListRequest,
) {
  return requestClient.post<SystemDepartmentApi.DepartmentListInfo>(
    '/sys-api/department/list',
    data,
  );
}

/**
 * 创建或更新部门
 * @param data 部门信息
 */
export async function createOrUpdateDepartment(
  data: SystemDepartmentApi.DepartmentInfo,
) {
  return requestClient.post<SystemDepartmentApi.DepartmentInfo>(
    '/sys-api/department/createOrUpdate',
    data,
  );
}

/**
 * 删除部门
 * @param id 部门 ID
 */
export async function deleteDepartment(id: number) {
  return requestClient.post<any>('/sys-api/department/delete', {
    id,
  });
}

export {};
