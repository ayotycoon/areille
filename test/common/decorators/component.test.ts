import ArielleApp from '../../../lib/common/ArielleApp';
import component from '../../../lib/common/decorators/component';
import getLogger from '../../../lib/common/utilities/logger';
import { getMockedClass } from '../../utils/mockedClass';

jest.mock('../../../lib/common/ArielleApp');
describe('bean test ', () => {
  let mockedClass: {
    Clazz: any;
    property?: string;
    descriptor?: PropertyDescriptor;
  };
  afterEach(() => {
    expect(ArielleApp.getInstanceByAppName).toHaveBeenCalled();
    expect(
      ArielleApp.getInstanceByAppName().registerBeanDecorator,
    ).toHaveBeenCalledWith('component', 0, expect.any(Function));
    expect(
      ArielleApp.getInstanceByAppName().instantiateSingleton,
    ).toHaveBeenCalled();

    // clear mocks
    jest.clearAllMocks();
  });
  test('should be able to annotate main bean', () => {
    mockedClass = getMockedClass();
    component()(
      mockedClass.Clazz,
      mockedClass.property,
      mockedClass.descriptor,
    );
    // assert mainBean was called
    expect(getLogger().debug).toHaveBeenCalledWith(`registering main Sample`);
  });

  test('should be able to annotate child bean', () => {
    mockedClass = getMockedClass(true);
    component()(
      mockedClass.Clazz,
      mockedClass.property,
      mockedClass.descriptor,
    );
    // assert childBean was called
    expect(getLogger().debug).toHaveBeenCalledWith(
      `registering child ExtendedSample`,
    );
  });
  /*
  test("should throw error of maxBean is reached", () => {
    mockedClass = getMockedClass();
    bean({maxBean:0})(mockedClass.Clazz, mockedClass.property, mockedClass.descriptor);

    const childMockedClass = getMockedClass(true)
    expect(()=> {
      bean()(childMockedClass.Clazz, childMockedClass.property, childMockedClass.descriptor);
    }).toThrow()

  });
*/
});
