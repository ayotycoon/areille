import path from 'path';
import { setConfig } from '../../common/utilities/config';
import AppServer from '../../server/classes/AppServer';
import ArielleApp from '../ArielleApp';
import { StartApplicationArgs } from '../type';
import { importAnnotatedModules } from '../utilities/scanner';

async function fn(args: { target: any } & StartApplicationArgs) {
  if (args.ENV) {
    setConfig({ ENV: args.ENV });
  }
  const libDir = path.resolve(__dirname, '../../');
  const arielleApp = ArielleApp.getInstanceByAppName();
  await importAnnotatedModules(arielleApp, { ...args, libDir });
  await arielleApp.processAnnotationProcessor();
  (arielleApp.getSingleton(args.target).clazz as AppServer).start();
}

export default function startApplication(args: string | StartApplicationArgs) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  return (target: any) => {
    if (!(target.prototype instanceof AppServer))
      throw new Error(
        'startApplication can only be used on a instance of AppServer',
      );
    if (typeof args === 'string')
      arielleApp.setInitializationPromise(fn({ target, scanDir: args }));
    else arielleApp.setInitializationPromise(fn({ target, ...args }));
  };
}
