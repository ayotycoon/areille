import { GlobalLogger } from 'js-logger';
import { KnownEnv } from './utilities/config';

export interface RuntimeConfigArgs {
  env: KnownEnv;
  handlers: { logger: (Logger: GlobalLogger) => void };
}
export interface PartialRuntimeConfigArgs {
  env: Partial<KnownEnv>;
  handlers: Partial<{ logger: (Logger: GlobalLogger) => void }>;
}
export interface CommonConfigArgs {
  instance?: string;
}
export interface ComponentArgs extends CommonConfigArgs {
  name?: string;
  maxBean?: number;
  order?: number;
  primary?: boolean;
}

export interface AutowiredArgs extends CommonConfigArgs {
  bean?: Clazz;
  exact?: boolean;
}

export type Clazz = { new (...args: any[]): any };

export interface BeanConfig {
  blockedFilesOrDir: string[];
  originalDir: string;
}
export interface StartApplicationArgs extends Partial<RuntimeConfigArgs> {
  scanDir?: string;
  shouldScanLib?: boolean;
  classes?: {
    include?: Clazz[];
    exclude?: Clazz[];
  };
}
