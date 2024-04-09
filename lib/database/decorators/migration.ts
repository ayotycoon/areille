import ArielleApp from '../../common/ArielleApp';
import { getConstructorName } from '../../common/utilities';
import getLogger, { COLORS, colorText } from '../../common/utilities/logger';
import { Datasource } from '../classes/Datasource';

/**
 * Runs a function if it has not been run before
 * @param id
 */
export default function migration(id: string = '') {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const arielleApp = ArielleApp.getInstanceByAppName();
    arielleApp.registerBeanDecorator(migration.name, 11, () => {
      const fileSignature = id + `#${propertyKey}`;
      const method = descriptor.value;
      descriptor.value = async (...args: any) => {
        const mig = await processMigration(arielleApp, fileSignature);
        if (!mig) return;
        const className = getConstructorName(target);
        const bean = arielleApp.getSingleton(className, false)?.clazz;
        try {
          await method.apply(bean || target, args);
          await mig.success();
        } catch (e) {
          await mig.fail();
        }
      };
      arielleApp.processSingletonMethods(
        'migration',
        target,
        propertyKey,
        descriptor,
      );
    });
  };
}

async function processMigration(arielleApp: ArielleApp, fileName: string) {
  const db = arielleApp.getAutoWireSingleton(Datasource);
  const utils = await db.beanMigrationUtils(fileName);
  const status = await utils.getMigrationFileStatus();
  if (status === 'SUCCESS') {
    getLogger().info(`Ignoring migration ${colorText(COLORS.Red, fileName)}`);
    return;
  }
  getLogger().info(`migrating ${colorText(COLORS.Green, fileName)}`);
  return {
    success: () => utils.success(),
    fail: () => utils.fail(),
  };
}
