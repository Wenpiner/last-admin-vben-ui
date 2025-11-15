import type { Recordable } from '@vben/types';

export interface PageRequest extends Recordable<any> {
  page: {
    currentPage: number;
    pageSize: number;
  };
}

export interface BaseListInfo<T> {
  total: number;
  list: T[];
}
