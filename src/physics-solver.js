import { CircleConstraint, Constraint } from './constraints.js';
import { Entity } from './entity.js';
import { vec2 } from './vec2.js';

export class PhysicsSolver {
  gravity = vec2(0, 1000);
  /**
   * @type {Entity[]}
   */
  entities = [];

  /**
   * @type {Constraint[]}
   */
  constraints = [ new CircleConstraint(vec2(250, 200), 100) ];


  update(deltaTime)
  {
    // aplicando forças
    this.applyGravity();
    this.applyConstraint();
    this.solveCollision();
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


  applyConstraint() {
    for (const constraint of this.constraints) {
      constraint.applyConstraint(this.entities)
    }
  }

  solveCollision()
  {
    const object_count = this.entities.length;

    for (let i = 0; i < object_count; i++)
    {
      const entity1 = this.entities[i];

      for (let j = i + 1; j < object_count; j++)
      {
        const entity2 = this.entities[j];
        const collisionAxis = entity1.currentPosition.copy().sub(entity2.currentPosition);
        const dist = collisionAxis.length();
        const minDist = entity1.shape.radius + entity2.shape.radius;
        if (dist < minDist)
        {
          const n = collisionAxis.copy().div(dist);
          const delta = minDist - dist;

          const result = 0.5 * delta;
          
          entity1.currentPosition = entity1.currentPosition.copy().add(n.copy().mul(result));
          entity2.currentPosition = entity2.currentPosition.copy().sub(n.copy().mul(result));
        }
      }
    }
  }
}
