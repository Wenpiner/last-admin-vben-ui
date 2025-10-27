import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { TooltipProps } from 'ant-design-vue/es/tooltip';

/**
 * 弹窗确认配置
 */
export interface PopConfirm {
  /**
   * 确认标题
   */
  title: string;
  /**
   * 确认按钮文本
   */
  okText?: string;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 确认回调
   */
  confirm: () => Promise<void> | void;
  /**
   * 取消回调
   */
  cancel?: () => void;
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
   * 点击回调
   */
  onClick?: () => Promise<void> | void;
  /**
   * 显示文本
   */
  label?: string;
  /**
   * 颜色主题
   */
  color?: 'error' | 'success' | 'warning';
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
   */
  disabled?: boolean;
  /**
   * 是否显示分割线
   */
  divider?: boolean;
  /**
   * 权限编码数组
   */
  auth?: string[];
  /**
   * 按钮类型：'button' | 'dropdown'
   */
  buttonType?: 'button' | 'dropdown';
  /**
   * 条件显示函数或布尔值
   */
  ifShow?: ((action: ActionItem) => boolean) | boolean;
  /**
   * 提示文本或提示配置
   */
  tooltip?: string | TooltipProps;
}

/**
 * 表格操作组件 Props
 */
export interface TableActionProps {
  /**
   * 操作项列表
   */
  actions: ActionItem[];
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
   * 对齐方式
   * @default 'end'
   */
  align?: 'center' | 'end' | 'start';
  /**
   * 下拉菜单最多显示的按钮数
   * @default 2
   */
  maxVisibleButtons?: number;
  /**
   * 是否响应式（移动端自动转换为下拉菜单）
   * @default true
   */
  responsive?: boolean;
  /**
   * 响应式断点（px）
   * @default 768
   */
  responsiveBreakpoint?: number;
}

/**
 * 表格操作组件 Emits
 */
export interface TableActionEmits {
  /**
   * 操作项点击事件
   */
  (e: 'actionClick', action: ActionItem): void;
}
