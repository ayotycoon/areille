import component from 'areille/common/decorators/component';
import { DatasourceAuthHandler } from 'areille/database/classes/DatasourceAuthHandler';
import Person from 'areille/database/classes/Person';
import { EnhancedRequest } from 'areille/express/utilities/classes/EnhancedRequest';
import SequelizePerson from '../Person';

@component()
export class SequelizeDatasourceAuthHandler extends DatasourceAuthHandler {
  public async findPersonByRole(args: {
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

    const person = new Person();
    person.id = sequelizePerson.id;

    return person;
  }
}
