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
   * @note Por hora estou considerando apenas colisão de entidades  com entidade, porém é necessário considerar
   * colisões provenientes das constraints. O caso de uso que tenho em mente é fazer emitir sons quando colidir com as bordas
   * da mesa.
   * Usar uma função diferente ou usar essa mesma?
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

    // armazena se estava em movimento ou não
    for (const entity of this.entities) {
      entity.wasMoving = !entity.isStoped();
    }

    for (let i = 0; i < substepping; i++)
    {
      // aplicando forças
      this.applyGravity();
      this.applyFriction(dt);
      // @note João, invertendo a ordem das validações aqui tive mais consistência nas restrições impostas pela
      // contraint 'LineSegment' sobre os círculos.
      this.solveCollision();
      this.applyConstraint();
      
      this.updatePositions(dt);
    }

    /**
     * @note João, agora reporta apenas quando de fato parou, e também está mais correto o momento da checagem,
     * porém, acho que esse tipo de coisa seria melhor implementado pelo código que usa essa classe e não na classe em si.
     */
    if (this.reportStoped) {
      for (const entity of this.entities) {
        if (entity.isStoped() && entity.wasMoving) {
          this.reportStoped(entity);
        }
      }
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

      }
    }
  }


  /**
   * @todo João, as constraints precisarão reportar colisões também. Vou precisar modificar a interface para
   * poder 'retornar' informação de colisão... ou talvez chamar diretamente a função de reportCollision, embora isso me
   * pareça uma ideia ruim.
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
          // @note aparenta não estar empurrando o suficiente para fora e por isso colide duas vezes em sequência?
          // ou é por causa da velocidade que colide duas vezes em sequência, analisar.. dando uma tacada com
          // força máxima na direção da primeira bola da cena é possível ver o bug acontecer
          if (this.reportCollision) {
            this.reportCollision(entity1, entity2);
          }
        }
      }
    }
  }
}
