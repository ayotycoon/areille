import getConfig, { hasEnvConfig } from '../../common/utilities/config';
import ArielleApp from '../ArielleApp';
import SingletonObj from '../classes/SingletonObj';
import getLogger, { COLORS, colorText } from '../utilities/logger';
import { assignValueToBeanProperty } from './utils/beanPropertyUtils';

export default function value(str: string) {
  return (target: any, propertyKey: string) => {
    const arielleApp = ArielleApp.getInstanceByAppName();

    arielleApp.registerBeanDecorator(target, value.name, 1, () => {
      arielleApp.processSingletonMethods(
        value.name,
        target,
        propertyKey,
        undefined,
      );
      if (!hasEnvConfig(str))
        throw new Error(`Error getting env value '${str}'`);
      const envValue = (getConfig().env as any)[str];

      function processSingletonCandidates(singletonObj: SingletonObj) {
        assignValueToBeanProperty(singletonObj, propertyKey, envValue);
        getLogger().info(
          `${colorText(COLORS.Blue, `[value]`)} ${colorText(COLORS.Magenta, `Assigning value`)}${colorText(COLORS.Magenta, arielleApp.getInstance())} ${colorText(COLORS.Magenta, 'to')} ${singletonObj.name}.${propertyKey} `,
        );
      }
      const singletonObj = arielleApp.getSingleton(target);

      processSingletonCandidates(singletonObj);
      for (const singletonName of singletonObj.beans.flat()) {
        processSingletonCandidates(arielleApp.getSingleton(singletonName));
      }
    });
  };
}
