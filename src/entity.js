import { Circle } from './circle.js';
import { Vec2 } from './vec2.js';

export class Entity {
  /**
   * @type {Vec2}
   */
  currentPosition;
  /**
   * @type {Vec2}
   */
  oldPosition;
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
   * @param {Vec2} currentPosition 
   * @param {Vec2} acceleration 
   * @param {Circle} shape 
   */
  constructor(currentPosition, acceleration, shape) {
    this.currentPosition = currentPosition;
    this.oldPosition = currentPosition;
    this.acceleration = acceleration;
    this.shape = shape;
  }

  /**
   * @todo João, refatorar para uma função ou sistema que cuide desse update
   * @param {number} deltaTime 
   */
  updatePosition(deltaTime) {
    // calcula velocidade
    const velocity = this.currentPosition.copy().sub(this.oldPosition);

    // salva a posição atual
    this.oldPosition = this.currentPosition.copy();

    // realiza o cálculo usando o método de Verlet
    this.currentPosition
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

  /**
   * 
   * @returns {Vec2}
   */
  getCurrentVelocity() {
    return this.currentPosition.copy().sub(this.oldPosition)
  }
}
