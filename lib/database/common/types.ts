import { Model, Optional } from 'sequelize';
import {
  Attributes,
  ModelAttributes,
  ModelStatic,
} from 'sequelize/types/model';
declare const ForeignKeyBrand: unique symbol;

type IsBranded<
  T,
  Brand extends symbol,
> = keyof NonNullable<T> extends keyof Omit<NonNullable<T>, Brand>
  ? false
  : true;

type BrandedKeysOf<T, Brand extends symbol> = {
  [P in keyof T]-?: IsBranded<T[P], Brand> extends true ? P : never;
}[keyof T];

export interface SequelizeEntityArgs<
  MS extends ModelStatic<Model>,
  M extends InstanceType<MS>,
> {
  fields: ModelAttributes<
    M,
    Optional<
      Attributes<M>,
      BrandedKeysOf<Attributes<M>, typeof ForeignKeyBrand>
    >
  >;
  options?: any;
  cb?: any;
  modelName?: string;
}
