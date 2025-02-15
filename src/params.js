const searchParams = new URLSearchParams(window.location.search);

export class Params {
  static map = new Map();

  static is(name) {
    if (this.map.has(name)) {
        return this.map.get(name);
    }

    const value = searchParams.has(name) && searchParams.get(name) === 'true';
    this.map.set(value);

    return value;
  }

  static set(name, value) {
    this.map.set(name, value);
  }
}

window['Params'] = Params;

