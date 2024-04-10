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
  private server!: any;
  @autowired()
  private expressRouteProcessor = ExpressRouteProcessor.prototype;

  async stop() {
    super.stop();
    if (!this.server) return;
    const serverPromise = () =>
      new Promise((resolve) => {
        this.server.close(function () {
          resolve(true);
        });
      });
    await serverPromise();
    this.server = null;
  }
  private config() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(cookieParser());
    this.app.use(cors({ origin: '*', credentials: true }));
  }
  public async start() {
    const fn = async () => {
      super.start();
      this.config();
      this.expressRouteProcessor.process(this.arielleApp, this.app);
      await this.beforeServerStart();
      const serverPromise = () =>
        new Promise((resolve) => {
          this.server = this.app.listen(getConfig().ENV.PORT, async () => {
            resolve(getConfig().ENV.PORT);
            getLogger().info(
              `${colorText(COLORS.Magenta, 'REST Server started')} on port ${getConfig().ENV.PORT} [env=${getConfig().ENV.NODE_ENV}]`,
            );
            await this.afterServerStart();
          });
        });
      await serverPromise();
    };
    this.initialization = fn();
    await this.initialization;
  }

  private initialization: Promise<void> = undefined as any;
  public async waitTillInitialization() {
    await super.waitTillInitialization();
    return this.initialization;
  }
}
