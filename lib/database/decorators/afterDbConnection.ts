import ArielleApp from '../../common/ArielleApp';

/**
 * runs after db connected successfully
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export function afterDbConnection(
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  arielleApp.registerBeanDecorator('afterDbConnection', 10, () => {
    arielleApp.processSingletonMethods(
      'afterDbConnection',
      target,
      propertyKey,
      descriptor,
    );
  });
}
