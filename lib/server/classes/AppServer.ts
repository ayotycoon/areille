import ArielleApp from '../../common/ArielleApp';
import autowired from '../../common/decorators/autowired';
import component from '../../common/decorators/component';
import { DatasourceSelector } from '../../database/DatasourceSelector';

@component({ order: -1 })
export default class AppServer {
  @autowired()
  protected datasourceProvider = DatasourceSelector.prototype;
  protected arielleApp!: ArielleApp;

  public start() {
    this.arielleApp = ArielleApp.getInstanceByAppName();
  }

  async beforeServerStart() {
    await this.arielleApp.runAnnotationFunctions('beforeServerStart');
    await this.datasourceProvider.datasource.connect();
    await this.afterDbConnection();
  }

  async afterServerStart() {
    await this.arielleApp.runAnnotationFunctions('afterServerStart');
  }

  async afterDbConnection() {
    await this.arielleApp.runAnnotationFunctions('migration');
    await this.arielleApp.runAnnotationFunctions('afterDbConnection');
  }
}
