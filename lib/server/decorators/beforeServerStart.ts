import ArielleApp from '../../common/ArielleApp';

export function beforeServerStart(
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  arielleApp.registerBeanDecorator(
    target,
    beforeServerStart.name,
    10,
    async () => {
      arielleApp.processSingletonMethods(
        'beforeServerStart',
        target,
        propertyKey,
        descriptor,
      );
    },
  );
}
