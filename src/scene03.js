import { Circle } from './circle.js';
import { CircleConstraint, RectangleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawRect, drawCircle } from './utils.js';
import { vec2 } from './vec2.js';


export class Scene03 extends DemonstrationScene {
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
    this.physicsSolver.constraints.push(new RectangleConstraint(vec2(250, 200), 200, 150, 0));
    this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F')));

    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        const radius = Math.random() * 5 + 5;
        const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.physicsSolver.entities.push(new Entity(vec2(265 + Math.random() * 10, 200), vec2(0, 0), new Circle(vec2(250, 200), radius, color)));
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
      if (constraint instanceof RectangleConstraint) {
        const position = constraint.position;
        const width = constraint.width;
        const height = constraint.height;
        const rotation = constraint.rotation; // @todo João, ignorando rotação
        const color = '#0F0';
        drawRect(this.ctx, color, position.x - width / 2, position.y - height / 2, width, height);
      }
    }

    for (const entity of this.physicsSolver.entities) {
      drawCircle(this.ctx, entity.currentPosition.x, entity.currentPosition.y, entity.shape.radius, entity.shape.color);
    }
  }
}
