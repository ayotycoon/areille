import { getPaginatedData } from '../FilteredQuery';
import { EnhancedRequest } from './../EnhancedRequest';
import Response from './Response';

export class JsonResponse<T> extends Response {
  public pagination: any = undefined;
  public data: T;
  public message = 'Successful message';
  public statusCode = 200;

  constructor(data: any, req?: EnhancedRequest, message?: string) {
    super(data);
    if (data instanceof JsonResponse) {
      this.message = data.message;
      this.data = data.data;
      this.statusCode = data.statusCode;
      this.pagination = data.pagination;
      return;
    }
    if (message) this.message = message;
    this.data = data;
    if (
      data?.count != undefined &&
      data?.rows != undefined &&
      req?.filteredQuery
    ) {
      this.data = data.rows;

      this.pagination = getPaginatedData(
        req?.filteredQuery,
        data.rows,
        data.count,
      );
    }
  }
  public static sanitizeObj(obj: any) {
    if (!obj) return;
    if (obj.deletedAt !== undefined) delete obj.deletedAt;
    if (obj.password !== undefined) delete obj.password;
    if (obj.deviceId !== undefined) delete obj.deviceId;

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'bigint' ||
        typeof value === 'function' ||
        value === undefined ||
        value === null
      )
        return;
      if (Array.isArray(value)) {
        value.forEach((x) => {
          JsonResponse.sanitizeObj(x);
        });
        return;
      }
      if (typeof value === 'object') return JsonResponse.sanitizeObj(value);
    });
  }
}

export default JsonResponse;
