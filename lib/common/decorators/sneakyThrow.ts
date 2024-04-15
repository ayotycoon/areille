import ArielleApp from '../ArielleApp';
import { getConstructorName, getTargetKeys } from '../utilities';
import getLogger, { COLORS, colorText } from '../utilities/logger';

function getName(className: string, propertyKey: string) {
  if (className) return `${className}.${propertyKey}`;
  return propertyKey;
}

function processError(e: any, target: any, propertyKey: string) {
  const logArgs = [`[${getName(target, propertyKey)}]`, e] as any[];
  getLogger().error(...logArgs);
}

const _sneakyThrow = (
  arielleApp: ArielleApp,
  className: string,
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const method = descriptor.value;
  descriptor.value = (...args: any) => {
    try {
      getLogger().info(
        `${colorText(COLORS.Blue, '[sneakyThrow]')} -  Executing [${getName(className, propertyKey)}]`,
      );
      const bean = arielleApp.getSingleton(target, false)?.clazz;
      const res = method.apply(bean || target, args);
      if (res instanceof Promise) {
        return new Promise((resolve) => {
          res.then(resolve).catch((e) => {
            processError(e, className, propertyKey);
            return resolve(null);
          });
        });
      }
      return res;
    } catch (e) {
      processError(e, className, propertyKey);
    }
  };
};
export const sneakyThrow = (
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
) => {
  const arielleApp = ArielleApp.getInstanceByAppName();
  const className = getConstructorName(target);
  if (propertyKey && descriptor)
    return _sneakyThrow(arielleApp, className, target, propertyKey, descriptor);

  const properties = getTargetKeys(target);
  for (const propertyName of properties) {
    descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      propertyName,
    );
    if (!descriptor || !(descriptor.value instanceof Function)) continue;
    return _sneakyThrow(
      arielleApp,
      className,
      target,
      propertyName,
      descriptor,
    );
  }
};
