class Sample {}
class ExtendedSampleA extends Sample {}
class ExtendedSampleA2 extends ExtendedSampleA {}
class ExtendedSampleB extends Sample {}
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
  }

  return { Clazz, property, descriptor };
};
