import { Selector } from '../../common/classes/Selector';
import autowired from '../../common/decorators/autowired';
import selector from '../../common/decorators/selector';
import { Authentication } from './Authentication';

@selector
export class AuthenticationSelector extends Selector {
  @autowired()
  public authentication = Authentication.prototype;
}
