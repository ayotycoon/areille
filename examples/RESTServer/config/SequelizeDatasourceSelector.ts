import autowired from 'areille/common/decorators/autowired';
import component from 'areille/common/decorators/component';
import { DatasourceSelector } from 'areille/database/DatasourceSelector';
import { SequelizeDatabase } from 'areille/database/classes/sequelize/SequelizeDatabase';
import { SequelizeDatasourceAuthHandler } from './SequelizeDatasourceAuthHandler';

@component()
export class SequelizeDatasourceSelector extends DatasourceSelector {
  @autowired()
  public datasource = SequelizeDatabase.prototype;
  @autowired()
  public datasourceAuthHandler = SequelizeDatasourceAuthHandler.prototype;
}
