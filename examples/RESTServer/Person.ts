import entity from 'areille/database/classes/sequelize/decorators/entity';
import { DataTypes, Model } from 'sequelize';

@entity({
  cb: () => {
    // Transaction.hasMany(TransactionWallet);
    // Transaction.hasMany(EntityLog);
  },
  // Model attributes are defined here
  fields: {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
  },
})
export default class Person extends Model {
  declare id?: string | number;
  declare password?: string;
  declare username?: string;
  declare enabled?: boolean;
}
