import { requestClient } from '#/api/request';

export namespace CaptchaApi {
  export interface CaptchaResult {
    base64Blob: string;
    id: string;
    captchaType: 'audio' | 'chinese' | 'digit' | 'math' | 'string';
  }
}

/**
 * 生成验证码
 */
export async function generateCaptchaApi() {
  return requestClient.get<CaptchaApi.CaptchaResult>(
    '/sys-api/captcha/generate',
  );
}
