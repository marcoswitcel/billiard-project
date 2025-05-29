import { makeAGlobal } from './utils.js';

const searchParams = new URLSearchParams(window.location.search);

export class Params {
  static eventTarget = new EventTarget();
  static map = new Map<string, any>();

  static is(name: string): boolean {
    if (this.map.has(name)) {
      return this.map.get(name);
    }

    const value = searchParams.has(name) && searchParams.get(name) === 'true';
    this.map.set(name, value);

    return value;
  }

  static set(name: string, value: any): void {
    
    // atualiza na url
    searchParams.set(name, value);
    const { protocol, host, pathname } = window.location;
    const url = `${protocol}//${host}${pathname}?${searchParams}`;
    window.history.pushState({ path: url }, '', url);

    this.map.set(name, value);

    this.eventTarget.dispatchEvent(new Event(`set.${name}`))
  }


  static get<T>(name: string, defaultValue: T): T {
    if (this.map.has(name)) {
      return this.map.get(name);
    }

    if (searchParams.has(name)) {
      const value = searchParams.get(name) as string;

      switch (typeof defaultValue) {
        case 'number': this.map.set(name, parseFloat(value)); break;
        case 'boolean': this.map.set(name, value === 'true'); break;
        case 'string': this.map.set(name, value); break;
        default:
          console.warn('tipo inválido'); // @note João, considera lançar exception aqui...
      }

      return this.map.get(name);
    } 

    return defaultValue;
  }

  static allParams(): string[] {
    return [...this.map.keys()];
  }
}

// exportando globalmente
makeAGlobal('Params', Params);

