import component from '../../common/decorators/component';
import getLogger, { COLORS, colorText } from '../../common/utilities/logger';
import Person from './Person';

@component()
export class DatasourceAuthHandler {
  public async findPersonByRole(args: {
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
