import ArielleApp from '../ArielleApp';
import { Clazz, ComponentArgs } from '../type';
import { getConstructorName } from '../utilities';
import getLogger from '../utilities/logger';

export default function component(args?: ComponentArgs) {
  return (
    target: Clazz,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    const arielleApp = ArielleApp.getInstanceByAppName();
    arielleApp.registerBeanDecorator(target, component.name, 0, () => {
      const name = args?.name || getConstructorName(target);
      if (arielleApp.getSingleton(target, false)) {
        getLogger().warn(`${name} has already initialized`);
        return;
      }
      if (target.prototype?.constructor) {
        const parentTarget = Object.getPrototypeOf(target.prototype);
        const parentName = arielleApp.getSingleton(parentTarget, false)?.name;

        if (parentName) {
          getLogger().debug(`registering child ${name}`);
          return child(name, target, propertyKey, descriptor, args);
        }
      }

      getLogger().debug(`registering main ${name}`);
      return main(name, target, propertyKey, descriptor, args);
    });
  };
}

function main(
  name: string,
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
  optionalArgs?: ComponentArgs,
  isChild?: boolean,
) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  arielleApp.instantiateSingleton(target, optionalArgs, isChild);
  arielleApp.processSingletonMethods(
    component.name,
    target,
    propertyKey,
    descriptor,
  );
}

function child(
  name: string,
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
  optionalArgs?: ComponentArgs,
) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  const parentTarget = Object.getPrototypeOf(target.prototype);

  const parentName = arielleApp.getSingleton(parentTarget)?.name as string;

  main(name, target, propertyKey, descriptor, optionalArgs, true);
  const obj = arielleApp.getSingleton(target, false);
  obj.primaryBean = target;
  obj.parent = parentName;

  function addPreviousBeanInstances(
    subParentName: string | undefined,
    depth: number,
  ) {
    if (!subParentName) return;
    const parentSingletonObj = arielleApp.getSingleton(subParentName, false);
    if (!parentSingletonObj) return;
    if (
      parentSingletonObj.args?.maxBean &&
      parentSingletonObj?.beans.flat().length >=
        parentSingletonObj.args?.maxBean
    ) {
      throw new Error(`Maximum number of bean reached for ${subParentName}`);
    }
    if (depth === parentSingletonObj?.beans.length) {
      parentSingletonObj.beans.push([]);
    }
    parentSingletonObj?.beans[depth].push(name);
    if (parentSingletonObj?.beans[depth].length > 1) {
      const primaryBeans = parentSingletonObj?.beans[depth]
        .map((s) => arielleApp.getSingleton(s))
        .filter((b) => b.args?.primary);
      if (primaryBeans?.length > 1) {
        throw new Error(
          `Multiple bean of type ${subParentName} was marked as primary`,
        );
      }
      const primaryBean = primaryBeans[0];
      if (!primaryBean) {
        throw new Error(
          `Multiple bean of type ${subParentName} found. Choose a primary from [${parentSingletonObj?.beans[depth].join(',')}]`,
        );
      }
      parentSingletonObj.primaryBean = primaryBean.Clazz as any;
    } else {
      if (
        !parentSingletonObj.primaryBean ||
        (parentSingletonObj.primaryBean &&
          (!arielleApp.getSingleton(parentSingletonObj.primaryBean).args
            ?.primary ||
            (parentSingletonObj.primaryBean &&
              obj.clazz instanceof
                arielleApp.getSingleton(parentSingletonObj.primaryBean).Clazz)))
      ) {
        parentSingletonObj.primaryBean = obj.primaryBean || target;
      }
    }

    addPreviousBeanInstances(parentSingletonObj?.parent, depth + 1);
  }

  addPreviousBeanInstances(parentName, 0);
}
