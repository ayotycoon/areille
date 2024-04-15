import fs from 'fs';
import getConfig from '../../common/utilities/config';
import ArielleApp from '../ArielleApp';
import { BeanConfig, StartApplicationArgs } from '../type';
import getLogger, { COLORS, colorText } from './logger';

const allowedExt = new Set(['js', 'ts']);

export function getFiles(config: BeanConfig, dir: string) {
  let files: {
    fullPath: string;
    projectPath: string;
  }[] = [];
  const fileList = fs.readdirSync(dir);
  if (config.blockedFilesOrDir.find((each) => dir.endsWith(each))) {
    getLogger().info(
      `${colorText(COLORS.Blue, '[scanner]')} -  Skipping dir ${dir}`,
    );
    return files;
  }
  for (const file of fileList) {
    const fullPath = `${dir}/${file}`;
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      files = [...files, ...getFiles(config, fullPath)];
    } else {
      const split = fullPath.split('.');
      const ext = split[split.length - 1];
      if (
        !allowedExt.has(ext) ||
        config.blockedFilesOrDir.find((each) => fullPath.endsWith(each))
      ) {
        getLogger().info(
          `${colorText(COLORS.Blue, '[scanner]')} -  Skipping file ${fullPath}`,
        );
        continue;
      }
      files.push({
        fullPath: fullPath,
        projectPath: `/src${fullPath.replace(config.originalDir, '')}`,
      });
    }
  }
  return files;
}

export async function importAnnotatedModules(
  arielleApp: ArielleApp,
  {
    shouldScanLib = true,
    scanDir,
    libDir,
    classes,
  }: StartApplicationArgs & { libDir: string },
) {
  async function importer(dir: string) {
    const config = {
      blockedFilesOrDir: getConfig().ENV.IGNORE_DIR,
      originalDir: dir,
    };
    const files = getFiles(config, dir);
    for (const file of files) {
      await import(file.fullPath);
    }
  }
  registerClasses(arielleApp, classes);
  if (shouldScanLib) await importer(libDir);
  if (scanDir) await importer(scanDir);
}

function registerClasses(
  arielleApp: ArielleApp,
  classes: StartApplicationArgs['classes'],
) {
  if (!classes) return;
  if (classes?.exclude && classes.exclude.length != 0) {
    for (const Clazz of classes.exclude) {
      arielleApp.excludeClass(Clazz);
      getLogger().info(`excluding ${Clazz.name}`);
    }
  }
  if (classes?.include && classes.include.length != 0) {
    for (const Clazz of classes.include) {
      getLogger().info(`manually importing ${Clazz.name}`);
    }
  }
}
