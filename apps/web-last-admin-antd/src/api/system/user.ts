import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  /**
   * TOTP信息
   */
  export interface TotpInfo {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    state?: boolean;
    isVerified?: boolean;
    lastUsedAt?: number;
    lastUsedCode?: string;
    deviceName?: string;
    issuer?: string;
  }

  /**
   * 用户信息
   */
  export interface UserInfo {
    userId?: string;
    username: string;
    realName?: string;
    email?: string;
    mobile?: string;
    avatar?: string;
    departmentId?: number;
    departmentName?: string;
    desc?: string;
    homePath?: string;
    lastLoginAt?: number;
    lastLoginIp?: string;
    positionIds?: number[];
    positionNames?: string[];
    roleIds?: number[];
    roleNames?: string[];
    roles?: string[];
    state: boolean;
    createdAt?: number;
    updatedAt?: number;
    totpInfo?: TotpInfo;
  }

  /**
   * 用户列表请求参数
   */
  export interface UserListRequest extends PageRequest {
    departmentId?: number;
    email?: string;
    mobile?: string;
    state?: boolean;
    userId?: string;
    username?: string;
  }

  /**
   * 用户列表信息
   */
  export type UserListInfo = BaseListInfo<UserInfo>;
}

/**
 * 获取用户列表
 * @param data 查询参数
 */
export async function getUserList(data: SystemUserApi.UserListRequest) {
  return requestClient.post<SystemUserApi.UserListInfo>(
    '/sys-api/user/list',
    data,
  );
}

/**
 * 创建或更新用户
 * @param data 用户信息
 */
export async function createOrUpdateUser(data: SystemUserApi.UserInfo) {
  return requestClient.post<SystemUserApi.UserInfo>(
    '/sys-api/user/createOrUpdate',
    data,
  );
}

/**
 * 删除用户
 * @param id 用户 ID
 */
export async function deleteUser(id: string) {
  return requestClient.post<any>('/sys-api/user/delete', {
    id,
  });
}

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  return requestClient.get<SystemUserApi.UserInfo>('/sys-api/user/info');
}

/**
 * 启用TOTP
 * @param data TOTP启用参数
 */
export async function enableTotp(data: {
  domain: string;
  issuer: string;
  userId: string;
}) {
  return requestClient.post<{ qrText: string }>('/user/totp/enable', data);
}

/**
 * 验证TOTP
 * @param data TOTP验证参数
 */
export async function verifyTotp(data: { code: string; userId: string }) {
  return requestClient.post<any>('/user/totp/verify', data);
}

/**
 * 禁用TOTP
 * @param data TOTP禁用参数
 */
export async function disableTotp(data: { id: string }) {
  return requestClient.post<any>('/user/totp/disable', data);
}

export {};
