import ArielleApp from '../../common/ArielleApp';

export function afterGRPCConnection(
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
) {
  const arielleApp = ArielleApp.getInstanceByAppName();

  arielleApp.processSingletonMethods(
    'afterGRPCConnection',
    target,
    propertyKey,
    descriptor,
  );
}
