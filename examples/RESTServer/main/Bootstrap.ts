import ArielleApp from 'areille/common/ArielleApp';
import appInstance from 'areille/common/decorators/appInstance';
import component from 'areille/common/decorators/component';
import { afterDbConnection } from 'areille/database/decorators/afterDbConnection';
import migration from 'areille/database/decorators/migration';
import Person from './Person';

@component()
export class Bootstrap {
  @appInstance()
  private app!: ArielleApp;
  @afterDbConnection
  public async init() {
    const person = await Person.findOne({
      where: { username: 'super-admin' },
    });
    if (person != null) return;
    await Person.create({ username: 'super-admin', password: 'password' });
  }

  @migration()
  public async populateUsers() {
    for (let i = 0; i < 10; i++) {
      await Person.create({ username: 'user' + i, password: 'password' });
    }
  }

  @afterDbConnection
  public async getBeans() {}
}
