import { Constraint } from './constraints.js';
import { Entity } from './entity.js';
import { vec2 } from './vec2.js';


export const IN_MOVEMENT_THREASHOLD = 0.001;


export class PhysicsSolver {
  gravity = vec2(0, 9.8);
  /**
   * @type {Entity[]}
   */
  entities = [];

  /**
   * @type {Constraint[]}
   */
  constraints = [];

  /**
   * @todo João, decidir e documentar unidades de medida e funcionamento
   */
  unit = 'm/s';

  /**
   * @type {((a: Entity, b: Entity) => void)|null}
   */
  reportCollision = null;

  /**
   * @todo João, o sub-stepping da física está produzindo resultado incorretos,
   * acho que esse seria o próximo ponto a ser resolvido.
   * @param {*} deltaTime 
   * @param {*} substepping 
   */
  update(deltaTime, substepping = 1)
  {
    const dt = deltaTime / substepping;

    for (let i = 0; i < substepping; i++)
    {
      // aplicando forças
      this.applyGravity();
      this.applyFriction();
      this.applyConstraint();
      this.solveCollision();
      this.updatePositions(dt);
    }
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

  /**
   * @private
   */
  applyFriction()
  {
    const friction = 1;

    for (const entity of this.entities)
    {
      const velocity = entity.getCurrentVelocity();
      if (velocity.length() > IN_MOVEMENT_THREASHOLD) { // @todo João, mover essa lógica para a entidade
        entity.accelerate(velocity.normalize().mul(-1).mul(friction));
      } else {
        // @todo João, avaliar em relação ao threashold, mas acho que preciso ajustar mais coisas.
        // entity.oldPosition = entity.currentPosition;
      }
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
          
          // @todo João, acredito que isso aqui reporte muitas colisões duplicadas, avaliar...
          if (this.reportCollision) {
            this.reportCollision(entity1, entity2);
          }
        }
      }
    }
  }
}
