import autowired from 'areille/common/decorators/autowired';
import component from 'areille/common/decorators/component';
import { AuthenticationSelector } from 'areille/express/authentication/AuthenticationSelector';
import { JWTAuthentication } from 'areille/express/authentication/JWTAuthentication';

@component()
export class JWTAuthenticationSelector extends AuthenticationSelector {
  @autowired()
  public authentication = JWTAuthentication.prototype;
}
