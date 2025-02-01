import { Circle } from './circle.js';
import { CircleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render, RenderParams } from './render.js';
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
    this.camera = new Camera(vec2(265, 200), vec2(this.ctx.canvas.width, this.ctx.canvas.height));
    this.renderParams = new RenderParams();
  }

  setup() {
    this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F')));
    this.physicsSolver.gravity = vec2(10, 100)
  }

  update(deltaTimeMs) {
    this.physicsSolver.update(deltaTimeMs);
  }

  render() {
    // background 
    drawRect(this.ctx, '#000', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.camera.position = this.physicsSolver.entities[0].currentPosition.copy();

    render(this.ctx, this.physicsSolver, this.camera, this.renderParams);
  }
}
