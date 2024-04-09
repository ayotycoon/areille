import ArielleApp from '../../ArielleApp';
import SingletonObj from '../../classes/SingletonObj';
import { Clazz } from '../../type';
import { capitalizeFirstLetter } from '../../utilities';
import getLogger, { COLORS, colorText } from '../../utilities/logger';

export const getAnnotatedCandidateBean = (
  arielleApp: ArielleApp,
  singletonObj: SingletonObj,
  propertyKey: string,
  originalPropertyValue: any,
  descriptor?: PropertyDescriptor,
  bean?: InstanceType<Clazz>,
) => {
  if (originalPropertyValue && !descriptor) {
    if (originalPropertyValue instanceof SingletonObj) {
      originalPropertyValue = originalPropertyValue.Clazz.prototype;
    }
    const singletonValue = arielleApp.getSingleton(
      originalPropertyValue,
      false,
    )?.name;
    if (singletonValue) return singletonValue;
  }
  if (bean) {
    return arielleApp.getSingleton(bean).name;
  }

  getLogger().warn(
    `Using variable name to assign ${colorText(COLORS.Magenta, `${singletonObj.name}.${propertyKey}`)}, can cause unexpected results`,
  );
  return capitalizeFirstLetter(propertyKey);
};

export function assignValueToBeanProperty(
  singletonObj: SingletonObj,
  propertyKey: string,
  value: any,
) {
  Reflect.deleteProperty(singletonObj.clazz, propertyKey);
  Reflect.defineProperty(singletonObj.clazz, propertyKey, {
    get: () => value,
    set: (args) => {
      value = args;
    },
    enumerable: true,
    configurable: true,
  });
}
