import * as React from 'react';

import { AsyncStorageBasic, SingletonObjects } from '../../rename.uikit';
import {
  appId,
  appKey,
  enableDNSConfig,
  imPort,
  imServer,
  restServer,
} from '../common/const';

export function useServerConfig() {
  const getKey = React.useCallback(
    async (key: string): Promise<string | undefined> => {
      const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
        appKey: `uikit/demo`,
      });
      try {
        const ret = await s.getData({ key: `${key}` });
        return ret.value;
      } catch (error) {
        console.warn('get error:', error);
        return undefined;
      }
    },
    []
  );
  const setKey = React.useCallback(async (key: string, value: string) => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `uikit/demo`,
    });
    try {
      await s.setData({ key: `${key}`, value: value });
    } catch (error) {
      console.warn('set error:', error);
    }
  }, []);

  const getAppKey = React.useCallback(async () => {
    return (await getKey('appKey')) ?? appKey;
  }, [getKey]);
  const getAppId = React.useCallback(async () => {
    return (await getKey('appId')) ?? appId;
  }, [getKey]);
  const getIsAppKey = React.useCallback(async () => {
    const ret = (await getKey('isAppKey')) ?? (appKey && appKey.length > 0);
    return ret === 'true' ? true : ret === 'false' ? false : false;
  }, [getKey]);
  const getImServer = React.useCallback(async () => {
    return (await getKey('imServer')) ?? imServer;
  }, [getKey]);
  const getImPort = React.useCallback(async () => {
    return (await getKey('imPort')) ?? imPort;
  }, [getKey]);
  const getEnableDNSConfig = React.useCallback(async () => {
    const ret = await getKey(`enablePrivateServer`);
    return ret === 'true' ? true : ret === 'false' ? false : enableDNSConfig;
  }, [getKey]);
  const getRestSever = React.useCallback(async () => {
    return (await getKey('restServer')) ?? restServer;
  }, [getKey]);
  const getEnableDevMode = React.useCallback(async () => {
    const ret = await getKey(`enableDevMode`);
    return ret === 'true' ? true : ret === 'false' ? false : false;
  }, [getKey]);

  const setAppKey = React.useCallback(
    async (value: string) => {
      setKey('appKey', value);
    },
    [setKey]
  );
  const setAppId = React.useCallback(
    async (value: string) => {
      setKey('appId', value);
    },
    [setKey]
  );
  const setIsAppKey = React.useCallback(
    async (value: boolean) => {
      setKey(
        'isAppKey',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );
  const setImServer = React.useCallback(
    async (value: string) => {
      setKey('imServer', value);
    },
    [setKey]
  );
  const setImPort = React.useCallback(
    async (value: string) => {
      setKey('imPort', value);
    },
    [setKey]
  );
  const setEnableDNSConfig = React.useCallback(
    async (value: boolean) => {
      setKey(
        'enablePrivateServer',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );
  const setRestSever = React.useCallback(
    async (value: string) => {
      setKey('restServer', value);
    },
    [setKey]
  );
  const setEnableDevMode = React.useCallback(
    async (value: boolean) => {
      setKey(
        'enableDevMode',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );

  return {
    getAppKey,
    getAppId,
    getIsAppKey,
    getImServer,
    getImPort,
    getEnableDNSConfig,
    getRestSever,
    getEnableDevMode,
    setAppKey,
    setAppId,
    setIsAppKey,
    setImServer,
    setImPort,
    setEnableDNSConfig,
    setRestSever,
    setEnableDevMode,
  };
}

export class AppKey {
  static _appKey = appKey;
  static _appId = appId;
  static appKey() {
    return AppKey._appKey;
  }
  static appId() {
    return AppKey._appId;
  }
  static setAppKey(appKey: string) {
    AppKey._appKey = appKey;
  }
  static setAppId(appId: string) {
    AppKey._appId = appId;
  }
  static gAppKey() {
    return AppKey._appKey && AppKey._appKey.length > 0
      ? AppKey._appKey
      : AppKey._appId;
  }
}
