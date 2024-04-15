import ArielleApp from 'areille/common/ArielleApp';
import component from 'areille/common/decorators/component';
import startApplication from 'areille/common/decorators/startApplication';
import { SequelizeDatabase } from 'areille/database/classes/sequelize/SequelizeDatabase';
import { ToolsController } from 'areille/express/ToolsController';
import { JWTAuthentication } from 'areille/express/authentication/JWTAuthentication';
import ExpressRestBeanServer from 'areille/express/classes/ExpressRestBeanServer';
import AppServer from 'areille/server/classes/AppServer';
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
        exclude: [SequelizeDatabase, ToolsController, JWTAuthentication],
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
  test('ExpressRestBeanServer is defined', () => {
    const bean = arielleApp.getAutoWireSingleton(AppServer);
    expect(bean).toBeDefined();
    expect(bean instanceof ExpressRestBeanServer).toBeTruthy();
  });
});
