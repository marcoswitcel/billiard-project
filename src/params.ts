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
      const value = this.map.get(name);
      if (typeof defaultValue !== typeof value) {
        console.warn(`||Params.get|| Parâmetro '${name}' com valor armazenado '${value}' incompatível com default: '${defaultValue}', retomando valor default`);
        this.map.set(name, defaultValue);
        return defaultValue;
      } else {
        return value;
      }
    }

    if (searchParams.has(name)) {
      const rawValue = searchParams.get(name) as string;
      let value: any = null;

      switch (typeof defaultValue) {
        case 'number': {
          value = parseFloat(rawValue);
          if (isNaN(value)) {
            console.warn(`||Params.get|| Parâmetro '${name}' com valor valor '${rawValue}', esperava um número`);
            value = null;
          }
          break;
        }
        case 'boolean': {
          value = rawValue === 'true';
          break;
        }
        case 'string': {
          value = rawValue;
          break;
        }
        default: {
          console.warn(`||Params.get|| Parâmetro '${name}' com valor valor '${rawValue}' incompatível valores suportados: 'number, boolean, string'`);
        }
      }

      if (value !== null) {
        if (typeof defaultValue !== typeof value) {
          console.warn(`||Params.get|| Parâmetro '${name}' com valor armazenado '${value}' incompatível com default: '${defaultValue}'`);
        } else {
          this.map.set(name, value);
          return value;
        }
      } else {
        console.warn(`||Params.get|| Parâmetro '${name}' usando o valor default: '${defaultValue}'`);
      }
    } 

    this.map.set(name, defaultValue);
    return defaultValue;
  }

  static allParams(): string[] {
    return [...this.map.keys()];
  }
}

// exportando globalmente
makeAGlobal('Params', Params);

