import { PartialRuntimeConfigArgs } from 'areille/common/type';
import * as config from 'areille/common/utilities/config';
import { KnownEnv } from 'areille/common/utilities/config';

export function spyConfig(args: Partial<PartialRuntimeConfigArgs>) {
  jest.spyOn(config, 'default').mockImplementation(() => {
    return {
      isProduction: jest.fn(() => args?.env?.NODE_ENV === 'production'),
      isTest: jest.fn(() => args?.env?.NODE_ENV !== 'production'),
      handlers: args.handlers || { logger: () => {} },
      env: args?.env as unknown as KnownEnv,
    } as any;
  });
}
