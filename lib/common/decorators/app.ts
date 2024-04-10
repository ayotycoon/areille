import ArielleApp from '../ArielleApp';
import SingletonObj from '../classes/SingletonObj';
import getLogger, { COLORS, colorText } from '../utilities/logger';
import { assignValueToBeanProperty } from './utils/beanPropertyUtils';

export default function app(instance?: string) {
  return (target: any, propertyKey: string) => {
    const arielleApp = ArielleApp.getInstanceByAppName(instance);

    arielleApp.registerBeanDecorator(app.name, 5, () => {
      arielleApp.processSingletonMethods(
        app.name,
        target,
        propertyKey,
        undefined,
      );

      function processSingletonCandidates(singletonObj: SingletonObj) {
        assignValueToBeanProperty(singletonObj, propertyKey, arielleApp);
        getLogger().info(
          `${colorText(COLORS.Magenta, `Assigning app instance`)} ${singletonObj.name}.${propertyKey} ${colorText(COLORS.Magenta, 'to')}`,
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
