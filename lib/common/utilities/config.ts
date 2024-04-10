import * as process from 'process';

const blockedFilesOrDir = [
  'test.ts',
  `node_modules`,
  `decorators`,
  `.d.ts`,
  'getLogger().ts',
];
function getConfig() {
  const environmentConfig = {
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

    MONGODB_CONNECTION_URI: process.env.MONGODB_CONNECTION_URI as string,

    JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME as string,
    PORT: process.env.PORT || 6000,

    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as string,
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS as string),
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_KEY_EXPIRE_TIME: process.env.ACCESS_TOKEN_KEY_EXPIRE_TIME,
    REFRESH_TOKEN_KEY_EXPIRE_TIME: process.env.REFRESH_TOKEN_KEY_EXPIRE_TIME,
    JWT_ISSUER: process.env.JWT_ISSUER as string,
    REST_PASSWORD_OTP_EXPIRE_TIME: process.env.REST_PASSWORD_OTP_EXPIRE_TIME,
  };

  return {
    ENV: environmentConfig,
    isProduction: () => environmentConfig.NODE_ENV === 'production',
    isTest: () => environmentConfig.NODE_ENV === 'test',
  };
}

let cache: ReturnType<typeof getConfig>;
export default function (forceReload = false) {
  if (!cache || forceReload) cache = getConfig();
  return cache;
}
