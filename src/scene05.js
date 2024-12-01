import { Circle } from './circle.js';
import { CircleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render } from './render.js';
import { drawRect, drawCircle } from './utils.js';
import { vec2 } from './vec2.js';


export class Scene05 extends DemonstrationScene {
  physicsSolver = new PhysicsSolver();
  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @type {Camera | null}
   */
  camera = null;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super();

    this.ctx = ctx;
    this.camera = new Camera(vec2(0, 0), vec2(this.ctx.canvas.width, this.ctx.canvas.height));
  }

  setup() {
    this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F')));
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

    this.camera.position = this.physicsSolver.entities[0].currentPosition.copy().sub(vec2(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2));

    render(this.ctx, this.physicsSolver, this.camera);
  }
}
