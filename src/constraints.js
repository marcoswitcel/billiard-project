import { Entity } from './entity.js';
import { Vec2, vec2 } from './vec2.js';

export class Constraint {
  /**
   * 
   * @param {Entity[]} entities 
   */
  applyConstraint(entities) {}
}

export class CircleConstraint extends Constraint {
  /**
   * @type {Vec2} position 
   */
  position = vec2(0, 0);
  /**
   * @type {number} radius 
   */
  radius = 0;

  /**
   * 
   * @param {Vec2} position 
   * @param {number} radius 
   */
  constructor(position, radius) {
    super();

    this.position = position;
    this.radius = radius;
  }

  /**
   * 
   * @param {Entity[]} entities 
   */
  applyConstraint(entities) {
    for (const entity of entities) {
      const to_obj = entity.currentPosition.copy().sub(this.position);
      const dist = to_obj.length();

      if (dist > this.radius - entity.shape.radius) {
        const n = to_obj.normalized();
        entity.currentPosition = this.position.copy().add(n.mul(this.radius - entity.shape.radius));
      }
    }  
  }
}