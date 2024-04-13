interface Props {
  args: any;
  fn?: () => void | Promise<void>;
  target: any;
}

export default class DecoratorObj<T = {}> {
  args: T;
  fn?: (...args: any[]) => void | Promise<void>;
  target: any;

  constructor(props: Props) {
    this.args = props.args;
    this.target = props.target;
    this.fn = props.fn;
  }

  public addArgs(obj: Partial<T>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!this.args) this.args = {};
    this.args = { ...this.args, ...obj };
  }
}
