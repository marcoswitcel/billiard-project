import { Circle } from './circle.js';
import { RectangleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render } from './render.js';
import { drawRect, drawCircle } from './utils.js';
import { vec2 } from './vec2.js';


const calculateForce = (start, now) => Math.min((now - start), 2000) / 1000;

export class Scene04 extends DemonstrationScene {
  physicsSolver = new PhysicsSolver();
  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @type {number|null}
   */
  lastClick = null;

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
    const ball = new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#FFF'));
    this.physicsSolver.gravity.set(0, 0);
    this.physicsSolver.entities.push(ball);
    this.physicsSolver.entities.push(new Entity(vec2(380, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));
    this.physicsSolver.entities.push(new Entity(vec2(420, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));

    this.physicsSolver.entities.push(new Entity(vec2(450, 185), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));
    this.physicsSolver.entities.push(new Entity(vec2(450, 215), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));
    this.physicsSolver.constraints.push(new RectangleConstraint(vec2(350, 200), 400, 250, 0));

    /**
     * @todo João, adicionar funcionalidade para detectar quando as bolas "pararam" de ser mover. Não
     * sei bem como quero implementar isso, mas é necessário definir isso para saber se a "tacada" acertou ou não
     * alguma bola.
     */
    this.physicsSolver.reportCollision = (e1, e2) => {
      if (e1 === ball || e2 === ball) {
        console.log('hitted');
      }
    }

    const shootForce = 5;

    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        ball.currentPosition.add(vec2(shootForce, 0));
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        this.camera.position.x++;
      } if (event.key === 'ArrowLeft') {
        this.camera.position.x--;
      } if (event.key === 'ArrowUp') {
        this.camera.position.y--;
      } if (event.key === 'ArrowDown') {
        this.camera.position.y++;
      }
    });

    const canvas = this.ctx.canvas;

    canvas.addEventListener('mousedown', event => {
      if (event.which !== 1) return;
      this.lastClick = Date.now();
    });

    canvas.addEventListener('mouseup', event => {
      if (event.which !== 1) return;

      const modifier = calculateForce(this.lastClick, Date.now());
      this.lastClick = null;

      /**
       * @todo João, quando devidamente separado os eixos da simulação e da tela, será necessário calcular e 'projetar'
       * o click no ponto correto.
       */
      const boundings = canvas.getBoundingClientRect();
      // posição menos offset do canvas e reescalado para compensar o escalonamento atual do canvas
      const coords = { x: (event.clientX - boundings.x) / canvas.clientWidth, y: (event.clientY - boundings.y) / canvas.clientHeight, };

      const force = vec2(event.clientX - boundings.x, event.clientY - boundings.y)
        .add(this.camera.position)
        .sub(ball.currentPosition)
        .normalize()
        .mul(shootForce * modifier);

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

    render(this.ctx, this.physicsSolver, this.camera);

    if (this.lastClick) {
      drawRect(this.ctx, '#00F', 0, 0, calculateForce(this.lastClick, Date.now()) * 100, 10);
    }
  }
}
