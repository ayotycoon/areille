import ArielleApp from 'areille/common/ArielleApp';
import service from 'areille/common/decorators/service';
import { sneakyThrow } from 'areille/common/decorators/sneakyThrow';
import { Datasource } from 'areille/database/classes/Datasource';
import { afterServerStart } from 'areille/server/decorators/afterServerStart';
import Food from './Food.model';

@service()
export default class Service {
  public async getAll() {
    return await Food.findAll();
  }

  @sneakyThrow
  public async swallowError() {
    throw new Error('deliberate error');
  }

  @afterServerStart
  public async start() {
    const app = ArielleApp.getInstanceByAppName();

    const x = app.getBeanChildren(Datasource);

    return x;
  }
}
