import component from '../../common/decorators/component';

@component({ maxBean: 1 })
export class ExpressRouteConfigurator {
  private arr: { regex: RegExp; handler: string }[] = [];

  public registerUrlToHandler(regex: RegExp, handler: string) {
    this.arr.push({ regex, handler });
  }

  public getPreconfiguredHandler(fullUrl: string) {
    for (const obj of this.arr) {
      if (obj.regex.test(fullUrl)) {
        return obj.handler;
      }
    }
    return undefined;
  }
}
