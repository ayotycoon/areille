import { Clazz, ComponentArgs } from '../type';
interface Props<T extends Clazz> {
  name: string;
  /**
   * instance
   */
  clazz: InstanceType<T>;
  Clazz: Clazz;
  args?: ComponentArgs;
  propertyBeans?: Map<string, { name: string; def: Function }>;
  autowiredCandidates?: Clazz[];
  primaryBean: Clazz;
  beans?: string[][];
  parent?: string;
}
export default class SingletonObj<T extends Clazz = Clazz> {
  name: string;
  clazz: InstanceType<T>;
  Clazz: Clazz;
  args: ComponentArgs = {};
  propertyBeans: Map<string, { name: string; def: Function }> = new Map();
  autowiredCandidates: Clazz[] = [];
  primaryBean: Clazz;
  beans: string[][] = [];
  parent?: string;

  constructor(props: Props<T>) {
    this.name = props.name;
    this.clazz = props.clazz;
    this.Clazz = props.Clazz;
    this.primaryBean = props.primaryBean;
    if (props.propertyBeans) this.propertyBeans = props.propertyBeans;
    if (props.autowiredCandidates)
      this.autowiredCandidates = props.autowiredCandidates;
    if (props.beans) this.beans = props.beans;
    if (props.parent) this.parent = props.parent;
    if (props.args) this.args = props.args;
  }
  public addArgs(obj: any) {
    if (!this.args) this.args = {};
    this.args = { ...this.args, ...obj };
  }
  public static of<Y extends Clazz>(Clazz: Y) {
    return new SingletonObj<Y>({
      name: '',
      clazz: Clazz.prototype,
      Clazz: Clazz,
      primaryBean: Clazz,
      args: {},
    });
  }
}
