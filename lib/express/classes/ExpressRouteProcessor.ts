import express, { Express, Request, Response } from 'express';
import ArielleApp from '../../common/ArielleApp';
import autowired from '../../common/decorators/autowired';
import component from '../../common/decorators/component';
import getLogger, { COLORS, colorText } from '../../common/utilities/logger';
import { EnhancedRequest } from '../utilities/classes/EnhancedRequest';
import { RestMethod } from '../utilities/types';
import { ExpressRouteConfigurator } from './ExpressRouteConfigurator';
import { ExpressRouteHelper } from './ExpressRouteHelper';

@component()
export class ExpressRouteProcessor {
  @autowired()
  private expressRouteHelper: ExpressRouteHelper = ExpressRouteHelper.prototype;
  @autowired()
  private expressRouteConfigurator: ExpressRouteConfigurator =
    ExpressRouteConfigurator.prototype;

  public process(arielleApp: ArielleApp, app: Express) {
    const restControllers =
      arielleApp.getDecoratorFunctionsOnly<{
        className: string;
        urlPath: string;
      }>('restController') || [];
    const requestMappings =
      arielleApp.getDecoratorFunctionsOnly<{
        className: string;
        method: RestMethod;
        authHandler: string | string[];
        urlPath: string;
        propertyKey: string;
        absolute: boolean;
        prepend: string;
        roles: string[];
      }>('requestMapping') || [];

    for (const restController of restControllers) {
      const controllerRouter = express.Router();
      for (const requestMapping of requestMappings) {
        if (restController.target !== requestMapping.target) continue;
        if (requestMapping?.args.absolute && requestMapping?.args.prepend)
          throw new Error('prepend and absolute cannot be used together');
        const requestMappingUrl = requestMapping.args.urlPath;
        const isAbsolute = requestMapping?.args.absolute;
        const prepend = requestMapping?.args.prepend;

        let fullUrl = isAbsolute
          ? requestMapping.args?.urlPath
          : `${restController.args?.urlPath}${requestMapping.args?.urlPath}`;
        if (prepend) {
          fullUrl = `${prepend}${fullUrl}`;
        }
        const method = requestMapping.args.method;
        let authHandlers = Array.isArray(requestMapping.args?.authHandler)
          ? requestMapping.args?.authHandler
          : [requestMapping.args?.authHandler];
        const preConfiguredAuthHandler =
          this.expressRouteConfigurator.getPreconfiguredHandler(fullUrl);
        if (preConfiguredAuthHandler) {
          if (authHandlers?.indexOf(preConfiguredAuthHandler) !== -1) continue;
          authHandlers = authHandlers?.filter((a) => a !== 'OPEN');
          authHandlers.unshift(preConfiguredAuthHandler);
        }

        const authenticationMethod = (
          req: EnhancedRequest,
          res: Response,
          cb: (req: EnhancedRequest) => Promise<any>,
          roles?: string[],
        ) => {
          return this.expressRouteHelper.process(
            req,
            res,
            cb,
            authHandlers,
            roles,
          );
        };
        const authHandlersString = authHandlers?.join(',');

        if (isAbsolute) {
          app[method](requestMappingUrl, (req: Request, res: Response) =>
            authenticationMethod(
              req as unknown as any,
              res,
              requestMapping.fn as any,
            ),
          );
          getLogger().info(
            `${colorText(COLORS.Blue, `[routing]`)} - ${requestMapping.args?.method} ${colorText(COLORS.Magenta, authHandlersString)} ${fullUrl}`,
          );

          continue;
        }

        if (prepend) {
          app[method](fullUrl, (req: Request, res: Response) =>
            authenticationMethod(
              req as unknown as any,
              res,
              requestMapping.fn as any,
            ),
          );
          getLogger().info(
            `${colorText(COLORS.Blue, `[routing]`)} - ${requestMapping.args?.method} ${colorText(COLORS.Magenta, authHandlersString)} ${fullUrl}`,
          );

          continue;
        }
        getLogger().info(
          `${colorText(COLORS.Blue, `[routing]`)} - ${requestMapping.args?.method} ${colorText(COLORS.Magenta, authHandlersString)} ${fullUrl}`,
        );

        controllerRouter[method](
          requestMappingUrl,
          (req: Request, res: Response) =>
            authenticationMethod(
              req as unknown as any,
              res,
              requestMapping.fn as any,
            ),
        );
      }
      app.use(restController.args?.urlPath, controllerRouter);
    }

    this.registerErrorRoutes(app);
  }

  public registerErrorRoutes(app: Express) {
    app.all('**', (req: Request, res: Response) =>
      this.expressRouteHelper.process(
        req as unknown as any,
        res,
        async (req: EnhancedRequest) => {
          throw new Error(`invalid url ${req.url}`);
        },
      ),
    );
  }
}
