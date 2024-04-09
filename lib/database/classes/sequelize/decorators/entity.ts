import { Model } from 'sequelize';
import { ModelStatic } from 'sequelize/types/model';
import ArielleApp from '../../../../common/ArielleApp';
import { SequelizeEntityArgs } from '../../../common/types';
import { SequelizeDatabase } from '../SequelizeDatabase';

export default function entity<
  MS extends ModelStatic<Model>,
  M extends InstanceType<MS>,
>(obj: SequelizeEntityArgs<MS, M>) {
  const arielleApp = ArielleApp.getInstanceByAppName();
  return (target: any) => {
    arielleApp.registerBeanDecorator(entity.name, 3, () => {
      const dBInstance = arielleApp.getAutoWireSingleton(SequelizeDatabase);
      dBInstance.registerModel(target, obj);
    });
  };
}
