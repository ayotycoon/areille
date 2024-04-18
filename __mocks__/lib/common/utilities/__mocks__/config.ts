export default () => {
  return {
    env: {} as any,
    isProduction: jest.fn(),
    isTest: jest.fn(),
  };
};
