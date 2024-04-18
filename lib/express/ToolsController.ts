import ArielleApp from '../common/ArielleApp';
import component from '../common/decorators/component';
import { requestMapping } from './decorators/requestMapping';
import { restController } from './decorators/restController';
import JsonResponse from './utilities/classes/response/JsonResponse';

@component()
@restController()
export class ToolsController {
  @requestMapping({ urlPath: '/health', absolute: true })
  public getGlobalBean() {
    return new JsonResponse(ArielleApp.getInstanceByAppName().toString());
  }
}
