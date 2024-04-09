import ArielleApp from '../../common/ArielleApp';
import { CommonConfigArgs } from '../../common/type';

export function restController(urlPath = '', args?: CommonConfigArgs) {
  const arielleApp = ArielleApp.getInstanceByAppName(args?.instance);
  return (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    arielleApp.registerBeanDecorator('restController', 9, () => {
      const className = arielleApp.getSingleton(target)?.name;
      const x = arielleApp.processSingletonMethods(
        'restController',
        target,
        propertyKey,
        descriptor,
      );
      x?.addArgs({ className, urlPath });
    });
  };
}
