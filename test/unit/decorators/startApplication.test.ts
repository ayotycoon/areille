import ArielleApp from 'areille/common/ArielleApp';
import startApplication from 'areille/common/decorators/startApplication';
import { importAnnotatedModules } from 'areille/common/utilities/scanner';
import { getMockedObj } from '../../utils/mockedClass';

jest.mock('areille/server/classes/AppServer');
jest.mock('areille/common/ArielleApp');
jest.mock('areille/common/utilities/scanner');
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
