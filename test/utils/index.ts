import * as config from 'areille/common/utilities/config';
import { KnownEnv } from 'areille/common/utilities/config';

export function spyConfig(args: Partial<KnownEnv>) {
  jest.spyOn(config, 'default').mockImplementation(() => {
    return {
      isProduction: jest.fn(() => args.NODE_ENV === 'production'),
      isTest: jest.fn(() => args.NODE_ENV !== 'production'),
      env: args as unknown as KnownEnv,
    };
  });
}
