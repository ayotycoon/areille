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
    arielleApp.registerBeanDecorator(target, migration.name, 9, () => {
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
          getLogger().info(
            `${colorText(COLORS.Blue, '[migration]')} -  ${fileSignature} - ${colorText(COLORS.Green, 'success')}`,
          );
        } catch (e) {
          getLogger().error(`${className}.${propertyKey} - failed `, e);
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

async function processMigration(arielleApp: ArielleApp, fileSignature: string) {
  const db = arielleApp.getAutoWireSingleton(Datasource);
  const utils = await db.beanMigrationUtils(fileSignature);
  const status = utils.getMigrationFileStatus();
  if (status === 'SUCCESS') {
    getLogger().info(
      `${colorText(COLORS.Blue, '[migration]')} -  ${fileSignature} - ${colorText(COLORS.Cyan, 'ignored')}`,
    );
    return;
  }
  getLogger().info(
    `${colorText(COLORS.Blue, '[migration]')} -  ${fileSignature} - ${colorText(COLORS.Cyan, 'attempting')}`,
  );
  return {
    success: () => utils.success(),
    fail: () => utils.fail(),
  };
}
