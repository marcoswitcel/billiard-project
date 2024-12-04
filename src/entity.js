import { Circle } from './circle.js';
import { vec2, Vec2 } from './vec2.js';

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
   * @type {number}
   */
  lastDt;
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
    this.lastDt = 0;
    this.acceleration = acceleration;
    this.shape = shape;
  }

  /**
   * @todo João, refatorar para uma função ou sistema que cuide desse update
   * @param {number} deltaTime 
   */
  updatePosition(deltaTime) {
    // calcula velocidade
    const velocity = this.lastDt === 0 ? vec2(0, 0) : this.getCurrentVelocity().div(this.lastDt);

    this.lastDt = deltaTime;

    // salva a posição atual
    this.oldPosition = this.currentPosition.copy();

    // realiza o cálculo usando o método de Verlet
    this.currentPosition
      .add(velocity.mul(deltaTime))
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
   * @todo João, definir como usar o deltaTime aqui para poder calcular a velocidade atual
   * @returns {Vec2}
   */
  getCurrentVelocity() {
    return this.currentPosition.copy().sub(this.oldPosition)
  }
}
