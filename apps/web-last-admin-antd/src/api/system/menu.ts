import type { MenuRecordRaw } from '#/api/core/menu';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export interface SystemMenu extends MenuRecordRaw {
    state?: boolean;
    service: string;
    createdAt: number;
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

export { getMenuList };
