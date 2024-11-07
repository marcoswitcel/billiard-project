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
    this.applyConstraint();
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


  applyConstraint()
  {
    // @todo João, abstrair as constraints começando pelo 'circle constraint'
    const position = vec2(250, 200); // @todo João, hardcoded
    const radius = 100; // @todo João, hardcoded
    
    for (const entity of this.entities)
    {
      const to_obj = entity.currentPosition.copy().sub(position);
      const dist = to_obj.length();

      if (dist > radius - entity.shape.radius)
      {
        const n = to_obj.normalized();
        entity.currentPosition = position.copy().add(n.mul(radius - entity.shape.radius));
      }
    }
  }
}
