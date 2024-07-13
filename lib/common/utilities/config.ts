import { GlobalLogger } from 'js-logger';
import * as process from 'process';
import { RuntimeConfigArgs } from '../type';
import { getRandomInt } from './index';

const blockedFilesOrDir = ['test.ts', `node_modules`, `decorators`, `.d.ts`];
const configFromProcess = () => {
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    IGNORE_DIR: [
      ...blockedFilesOrDir,
      ...(process.env.IGNORE_DIR || '').split(',').map((s) => s.trim()),
    ] as string[],
    SQL_DATABASE: process.env.SQL_DATABASE as string,
    SQL_DATABASE_USERNAME: process.env.SQL_DATABASE_USERNAME as string,
    SQL_DATABASE_STORAGE: process.env.SQL_DATABASE_STORAGE as string,
    SQL_DATABASE_PASSWORD: process.env.SQL_DATABASE_PASSWORD as string,
    SQL_DATABASE_HOST: process.env.SQL_DATABASE_HOST as string,
    SQL_DATABASE_PORT: parseInt(process.env.SQL_DATABASE_PORT || '0'),
    SQL_DATABASE_DIALECT: process.env.SQL_DATABASE_DIALECT as string,
    SQL_DATABASE_FORCE_SYNC_DB:
      process.env.SQL_DATABASE_FORCE_SYNC_DB === 'true',
    SQL_LOG_QUERY: process.env.SQL_LOG_QUERY === 'true',
    LOG_WITH_CLASS_NAMES: process.env.LOG_WITH_CLASS_NAMES === 'true',

    MONGODB_CONNECTION_URI: process.env.MONGODB_CONNECTION_URI as string,

    JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME as string,
    PORT: process.env.PORT || getRandomInt(6000, 10000),

    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as string,
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS as string),
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_KEY_EXPIRE_TIME: process.env.ACCESS_TOKEN_KEY_EXPIRE_TIME,
    REFRESH_TOKEN_KEY_EXPIRE_TIME: process.env.REFRESH_TOKEN_KEY_EXPIRE_TIME,
    JWT_ISSUER: process.env.JWT_ISSUER as string,
    REST_PASSWORD_OTP_EXPIRE_TIME: process.env.REST_PASSWORD_OTP_EXPIRE_TIME,
  };
};
export type KnownEnv = ReturnType<typeof configFromProcess>;

const runtimeConfig: RuntimeConfigArgs = {
  env: {} as any,
  handlers: {
    logger: (Logger: GlobalLogger) => {
      const consoleHandler = Logger.createDefaultHandler({
        formatter: function (messages) {
          messages.unshift(new Date().toUTCString());
        },
      });
      Logger.setLevel(Logger.DEBUG);

      if (!getConfig().isTest()) {
        (Logger as unknown as GlobalLogger).setHandler(
          function (messages, context) {
            consoleHandler(messages, context);
          },
        );
      }
    },
  },
};
export function setConfig({ env, handlers }: Partial<RuntimeConfigArgs>) {
  if (env) {
    runtimeConfig.env = env;
  }
  if (handlers?.logger) {
    runtimeConfig.handlers.logger = handlers.logger;
  }
}
function getConfig() {
  let environmentConfig = configFromProcess();
  environmentConfig = { ...environmentConfig, ...runtimeConfig.env };

  return {
    env: environmentConfig,
    handlers: runtimeConfig.handlers,
    isProduction: () => environmentConfig.NODE_ENV === 'production',
    isTest: () => environmentConfig.NODE_ENV === 'test',
  };
}

let cache: ReturnType<typeof getConfig>;
export default function (forceReload = false) {
  if (!cache || forceReload) cache = getConfig();
  return cache;
}

export const hasEnvConfig = (str: string, forceReload = false) => {
  if (!cache || forceReload) cache = getConfig();
  return (cache.env as any)[str] != undefined;
};
