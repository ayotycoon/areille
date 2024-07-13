import { SequelizeDatabase } from 'areille/database/classes/sequelize/SequelizeDatabase';
import { spyConfig } from '../../../../utils';
import { getMockedObj } from '../../../../utils/mockedClass';

jest.mock('areille/common/utilities/config');
jest.mock('areille/server/classes/AppServer');
jest.mock('areille/common/decorators/component');
jest.mock('areille/common/decorators/autowired');

describe('SequelizeDatabase test ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should  be able to open and close conn', async () => {
    spyConfig({ env: { SQL_LOG_QUERY: true } });
    const instance = new SequelizeDatabase();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    instance.initDatabaseFields = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const initDatabaseFieldsMock = instance.initDatabaseFields;
    await instance.connect();
    expect(instance.getConnection()).toBeTruthy();
    expect(initDatabaseFieldsMock).toBeCalledTimes(1);
    await instance.connect();
    expect(initDatabaseFieldsMock).toBeCalledTimes(1);
    await instance.disconnect();
    expect(instance.getConnection()).toBeFalsy();
  });

  test('should  be able to open and sync db', async () => {
    spyConfig({ env: { SQL_DATABASE_FORCE_SYNC_DB: true } });
    const instance = new SequelizeDatabase();
    await instance.connect();
    expect(instance.getConnection().sync).toBeCalledWith({ force: true });
  });

  test('should  be able to register models', async () => {
    spyConfig({ env: { SQL_DATABASE_FORCE_SYNC_DB: true } });
    const cb = jest.fn(() => {});
    const Clazz = getMockedObj().Clazz as any;
    Clazz.init = jest.fn();
    const instance = new SequelizeDatabase();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const entities = instance.entities;
    expect(entities.length).toBe(0);
    instance.registerModel(Clazz, { fields: {}, cb });
    expect(entities.length).toBe(1);
    // connect
    await instance.connect();
    expect(cb).toHaveBeenCalled();
  });

  test('test executeWithTransaction to throw', async () => {
    const cb = jest.fn(() => {}) as any;
    const instance = new SequelizeDatabase();
    let error = null as any;
    try {
      await instance.executeWithTransaction(cb, null as any);
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
    expect(error.message).toBe('transaction not found');
  });

  test('test executeWithTransaction with transaction arg', async () => {
    const cb = jest.fn(() => {}) as any;
    const instance = new SequelizeDatabase();
    await instance.connect();
    const transaction = await instance.getConnection().transaction();
    await instance.executeWithTransaction(cb, transaction);
    expect(cb).toHaveBeenCalled();
    expect(transaction.commit).toHaveBeenCalled();
    // test roll back
    let error = null as any;
    try {
      await instance.executeWithTransaction(() => {
        throw new Error('error');
      }, transaction);
    } catch (e) {
      error = e;
    }

    expect(transaction.rollback).toHaveBeenCalled();
    expect(error.message).toBe('error');
  });

  test('test beanMigrationUtils with no entity', async () => {
    const instance = new SequelizeDatabase();
    await instance.connect();
    const connection = instance.getConnection();
    const defineReturn = {
      create: jest.fn(() => {
        return {
          signature: 'str',
          status: 'PENDING',
          save: jest.fn(),
        };
      }),
      sync: jest.fn(),
      findOne: jest.fn(() => null),
    };

    (connection.define as jest.Mock).mockImplementation(() => {
      return defineReturn;
    });
    const res = await instance.beanMigrationUtils('str');
    expect(res).toBeDefined();
    expect(defineReturn.create).toHaveBeenCalled();
    expect(res.getMigrationFileStatus()).toBe('PENDING');
  });

  test('test beanMigrationUtils and existing entity', async () => {
    spyConfig({ env: { SQL_DATABASE_FORCE_SYNC_DB: false } });
    const instance = new SequelizeDatabase();
    await instance.connect();
    const connection = instance.getConnection();
    const defineReturn = {
      create: jest.fn(() => {
        return {
          signature: 'str',
          status: 'FAIL',
          save: jest.fn(),
        };
      }),
      sync: jest.fn(),
      findOne: jest.fn(() => {
        return {
          signature: 'str',
          status: 'FAIL',
          save: jest.fn(),
        };
      }),
    };
    (connection.define as jest.Mock).mockImplementation(() => {
      return defineReturn;
    });
    const res = await instance.beanMigrationUtils('str');

    expect(defineReturn.create).not.toHaveBeenCalled();
    expect(res).toBeDefined();
    await res.success();
    expect(res.getMigrationFileStatus()).toBe('SUCCESS');
    await res.fail();
    expect(res.getMigrationFileStatus()).toBe('FAIL');
  });
});
