import ArielleApp from 'areille/common/ArielleApp';
import app from 'areille/common/decorators/app';
import component from 'areille/common/decorators/component';
import { afterDbConnection } from 'areille/database/decorators/afterDbConnection';
import migration from 'areille/database/decorators/migration';
import Person from './Person';

@component()
export class Bootstrap {
  @app()
  private app!: ArielleApp;
  @afterDbConnection
  private async init() {
    const person = await Person.findOne({ where: { username: 'super-admin' } });
    if (person != null) return;
    await Person.create({ username: 'super-admin', id: 'super-admin' });
  }

  @migration()
  private async populateUsers() {
    for (let i = 0; i < 10; i++) {
      await Person.create({ username: 'user' + i, id: 'user' + i });
    }
  }

  @afterDbConnection
  private async getBeans() {}
}
