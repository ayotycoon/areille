let mocked = null as any;
export default class Mocked {
  public registerBeanDecorator = jest.fn(
    (decoratorName: string, priority: number, cb: () => void) => {
      cb();
    },
  );
  getSingleton = jest.fn(() => {
    return { name: "SingletonName" };
  });
  public instantiateSingleton = jest.fn();
  public processSingletonMethods = jest.fn();

  public static getInstanceByAppName = jest.fn(() => {
    if (!mocked) mocked = new Mocked();

    return mocked;
  });
}
