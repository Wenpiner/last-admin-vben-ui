/**
 * 业务错误处理器
 * 根据不同的错误码进行相应的处理
 */

import type { AxiosError } from '@vben/request';

import type { ErrorCodeType } from './error-codes';

import { useAccessStore } from '@vben/stores';

import { message, Modal } from 'ant-design-vue';

import { $t } from '#/locales';
import { useAuthStore } from '#/store';

import {
  ErrorCode,
  isAuthenticationError,
  isTOTPRequired,
  isTOTPVerifyFailed,
} from './error-codes';

export interface ErrorResponse {
  code: ErrorCodeType;
  message?: string;
  data?: any;
}

export interface ErrorHandlerContext {
  error: AxiosError;
  errorResponse: ErrorResponse;
  onTOTPRequired?: (callback: (totpCode: string) => Promise<void>) => void;
  onRetry?: (totpCode: string) => Promise<any>;
}

/**
 * 处理认证错误
 */
async function handleAuthenticationError() {
  const accessStore = useAccessStore();
  const authStore = useAuthStore();

  // 如果有 token，则进行退出登录
  if (accessStore.accessToken) {
    await authStore.logout();
  }
}

/**
 * 处理二步验证需求
 */
function handleTOTPRequired(context: ErrorHandlerContext) {
  return new Promise<string>((resolve, reject) => {
    let totpCode = '';
    let isSubmitting = false;

    Modal.confirm({
      title: $t('api.totp.title'),
      content: $t('api.totp.description'),
      okText: $t('api.totp.confirm'),
      cancelText: $t('api.totp.cancel'),
      okButtonProps: { loading: false },
      onOk: async () => {
        if (!totpCode.trim()) {
          message.error($t('api.totp.emptyError'));
          throw new Error($t('api.totp.emptyError'));
        }

        // 如果提供了重试回调，则自动重试请求
        if (context.onRetry && !isSubmitting) {
          isSubmitting = true;
          try {
            const result = await context.onRetry(totpCode);
            message.success('二步验证成功');
            resolve(totpCode);
            return result;
          } catch (error: any) {
            isSubmitting = false;
            const errorCode = error?.response?.data?.code;
            if (errorCode === ErrorCode.TOTP_VERIFY_FAILED) {
              message.error($t('api.totp.failedMessage'));
              throw error;
            }
            throw error;
          }
        }

        resolve(totpCode);
      },
      onCancel() {
        reject(new Error($t('api.totp.cancelMessage')));
      },
    });

    // 这里可以通过 context.onTOTPRequired 回调来处理输入
    if (context.onTOTPRequired) {
      context.onTOTPRequired(async (code) => {
        totpCode = code;
      });
    }
  });
}

/**
 * 处理业务错误
 */
function handleBusinessError(code: ErrorCodeType, message_text?: string) {
  const messages: Record<ErrorCodeType, string> = {
    [ErrorCode.SUCCESS]: '成功',
    [ErrorCode.SYSTEM_ERROR]: '系统错误',
    [ErrorCode.INTERNAL_ERROR]: '内部服务器错误',
    [ErrorCode.SERVICE_UNAVAILABLE]: '服务不可用',
    [ErrorCode.TIMEOUT]: '请求超时',
    [ErrorCode.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
    [ErrorCode.MAINTENANCE]: '系统维护中，请稍后再试',
    [ErrorCode.BAD_REQUEST]: '请求参数错误',
    [ErrorCode.INVALID_PARAMS]: '参数格式错误',
    [ErrorCode.MISSING_PARAMS]: '缺少必要参数',
    [ErrorCode.PARAM_OUT_OF_RANGE]: '参数超出范围',
    [ErrorCode.INVALID_FORMAT]: '格式错误',
    [ErrorCode.INVALID_JSON]: 'JSON格式错误',
    [ErrorCode.INVALID_FILE_TYPE]: '文件类型错误',
    [ErrorCode.FILE_TOO_LARGE]: '文件过大',
    [ErrorCode.UNAUTHORIZED]: '未认证，请登录',
    [ErrorCode.INVALID_TOKEN]: '无效的令牌',
    [ErrorCode.TOKEN_EXPIRED]: '令牌已过期，请重新登录',
    [ErrorCode.TOKEN_MALFORMED]: '令牌格式错误',
    [ErrorCode.FORBIDDEN]: '权限不足',
    [ErrorCode.ACCESS_DENIED]: '访问被拒绝',
    [ErrorCode.INVALID_CREDENTIALS]: '凭据无效',
    [ErrorCode.ACCOUNT_LOCKED]: '账户被锁定',
    [ErrorCode.ACCOUNT_DISABLED]: '账户被禁用',
    [ErrorCode.TOTP_REQUIRED]: '需要二步验证',
    [ErrorCode.TOTP_VERIFY_FAILED]: '二步验证失败',
    [ErrorCode.NOT_FOUND]: '资源不存在',
    [ErrorCode.RESOURCE_NOT_FOUND]: '指定资源不存在',
    [ErrorCode.USER_NOT_FOUND]: '用户不存在',
    [ErrorCode.RECORD_NOT_FOUND]: '记录不存在',
    [ErrorCode.PAGE_NOT_FOUND]: '页面不存在',
    [ErrorCode.BUSINESS_ERROR]: '业务逻辑错误',
    [ErrorCode.DATA_CONFLICT]: '数据冲突',
    [ErrorCode.RESOURCE_EXISTS]: '资源已存在',
    [ErrorCode.OPERATION_FAILED]: '操作失败',
    [ErrorCode.INVALID_OPERATION]: '无效操作',
    [ErrorCode.STATUS_ERROR]: '状态错误',
    [ErrorCode.QUOTA_EXCEEDED]: '配额超限',
    [ErrorCode.DEPENDENCY_ERROR]: '依赖错误',
    [ErrorCode.DATABASE_ERROR]: '数据库错误',
    [ErrorCode.CONNECTION_FAILED]: '数据库连接失败',
    [ErrorCode.QUERY_FAILED]: '查询失败',
    [ErrorCode.TRANSACTION_FAILED]: '事务失败',
    [ErrorCode.CONSTRAINT_VIOLATION]: '约束违反',
    [ErrorCode.DUPLICATE_ENTRY]: '重复条目',
    [ErrorCode.EXTERNAL_ERROR]: '外部服务错误',
    [ErrorCode.THIRD_PARTY_ERROR]: '第三方服务错误',
    [ErrorCode.NETWORK_ERROR]: '网络错误',
    [ErrorCode.GATEWAY_ERROR]: '网关错误',
    [ErrorCode.UPSTREAM_ERROR]: '上游服务错误',
  };

  return message_text || messages[code] || '发生错误';
}

/**
 * 主错误处理函数
 */
export async function handleBusinessErrorCode(context: ErrorHandlerContext) {
  const { errorResponse } = context;
  const code = errorResponse.code as ErrorCodeType;

  // 如果是成功状态码，不处理
  if (code === ErrorCode.SUCCESS) {
    return;
  }

  // 处理认证错误
  if (isAuthenticationError(code)) {
    await handleAuthenticationError();
    return;
  }

  // 处理二步验证需求
  if (isTOTPRequired(code)) {
    try {
      const totpCode = await handleTOTPRequired(context);
      // 返回 totpCode，由调用者决定如何处理（通常是重新发送请求并添加 totpCode 字段）
      return { totpCode };
    } catch (error) {
      message.error('二步验证已取消');
      throw error;
    }
  }

  // 处理二步验证失败
  if (isTOTPVerifyFailed(code)) {
    message.error($t('page.auth.totp.failedMessage'));
    return;
  }

  // 其他错误，显示错误消息
  const errorMsg = handleBusinessError(code, errorResponse.message);
  message.error(errorMsg);
}

/**
 * 从响应中提取错误码
 */
export function extractErrorCode(error: AxiosError): ErrorCodeType | null {
  const responseData = error?.response?.data as any;
  const code = responseData?.code;

  if (typeof code === 'number') {
    return code as ErrorCodeType;
  }

  return null;
}
