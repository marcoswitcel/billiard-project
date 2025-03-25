
export class Color {
  r = 0;
  g = 0;
  b = 0;
  a = 1;

  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  copy() {
    return new Color( this.r, this.g, this.b, this.a);
  }

  darken(value) {
    this.r *= value;
    this.g *= value;
    this.b *= value;
    return this;
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
