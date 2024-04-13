import * as config from 'areille/common/utilities/config';
import { KnownENV } from 'areille/common/utilities/config';
import { SequelizeDatabase } from 'areille/database/classes/sequelize/SequelizeDatabase';
import { getMockedObj } from '../../../utils/mockedClass';

jest.mock('areille/common/utilities/config');
jest.mock('areille/server/classes/AppServer');
jest.mock('areille/common/decorators/component');
jest.mock('areille/common/decorators/autowired');

function spyConfig(args: Partial<KnownENV>) {
  jest.spyOn(config, 'default').mockImplementation(() => {
    return {
      isProduction: jest.fn(() => args.NODE_ENV === 'production'),
      isTest: jest.fn(() => args.NODE_ENV !== 'production'),
      ENV: args as unknown as KnownENV,
    };
  });
}

describe('SequelizeDatabase test ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should  be able to open and close conn', async () => {
    spyConfig({ SQL_LOG_QUERY: true });
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
    spyConfig({ SQL_DATABASE_FORCE_SYNC_DB: true });
    const instance = new SequelizeDatabase();
    await instance.connect();
    expect(instance.getConnection().sync).toBeCalledWith({ force: true });
  });

  test('should  be able to register models', async () => {
    spyConfig({ SQL_DATABASE_FORCE_SYNC_DB: true });
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

  test('test beanMigrationUtils', async () => {
    const instance = new SequelizeDatabase();
    await instance.connect();
    const res = await instance.beanMigrationUtils('str');
  });
});
