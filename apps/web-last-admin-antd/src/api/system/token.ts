import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemTokenApi {
  /**
   * Token信息
   */
  export interface TokenInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    deviceInfo?: string;
    expiresAt?: number;
    ipAddress?: string;
    lastUsedAt?: number;
    metadata?: string;
    providerId?: number;
    state: boolean;
    tokenType: string;
    tokenValue: string;
    userAgent?: string;
    userId?: string;
    // 新增的关联字段（仅用于列表显示）
    username?: string;
    providerName?: string;
    fullName?: string;
  }

  /**
   * Token列表请求参数
   */
  export interface TokenListRequest extends PageRequest {
    deviceInfo?: string;
    ipAddress?: string;
    isRevoked?: boolean;
    providerId?: number;
    tokenType?: string;
    userId?: string;
  }

  /**
   * Token列表信息
   */
  export type TokenListInfo = BaseListInfo<TokenInfo>;

  /**
   * 拉黑Token请求参数
   */
  export interface BlockTokenRequest {
    id: number;
  }

  /**
   * 清理Token请求参数
   */
  export interface CleanTokenRequest {
    beforeTime?: number;
    tokenType?: string;
  }

  /**
   * 清理Token响应
   */
  export interface CleanTokenResponse {
    cleanedCount: number;
    message: string;
  }

  /**
   * 通用响应
   */
  export interface CommonResponse {
    code: number;
    message: string;
  }
}

/**
 * 获取Token列表
 * @param data 查询参数
 */
export async function getTokenList(data: SystemTokenApi.TokenListRequest) {
  return requestClient.post<SystemTokenApi.TokenListInfo>(
    '/sys-api/token/list',
    data,
  );
}

/**
 * 删除Token
 * @param id Token ID
 */
export async function deleteToken(id: number) {
  return requestClient.delete<SystemTokenApi.CommonResponse>(
    `/sys-api/token/${id}`,
    {
      data: { id },
    },
  );
}

/**
 * 拉黑Token
 * @param data 拉黑Token请求参数
 */
export async function blockToken(data: SystemTokenApi.BlockTokenRequest) {
  return requestClient.post<SystemTokenApi.CommonResponse>(
    '/sys-api/token/block',
    data,
  );
}
/**
 * 取消拉黑Token
 * @param data 取消拉黑Token请求参数
 */
export async function unblockToken(data: SystemTokenApi.BlockTokenRequest) {
  return requestClient.post<SystemTokenApi.CommonResponse>(
    '/sys-api/token/unblock',
    data,
  );
}

/**
 * 清理过期Token
 * @param data 清理Token请求参数
 */
export async function cleanExpiredTokens(
  data: SystemTokenApi.CleanTokenRequest,
) {
  return requestClient.post<SystemTokenApi.CleanTokenResponse>(
    '/sys-api/token/clean',
    data,
  );
}

export {};
