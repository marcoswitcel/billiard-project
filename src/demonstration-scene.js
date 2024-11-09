import { Circle } from './circle.js';
import { CircleConstraint } from './constraints.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawRect } from './utils.js';
import { vec2 } from './vec2.js';

export class DemonstrationScene {
  setup() {}
  /**
   * @param {number} deltaTimeMs
   */
  update(deltaTimeMs) {}
  render() {}
  cleanup() {}
}

export class Scene01 extends DemonstrationScene {
  physicsSolver = new PhysicsSolver();
  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super();


    this.ctx = ctx;
  }

  setup() {
    this.physicsSolver.constraints.push(new CircleConstraint(vec2(250, 200), 100));
    this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F')));

    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        const radius = Math.random() * 5 + 5;
        const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), radius, color)));
      }
    });
  }

  update(deltaTimeMs) {
    /**
     * @todo João, implementar o sistema de 'sub-steps' no update das entidades.
     * @note tentei implementar um mecanismo simples, onde atualizo 3 vezes passando o deltaTimeMs dividido por três;
     * dessa forma ficou mais estável a simualação.
     */
    this.physicsSolver.update(deltaTimeMs);
  }

  render() {
    // background 
    drawRect(this.ctx, '#000', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (const constraint of this.physicsSolver.constraints) {
      if (constraint instanceof CircleConstraint) {
        const position = constraint.position;
        const radius = constraint.radius;
        const color = '#0F0';
        drawCircle(this.ctx, position.x, position.y, radius, color);
      }
    }

    for (const entity of this.physicsSolver.entities) {
      drawCircle(this.ctx, entity.currentPosition.x, entity.currentPosition.y, entity.shape.radius, entity.shape.color);
    }
  }
}

export class Scene02 extends DemonstrationScene {
  physicsSolver = new PhysicsSolver();
  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super();


    this.ctx = ctx;
  }

  setup() {
    const ball = new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F'));
    this.physicsSolver.gravity.set(0, 0);
    this.physicsSolver.entities.push(ball);
    this.physicsSolver.entities.push(new Entity(vec2(380, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));
    this.physicsSolver.entities.push(new Entity(vec2(420, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));

    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        ball.currentPosition.add(vec2(5, 0));
      }
    });
  }

  update(deltaTimeMs) {
    /**
     * @todo João, implementar o sistema de 'sub-steps' no update das entidades.
     * @note tentei implementar um mecanismo simples, onde atualizo 3 vezes passando o deltaTimeMs dividido por três;
     * dessa forma ficou mais estável a simualação.
     */
    this.physicsSolver.update(deltaTimeMs);
  }

  render() {
    // background 
    drawRect(this.ctx, '#000', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (const constraint of this.physicsSolver.constraints) {
      if (constraint instanceof CircleConstraint) {
        const position = constraint.position;
        const radius = constraint.radius;
        const color = '#0F0';
        drawCircle(this.ctx, position.x, position.y, radius, color);
      }
    }

    for (const entity of this.physicsSolver.entities) {
      drawCircle(this.ctx, entity.currentPosition.x, entity.currentPosition.y, entity.shape.radius, entity.shape.color);
    }
  }
}
