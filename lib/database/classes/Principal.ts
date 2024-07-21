/**
 * Authentication class. any auth impl must map to this class
 */
export default class Principal {
  public id?: string | number;
  public username?: string;
  public roles: string[] = [];
  public handler?: string;
  public enabled?: boolean;
  public data?: any;
}
