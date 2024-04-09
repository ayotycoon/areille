import { init } from 'areille/common/decorators/after';
import component from 'areille/common/decorators/component';
import { ExpressRouteConfigurator } from 'areille/express/classes/ExpressRouteConfigurator';

@component()
export default class RouteConfigurator extends ExpressRouteConfigurator {
  @init
  private init() {
    super.registerUrlToHandler(/^\/auth\//, 'USER');
  }
}
