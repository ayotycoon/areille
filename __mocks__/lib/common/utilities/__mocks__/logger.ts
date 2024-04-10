const actual = jest.requireActual("areille/common/utilities/logger");

export const colorText = (a: any, s: any) => s;
export const COLORS = actual["COLORS"];
export default () => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
};
