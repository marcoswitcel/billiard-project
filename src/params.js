import { makeAGlobal } from './utils.js';

const searchParams = new URLSearchParams(window.location.search);

export class Params {
  static eventTarget = new EventTarget();
  static map = new Map();

  static is(name) {
    if (this.map.has(name)) {
      return this.map.get(name);
    }

    const value = searchParams.has(name) && searchParams.get(name) === 'true';
    this.map.set(name, value);

    return value;
  }

  static set(name, value) {
    
    // atualiza na url
    searchParams.set(name, value);
    const { protocol, host, pathname } = window.location;
    const url = `${protocol}//${host}${pathname}?${searchParams}`;
    window.history.pushState({ path: url }, '', url);

    this.map.set(name, value);

    this.eventTarget.dispatchEvent(new Event(`set.${name}`))
  }

  static get(name, defaultValue) {
    if (this.map.has(name)) {
      return this.map.get(name);
    }

    if (searchParams.has(name)) {
      const value = searchParams.get(name);

      switch (typeof defaultValue) {
        case 'number': this.map.set(name, parseFloat(value));
        break;
        default:
          console.warn('tipo inválido');
      }

      return this.map.get(name);
    } 

    return defaultValue;
  }

  static allParams() {
    return [...this.map.keys()];
  }
}

// exportando globalmente
makeAGlobal('Params', Params);

