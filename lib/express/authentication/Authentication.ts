import component from '../../common/decorators/component';
import Person from '../../database/classes/Person';
import { EnhancedRequest } from '../utilities/classes/EnhancedRequest';

@component()
export class Authentication {
  public getAuthenticatedPersonWithAuthHandler = async (
    req: EnhancedRequest,
    authHandler: string,
    roles: string[] = [],
  ) => {
    const p = new Person();
    p.roles = roles;
    return p;
  };
}
