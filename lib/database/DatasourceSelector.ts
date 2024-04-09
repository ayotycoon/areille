import { Selector } from '../common/classes/Selector';
import autowired from '../common/decorators/autowired';
import selector from '../common/decorators/selector';
import { Datasource } from './classes/Datasource';
import { DatasourceAuthHandler } from './classes/DatasourceAuthHandler';

@selector
export class DatasourceSelector extends Selector {
  @autowired()
  public datasource: Datasource = Datasource.prototype;
  @autowired()
  public datasourceAuthHandler: DatasourceAuthHandler =
    DatasourceAuthHandler.prototype;
}
