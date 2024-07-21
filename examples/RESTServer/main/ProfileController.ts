import component from 'areille/common/decorators/component';
import { requestMapping } from 'areille/express/decorators/requestMapping';
import { restController } from 'areille/express/decorators/restController';
import { EnhancedRequest } from 'areille/express/utilities/classes/EnhancedRequest';
import { RestMethod } from 'areille/express/utilities/types';

@component()
@restController('/profile')
export default class ProfileController {
  @requestMapping({
    urlPath: '/profile',
    method: RestMethod.GET,
    authHandler: 'ADMIN',
    absolute: true,
  })
  public async getLoggedInUser({ principal }: EnhancedRequest) {
    return principal;
  }

  @requestMapping({
    urlPath: '/auth/profile',
    method: RestMethod.GET,
    absolute: true,
  })
  public async getLoggedInUser2({ principal }: EnhancedRequest) {
    return principal;
  }
}
