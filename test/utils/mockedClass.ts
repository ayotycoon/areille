export const getMockedClass = (
  extend = false,
  property?: string,
  descriptor?: PropertyDescriptor,
) => {
  class Sample {}
  class ExtendedSample extends Sample {}

  const Clazz = extend ? ExtendedSample : Sample;

  return { Clazz, property, descriptor };
};
