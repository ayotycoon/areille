import ArielleApp from 'areille/common/ArielleApp';
import component from 'areille/common/decorators/component';
import getLogger from 'areille/common/utilities/logger';
import { getMockedObj } from '../../utils/mockedClass';

jest.mock('areille/common/ArielleApp');
jest.mock('areille/server/classes/AppServer');

describe('component test ', () => {
  afterEach(() => {
    // clear mocks
    ArielleApp.getInstanceByAppName().deRegister();
    jest.clearAllMocks();
  });

  test('should be able to annotate main bean', () => {
    const mockedObj = getMockedObj();
    component()(mockedObj.Clazz, mockedObj.property, mockedObj.descriptor);
    // assert mainBean was called
    expect(getLogger().debug).toHaveBeenCalledWith(`registering main Sample`);

    expect(ArielleApp.getInstanceByAppName).toHaveBeenCalled();
    expect(
      ArielleApp.getInstanceByAppName().registerBeanDecorator,
    ).toHaveBeenCalledWith(
      expect.any(Function),
      'component',
      expect.any(Number),
      expect.any(Function),
    );
    expect(
      ArielleApp.getInstanceByAppName().instantiateSingleton,
    ).toHaveBeenCalled();
  });

  test('should be able to annotate child bean', () => {
    const mockedParentClass = getMockedObj();
    component()(
      mockedParentClass.Clazz,
      mockedParentClass.property,
      mockedParentClass.descriptor,
    );

    const mockedObj = getMockedObj(1);
    component()(mockedObj.Clazz, mockedObj.property, mockedObj.descriptor);
    // assert childBean was called
    expect(getLogger().debug).toHaveBeenCalledWith(
      `registering child ExtendedSampleA`,
    );
  });

  test('should be able to mark primary bean', () => {
    const mockedObj = getMockedObj();
    component()(mockedObj.Clazz, mockedObj.property, mockedObj.descriptor);

    const childMockedAObj = getMockedObj(1);
    component()(
      childMockedAObj.Clazz,
      childMockedAObj.property,
      childMockedAObj.descriptor,
    );
    const childMockedBObj = getMockedObj(2);
    component({ primary: true })(
      childMockedBObj.Clazz,
      childMockedBObj.property,
      childMockedBObj.descriptor,
    );
    const obj = ArielleApp.getInstanceByAppName().getSingleton(mockedObj.Clazz);
    expect(obj.primaryBean.name).toBe(childMockedBObj.Clazz.name);
  });

  test('should be able to mark primary bean even if another bean is extended', () => {
    const mockedObj = getMockedObj();
    component()(mockedObj.Clazz, mockedObj.property, mockedObj.descriptor);

    const childMockedAObj = getMockedObj(1);
    component()(
      childMockedAObj.Clazz,
      childMockedAObj.property,
      childMockedAObj.descriptor,
    );
    const childMockedBObj = getMockedObj(2);
    component({ primary: true })(
      childMockedBObj.Clazz,
      childMockedBObj.property,
      childMockedBObj.descriptor,
    );
    const childMockedA2Obj = getMockedObj(3);
    component()(
      childMockedA2Obj.Clazz,
      childMockedA2Obj.property,
      childMockedA2Obj.descriptor,
    );
    const obj = ArielleApp.getInstanceByAppName().getSingleton(mockedObj.Clazz);
    expect(obj.primaryBean.name).toBe(childMockedBObj.Clazz.name);
  });
  test('should throw error of maxBean is reached', () => {
    const mockedObj = getMockedObj();
    component({ maxBean: 1 })(
      mockedObj.Clazz,
      mockedObj.property,
      mockedObj.descriptor,
    );

    const childMockedAObj = getMockedObj(1);
    component()(
      childMockedAObj.Clazz,
      childMockedAObj.property,
      childMockedAObj.descriptor,
    );
    const childMockedBObj = getMockedObj(2);
    expect(() => {
      component({ primary: true })(
        childMockedBObj.Clazz,
        childMockedBObj.property,
        childMockedBObj.descriptor,
      );
    }).toThrow('Maximum number of bean reached for Sample');
  });
  test('should throw multiple bean error', () => {
    const mockedObj = getMockedObj();
    component()(mockedObj.Clazz, mockedObj.property, mockedObj.descriptor);

    const childMockedAObj = getMockedObj(1);
    component()(
      childMockedAObj.Clazz,
      childMockedAObj.property,
      childMockedAObj.descriptor,
    );
    const childMockedBObj = getMockedObj(2);
    expect(() => {
      component()(
        childMockedBObj.Clazz,
        childMockedBObj.property,
        childMockedBObj.descriptor,
      );
    }).toThrow(
      'Multiple bean of type Sample found. Choose a primary from [ExtendedSampleA,ExtendedSampleB]',
    );
  });
  test('should throw multiple primary bean error', () => {
    const mockedObj = getMockedObj();
    component()(mockedObj.Clazz, mockedObj.property, mockedObj.descriptor);

    const childMockedAObj = getMockedObj(1);
    component({ primary: true })(
      childMockedAObj.Clazz,
      childMockedAObj.property,
      childMockedAObj.descriptor,
    );
    const childMockedBObj = getMockedObj(2);
    expect(() => {
      component({ primary: true })(
        childMockedBObj.Clazz,
        childMockedBObj.property,
        childMockedBObj.descriptor,
      );
    }).toThrow('Multiple bean of type Sample was marked as primary');
  });
});
