import { Entity } from './entity.js';
import { calculateIntersectionOfLineSegments, isLineSegmentIntersecting, rotatePoint } from './utils.js';
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
   * @type {number} rotation 
   */
  collisionElasticity = 1;

  /**
   * 
   * @param {Vec2} start 
   * @param {Vec2} end 
   * @param {number} collisionElasticity
   */
  constructor(start, end, collisionElasticity = 1) {
    super();

    this.start = start;
    this.end = end;
    this.collisionElasticity = collisionElasticity;
  }

  /**
   * 
   * @param {Entity[]} entities 
   */
  applyConstraint(entities) {
    // @todo João, a constraint de linha é sensível e facilmente a bola atravessa a linha.
    // Um exemplo é quando a bola está perto da borda e a bola branca a atinge com velocidade elevada.
    // Acredito que o sistema de colisão das bolas a empurra para fora da constraint da linha... necessário verificação.
    for (const entity of entities) {
      const radiusDir =  entity.currentPosition.copy().sub(entity.oldPosition).normalize().mul(entity.shape.radius);
      // const currentPositionPlusRadius = entity.currentPosition.copy().add(radiusDir); //@todo João, avaliar como considerar a borda do círculo
      const currentPositionPlusRadius = entity.currentPosition;
      if (isLineSegmentIntersecting(this.start, this.end, entity.oldPosition, currentPositionPlusRadius)) {
        const pi = calculateIntersectionOfLineSegments(this.start, this.end, entity.oldPosition, currentPositionPlusRadius);
        console.assert(pi !== null, "não deveria ser nullo");
        
        // @url https://stackoverflow.com/questions/1211212/how-to-calculate-an-angle-from-three-points#31334882
        const quarterOfCircle = Math.PI / 2;
        const lineSegmentPart = this.start.copy();
        const result = Math.atan2(lineSegmentPart.y - pi.y, lineSegmentPart.x - pi.x) - Math.atan2(entity.oldPosition.y - pi.y, entity.oldPosition.x - pi.x);

        const angle = (result > quarterOfCircle) ? Math.PI + (result - quarterOfCircle) * 2 : Math.PI - (quarterOfCircle - result) * 2;
        
        rotatePoint(pi, entity.currentPosition, angle);
        rotatePoint(pi, entity.oldPosition, angle);

        const force = entity.oldPosition.copy().sub(entity.currentPosition);
        const length = force.length();
        force.normalize().mul(length * this.collisionElasticity);

        entity.oldPosition = entity.currentPosition.copy().add(force);
      }
    }
  }
}

// @todo João, implementar uma contraint de semi-circulo
