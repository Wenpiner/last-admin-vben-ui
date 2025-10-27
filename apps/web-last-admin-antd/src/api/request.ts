/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';
import { extractErrorCode, handleBusinessErrorCode } from './error-handler';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 0,
    }),
  );

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 根据业务错误码进行定制化处理
      const errorCode = extractErrorCode(error);
      if (errorCode === null) {
        // 没有业务错误码，使用默认错误处理
        const responseData = error?.response?.data ?? {};
        const errorMessage = responseData?.error ?? responseData?.message ?? '';
        // 显示错误
        message.error(errorMessage || msg);
      } else {
        // 有业务错误码，使用业务错误处理器
        const responseData = error?.response?.data ?? {};
        const originalConfig = error?.config;

        handleBusinessErrorCode({
          error,
          errorResponse: {
            code: errorCode,
            message: responseData?.message,
            data: responseData?.data,
          },
          // 提供重试回调，自动添加 totpCode 并重新发送请求
          onRetry: async (totpCode: string) => {
            if (!originalConfig) {
              throw error;
            }

            // 根据请求类型添加 totpCode 字段
            const data = originalConfig.data
              ? JSON.parse(originalConfig.data)
              : {};
            data.totpCode = totpCode;

            // 重新发送请求
            const url = originalConfig.url || '';
            const config = { ...originalConfig, data };
            return client.request(url, config);
          },
        }).catch(() => {
          // 错误已被处理
        });
      }
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
