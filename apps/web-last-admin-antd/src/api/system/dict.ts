import type { BaseListInfo, PageRequest } from './base';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  /**
   * 字典信息
   */
  export interface DictInfo {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    name: string; // 字典名称
    code: string; // 字典编码
    state: boolean; // 状态 (true=启用, false=禁用)
    description?: string; // 描述
  }

  /**
   * 字典子项信息
   */
  export interface DictItemInfo {
    id?: number | string;
    createdAt?: number;
    updatedAt?: number;
    dictId: number; // 字典ID
    label: string; // 字典子项标签
    value: string; // 字典子项值
    sortOrder: number; // 排序
    state: boolean; // 状态 (true=启用, false=禁用)
    color?: string; // 字典子项颜色
    css?: string; // 字典子项CSS
    description?: string; // 描述
  }

  /**
   * 字典列表请求参数
   */
  export interface DictListRequest extends PageRequest {
    name?: string;
    code?: string;
    description?: string;
  }

  /**
   * 字典子项列表请求参数
   */
  export interface DictItemListRequest extends PageRequest {
    dictId?: number;
    dictCode?: string;
    label?: string;
    value?: string;
  }

  /**
   * 字典列表信息
   */
  export type DictListInfo = BaseListInfo<DictInfo>;

  /**
   * 字典子项列表信息
   */
  export type DictItemListInfo = BaseListInfo<DictItemInfo>;
}

/**
 * 获取字典列表
 * @param data 查询参数
 */
export async function getDictList(data: SystemDictApi.DictListRequest) {
  return requestClient.post<SystemDictApi.DictListInfo>(
    '/sys-api/dict/list',
    data,
  );
}

/**
 * 创建或更新字典
 * @param data 字典信息
 */
export async function createOrUpdateDict(data: SystemDictApi.DictInfo) {
  return requestClient.post<SystemDictApi.DictInfo>(
    '/sys-api/dict/createOrUpdate',
    data,
  );
}

/**
 * 删除字典
 * @param id 字典 ID
 */
export async function deleteDict(id: number) {
  return requestClient.post<any>('/sys-api/dict/delete', { id });
}

/**
 * 获取字典子项列表
 * @param data 查询参数
 */
export async function getDictItemList(data: SystemDictApi.DictItemListRequest) {
  return requestClient.post<SystemDictApi.DictItemListInfo>(
    '/sys-api/dict/item/list',
    data,
  );
}

/**
 * 创建或更新字典子项
 * @param data 字典子项信息
 */
export async function createOrUpdateDictItem(data: SystemDictApi.DictItemInfo) {
  if (typeof data.id === 'string') {
    delete data.id;
  }
  return requestClient.post<SystemDictApi.DictItemInfo>(
    '/sys-api/dict/item/createOrUpdate',
    data,
  );
}

/**
 * 删除字典子项
 * @param id 字典子项 ID
 */
export async function deleteDictItem(id: number) {
  return requestClient.post<any>('/sys-api/dict/item/delete', { id });
}

/**
 * 获取字典列表，通过ID或Code
 */
export async function getDictListByIdOrCode(idOrCode: number | string, pageSize = 1000): Promise<SystemDictApi.DictItemInfo[]> {
  const request = {
    dictId: 0,
    dictCode: '',
    page: {
      currentPage: 1,
      pageSize,
    }
  } as SystemDictApi.DictItemListRequest;
  if (typeof idOrCode === 'number') {
    request.dictId = idOrCode;
  } else {
    request.dictCode = idOrCode;
  }
  const result = await getDictItemList(request);
  return result.list;
}

export { };
