import { importAnnotatedModules } from 'areille/common/utilities/initializer';
import ArielleApp from '../../../lib/common/ArielleApp';
import startApplication from '../../../lib/common/decorators/startApplication';
import { getMockedObj } from '../utils/mockedClass';

jest.mock('areille/server/classes/AppServer');
jest.mock('../../../lib/common/ArielleApp');
jest.mock('areille/common/utilities/initializer');
describe('startApplication test ', () => {
  let app: ArielleApp;
  beforeEach(() => {
    app = ArielleApp.getInstanceByAppName();
    jest.spyOn(app, 'registerBeanDecorator').mockImplementation(() => {});

    jest.spyOn(app, 'getSingleton').mockReturnValue({
      clazz: {
        start: jest.fn(),
      },
    } as any);
  });
  afterEach(() => {
    // clear mocks
    app.deRegister();
    jest.clearAllMocks();
  });
  test('should be able to annotate', async () => {
    const mockedObj = getMockedObj(7);
    startApplication('path')(mockedObj.Clazz);

    expect(ArielleApp.getInstanceByAppName).toHaveBeenCalled();

    await new Promise(process.nextTick);
    expect(importAnnotatedModules).toHaveBeenCalled();
    expect(
      ArielleApp.getInstanceByAppName().processAnnotationProcessor,
    ).toBeCalled();
    expect(ArielleApp.getInstanceByAppName().getSingleton).toHaveBeenCalled();
  });

  test('should throw error if class does not extend AppServer class', () => {
    const mockedObj = getMockedObj();

    expect(() => {
      startApplication('path')(mockedObj.Clazz);
    }).toThrow('startApplication can only be used on a instance of AppServer');
  });
});
