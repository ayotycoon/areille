import * as s from "sequelize";

function mockedEntity() {
  return {
    signature: jest.fn(),
    status: jest.fn(),
    save: jest.fn(),
  };
}

class Mocked {
  authenticate = jest.fn();
  sync = jest.fn();
  close = jest.fn();
  define = jest.fn(() => {
    return {
      create: jest.fn(() => mockedEntity()),
      sync: jest.fn(),
      findOne: jest.fn(() => mockedEntity()),
    };
  });
  transaction = () =>
    Promise.resolve({
      commit: jest.fn(),
      rollback: jest.fn(),
    });
  config = {
    host: 0,
    port: 0,
  };
  constructor(a: any, b: any, c: any, d: any) {
    d?.logging("sample message");
  }
}

export const Sequelize = Mocked;
export const DataTypes = s.DataTypes;
