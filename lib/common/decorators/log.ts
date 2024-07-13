import { GlobalLogger } from 'js-logger';
import getConfig from '../../common/utilities/config';
import ArielleApp from '../ArielleApp';
import SingletonObj from '../classes/SingletonObj';
import getLogger, { COLORS, colorText } from '../utilities/logger';
import { assignValueToBeanProperty } from './utils/beanPropertyUtils';

export interface Log extends GlobalLogger {}
export default function log(target: any, propertyKey: string) {
  const arielleApp = ArielleApp.getInstanceByAppName();

  arielleApp.registerBeanDecorator(target, log.name, 1, () => {
    arielleApp.processSingletonMethods(
      log.name,
      target,
      propertyKey,
      undefined,
    );
    const singletonObj = arielleApp.getSingleton(target);
    const mainLogger = getLogger();
    let obj: any = {};
    if (getConfig().env.LOG_WITH_CLASS_NAMES) {
      const prepend = `[${singletonObj.name}]`;
      obj.info = (...args: any) => mainLogger.info(prepend, ...args);
      obj.debug = (...args: any) => mainLogger.debug(prepend, ...args);
      obj.error = (...args: any) => mainLogger.error(prepend, ...args);
      obj.warn = (...args: any) => mainLogger.warn(prepend, ...args);
    } else {
      obj = mainLogger;
    }

    function processSingletonCandidates(_singletonObj: SingletonObj) {
      assignValueToBeanProperty(_singletonObj, propertyKey, obj);
      getLogger().info(
        `${colorText(COLORS.Blue, `[log]`)} ${colorText(COLORS.Magenta, `Assigning log`)}${colorText(COLORS.Magenta, arielleApp.getInstance())} ${colorText(COLORS.Magenta, 'to')} ${singletonObj.name}.${propertyKey} `,
      );
    }

    processSingletonCandidates(singletonObj);
    for (const singletonName of singletonObj.beans.flat()) {
      processSingletonCandidates(arielleApp.getSingleton(singletonName));
    }
  });
}
