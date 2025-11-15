import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemOauthApi {
  /**
   * OAuth提供商信息
   */
  export interface OauthInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    providerName: string; // 提供商名称
    providerCode: string; // 提供商编码
    clientId: string; // 客户端ID
    clientSecret?: string; // 客户端密钥（创建时必填，更新时非必填）
    authorizationUrl: string; // 授权URL
    tokenUrl: string; // 令牌URL
    userinfoUrl: string; // 用户信息URL
    redirectUri: string; // 重定向URI
    scopes?: string; // 授权范围
    authStyle: number; // 认证方式 (0=自动检测, 1=在请求头中, 2=在请求体中)
    logoutUrl?: string; // 登出URL
    state: boolean; // 状态 (true=启用, false=禁用)
    description?: string; // 描述
  }

  /**
   * OAuth提供商列表请求参数
   */
  export interface OauthListRequest extends PageRequest {
    providerName?: string; // 提供商名称
    providerCode?: string; // 提供商编码
    state?: boolean; // 状态
  }

  /**
   * OAuth提供商列表响应（根据swagger.json的实际响应结构）
   */
  export interface OauthListResponse {
    code: number;
    data: string;
    list: OauthInfo[];
    message: string;
  }

  /**
   * OAuth提供商列表信息（用于内部处理）
   */
  export type OauthListInfo = BaseListInfo<OauthInfo>;
}

/**
 * 获取OAuth提供商列表
 * @param data 查询参数
 */
export async function getOauthList(
  data: SystemOauthApi.OauthListRequest,
): Promise<SystemOauthApi.OauthListInfo> {
  const response = await requestClient.post<SystemOauthApi.OauthListResponse>(
    '/sys-api/oauth/list',
    data,
  );

  // 根据swagger.json的响应结构，OAuth接口返回的是 { code, data, list, message }
  // 而其他系统接口返回的是 { code, data: { total, list } }
  // OAuth接口没有total字段，这里使用list长度作为total
  // 注意：这意味着OAuth接口可能不支持真正的分页，或使用不同的分页机制
  return {
    total: response.list?.length || 0,
    list: response.list || [],
  };
}

/**
 * 创建或更新OAuth提供商
 * @param data OAuth提供商信息
 */
export async function createOrUpdateOauth(data: SystemOauthApi.OauthInfo) {
  return requestClient.post<SystemOauthApi.OauthInfo>(
    '/sys-api/oauth/createOrUpdate',
    data,
  );
}

/**
 * 删除OAuth提供商
 * @param id OAuth提供商 ID
 */
export async function deleteOauth(id: number) {
  return requestClient.post<any>('/sys-api/oauth/delete', {
    id,
  });
}

export {};
