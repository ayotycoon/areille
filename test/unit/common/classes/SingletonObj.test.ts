import SingletonObj from 'areille/common/classes/SingletonObj';
import { ComponentArgs } from 'areille/common/type';
import { getMockedObj } from '../../../utils/mockedClass';
jest.mock('areille/server/classes/AppServer');

describe('SingletonObj test ', () => {
  let props: {
    name: string;
    clazz: any;
    Clazz: any;
    args?: ComponentArgs;
    propertyBeans?: Map<string, { name: string; def: Function }>;
    autowiredCandidates?: any[];
    primaryBean: any;
    beans?: string[][];
    parent?: string;
  };
  beforeEach(() => {
    props = {
      name: 'string',
      clazz: getMockedObj().Clazz,
      Clazz: getMockedObj().Clazz,
      args: {},
      propertyBeans: new Map(),
      autowiredCandidates: [getMockedObj().Clazz],
      primaryBean: getMockedObj().Clazz,
      beans: [['bean']],
      parent: 'parent',
    };
  });
  test('instantiating class 1', () => {
    const instance = new SingletonObj(props);
    expect(instance.args).toStrictEqual({});
    instance.addArgs({ hello: 'world' });
    expect(instance.autowiredCandidates[0]).toBe(getMockedObj().Clazz);
    expect(instance.args).toStrictEqual({ hello: 'world' });
  });
  test('instantiating class 2', () => {
    const instance = SingletonObj.of(getMockedObj().Clazz);
    expect(instance.args).toStrictEqual({});
    instance.addArgs({ hello: 'world' });
    expect(instance.args).toStrictEqual({ hello: 'world' });
    instance.args = undefined as any;
    instance.addArgs({ hello: 'world22' });
    expect(instance.args).toStrictEqual({ hello: 'world22' });
  });
});
