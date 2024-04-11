import ArielleApp from '../../../lib/common/ArielleApp';
import selector from '../../../lib/common/decorators/selector';
import getLogger from '../../../lib/common/utilities/logger';
import { getMockedObj } from '../utils/mockedClass';

jest.mock('../../../lib/common/ArielleApp');
jest.mock('areille/server/classes/AppServer');
describe('selector test ', () => {
  afterEach(() => {
    // clear mocks
    ArielleApp.getInstanceByAppName().deRegister();
    jest.clearAllMocks();
  });
  test('should be able to annotate', () => {
    const mockedObj = getMockedObj(8);
    selector(mockedObj.Clazz);
    // assert mainBean was called
    expect(getLogger().debug).toHaveBeenCalledWith(
      `registering main SampleSelector`,
    );

    expect(ArielleApp.getInstanceByAppName).toHaveBeenCalled();
    expect(
      ArielleApp.getInstanceByAppName().registerBeanDecorator,
    ).toHaveBeenCalledWith(
      'component',
      expect.any(Number),
      expect.any(Function),
    );
    expect(
      ArielleApp.getInstanceByAppName().instantiateSingleton,
    ).toHaveBeenCalled();
  });

  test('should throw error if class does not extend selector class', () => {
    const mockedObj = getMockedObj();

    expect(() => {
      selector(mockedObj.Clazz);
    }).toThrow('Selector class must be instance of Selector');
  });
});
