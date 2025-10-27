/**
 * 业务错误码定义
 * 与后端保持一致的错误码常量定义
 */

// 系统级错误码 (10000-19999)
export const ErrorCode = {
  // 成功
  SUCCESS: 0,

  // 系统级错误码 (10000-19999)
  SYSTEM_ERROR: 10_000,
  INTERNAL_ERROR: 10_001,
  SERVICE_UNAVAILABLE: 10_002,
  TIMEOUT: 10_003,
  TOO_MANY_REQUESTS: 10_004,
  MAINTENANCE: 10_005,

  // 请求参数错误码 (20000-29999)
  BAD_REQUEST: 20_000,
  INVALID_PARAMS: 20_001,
  MISSING_PARAMS: 20_002,
  PARAM_OUT_OF_RANGE: 20_003,
  INVALID_FORMAT: 20_004,
  INVALID_JSON: 20_005,
  INVALID_FILE_TYPE: 20_006,
  FILE_TOO_LARGE: 20_007,

  // 认证授权错误码 (30000-39999)
  UNAUTHORIZED: 30_000,
  INVALID_TOKEN: 30_001,
  TOKEN_EXPIRED: 30_002,
  TOKEN_MALFORMED: 30_003,
  FORBIDDEN: 30_004,
  ACCESS_DENIED: 30_005,
  INVALID_CREDENTIALS: 30_006,
  ACCOUNT_LOCKED: 30_007,
  ACCOUNT_DISABLED: 30_008,
  TOTP_REQUIRED: 30_009,
  TOTP_VERIFY_FAILED: 30_010,

  // 资源错误码 (40000-49999)
  NOT_FOUND: 40_000,
  RESOURCE_NOT_FOUND: 40_001,
  USER_NOT_FOUND: 40_002,
  RECORD_NOT_FOUND: 40_003,
  PAGE_NOT_FOUND: 40_004,

  // 业务逻辑错误码 (50000-59999)
  BUSINESS_ERROR: 50_000,
  DATA_CONFLICT: 50_001,
  RESOURCE_EXISTS: 50_002,
  OPERATION_FAILED: 50_003,
  INVALID_OPERATION: 50_004,
  STATUS_ERROR: 50_005,
  QUOTA_EXCEEDED: 50_006,
  DEPENDENCY_ERROR: 50_007,

  // 数据库错误码 (60000-69999)
  DATABASE_ERROR: 60_000,
  CONNECTION_FAILED: 60_001,
  QUERY_FAILED: 60_002,
  TRANSACTION_FAILED: 60_003,
  CONSTRAINT_VIOLATION: 60_004,
  DUPLICATE_ENTRY: 60_005,

  // 外部服务错误码 (70000-79999)
  EXTERNAL_ERROR: 70_000,
  THIRD_PARTY_ERROR: 70_001,
  NETWORK_ERROR: 70_002,
  GATEWAY_ERROR: 70_003,
  UPSTREAM_ERROR: 70_004,
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * 错误码分类
 */
export enum ErrorCodeCategory {
  // 认证相关
  AUTHENTICATION = 'AUTHENTICATION',
  // 授权相关
  AUTHORIZATION = 'AUTHORIZATION',
  // 业务逻辑
  BUSINESS = 'BUSINESS',
  // 外部服务
  EXTERNAL = 'EXTERNAL',
  // 资源不存在
  NOT_FOUND = 'NOT_FOUND',
  // 系统错误
  SYSTEM = 'SYSTEM',
  // 参数验证
  VALIDATION = 'VALIDATION',
}

/**
 * 获取错误码分类
 */
export function getErrorCodeCategory(code: ErrorCodeType): ErrorCodeCategory {
  if (code >= 30_000 && code < 40_000) {
    if (
      code === ErrorCode.TOTP_REQUIRED ||
      code === ErrorCode.TOTP_VERIFY_FAILED
    ) {
      return ErrorCodeCategory.AUTHENTICATION;
    }
    if (
      code === ErrorCode.UNAUTHORIZED ||
      code === ErrorCode.INVALID_TOKEN ||
      code === ErrorCode.TOKEN_EXPIRED ||
      code === ErrorCode.TOKEN_MALFORMED ||
      code === ErrorCode.INVALID_CREDENTIALS
    ) {
      return ErrorCodeCategory.AUTHENTICATION;
    }
    return ErrorCodeCategory.AUTHORIZATION;
  }
  if (code >= 20_000 && code < 30_000) {
    return ErrorCodeCategory.VALIDATION;
  }
  if (code >= 40_000 && code < 50_000) {
    return ErrorCodeCategory.NOT_FOUND;
  }
  if (code >= 50_000 && code < 60_000) {
    return ErrorCodeCategory.BUSINESS;
  }
  if (code >= 60_000 && code < 70_000) {
    return ErrorCodeCategory.SYSTEM;
  }
  if (code >= 70_000 && code < 80_000) {
    return ErrorCodeCategory.EXTERNAL;
  }
  if (code >= 10_000 && code < 20_000) {
    return ErrorCodeCategory.SYSTEM;
  }
  return ErrorCodeCategory.SYSTEM;
}

/**
 * 判断是否为认证错误
 */
export function isAuthenticationError(code: ErrorCodeType): boolean {
  const authErrorCodes: ErrorCodeType[] = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.INVALID_TOKEN,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.TOKEN_MALFORMED,
  ];
  return authErrorCodes.includes(code);
}

/**
 * 判断是否需要二步验证
 */
export function isTOTPRequired(code: ErrorCodeType): boolean {
  return code === ErrorCode.TOTP_REQUIRED;
}

/**
 * 判断是否为二步验证失败
 */
export function isTOTPVerifyFailed(code: ErrorCodeType): boolean {
  return code === ErrorCode.TOTP_VERIFY_FAILED;
}
