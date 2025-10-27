import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { TooltipProps } from 'ant-design-vue/es/tooltip';

import type { Fn, Recordable } from '@vben/types';

/**
 * 弹窗确认配置
 */
export interface PopConfirm {
  /**
   * 确认按钮文本
   */
  okText?: string;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 确认标题
   */
  title: string;
  /**
   * 确认回调
   */
  confirm: Fn;
  /**
   * 取消回调
   */
  cancel?: Fn;
  /**
   * 图标
   */
  icon?: string;
}

/**
 * 表格操作项配置
 */
export interface ActionItem extends ButtonProps {
  /**
   * 操作项唯一标识
   */
  code?: string;
  /**
   * 显示文本/标签
   */
  label?: string;
  /**
   * 点击回调
   */
  onClick?: Fn;
  /**
   * 颜色主题
   * @default 'default'
   */
  color?: 'default' | 'error' | 'success' | 'warning';
  /**
   * 图标
   */
  icon?: string;
  /**
   * 弹窗确认配置
   */
  popConfirm?: PopConfirm;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否显示分割线
   * @default false
   */
  divider?: boolean;
  /**
   * 权限编码数组，用于权限控制
   */
  auth?: string[];
  /**
   * 按钮类型
   * @default 'button'
   */
  buttonType?: 'button' | 'dropdown';
  /**
   * 条件显示函数或布尔值
   */
  ifShow?: ((action: ActionItem) => boolean) | boolean;
  /**
   * 提示文本或 Tooltip 配置
   */
  tooltip?: string | TooltipProps;
  /**
   * 下拉菜单项（当 buttonType 为 'dropdown' 时使用）
   */
  dropdownItems?: ActionItem[];
}

/**
 * TableAction 组件 Props
 */
export interface TableActionProps {
  /**
   * 操作项列表
   */
  actions: ActionItem[];
  /**
   * 操作项对齐方式
   * @default 'end'
   */
  align?: 'center' | 'end' | 'start';
  /**
   * 按钮大小
   * @default 'small'
   */
  size?: 'large' | 'middle' | 'small';
  /**
   * 按钮间距
   * @default 8
   */
  gap?: number;
  /**
   * 是否显示分割线
   * @default true
   */
  showDivider?: boolean;
  /**
   * 自定义类名
   */
  class?: string;
  /**
   * 自定义样式
   */
  style?: Recordable<any>;
}

/**
 * TableAction 组件 Emits
 */
export interface TableActionEmits {
  /**
   * 操作项点击事件
   */
  (e: 'click', action: ActionItem): void;
}
