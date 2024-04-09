import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import getLogger, { COLORS, colorText } from '../../common/utilities/logger';
import AppServer from '../../server/classes/AppServer';

import getConfig from '../../common/utilities/config';

import autowired from '../../common/decorators/autowired';
import component from '../../common/decorators/component';
import { ExpressRouteProcessor } from './ExpressRouteProcessor';

@component({ order: -2 })
export default class ExpressRestBeanServer extends AppServer {
  private app!: Express;
  @autowired()
  private expressRouteProcessor = ExpressRouteProcessor.prototype;

  async stop() {
    throw new Error('Server stopped');
  }
  private config() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(cookieParser());
    this.app.use(cors({ origin: '*', credentials: true }));
  }
  public async start() {
    await super.start();
    this.config();
    this.expressRouteProcessor.process(this.arielleApp, this.app);
    await this.beforeServerStart();
    this.app.listen(getConfig().ENV.PORT, async () => {
      getLogger().info(
        `${colorText(COLORS.Magenta, 'REST Server started')} on port ${getConfig().ENV.PORT} [env=${getConfig().ENV.NODE_ENV}]`,
      );
      await this.afterServerStart();
    });
  }
}
