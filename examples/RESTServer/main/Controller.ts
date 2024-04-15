import SingletonObj from 'areille/common/classes/SingletonObj';
import autowired from 'areille/common/decorators/autowired';
import component from 'areille/common/decorators/component';
import { requestMapping } from 'areille/express/decorators/requestMapping';
import { restController } from 'areille/express/decorators/restController';
import { EnhancedRequest } from 'areille/express/utilities/classes/EnhancedRequest';
import { RestMethod } from 'areille/express/utilities/types';
import Food from './Food.model';
import { PaymentMethod } from './PaymentMethod';
import Service from './Service';

@component()
@restController()
export default class Controller {
  @autowired({ bean: Service, exact: true })
  private service!: Service;

  @autowired({ exact: true })
  private paymentMethodSingletonObj = SingletonObj.of(PaymentMethod);

  @requestMapping({
    urlPath: '/auth/login',
    method: RestMethod.POST,
    authHandler: 'USER',
    absolute: true,
  })
  public async login({ body }: EnhancedRequest) {
    return this.service.login(body);
  }
  @requestMapping({
    urlPath: '/auth/register',
    method: RestMethod.POST,
    authHandler: 'USER',
    absolute: true,
  })
  public async register({ body }: EnhancedRequest) {
    return this.service.register(body);
  }

  @requestMapping({
    urlPath: '/auth/food',
    method: RestMethod.GET,
    authHandler: 'ADMIN',
    absolute: true,
  })
  public async getAllAuthFood() {
    return this.service.getAll();
  }

  @requestMapping('/food')
  public async getAllFood() {
    await this.service.swallowError();
    return this.service.getAll();
  }
  @requestMapping('/payment-methods')
  public async getPaymentMethods() {
    return this.paymentMethodSingletonObj.beans.flat();
  }

  @requestMapping({ urlPath: '/food', method: RestMethod.POST })
  public async post({
    body,
  }: EnhancedRequest<{
    name: string;
    category: string;
    description: string;
  }>) {
    return await Food.create(body);
  }
}
