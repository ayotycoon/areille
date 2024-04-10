import ArielleApp from '../ArielleApp';
import SingletonObj from '../classes/SingletonObj';
import { AutowiredArgs } from '../type';
import getLogger, { COLORS, colorText } from '../utilities/logger';
import {
  assignValueToBeanProperty,
  getAnnotatedCandidateBean,
} from './utils/beanPropertyUtils';

export default function autowired(args?: AutowiredArgs) {
  return (
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) => {
    const arielleApp = ArielleApp.getInstanceByAppName(args?.instance);

    arielleApp.registerBeanDecorator(autowired.name, 1, () => {
      arielleApp.processSingletonMethods(
        autowired.name,
        target,
        propertyKey,
        descriptor,
      );

      function processSingletonAutowireCandidates(singletonObj: SingletonObj) {
        const originalPropertyValue = Reflect.get(
          singletonObj.clazz,
          propertyKey,
        );
        const isSingletonObjInstance =
          originalPropertyValue instanceof SingletonObj;
        const candidateName: string = getAnnotatedCandidateBean(
          arielleApp,
          singletonObj,
          propertyKey,
          originalPropertyValue,
          descriptor,
          args?.bean,
        );

        if (!descriptor) {
          let existingPropertySingletonObj =
            arielleApp.getSingleton(candidateName);
          let existingPropertySingleton = existingPropertySingletonObj?.clazz;
          // check if theres a primyBean
          if (!args?.exact && existingPropertySingletonObj?.primaryBean) {
            existingPropertySingletonObj = arielleApp.getSingleton(
              existingPropertySingletonObj.primaryBean,
            );
            existingPropertySingleton = existingPropertySingletonObj?.clazz;
          }

          singletonObj.autowiredCandidates.push(existingPropertySingleton);

          assignValueToBeanProperty(
            singletonObj,
            propertyKey,
            isSingletonObjInstance
              ? existingPropertySingletonObj
              : existingPropertySingleton,
          );
          const autowiredValue = isSingletonObjInstance
            ? `Obj<${candidateName}>`
            : candidateName;
          getLogger().info(
            `${colorText(COLORS.Magenta, `Autowiring`)} ${singletonObj.name}.${propertyKey} ${colorText(COLORS.Magenta, 'to')} ${autowiredValue} `,
          );
        } else {
          // autowiring a method
        }
      }

      const singletonObj = arielleApp.getSingleton(target);

      processSingletonAutowireCandidates(singletonObj);
      for (const singletonName of singletonObj.beans.flat()) {
        processSingletonAutowireCandidates(
          arielleApp.getSingleton(singletonName),
        );
      }
    });
  };
}
