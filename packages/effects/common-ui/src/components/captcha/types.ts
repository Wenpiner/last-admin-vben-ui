import type { CSSProperties } from 'vue';

import type { ClassType } from '@vben/types';

export interface CaptchaData {
  /**
   * x
   */
  x: number;
  /**
   * y
   */
  y: number;
  /**
   * 时间戳
   */
  t: number;
}
export interface CaptchaPoint extends CaptchaData {
  /**
   * 数据索引
   */
  i: number;
}
export interface PointSelectionCaptchaCardProps {
  /**
   * 验证码图片
   */
  captchaImage: string;
  /**
   * 验证码图片高度
   * @default '220px'
   */
  height?: number | string;
  /**
   * 水平内边距
   * @default '12px'
   */
  paddingX?: number | string;
  /**
   * 垂直内边距
   * @default '16px'
   */
  paddingY?: number | string;
  /**
   * 标题
   * @default '请按图依次点击'
   */
  title?: string;
  /**
   * 验证码图片宽度
   * @default '300px'
   */
  width?: number | string;
}

export interface PointSelectionCaptchaProps
  extends PointSelectionCaptchaCardProps {
  /**
   * 是否展示确定按钮
   * @default false
   */
  showConfirm?: boolean;
  /**
   * 提示图片
   * @default ''
   */
  hintImage?: string;
  /**
   * 提示文本
   * @default ''
   */
  hintText?: string;
}

export interface SliderCaptchaProps {
  class?: ClassType;
  /**
   * @description 滑块的样式
   * @default {}
   */
  actionStyle?: CSSProperties;

  /**
   * @description 滑块条的样式
   * @default {}
   */
  barStyle?: CSSProperties;

  /**
   * @description 内容的样式
   * @default {}
   */
  contentStyle?: CSSProperties;

  /**
   * @description 组件的样式
   * @default {}
   */
  wrapperStyle?: CSSProperties;

  /**
   * @description 是否作为插槽使用，用于联动组件，可参考旋转校验组件
   * @default false
   */
  isSlot?: boolean;

  /**
   * @description 验证成功的提示
   * @default '验证通过'
   */
  successText?: string;

  /**
   * @description 提示文字
   * @default '请按住滑块拖动'
   */
  text?: string;
}

export interface SliderRotateCaptchaProps {
  /**
   * @description 旋转的角度
   * @default 20
   */
  diffDegree?: number;

  /**
   * @description 图片的宽度
   * @default 260
   */
  imageSize?: number;

  /**
   * @description 图片的样式
   * @default {}
   */
  imageWrapperStyle?: CSSProperties;

  /**
   * @description 最大旋转角度
   * @default 270
   */
  maxDegree?: number;

  /**
   * @description 最小旋转角度
   * @default 90
   */
  minDegree?: number;

  /**
   * @description 图片的地址
   */
  src?: string;
  /**
   * @description 默认提示文本
   */
  defaultTip?: string;
}

export interface SliderTranslateCaptchaProps {
  /**
   * @description 拼图的宽度
   * @default 420
   */
  canvasWidth?: number;
  /**
   * @description 拼图的高度
   * @default 280
   */
  canvasHeight?: number;
  /**
   * @description 切块上正方形的长度
   * @default 42
   */
  squareLength?: number;
  /**
   * @description 切块上圆形的半径
   * @default 10
   */
  circleRadius?: number;
  /**
   * @description 图片的地址
   */
  src?: string;
  /**
   * @description 允许的最大差距
   * @default 3
   */
  diffDistance?: number;
  /**
   * @description 默认提示文本
   */
  defaultTip?: string;
}

export interface CaptchaVerifyPassingData {
  isPassing: boolean;
  time: number | string;
}

export interface SliderCaptchaActionType {
  resume: () => void;
}

export interface SliderRotateVerifyPassingData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}

/**
 * 验证码数据更新函数
 * 用于在 onRefresh 回调中更新验证码的所有动态数据
 */
export interface CaptchaDataSetter {
  /**
   * 设置验证码数据
   * @param id 验证码 ID
   * @param base64Blob 验证码图片或音频的 base64 数据
   * @param audioBlob 音频数据（可选，用于音频类型）
   * @param captchaType 验证码类型
   */
  (id: string, base64Blob: string, captchaType: string): void;
}

export interface LastAdminCaptchaProps {
  /**
   * @description 输入框占位符
   * @default ''
   */
  placeholder?: string;

  /**
   * @description 刷新按钮文本
   * @default '刷新'
   */
  refreshText?: string;

  /**
   * @description 输入框宽度
   * @default '100%'
   */
  width?: number | string;

  /**
   * @description 输入框高度
   * @default '40px'
   */
  height?: number | string;

  /**
   * @description 验证码图片宽度
   * @default '100px'
   */
  captchaWidth?: number | string;

  /**
   * @description 验证码图片高度
   * @default '40px'
   */
  captchaHeight?: number | string;

  /**
   * @description 刷新验证码的回调函数
   * @param setter 用于设置验证码数据的函数
   */
  onRefresh?: (setter: CaptchaDataSetter) => Promise<void> | void;

  /**
   * @description 验证码值变化的回调函数
   */
  onChange?: (data: LastAdminCaptchaData) => void;
}

export interface LastAdminCaptchaData {
  /**
   * 验证码 ID
   */
  id: string;

  /**
   * 用户输入的验证码值
   */
  value: string;
}
