import entity from 'areille/database/classes/sequelize/decorators/entity';
import { DataTypes, Model } from 'sequelize';

@entity({
  cb: () => {
    // Transaction.hasMany(TransactionWallet);
    // Transaction.hasMany(EntityLog);
  },
  // Model attributes are defined here
  fields: {
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    name: DataTypes.STRING,
  },
})
export default class Food extends Model {
  declare id: number;
  declare createdAt: string;
  declare updatedAt: string;

  declare name: string;
  declare category: string;
  declare description: string;
}
