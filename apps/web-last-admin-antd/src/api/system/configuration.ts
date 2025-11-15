import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemConfigurationApi {
  /**
   * 配置信息
   */
  export interface ConfigurationInfo {
    key: string; // 配置键
    value: string; // 配置值
    name: string; // 配置名称
    group: string; // 配置分组
    description?: string; // 配置描述
    createdAt?: number; // 创建时间
    updatedAt?: number; // 更新时间
  }

  /**
   * 配置列表请求参数
   */
  export interface ConfigurationListRequest extends PageRequest {
    key?: string; // 配置键
    name?: string; // 配置名称
    group?: string; // 配置分组
  }

  /**
   * 配置列表信息
   */
  export type ConfigurationListInfo = BaseListInfo<ConfigurationInfo>;
}

/**
 * 获取配置列表
 * @param data 查询参数
 */
export async function getConfigurationList(
  data: SystemConfigurationApi.ConfigurationListRequest,
) {
  return requestClient.post<SystemConfigurationApi.ConfigurationListInfo>(
    '/sys-api/configuration/list',
    data,
  );
}

/**
 * 创建或更新配置
 * @param data 配置信息
 */
export async function createOrUpdateConfiguration(
  data: SystemConfigurationApi.ConfigurationInfo,
) {
  return requestClient.post<SystemConfigurationApi.ConfigurationInfo>(
    '/sys-api/configuration/createOrUpdate',
    data,
  );
}

/**
 * 删除配置
 * @param key 配置键
 */
export async function deleteConfiguration(key: string) {
  return requestClient.post<any>('/sys-api/configuration/delete', {
    key,
  });
}

export {};
