import type { RouteMeta } from '@vben/types';

import type { MenuRecordRaw } from '#/api/core/menu';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export interface SystemMenu extends Omit<MenuRecordRaw, 'meta'> {
    state?: boolean;
    service: string;
    createdAt: number;
    type: 'button' | 'directory' | 'iframe' | 'link' | 'menu';
    permission?: string;
    description?: string;
    meta: RouteMeta;
  }

  export interface MenuCreateOrUpdateRequest {
    id?: number;
    path: string;
    name: string;
    meta: RouteMeta;
    state: boolean;
    service: string;
    permission: string;
    type: 'button' | 'directory' | 'iframe' | 'link' | 'menu';
    component?: string;
    description?: string;
    parentId?: null | number;
    redirect?: string;
  }
}

/**
 * 获取菜单数据列表（平铺格式）
 */
async function getMenuList() {
  const menus = await requestClient.get<SystemMenuApi.SystemMenu[]>(
    '/sys-api/menu/all-menus',
  );
  // 返回平铺的数据，让 VXE Table 的 transform 自动转换成树形
  return menus;
}

/**
 * 创建或更新菜单
 * @param data 菜单信息
 */
export async function createOrUpdateMenu(
  data: SystemMenuApi.MenuCreateOrUpdateRequest,
) {
  return requestClient.put<SystemMenuApi.SystemMenu>(
    '/sys-api/menu/update',
    data,
  );
}

/**
 * 删除菜单
 * @param id 菜单 ID
 */
export async function deleteMenu(id: number) {
  return requestClient.post<any>('/sys-api/menu/delete', {
    id,
  });
}

export { getMenuList };
