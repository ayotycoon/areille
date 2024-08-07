import { Sequelize, Transaction } from 'sequelize';
import autowired from '../../common/decorators/autowired';
import component from '../../common/decorators/component';
import { EnhancedRequest } from '../../express/utilities/classes/EnhancedRequest';
import { DatasourceSelector } from '../DatasourceSelector';
import Person from './Person';

@component()
export class Datasource {
  @autowired()
  protected datasourceProvider: DatasourceSelector =
    DatasourceSelector.prototype;
  getConnection() {
    return null as unknown as Sequelize;
  }

  async disconnect() {}

  public connect = async () => {
    return null as unknown as Sequelize;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public registerModel(field: any, cb?: any) {}
  public async executeWithTransaction<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cb: (t: Transaction) => Promise<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    existingTransaction?: Transaction,
  ) {
    return null as unknown as T;
  }
  public async findPersonByRole(args: {
    req: EnhancedRequest;
    id: string | number;
    roles: string[];
    authHandler: string;
  }): Promise<Person | null> {
    return this.datasourceProvider.datasourceAuthHandler.findPersonByRole(args);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async beanMigrationUtils(fileName: string) {
    return {
      getMigrationFileStatus: () => 'PENDING' as 'PENDING' | 'FAIL' | 'SUCCESS',
      success: () => Promise.resolve(),
      fail: () => Promise.resolve(),
    };
  }
}
