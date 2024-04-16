import { Response } from 'express';
import autowired from '../../common/decorators/autowired';
import component from '../../common/decorators/component';
import { swallowError } from '../../common/utilities';
import getConfig from '../../common/utilities/config';
import getLogger from '../../common/utilities/logger';
import { AuthenticationSelector } from '../authentication/AuthenticationSelector';
import { EnhancedRequest } from '../utilities/classes/EnhancedRequest';
import { FilteredQuery } from '../utilities/classes/FilteredQuery';
import GenericError from '../utilities/classes/GenericError';
import BlobResponse from '../utilities/classes/response/BlobResponse';
import JsonResponse from '../utilities/classes/response/JsonResponse';

@component()
export class ExpressRouteHelper {
  @autowired()
  private authenticationProvider = AuthenticationSelector.prototype;

  public process = async <T>(
    req: EnhancedRequest,
    res: Response,
    cb: (req: EnhancedRequest) => Promise<T>,
    authHandlers: string[] = [],
    roles?: string[],
  ) => {
    req.filteredQuery = new FilteredQuery(req.query as any);
    try {
      if (authHandlers && authHandlers.length > 0) {
        const obj = {
          success: 0,
          error: '',
        };
        for (const authHandler of authHandlers) {
          if (authHandler === 'OPEN') {
            obj.success++;
            continue;
          }
          // think about handling the multiple usecases
          const person = await swallowError(
            () =>
              this.authenticationProvider.authentication.getAuthenticatedPersonWithAuthHandler(
                req,
                authHandler,
                roles,
              ),
            obj,
          );
          if (person) {
            req.person = person;
            obj.success++;
            continue;
          }
        }
        if (!obj.success) {
          throw new GenericError(obj.error, 401);
        }
      }

      const reply = await cb(req);
      if (reply instanceof JsonResponse) {
        const obj: any = JSON.parse(JSON.stringify(reply));
        JsonResponse.sanitizeObj(obj.data);
        return res.status(reply.statusCode).json(obj);
      }
      if (reply instanceof BlobResponse) {
        res.set({
          'Content-Type': reply.type.toString(),
        });
        return res.status(200).json(reply.data);
      }
      getLogger().warn(
        `restController requestMappings should return type 'Response' `,
      );
      return res.send(reply);
    } catch (e: any) {
      getLogger().error(e);
      const errorResponse = new GenericError(
        e.message || (typeof e === 'string' ? e : 'An error has occurred'),
      );
      errorResponse.stack = getConfig().isProduction() ? undefined : e.stack;

      if (e instanceof GenericError) {
        errorResponse.statusCode = e.statusCode;
      }

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  };
}
