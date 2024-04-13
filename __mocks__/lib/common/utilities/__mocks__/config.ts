const getConfig = () => {
  return {
    ENV: {} as any,
    isProduction: jest.fn(),
    isTest: jest.fn(),
  };
};

export default getConfig;
