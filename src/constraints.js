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

export class RectangleConstraint extends Constraint {
  /**
   * @type {Vec2} position - centro do retângulo 
   */
  position = vec2(0, 0);
  /**
   * @type {number} width  
   */
  width = 0;
  /**
   * @type {number} height 
   */
  height = 0;
  /**
   * @type {number} rotation 
   */
  rotation = 0;
  /**
   * @type {number} rotation 
   */
  collisionElasticity = 1;

  /**
   * 
   * @param {Vec2} position 
   * @param {number} width
   * @param {number} height
   * @param {number} rotation
   */
  constructor(position, width, height, rotation, collisionElasticity = 1) {
    super();

    this.position = position;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.collisionElasticity = collisionElasticity;
  }

  /**
   * @note João, por hora esse método só funciona pra retângulo aonde as bordas estejam paralelas
   * às bordas da tela.
   * @param {Entity[]} entities 
   */
  applyConstraint(entities) {
    for (const entity of entities) {
      if (entity.currentPosition.y + entity.shape.radius > this.position.y + this.height / 2) {
        entity.oldPosition.y = this.position.y + this.height / 2 - entity.shape.radius + (entity.currentPosition.y - entity.oldPosition.y) * this.collisionElasticity;
        entity.currentPosition.y = this.position.y + this.height / 2 - entity.shape.radius;
      }

      if (entity.currentPosition.y - entity.shape.radius < this.position.y - this.height / 2) {
        entity.oldPosition.y = this.position.y - this.height / 2 + entity.shape.radius + (entity.currentPosition.y - entity.oldPosition.y) * this.collisionElasticity;
        entity.currentPosition.y = this.position.y - this.height / 2 + entity.shape.radius;
      }

      if (entity.currentPosition.x + entity.shape.radius > this.position.x + this.width / 2) {
        entity.oldPosition.x = this.position.x + this.width / 2 - entity.shape.radius + (entity.currentPosition.x - entity.oldPosition.x) * this.collisionElasticity;
        entity.currentPosition.x = this.position.x + this.width / 2 - entity.shape.radius;
      }

      if (entity.currentPosition.x - entity.shape.radius < this.position.x - this.width / 2) {
        entity.oldPosition.x = this.position.x - this.width / 2 + entity.shape.radius + (entity.currentPosition.x - entity.oldPosition.x) * this.collisionElasticity;
        entity.currentPosition.x = this.position.x - this.width / 2 + entity.shape.radius;
      }
    }  
  }
}

// @todo João, implementar uma constraint para linhas. Quero usar para montar a mesa com vários segmentos de linhas
export class LineSegmentConstraint extends Constraint {
  /**
   * @type {Vec2} start 
   */
  start = vec2(0, 0);
  /**
   * @type {Vec2} end 
   */
  end = vec2(0, 0);

  /**
   * 
   * @param {Vec2} start 
   * @param {Vec2} end 
   */
  constructor(start, end) {
    super();

    this.start = start;
    this.end = end;
  }

  /**
   * 
   * @param {Entity[]} entities 
   */
  applyConstraint(entities) {
    console.warn("Não implementado");
    // throw new Error("não implementado");
  }
}

// @todo João, implementar uma contraint de semi-circulo
