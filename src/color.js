
const canvas = document.createElement('canvas');
/**
 * @type {CanvasRenderingContext2D}
 */ // @ts-ignore
const ctx = canvas.getContext('2d');
canvas.width = 1;
canvas.height = 1;

export class Color {
  r = 0;
  g = 0;
  b = 0;
  a = 1;

  /**
   * 
   * @param {number} r 
   * @param {number} g 
   * @param {number} b 
   * @param {number} a 
   */
  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = Math.min(a, 1);
  }

  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * 
   * @param {number} value 
   * @returns 
   */
  darken(value) {
    this.r *= value;
    this.g *= value;
    this.b *= value;
    return this;
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  /**
   * @param {string} color 
   * @returns 
   */
  static from(color) {
    ctx.rect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fill();
    const image = ctx.getImageData(0, 0, 1, 1);
    const data = image.data;

    return new Color(data[0], data[1], data[2], data[3]);
  }
}
