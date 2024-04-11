import { Selector } from 'areille/common/classes/Selector';
import AppServer from 'areille/server/classes/AppServer';

class Sample {}
class ExtendedSampleA extends Sample {}
class ExtendedSampleA2 extends ExtendedSampleA {}
class ExtendedSampleB extends Sample {}
class SampleSelector extends Selector {}
class SampleServer extends AppServer {}
export const getMockedObj = (
  extend = 0,
  property?: string,
  descriptor?: PropertyDescriptor,
) => {
  let Clazz = Sample as any;
  switch (extend) {
    case 1:
      Clazz = ExtendedSampleA;
      break;
    case 2:
      Clazz = ExtendedSampleB;
      break;
    case 3:
      Clazz = ExtendedSampleA2;
      break;
    case 7:
      Clazz = SampleServer;
      break;
    case 8:
      Clazz = SampleSelector;
      break;
  }

  return { Clazz, property, descriptor };
};
