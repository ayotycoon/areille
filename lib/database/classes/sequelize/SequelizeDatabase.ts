import { DataTypes, Model, Sequelize, Transaction } from 'sequelize';

import { ModelStatic } from 'sequelize/types/model';
import component from '../../../common/decorators/component';
import getConfig from '../../../common/utilities/config';
import getLogger, { COLORS, colorText } from '../../../common/utilities/logger';
import GenericError from '../../../express/utilities/classes/GenericError';
import { SequelizeEntityArgs } from '../../common/types';
import { Datasource } from '../Datasource';

@component()
export class SequelizeDatabase extends Datasource {
  private connection = null as unknown as Sequelize;
  private entities: (SequelizeEntityArgs<any, any> & {
    Clazz?: ModelStatic<Model<any, any>>;
  })[] = [];

  getConnection() {
    return this.connection;
  }

  disconnect() {
    this.connection.close();
    this.connection = null as any;
  }

  public connect = async () => {
    if (this.connection) return this.connection;
    this.connection = new Sequelize(
      getConfig().ENV.SQL_DATABASE,
      getConfig().ENV.SQL_DATABASE_USERNAME,
      getConfig().ENV.SQL_DATABASE_PASSWORD,
      {
        host: getConfig().ENV.SQL_DATABASE_HOST,
        port: getConfig().ENV.SQL_DATABASE_PORT,
        dialect: getConfig().ENV.SQL_DATABASE_DIALECT as any,
        logging: (msg) =>
          getConfig().ENV.SQL_LOG_QUERY && getLogger().debug(msg),
      },
    );

    await this.initDatabaseFields();
    await this.connection.authenticate();
    await this.syncDB();

    getLogger().info(
      `${colorText(COLORS.Magenta, 'Datasource SQL')} Connected: ${this.connection.config.host} on port ${this.connection.config.port}`,
    );
    return this.connection;
  };

  private async syncDB() {
    await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');

    if (getConfig().ENV.SQL_DATABASE_FORCE_SYNC_DB) {
      await this.connection.sync({ force: true });
    } else {
      await this.connection.sync();
    }
    await this.connection.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  public registerModel(
    Clazz: ModelStatic<Model<any, any>>,
    entity: SequelizeEntityArgs<any, any> & {
      Clazz?: ModelStatic<Model<any, any>>;
    },
  ) {
    entity.Clazz = Clazz;
    this.entities.push(entity);
  }

  protected addFieldModifications = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entity: SequelizeEntityArgs<any, any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: any,
  ) => {};
  protected initModel = (
    modelName: string,
    Clazz: ModelStatic<Model<any, any>>,
    entity: SequelizeEntityArgs<any, any>,
    options: any,
  ) => {
    Clazz.init(entity.fields, {
      sequelize: this.connection,
      modelName,
      paranoid: true,
      constraints: false,
      freezeTableName: getConfig().isTest() ? true : false,
      ...options,
    });
  };
  private initDatabaseFields = async () => {
    for (const entity of this.entities) {
      const Clazz = entity.Clazz;
      if (!Clazz) continue;
      delete entity.Clazz;
      const options = entity.options || {};
      this.addFieldModifications(entity, options);

      let modelName: string = entity.modelName || Clazz.name;
      modelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
      this.initModel(modelName, Clazz, entity, options);
    }

    for (const cb of this.entities.map((x) => x.cb)) {
      if (cb) await cb();
    }
  };

  public async executeWithTransaction<T>(
    cb: (t: Transaction) => Promise<T>,
    existingTransaction?: Transaction,
  ) {
    const sequelizeTransaction =
      existingTransaction || (await this.getConnection()?.transaction());
    if (!sequelizeTransaction) throw new GenericError('transaction not found');
    try {
      const result = await cb(sequelizeTransaction);
      await sequelizeTransaction.commit();
      return result;
    } catch (e) {
      await sequelizeTransaction.rollback();
      throw e;
    }
  }

  async beanMigrationUtils(fileName: string) {
    const SystemMigrationTracker = this.getConnection().define(
      'system_migration_trackers',
      {
        signature: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
      },
    );
    if (getConfig().ENV.SQL_DATABASE_FORCE_SYNC_DB) {
      await SystemMigrationTracker.sync({ force: true });
    } else {
      await SystemMigrationTracker.sync();
    }

    let entity: any = await SystemMigrationTracker.findOne({
      where: {
        signature: fileName,
      },
    });

    if (!entity) {
      entity = await SystemMigrationTracker.create({
        signature: fileName,
        status: 'PENDING',
      });
    }

    async function getMigrationFileStatus(): Promise<
      'PENDING' | 'FAIL' | 'SUCCESS'
    > {
      return entity.status;
    }

    async function success() {
      entity.status = 'SUCCESS';
      await entity.save();
    }

    async function fail() {
      entity.status = 'FAIL';
      await entity.save();
    }

    return {
      getMigrationFileStatus,
      success,
      fail,
    };
  }
}
