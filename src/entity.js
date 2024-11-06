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
   * @type {Vec2}
   */
  acceleration;
  /**
   * @type {Circle}
   */
  shape;

  /**
   * 
   * @param {Vec2} current_position 
   * @param {Vec2} acceleration 
   * @param {Circle} shape 
   */
  constructor(current_position, acceleration, shape) {
    this.current_position = current_position;
    this.old_position = current_position;
    this.acceleration = acceleration;
    this.shape = shape;
  }

  /**
   * @todo João, refatorar para uma função ou sistema que cuide desse update
   * @param {number} deltaTime 
   */
  updatePosition(deltaTime) {
    // calcula velocidade
    const velocity = this.current_position.copy().sub(this.old_position);

    // salva a posição atual
    this.old_position = this.current_position.copy();

    // realiza o cálculo usando o método de Verlet
    this.current_position
      .add(velocity)
      .add(this.acceleration.mul(deltaTime * deltaTime));

    // reseta aceleração
    this.acceleration.set(0, 0);
  }

  /**
   * 
   * @param {Vec2} acc 
   */
  accelerate(acc) {
    this.acceleration.add(acc);
  }
}
