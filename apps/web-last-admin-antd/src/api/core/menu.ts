import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

export interface MenuRecordRaw extends RouteRecordStringComponent {
  children?: MenuRecordRaw[];
  id: number | string;
  parentId?: null | number | string;
}

/**
 * 将菜单数组转换为树形结构
 * @param menus - 菜单数组，包含 id 和 parentId 字段
 * @param parentId - 父级ID，默认为 null（表示根节点）
 * @returns 树形结构的菜单数组
 */
export function convertMenusToTree<
  T extends {
    children?: T[];
    id: number | string;
    parentId?: null | number | string;
  },
>(menus: T[], parentId: null | number | string = null): T[] {
  return menus
    .filter((menu) => {
      // 如果 parentId 为 null、undefined、''、0，则认为是根节点
      const menuParentId = menu.parentId ?? null;
      const normalizedParentId = menuParentId || null;
      const normalizedTargetId = parentId || null;
      return normalizedParentId === normalizedTargetId;
    })
    .map((menu) => ({
      ...menu,
      children: convertMenusToTree(menus, menu.id),
    }));
}

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<MenuRecordRaw[]>('/sys-api/menu/all');
}
