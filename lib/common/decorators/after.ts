import ArielleApp from '../ArielleApp';

const after = (decorator: Function) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const arielleApp = ArielleApp.getInstanceByAppName();
    arielleApp.registerBeanDecoratorLifecycle(target, decorator.name, () => {
      const method = descriptor.value;
      const classSingletonObj = arielleApp.getSingleton(target);
      descriptor.value = () => {
        return method.apply(
          classSingletonObj.clazz,
          classSingletonObj.autowiredCandidates,
        );
      };
      descriptor.value();
    });
  };
};

export const init = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  return after({ name: 'all' } as any)(target, propertyKey, descriptor);
};

export default after;
