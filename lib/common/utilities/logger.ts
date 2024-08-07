import * as Logger from 'js-logger';
import { GlobalLogger } from 'js-logger';
import getConfig from './config';

const logger = Logger as unknown as GlobalLogger;
let initialized = false;
const getLogger = () => {
  if (initialized) return logger;
  initialized = true;
  Logger.useDefaults();

  getConfig(true).handlers.logger(Logger as unknown as GlobalLogger);
  return logger;
};

export enum COLORS {
  Black = '\u001b[30m',
  Red = ' \u001b[31m',
  Green = ' \u001b[32m',
  Yellow = ' \u001b[33m',
  Blue = ' \u001b[34m',
  Magenta = ' \u001b[35m',
  Cyan = ' \u001b[36m',
  White = ' \u001b[37m',
  Reset = ' \u001b[0m',
}

export const colorText = (c: COLORS, str?: string | number) => {
  return `${c}${str}${COLORS.Reset}`;
};

export default getLogger;
