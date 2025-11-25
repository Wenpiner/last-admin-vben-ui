import type { Preferences } from '@vben/preferences';

import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

interface ApiVbenPreference {
  code: number;
  message: string;
  data: Preferences;
}

/**
 * 应用初始化完成之后再进行页面加载渲染
 */
async function initApplication() {
  // name用于指定项目唯一标识
  // 用于区分不同项目的偏好设置以及存储数据的key前缀以及其他一些需要隔离的数据
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
  let vbenPreference: ApiVbenPreference;
  // 异常捕获
  try {
    vbenPreference = (await fetch(
      `/api/sys-api/public/config/vben_preference`,
    ).then((res) => res.json())) as ApiVbenPreference;
  } catch {
    vbenPreference = {} as ApiVbenPreference;
  }

  // app偏好设置初始化
  await initPreferences({
    namespace,
    overrides: vbenPreference?.data || {},
  });

  // 启动应用并挂载
  // vue应用主要逻辑及视图
  const { bootstrap } = await import('./bootstrap');
  await bootstrap(namespace);

  // 移除并销毁loading
  unmountGlobalLoading();
}

initApplication();
