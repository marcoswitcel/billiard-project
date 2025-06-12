import { Vec2 } from './vec2.js';


export class Circle {
  /**
   * @type {Vec2}
   */
  position;
  /**
   * @type {number}
   */
  radius = 0;
  /**
   * @type {string}
   */
  color = '#FFFFFF';

  /**
   * 
   * @param {Vec2} position 
   * @param {number} radius 
   * @param {string} color 
   */
  constructor(position, radius, color) {
    this.position = position;
    this.radius = radius;
    this.color = color;
  }
}
