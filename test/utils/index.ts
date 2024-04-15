import * as config from 'areille/common/utilities/config';
import { KnownENV } from 'areille/common/utilities/config';

export function spyConfig(args: Partial<KnownENV>) {
  jest.spyOn(config, 'default').mockImplementation(() => {
    return {
      isProduction: jest.fn(() => args.NODE_ENV === 'production'),
      isTest: jest.fn(() => args.NODE_ENV !== 'production'),
      ENV: args as unknown as KnownENV,
    };
  });
}
