import component from '../../common/decorators/component';
import Principal from '../../database/classes/Principal';
import { EnhancedRequest } from '../utilities/classes/EnhancedRequest';

@component()
export class Authentication {
  public getAuthenticatedPrincipal = async (
    req: EnhancedRequest,
    authHandler: string,
    roles: string[] = [],
  ) => {
    const p = new Principal();
    p.roles = roles;
    return p;
  };
}
