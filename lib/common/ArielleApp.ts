import DecoratorObj from './classes/DecoratorObj';
import SingletonObj from './classes/SingletonObj';
import { Clazz, ComponentArgs } from './type';
import { getConstructorName } from './utilities';
import AnyKeyMap from './utilities/AnyKeyMap';
import getLogger, { COLORS, colorText } from './utilities/logger';

const customGlobal: typeof globalThis & {
  appInstance: { [key: string]: ArielleApp };
} = global as any;

export default class ArielleApp {
  public singleton = new AnyKeyMap<SingletonObj>(2);
  public decoratorLifecycle = new Map<
    string,
    { target: any; fn: () => Promise<void> | void }[]
  >();
  public decoratorFunctions: Map<string, Map<string, DecoratorObj>> = new Map();
  public registeredDecorators = new Map<
    string,
    {
      priority: number;
      decoratorName: string;
      obj: { target: any; fn: () => Promise<void> | void }[];
    }
  >();
  private excludedClasses = new Set<Clazz>();
  private instance: string;
  public getInstance() {
    return this.instance;
  }
  constructor(instance: string) {
    this.instance = instance;
  }
  private reset() {
    this.singleton = new AnyKeyMap<SingletonObj>(2);
    this.decoratorLifecycle = new Map();
    this.decoratorFunctions = new Map();
    this.registeredDecorators = new Map();
    this.excludedClasses = new Set();
  }

  public instantiateSingleton(
    target: any,
    args?: ComponentArgs,
    isChild?: boolean,
  ) {
    const name = args?.name || getConstructorName(target);
    const Clazz = target?.prototype?.constructor || target.constructor;

    if (this.singleton.has()(name)) {
      const val = this.singleton.get()(name);
      if (val?.Clazz && val.Clazz !== Clazz) {
        throw new Error(`bean with name ${name} already exists`);
      }
      getLogger().info(
        `${colorText(COLORS.Blue, '[component]')} -  ${colorText(COLORS.Red, 'ignoring')} ${colorText(COLORS.Magenta, 'registering bean')} ${name}`,
      );
      return val;
    }
    getLogger().info(
      `${colorText(COLORS.Blue, '[component]')} - ${colorText(COLORS.Magenta, `Registering bean - ${isChild ? 'C' : 'M'}`)} ${name}`,
    );

    const clazz = new Clazz();
    //  const clazz = Object.create(Clazz)

    this.singleton.set(
      name,
      target,
    )(
      new SingletonObj({
        name,
        clazz,
        Clazz: Clazz,
        args,
        primaryBean: clazz,
      }),
    );
    return this.singleton.get()(name);
  }

  public getSingleton<T extends Clazz>(
    key: T | string,
    throwError = true,
  ): SingletonObj<T> {
    let val;
    if (typeof key === 'string') {
      val = this.singleton.get(0)(key);
    } else {
      val =
        this.singleton.get(1)(key) || this.singleton.get(1)(key.constructor);
    }

    if (throwError && !val) {
      const name = typeof key === 'string' ? key : getConstructorName(key);
      throw new Error(`bean of ${name} not found`);
    }

    return val as SingletonObj<T>;
  }

  public getAutoWireSingleton<T extends Clazz>(key: T): InstanceType<T> {
    const val = this.getSingleton(key);

    if (val?.primaryBean !== key) {
      return this.getAutoWireSingleton(val?.primaryBean);
    }
    return val.clazz as unknown as InstanceType<T>;
  }

  public getDecoratorFunctions<T>(key: string): Map<string, DecoratorObj<T>[]> {
    return this.decoratorFunctions.get(key) || new Map();
  }

  public getDecoratorFunctionsOnly<T>(key: string): DecoratorObj<T>[] {
    const arr: DecoratorObj<T>[] = [];

    for (const x of this.getDecoratorFunctions<T>(key).values()) {
      for (const y of x) {
        arr.push(y);
      }
    }
    return arr;
  }

  public getAllBeanFunctions() {
    return this.decoratorFunctions;
  }
  public getBeanChildren<T extends Clazz>(key: T | string): any[] {
    const beans = this.getSingleton<T>(key)?.beans || new Set<string>();
    return beans.flat().map((bean) => this.getSingleton<T>(bean).clazz);
  }

  public deRegister() {
    this.reset();
    delete customGlobal.appInstance[this.instance];
  }

  public processSingletonMethods(
    decoratorName: string,
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    if (this.isClassExcluded(target)) return;
    if (!this.getAllBeanFunctions().has(decoratorName))
      this.getAllBeanFunctions().set(decoratorName, new Map());

    const obj = new DecoratorObj({
      args: {},
      target: descriptor ? target.constructor : target,
    });
    const singleton = this.getSingleton(target);
    // singleton.decorators
    const className = singleton.name;

    if (target && !propertyKey && !descriptor) {
      singleton.decorators.add(decoratorName);
    }

    if (descriptor) {
      const method = descriptor.value;

      descriptor.value = (...args: any) => {
        return method.apply(singleton?.clazz, args);
      };

      obj.fn = descriptor.value;
    }

    if (!this.getDecoratorFunctions(decoratorName)?.get(className)) {
      this.getDecoratorFunctions(decoratorName)?.set(className, []);
    }
    this.getDecoratorFunctions(decoratorName)?.get(className)?.push(obj);

    return obj;
  }

  public async runLifecycleAnnotationFunctions(decoratorName: string) {
    for (const obj of this.decoratorLifecycle.get(decoratorName) || []) {
      if (this.isClassExcluded(obj.target)) continue;
      await obj.fn();
    }
    getLogger().info(
      `${colorText(COLORS.Blue, `[${decoratorName}]`)} - Completed decorator Lifecycle`,
    );
  }

  public async runAnnotationFunctions(decoratorName: string) {
    for (const { fn } of this.getDecoratorFunctionsOnly(decoratorName) || []) {
      if (fn) await fn();
    }
    getLogger().info(
      `${colorText(COLORS.Blue, `[${decoratorName}]`)} - Completed runAnnotationFunctions`,
    );
  }

  async processAnnotationProcessor() {
    const arr = Array.from(this.registeredDecorators.values()).sort((a, b) => {
      return a.priority - b.priority;
    });
    getLogger().info(
      `${colorText(COLORS.Blue, '[engine]')} -  ${colorText(COLORS.Magenta, 'Processing Order')} ${Array.from(new Set<string>(arr.map((a) => a.decoratorName)))}`,
    );

    let last: string = '';
    for (const decoratorObj of arr) {
      // bug
      if (last && decoratorObj.decoratorName != last) {
        await this.runLifecycleAnnotationFunctions(last);
      }
      for (const functionObj of decoratorObj.obj || []) {
        if (this.isClassExcluded(functionObj.target)) continue;
        await functionObj.fn();
      }
      getLogger().info(
        `${colorText(COLORS.Blue, `[${decoratorObj.decoratorName}]`)} - completed`,
      );
      last = decoratorObj.decoratorName;
    }
    if (arr.length == 1) {
      await this.runLifecycleAnnotationFunctions(arr[0].decoratorName);
    }
    await this.runLifecycleAnnotationFunctions('all');
  }

  public static getInstanceByAppName(instance = 'default') {
    if (!customGlobal?.appInstance?.[instance]) {
      // throw Error(`instance ${instance} not found`);
      ArielleApp.registerAppInstance();
    }
    return customGlobal.appInstance[instance];
  }

  public static registerAppInstance(instance = 'default') {
    const g = new ArielleApp(instance);
    if (!customGlobal.appInstance) {
      customGlobal.appInstance = {};
    }
    customGlobal.appInstance[instance] = g;
    return g;
  }

  registerBeanDecoratorLifecycle(
    target: any,
    decoratorName: string,
    cb: () => Promise<void> | void,
  ) {
    if (!this.decoratorLifecycle.has(decoratorName)) {
      this.decoratorLifecycle.set(decoratorName, []);
    }
    this.decoratorLifecycle.get(decoratorName)?.push({ fn: cb, target });
  }
  registerBeanDecorator(
    target: any,
    decoratorName: string,
    priority: number,
    cb: () => void,
  ) {
    if (!this.registeredDecorators.has(decoratorName)) {
      this.registeredDecorators.set(decoratorName, {
        priority,
        decoratorName,
        obj: [],
      });
    }
    this.registeredDecorators.get(decoratorName)?.obj.push({ fn: cb, target });
  }
  private initialization: Promise<void> = undefined as any;
  public setInitializationPromise(promise: Promise<void>) {
    this.initialization = promise;
  }
  public waitTillInitialization() {
    return this.initialization;
  }

  public excludeClass(Clazz: Clazz) {
    this.excludedClasses.add(Clazz);
  }
  public isClassExcluded(Clazz: Clazz) {
    return (
      this.excludedClasses.has(Clazz) ||
      this.excludedClasses.has((Clazz as any).constructor)
    );
  }

  public getSingletons() {
    return Array.from(this.singleton.keys());
  }
  private jsonCache: any = null;
  public toJSON() {
    if (this.jsonCache) return this.jsonCache;
    this.jsonCache = {
      instance: this.instance,
    };
    return this.jsonCache;
  }
}
