import type { PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  /**
   * 角色信息
   */
  export interface RoleInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    roleName: string;
    roleCode: string;
    description?: string;
    state: boolean;
  }

  /**
   * 角色列表请求参数
   */
  export interface RoleListRequest extends PageRequest {
    roleName?: string;
    roleCode?: string;
    state?: boolean;
  }

  /**
   * 角色列表信息
   */
  export interface RoleListInfo {
    total: number;
    list: RoleInfo[];
  }
}

/**
 * 获取角色列表
 * @param data 查询参数
 */
export async function getRoleList(data: SystemRoleApi.RoleListRequest) {
  return requestClient.post<SystemRoleApi.RoleListInfo>(
    '/sys-api/role/list',
    data,
  );
}

/**
 * 创建或更新角色
 * @param data 角色信息
 */
export async function createOrUpdateRole(data: SystemRoleApi.RoleInfo) {
  return requestClient.post<SystemRoleApi.RoleInfo>(
    '/sys-api/role/createOrUpdate',
    data,
  );
}

/**
 * 删除角色
 * @param id 角色 ID
 */
export async function deleteRole(id: number) {
  return requestClient.post<any>('/sys-api/role/delete', {
    id,
  });
}

/**
 * 获取角色菜单
 * @param value 角色 ID 或角色编码
 */
export async function getRoleMenu(value: string) {
  return requestClient.post<any>('/sys-api/role/get/menu', {
    id: value,
  });
}

/**
 * 为角色分配菜单
 * @param data 角色菜单分配信息
 * @param data.roleId 角色ID
 * @param data.menuIds 菜单ID数组
 */
export async function assignMenuToRole(data: {
  menuIds: number[];
  roleId: number;
}) {
  return requestClient.post<any>('/sys-api/role/assign/menu', data);
}

/**
 * 获取角色API权限
 * @param value 角色编码
 */
export async function getRoleApi(value: string) {
  return requestClient.post<null | string[] | undefined>(
    '/sys-api/role/get/api',
    {
      id: value,
    },
  );
}

/**
 * 为角色分配API权限
 * @param data 角色API分配信息
 * @param data.roleId 角色ID
 * @param data.apiIds API ID数组
 */
export async function assignApiToRole(data: {
  apiIds: number[];
  roleId: number;
}) {
  return requestClient.post<any>('/sys-api/role/assign/api', data);
}

export {};
