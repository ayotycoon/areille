import ArielleApp from 'areille/common/ArielleApp';
import appInstance from 'areille/common/decorators/appInstance';
import component from 'areille/common/decorators/component';
import value from 'areille/common/decorators/value';
import { afterDbConnection } from 'areille/database/decorators/afterDbConnection';
import migration from 'areille/database/decorators/migration';
import log, { Log } from '../../../lib/common/decorators/log';
import Person from './Person';

@component()
export class Bootstrap {
  @appInstance()
  private app!: ArielleApp;
  @log
  private log!: Log;
  @value('PORT')
  private variable!: string;
  @afterDbConnection
  public async init() {
    this.log.info('testing log');
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
