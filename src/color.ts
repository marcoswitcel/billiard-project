
const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

if (ctx === null) throw new Error('Problema na inicialização co módulo de Cores');

canvas.width = 1;
canvas.height = 1;

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  /**
   * 
   * @param r 
   * @param g 
   * @param b 
   * @param a 
   */
  constructor(r: number, g: number, b: number, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = Math.min(a, 1);
  }

  /**
   * Um objeto idêntico ao anterior
   * @returns 
   */
  copy(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * 
   * @param value 
   * @returns this
   */
  darken(value: number): Color {
    this.r *= value;
    this.g *= value;
    this.b *= value;
    return this;
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  /**
   * @slow em função do canvas
   * @param color 
   * @returns 
   */
  static from(color: string) {
    ctx.rect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fill();
    const image = ctx.getImageData(0, 0, 1, 1);
    const data = image.data;

    return new Color(data[0], data[1], data[2], data[3]);
  }
}
