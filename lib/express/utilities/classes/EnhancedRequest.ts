import Principal from '../../../database/classes/Principal';
import { FilteredQuery } from './FilteredQuery';

export class EnhancedRequest<B = any, P = any, Q = any> extends Request {
  public principal?: Principal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  public body: B = {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  public params: P = {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  public query: Q = {};
  public filteredQuery: FilteredQuery = new FilteredQuery(this.query as any);
  public deviceId: string = '';
}
