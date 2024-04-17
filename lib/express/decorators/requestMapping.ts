import ArielleApp from '../../common/ArielleApp';
import { CommonConfigArgs } from '../../common/type';
import { getConstructorName } from '../../common/utilities';
import { RestMethod } from '../utilities/types';

interface Args {
  urlPath?: string;
  /**
   * method must be of type RestMethod.
   * @default {RestMethod.GET}
   */
  method?: RestMethod;
  authHandler?: string | string[];
  /**
   * if true, this ignores the controller route entirely and configures the route solely based on requestMapping url
   * @default false
   */
  absolute?: boolean;
  prepend?: string;
  roles?: string[];
}

export function requestMapping(
  _options: Args | string = '',
  args?: CommonConfigArgs,
) {
  let options: Args = {};
  if (typeof _options === 'string') {
    options.urlPath = _options;
  } else {
    options = _options;
  }

  const {
    urlPath,
    method = RestMethod.GET,
    authHandler = 'OPEN',
    absolute = false,
    roles,
    prepend,
  } = options;

  const arielleApp = ArielleApp.getInstanceByAppName(args?.instance);
  return (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    arielleApp.registerBeanDecorator(target, requestMapping.name, 7, () => {
      const obj = arielleApp.processSingletonMethods(
        'requestMapping',
        target,
        propertyKey,
        descriptor,
      );
      if (!obj) return;
      const className = getConstructorName(target);
      obj.addArgs({
        className,
        urlPath,
        authHandler,
        method,
        propertyKey,
        descriptor,
        absolute,
        roles,
        prepend,
      });
    });
  };
}
