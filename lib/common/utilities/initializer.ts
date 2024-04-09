import fs from 'fs';
import getConfig from '../../common/utilities/config';
import { BeanConfig } from '../type';
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
      `${colorText(COLORS.Magenta, 'Skipping Scan dir')} ${dir}`,
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
          `${colorText(COLORS.Magenta, 'Skipping Scan file')} ${fullPath}`,
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

export async function importAnnotatedModules({
  scanDir,
  libDir,
}: {
  scanDir: string;
  libDir: string;
}) {
  const config = {
    blockedFilesOrDir: getConfig().ENV.IGNORE_DIR,
    originalDir: scanDir,
  };
  async function importer(_scanDir: string) {
    const files = getFiles(config, _scanDir);
    for (const file of files) {
      await import(file.fullPath);
    }
  }
  await importer(libDir);
  await importer(scanDir);
}
