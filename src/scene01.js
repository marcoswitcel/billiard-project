import { Circle } from './circle.js';
import { CircleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render, RenderParams } from './render.js';
import { Circle2, Shape } from './shape.js';
import { drawRect, drawCircle, between } from './utils.js';
import { vec2 } from './vec2.js';


export class Scene01 extends DemonstrationScene {
  physicsSolver = new PhysicsSolver();
  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @type {Shape[]}
   */
  visualElements;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super();

    this.camera = new Camera(vec2(ctx.canvas.width / 2, ctx.canvas.height / 2), vec2(ctx.canvas.width, ctx.canvas.height));
    this.renderParams = new RenderParams();
    this.ctx = ctx;
    this.visualElements = [];
  }

  setup() {
    this.physicsSolver.constraints.push(new CircleConstraint(vec2(250, 200), 100));
    this.visualElements.push(new Circle2(vec2(250, 200), '#0F0', 100));
    
    this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F')));


    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        const radius = Math.random() * 5 + 5;
        const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), radius, color)));
      }
    });

    this.ctx.canvas.addEventListener('wheel', (event) => {
      this.camera.scale = between(this.camera.scale + event.deltaY * 0.001, 0.1, 2);
    });
  }

  /**
   * @param {number} deltaTimeMs
   */
  update(deltaTimeMs) {
    this.physicsSolver.update(deltaTimeMs);
  }

  render() {
    // background 
    drawRect(this.ctx, '#000', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    render(this.ctx, this.physicsSolver, this.camera, this.renderParams, null, this.visualElements);
  }
}
