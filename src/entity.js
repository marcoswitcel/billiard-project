import { Circle } from './circle.js';
import { Vec2 } from './vec2.js';

export class Entity {
  /**
   * @type {Vec2}
   */
  current_position;
  /**
   * @type {Vec2}
   */
  old_position;
  /**
   * @type {number}
   */
  acceleration;
  /**
   * @type {Circle}
   */
  shape;

  /**
   * 
   * @param {Vec2} current_position 
   * @param {number} acceleration 
   * @param {Circle} shape 
   */
  constructor(current_position, acceleration, shape) {
    this.current_position = current_position;
    this.old_position = current_position;
    this.acceleration = acceleration;
    this.shape = shape;
  }

  // @todo João, continuar implementando métodos
}
