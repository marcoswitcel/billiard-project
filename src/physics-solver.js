import { Entity } from './entity.js';
import { vec2 } from './vec2.js';

export class PhysicsSolver {
  gravity = vec2(0, 1000);
  /**
   * @type {Entity[]}
   */
  entities = [];


  update(deltaTime)
  {
    // aplicando forças
    this.applyGravity();
    this.updatePositions(deltaTime);
  }

  /**
   * @private
   * @param {number} deltaTime 
   */
  updatePositions(deltaTime)
  {
    for (const entity of this.entities)
    {
      entity.updatePosition(deltaTime);
    }
  }

  /**
   * @private
   */
  applyGravity()
  {
    for (const entity of this.entities)
    {
      entity.accelerate(this.gravity);
    }
  }
}
