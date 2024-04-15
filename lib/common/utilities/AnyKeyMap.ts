export default class AnyKeyMap<V> {
  private map = new Map<any, V>();
  private otherMapKeys: Map<any, any>[] = [];
  private readonly maxKeysIndex: number;

  constructor(noOfKeys = 1) {
    this.maxKeysIndex = noOfKeys - 1;
    for (let i = 0; i < this.maxKeysIndex; i++) {
      this.otherMapKeys.push(new Map<any, any>());
    }
  }
  set = (...keys: any[]) => {
    if (keys.length - 1 != this.maxKeysIndex)
      throw Error(`key length must be ${this.maxKeysIndex - 1}`);
    return (value: V) => {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === 0) {
          this.map.set(key, value);
          continue;
        }
        this.otherMapKeys[i - 1].set(key, keys[0]);
      }
    };
  };

  keys = (i = 0) => {
    if (i > this.maxKeysIndex) throw Error('index out of bounds');
    return this.map.keys();
  };

  get = (i = 0) => {
    if (i > this.maxKeysIndex) throw Error('index out of bounds');
    return (key: any) => {
      if (i === 0) {
        return this.map.get(key);
      }
      return this.map.get(this.otherMapKeys[i - 1].get(key));
    };
  };
  has = (i = 0) => {
    return (key: any) => {
      return this.get(i)(key) !== undefined;
    };
  };
}
