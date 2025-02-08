import { Vec2, vec2 } from './vec2.js';

export class Shape {
  position = vec2(0, 0);
  color = '#0F0';

  /**
   * 
   * @param {Vec2} position 
   * @param {string} color 
   */
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }
}

export class Rectangle extends Shape {
  size = vec2(1, 1);

  /**
   * @param {Vec2} position 
   * @param {Vec2} size 
   * @param {string} color 
   */
  constructor(position, size, color) {
    super(position, color);
    this.size = size;
  }
}
