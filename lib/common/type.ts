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
