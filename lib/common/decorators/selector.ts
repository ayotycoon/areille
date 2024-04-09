import { Selector } from '../classes/Selector';
import { Clazz } from '../type';
import component from './component';

const selector = (target: Clazz) => {
  if (!(target.prototype instanceof Selector))
    throw new Error('Selector class must be instance of Selector');
  return component({ maxBean: 1 })(target);
};

export default selector;
