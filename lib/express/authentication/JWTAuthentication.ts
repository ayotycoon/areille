import jwt, { VerifyErrors } from 'jsonwebtoken';
import { init } from '../../common/decorators/after';
import autowired from '../../common/decorators/autowired';
import component from '../../common/decorators/component';
import getConfig from '../../common/utilities/config';
import { DatasourceSelector } from '../../database/DatasourceSelector';
import { EnhancedRequest } from '../utilities/classes/EnhancedRequest';
import GenericError from '../utilities/classes/GenericError';
import { Authentication } from './Authentication';

@component()
export class JWTAuthentication extends Authentication {
  @autowired()
  private datasourceProvider = DatasourceSelector.prototype;
  private authenticationHandlerMap = new Map<string, any>();

  @init
  private init() {
    this.registerAllHandlers();
  }

  public generateToken = (payload: any): Promise<string> => {
    return new Promise(function (resolve, reject) {
      jwt.sign(
        payload,
        getConfig().env.ACCESS_TOKEN_SECRET_KEY,
        {},
        (err: Error | null, encoded: string | undefined) => {
          if (err === null && encoded !== undefined) {
            resolve(encoded);
          } else {
            reject(err);
          }
        },
      );
    });
  };

  public parseToken = async (token: string): Promise<any> => {
    return new Promise((resolve, reject) =>
      jwt.verify(
        token,
        getConfig().env.ACCESS_TOKEN_SECRET_KEY as jwt.Secret,
        async (err: VerifyErrors | null, decodedUser: any) => {
          if (err) {
            const errorMessage =
              err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return reject(errorMessage);
          }
          resolve(decodedUser);
        },
      ),
    );
  };

  private registerAllHandlers() {
    const defaultHandler = async (
      handlerName: string,
      req: EnhancedRequest,
      decodedPerson: any,
      roles: string[],
    ) => {
      const principal = await this.datasourceProvider.datasource.findPrincipal({
        req,
        id: decodedPerson.id || decodedPerson.userId,
        roles,
        authHandler: handlerName,
      });

      return principal;
    };

    this.authenticationHandlerMap.set(
      'USER',
      (req: EnhancedRequest, decodedPerson: any, roles: string[]) =>
        defaultHandler('USER', req, decodedPerson, roles),
    );
  }

  public getAuthenticatedPrincipal = async (
    req: EnhancedRequest,
    authHandler: string,
    roles: string[] = [],
  ) => {
    const authHeader =
      (req && (req.headers as any).authorization) ||
      ((req && (req.headers as any).Authorization) as any);
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new GenericError('unauthenticated');

    const decodedPerson: any = await this.parseToken(token);
    const handler = this.authenticationHandlerMap.get(authHandler);
    if (!handler) throw new Error(`invalid handler '${authHandler}'`);
    const principal = await handler(req, decodedPerson, roles);
    if (!principal) {
      throw new GenericError('unauthorized');
    }
    principal.handler = authHandler;
    return principal;
  };
}
