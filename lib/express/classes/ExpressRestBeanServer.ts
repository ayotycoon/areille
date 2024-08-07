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
  protected app!: Express;
  protected server!: any;
  @autowired()
  protected expressRouteProcessor = ExpressRouteProcessor.prototype;

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
  protected postConfig() {}
  protected config() {
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
      this.postConfig();
      this.expressRouteProcessor.process(this.arielleApp, this.app);
      await this.beforeServerStart();
      const serverPromise = () =>
        new Promise((resolve) => {
          this.server = this.app.listen(getConfig().env.PORT, async () => {
            resolve(getConfig().env.PORT);
            getLogger().info(
              `${colorText(COLORS.Blue, `[AppServer]`)} - express Server started on port ${getConfig().env.PORT} [env=${getConfig().env.NODE_ENV}]`,
            );
            await this.afterServerStart();
          });
        });
      await serverPromise();
    };
    this.initialization = fn();
    await this.initialization;
  }

  protected initialization: Promise<void> = undefined as any;
  public async waitTillInitialization() {
    await super.waitTillInitialization();
    return this.initialization;
  }
}
