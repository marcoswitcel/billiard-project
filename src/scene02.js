import { Circle } from './circle.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { render } from './render.js';
import { drawRect } from './utils.js';
import { vec2 } from './vec2.js';


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

    this.physicsSolver.entities.push(new Entity(vec2(450, 185), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));
    this.physicsSolver.entities.push(new Entity(vec2(450, 215), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));

    const shootForce = 5;

    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        ball.currentPosition.add(vec2(shootForce, 0));
      }
    });

    const canvas = this.ctx.canvas;

    canvas.addEventListener('click', event => {
      /**
       * @todo João, quando devidamente separado os eixos da simulação e da tela, será necessário calcular e 'projetar'
       * o click no ponto correto.
       */
      const boundings = canvas.getBoundingClientRect();
      // posição menos offset do canvas e reescalado para compensar o escalonamento atual do canvas
      const coords = { x: (event.clientX - boundings.x) / canvas.clientWidth, y: (event.clientY - boundings.y) / canvas.clientHeight, };

      const force = vec2(event.clientX - boundings.x, event.clientY - boundings.y)
        .sub(ball.currentPosition)
        .normalize()
        .mul(shootForce);

      ball.currentPosition.add(force);
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

    render(this.ctx, this.physicsSolver);
  }
}
