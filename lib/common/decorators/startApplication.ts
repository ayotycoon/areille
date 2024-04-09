import path from 'path';
import AppServer from '../../server/classes/AppServer';
import ArielleApp from '../ArielleApp';
import { importAnnotatedModules } from '../utilities/initializer';

async function fn({ target, scanDir, libDir }: any) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  await importAnnotatedModules({
    scanDir,
    libDir,
  });
  await arielleApp.processAnnotationProcessor();
  (arielleApp.getSingleton(target).clazz as AppServer).start();
}

export default function startApplication(scanDir: string) {
  const libDir = path.resolve(__dirname, '../../');
  return (target: any) => {
    fn({ target, scanDir, libDir });
  };
}
