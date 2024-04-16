import DecoratorObj from "areille/common/classes/DecoratorObj";
import SingletonObj from "areille/common/classes/SingletonObj";
import AnyKeyMap from "areille/common/utilities/AnyKeyMap";

const actual = jest.requireActual("areille/common/ArielleApp");
const actualInstance = new actual.default("default");
let mocked: any = null;
class Mocked {
  public singleton = new AnyKeyMap<SingletonObj>(2);
  public decoratorLifecycle = new Map<string, (() => Promise<void> | void)[]>();
  public decoratorFunctions: Map<string, Map<string, DecoratorObj>> = new Map();
  public registeredDecorators = new Map<
    string,
    { priority: number; decoratorName: string; fns: any[] }
  >();
  public excludedClasses = new Set();
  private instance = "default";
  constructor(instance = "default") {
    this.instance = instance;
  }

  instantiateSingleton = jest.fn(actualInstance.instantiateSingleton);
  getSingleton = jest.fn(actualInstance.getSingleton);
  getAutoWireSingleton = jest.fn(actualInstance.getAutoWireSingleton);
  getDecoratorFunctions = jest.fn(actualInstance.getDecoratorFunctions);
  getDecoratorFunctionsOnly = jest.fn(actualInstance.getDecoratorFunctionsOnly);
  getAllBeanFunctions = jest.fn(actualInstance.getAllBeanFunctions);
  getBeanChildren = jest.fn(actualInstance.getBeanChildren);
  getAllSingleton = jest.fn(actualInstance.getAllSingleton);
  processSingletonMethods = jest.fn(actualInstance.processSingletonMethods);
  excludeClass = jest.fn(actualInstance.excludeClass);
  isClassExcluded = jest.fn(actualInstance.isClassExcluded);
  setInitializationPromise = jest.fn(actualInstance.setInitializationPromise);
  processAnnotationProcessor = jest.fn(
    actualInstance.processAnnotationProcessor,
  );
  runLifecycleAnnotationFunctions = jest.fn(
    actualInstance.runLifecycleAnnotationFunctions,
  );
  runAnnotationFunctions = jest.fn(actualInstance.runAnnotationFunctions);
  registerBeanDecoratorLifecycle = jest.fn(
    actualInstance.registerBeanDecoratorLifecycle,
  );
  static getInstanceByAppName = jest.fn((...args: any[]) => {
    if (!mocked) mocked = new Mocked("default");
    return mocked;
  });
  static registerAppInstance = jest.fn();
  registerBeanDecorator = jest.fn((a, b, c, d) => d());
  deRegister = jest.fn(() => {
    (global as any).appInstance = { default: {} };
    actualInstance.deRegister();
    mocked = new Mocked("default");
  });
}

export default Mocked;
