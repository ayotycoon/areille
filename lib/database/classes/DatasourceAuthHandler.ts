import component from '../../common/decorators/component';
import getLogger, { COLORS, colorText } from '../../common/utilities/logger';
import { EnhancedRequest } from '../../express/utilities/classes/EnhancedRequest';
import Person from './Person';

@component()
export class DatasourceAuthHandler {
  public async findPersonByRole(args: {
    req: EnhancedRequest;
    id: string | number;
    roles: string[];
    authHandler: string;
  }): Promise<Person | null> {
    getLogger().warn(
      `bean of ${colorText(COLORS.Magenta, 'DatasourceAuthHandler')} not found ${args}`,
    );
    return null;
  }
}
