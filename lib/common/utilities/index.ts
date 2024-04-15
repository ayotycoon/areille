import { Clazz } from '../type';

export function getConstructorName(target: Clazz): string {
  return target.name || target.constructor.name;
}
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function getTargetKeys(target: any) {
  return [
    ...Object.getOwnPropertyNames(target.prototype).filter(
      (s) => s !== 'constructor',
    ),
    ...Object.keys(target.prototype),
  ];
}

export const swallowError = async (cb: any, obj?: any) => {
  try {
    return await cb();
  } catch (e) {
    if (obj) {
      obj.error = e;
    }
    return null;
  }
};
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
