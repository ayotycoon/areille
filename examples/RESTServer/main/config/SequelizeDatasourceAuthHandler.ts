import component from 'areille/common/decorators/component';
import { DatasourceAuthHandler } from 'areille/database/classes/DatasourceAuthHandler';
import Principal from 'areille/database/classes/Principal';
import { EnhancedRequest } from 'areille/express/utilities/classes/EnhancedRequest';
import SequelizePerson from '../Person';

@component()
export class SequelizeDatasourceAuthHandler extends DatasourceAuthHandler {
  public async findPrincipal(args: {
    req: EnhancedRequest;
    id: string | number;
    roles: string[];
    authHandler: string;
  }) {
    const sequelizePerson = await SequelizePerson.findOne({
      where: {
        username: args.id,
      },
    });
    if (!sequelizePerson) return null;

    const principal = new Principal();
    principal.id = sequelizePerson.id;

    return principal;
  }
}
