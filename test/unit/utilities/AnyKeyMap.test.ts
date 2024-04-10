import AnyKeyMap from '../../../lib/common/utilities/AnyKeyMap';

describe('AnyKeyMap test ', () => {
  test('should be able to set and get single keys ', () => {
    const map = new AnyKeyMap<number>();
    map.set('key')(9);
    expect(map.get()('key')).toBe(9);
  });

  test('should be able to set and get multiple keys ', () => {
    const map = new AnyKeyMap<number>(3);
    map.set('key1', 'key2', 'key3')(9);
    expect(map.get()('key')).toBe(undefined);
    expect(map.get()('key2')).toBe(undefined);
    expect(map.get()('key3')).toBe(undefined);

    expect(map.get(0)('key1')).toBe(9);
    expect(map.get(1)('key2')).toBe(9);
    expect(map.get(2)('key3')).toBe(9);
  });
  test('should throw exceptions', () => {
    expect(() => {
      const map = new AnyKeyMap<number>(2);
      map.set('key1', 'key2', 'key3')(9);
    }).toThrow(Error);

    expect(() => {
      const map = new AnyKeyMap<number>(2);
      map.set('key1', 'key2')(9);
      map.get(4)('key2');
    }).toThrow(Error);
  });
});
