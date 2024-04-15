export default () => {
  return {
    ENV: {} as any,
    isProduction: jest.fn(),
    isTest: jest.fn(),
  };
};
