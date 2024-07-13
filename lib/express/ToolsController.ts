import ArielleApp from '../common/ArielleApp';
import component from '../common/decorators/component';
import getConfig from '../common/utilities/config';
import { requestMapping } from './decorators/requestMapping';
import { restController } from './decorators/restController';
import JsonResponse from './utilities/classes/response/JsonResponse';

@component()
@restController()
export class ToolsController {
  @requestMapping({ urlPath: '/health', absolute: true })
  public getGlobalBean() {
    const obj = {
      ...ArielleApp.getInstanceByAppName().toJSON(),
      port: getConfig().env.PORT,
    };
    return new JsonResponse(obj);
  }
}
