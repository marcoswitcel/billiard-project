import { Constraint } from './constraints.js';
import { Entity } from './entity.js';
import { vec2 } from './vec2.js';


// @note João, avaliar qual seria um threashold numericamente apropriado.
export const IN_MOVEMENT_THREASHOLD = 0.00001;


export class PhysicsSolver {
  gravity = vec2(0, 9.8);
  friction = 1;
  substepping = 1;
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
   * @type {((a: Entity) => void)|null}
   */
  reportStoped = null;

  /**
   * @todo João, o sub-stepping da física está produzindo resultado incorretos,
   * acho que esse seria o próximo ponto a ser resolvido.
   * @param {*} deltaTime 
   * @param {*} substepping 
   */
  update(deltaTime, substepping = 1)
  {
    this.substepping = substepping;
    
    const dt = deltaTime / substepping;

    for (let i = 0; i < substepping; i++)
    {
      // aplicando forças
      this.applyGravity();
      this.applyFriction(dt);
      // @note João, invertendo a ordem das validações aqui tive mais consistência nas restrições impostas pela
      // contraint 'LineSegment' sobre os círuclos.
      this.solveCollision();
      this.applyConstraint();
      
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
   * @todo João, deixar a fricção independente do framerate. Testar
   * @note Considerando que a gravidade é fixa, não depende do frame, a fricção também parece que poderia ser fixa. Avaliar.
   * @private
   * @param {number} deltaTime 
   */
  applyFriction(deltaTime)
  {
    if (this.friction <= 0) return;

    for (const entity of this.entities)
    {
      const velocity = entity.getCurrentVelocity();
      if (velocity.length() > IN_MOVEMENT_THREASHOLD) {
        const fric = velocity.copy().normalize().mul(-1).mul(this.friction).mul(deltaTime);
        if (fric.length() > velocity.length()) {
          entity.accelerate(velocity.mul(-1));
        } else {
          entity.accelerate(fric);
        }
      } else {
        entity.oldPosition = entity.currentPosition.copy();
        // @todo João, testar e avaliar se deve reportar no loop ou em algum outro ponto.
        // Até porque, em teoria a entidade pode ganhar força antes do termino da 'pipeline' de física.
        // Seria legal checar no final do processo se as posições seguem iguais...
        if (this.reportStoped) {
          this.reportStoped(entity);
        }
      }
    }
  }


  /**
   * @private
   */
  applyConstraint() {
    for (const constraint of this.constraints) {
      constraint.applyConstraint(this.entities)
    }
  }

  /**
   * @private
   */
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

          // @todo João, fiz uma análise inicial e de fato há divergência em algumas colisões.
          // Não consegui identificar o motivo, algumas podem ser de erros de adição devido ao uso de pontos flutuantes,
          // porém, algumas divergências eram grandes demais, necessitam de avaliação.
          // O problema parece ocorrer quando há colisões simultâneas de 3 ou mais entidades.
          // console.log('antes: ', entity1.getCurrentVelocity().length() + entity2.getCurrentVelocity().length());
          // const lengthBefore = entity1.getCurrentVelocity().length() + entity2.getCurrentVelocity().length();
          
          entity1.currentPosition = entity1.currentPosition.copy().add(n.copy().mul(result));
          entity2.currentPosition = entity2.currentPosition.copy().sub(n.copy().mul(result));

          // console.log('depois:', entity1.getCurrentVelocity().length() + entity2.getCurrentVelocity().length());
          // const lengthAfter = entity1.getCurrentVelocity().length() + entity2.getCurrentVelocity().length();

          // @todo João, acredito que isso aqui reporte muitas colisões duplicadas, avaliar...
          if (this.reportCollision) {
            this.reportCollision(entity1, entity2);
          }
        }
      }
    }
  }
}
