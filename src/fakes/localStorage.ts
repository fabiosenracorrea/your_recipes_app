interface iFakeLocalStore {
  [key: string]: any;
}

class LocalStorageFake {
  public store: iFakeLocalStore;

  constructor() {
    this.store = {};
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  setItem(key: string, value: any) {
    this.store[key] = value;
  }

  getItem(key: string) {
    return this.store[key] || null;
  }
}

export default LocalStorageFake;
