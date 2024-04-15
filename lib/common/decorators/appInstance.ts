import ArielleApp from '../ArielleApp';
import SingletonObj from '../classes/SingletonObj';
import getLogger, { COLORS, colorText } from '../utilities/logger';
import { assignValueToBeanProperty } from './utils/beanPropertyUtils';

export default function appInstance(instance?: string) {
  return (target: any, propertyKey: string) => {
    const arielleApp = ArielleApp.getInstanceByAppName(instance);

    arielleApp.registerBeanDecorator(target, appInstance.name, 5, () => {
      arielleApp.processSingletonMethods(
        appInstance.name,
        target,
        propertyKey,
        undefined,
      );

      function processSingletonCandidates(singletonObj: SingletonObj) {
        assignValueToBeanProperty(singletonObj, propertyKey, arielleApp);
        getLogger().info(
          `${colorText(COLORS.Blue, `[app]`)} ${colorText(COLORS.Magenta, `Assigning appInstance`)}${colorText(COLORS.Magenta, arielleApp.getInstance())} ${colorText(COLORS.Magenta, 'to')} ${singletonObj.name}.${propertyKey} `,
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
