import ArielleApp from '../../lib/common/ArielleApp';

describe('ArielleApp test ', () => {
  test('should be able to test toJSON ', () => {
    const instance = ArielleApp.getInstanceByAppName();
    expect(instance.toJSON()).toBeTruthy();
  });
});
