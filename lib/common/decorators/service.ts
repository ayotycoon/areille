import { Clazz, ComponentArgs } from '../type';
import component from './component';

export default function service(args?: ComponentArgs) {
  return (
    target: Clazz,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    return component(args)(target, propertyKey, descriptor);
  };
}
