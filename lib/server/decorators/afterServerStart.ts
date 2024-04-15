import ArielleApp from '../../common/ArielleApp';

export function afterServerStart(
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  arielleApp.registerBeanDecorator(
    target,
    afterServerStart.name,
    10,
    async () => {
      arielleApp.processSingletonMethods(
        'afterServerStart',
        target,
        propertyKey,
        descriptor,
      );
    },
  );
}
