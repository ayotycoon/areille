import cron from 'node-cron';
import getLogger from '../utilities/logger';

export function runCron(timer: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = (...args: any) => {
      getLogger().info('Setting Cron for ' + timer);
      cron.schedule(timer, () => method.apply(target, args));
    };
  };
}
