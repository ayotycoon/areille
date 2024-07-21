import component from '../../common/decorators/component';
import getLogger, { COLORS, colorText } from '../../common/utilities/logger';
import { EnhancedRequest } from '../../express/utilities/classes/EnhancedRequest';
import Principal from './Principal';

@component()
export class DatasourceAuthHandler {
  public async findPrincipal(args: {
    req: EnhancedRequest;
    id: string | number;
    roles: string[];
    authHandler: string;
  }): Promise<Principal | null> {
    getLogger().warn(
      `bean of ${colorText(COLORS.Magenta, 'DatasourceAuthHandler')} not found ${args}`,
    );
    return null;
  }
}
