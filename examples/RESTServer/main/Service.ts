import ArielleApp from 'areille/common/ArielleApp';
import autowired from 'areille/common/decorators/autowired';
import service from 'areille/common/decorators/service';
import { sneakyThrow } from 'areille/common/decorators/sneakyThrow';
import { Datasource } from 'areille/database/classes/Datasource';
import { JWTAuthentication } from 'areille/express/authentication/JWTAuthentication';
import { afterServerStart } from 'areille/server/decorators/afterServerStart';
import Food from './Food.model';
import Person from './Person';

@service()
export default class Service {
  @autowired()
  private jwtAuthentication = JWTAuthentication.prototype;
  public async getAll() {
    return await Food.findAll();
  }

  @sneakyThrow
  public async swallowError() {
    throw new Error('deliberate error');
  }

  @afterServerStart
  public async start() {
    const app = ArielleApp.getInstanceByAppName();

    const x = app.getBeanChildren(Datasource);

    return x;
  }

  public async register(body: any) {
    const person = await Person.create(body);
    return person;
  }
  public async login(body: any) {
    const person = await Person.findOne({ where: body });
    if (!person) throw new Error('invalid credentials');
    const token = await this.jwtAuthentication.generateToken({
      userId: body.username,
    });
    return { token };
  }
}
