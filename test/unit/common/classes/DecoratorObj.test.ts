import DecoratorObj from 'areille/common/classes/DecoratorObj';
import { getMockedObj } from '../../../utils/mockedClass';
jest.mock('areille/server/classes/AppServer');

describe('DecoratorObj test ', () => {
  test('instantiating class 1', () => {
    const instance = new DecoratorObj({
      args: {},
      target: getMockedObj().Clazz,
      fn: jest.fn(),
    });

    expect(instance.args).toStrictEqual({});
    expect(instance.target).toBe(getMockedObj().Clazz);
    expect(instance.fn).toBeDefined();
  });

  test('instantiating class 2', () => {
    const instance = new DecoratorObj({
      args: {},
      target: getMockedObj().Clazz,
    });

    expect(instance.args).toStrictEqual({});
    expect(instance.target).toBe(getMockedObj().Clazz);
    expect(instance.fn).not.toBeDefined();
  });

  test('instantiating class 3', () => {
    const instance = new DecoratorObj({
      args: {},
      target: getMockedObj().Clazz,
    });
    instance.addArgs({ hello: 'world' });

    expect(instance.args).toStrictEqual({ hello: 'world' });
    expect(instance.target).toBe(getMockedObj().Clazz);
    expect(instance.fn).not.toBeDefined();

    instance.args = undefined as any;
    instance.addArgs({ hello: 'world22' });
    expect(instance.args).toStrictEqual({ hello: 'world22' });
  });
});
