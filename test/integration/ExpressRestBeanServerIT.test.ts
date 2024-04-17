import ArielleApp from 'areille/common/ArielleApp';
import component from 'areille/common/decorators/component';
import startApplication from 'areille/common/decorators/startApplication';
import { SequelizeDatabase } from 'areille/database/classes/sequelize/SequelizeDatabase';
import { JWTAuthentication } from 'areille/express/authentication/JWTAuthentication';
import ExpressRestBeanServer from 'areille/express/classes/ExpressRestBeanServer';
import AppServer from 'areille/server/classes/AppServer';
import getConfig from 'areille/common/utilities/config';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

jest.unmock('js-logger');
jest.unmock('areille/common/utilities/logger');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('ExpressRestBeanServerIT', () => {
  let arielleApp: ArielleApp;
  beforeAll(async () => {
    component()(ExpressRestBeanServer);
    startApplication({
      // shouldScanLib: false,
      classes: {
        exclude: [SequelizeDatabase, JWTAuthentication],
      },
    })(ExpressRestBeanServer);
    arielleApp = ArielleApp.getInstanceByAppName();
    await arielleApp.waitTillInitialization();
    await arielleApp
      .getAutoWireSingleton(ExpressRestBeanServer)
      .waitTillInitialization();
  });
  afterAll(async () => {
    await arielleApp.getAutoWireSingleton(ExpressRestBeanServer).stop();
  });
  test('ExpressRestBeanServer is defined', async () => {
    const bean = arielleApp.getAutoWireSingleton(AppServer);
    expect(bean).toBeDefined();
    expect(bean instanceof ExpressRestBeanServer).toBeTruthy();
    const APP_URL = `http://localhost:${getConfig().ENV.PORT}/tools`;
    const res = await axios.get(APP_URL);
    expect(res.status).toBe(200);
  });
});
