import { Circle } from './circle.js';
import { LineSegmentConstraint, RectangleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { triangleShape } from './figures.js';
import { IN_MOVEMENT_THREASHOLD, PhysicsSolver } from './physics-solver.js';
import { Camera, render, RenderParams } from './render.js';
import { drawRect, drawCircle, between, drawLine } from './utils.js';
import { vec2 } from './vec2.js';


const calculateForce = (start, now) => Math.min((now - start), 2000) / 1000;

export class Scene07 extends DemonstrationScene {
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
  renderParams = null;
  mouseCoords = null;

  /**
   * @type {Entity}
   */
  ball;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super();

    this.ctx = ctx;
    this.ball = new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#FFF'));
    this.camera = new Camera(vec2(350, 200), vec2(this.ctx.canvas.width, this.ctx.canvas.height), 1.25);
    this.renderParams = new RenderParams();
    this.mouseCoords = vec2(0, 0);
  }

  setup() {
    const ball = this.ball;

    this.physicsSolver.gravity.set(0, 0);
    // player ball
    this.physicsSolver.entities.push(ball);


    this.physicsSolver.entities.push(new Entity(vec2(380, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));
    this.physicsSolver.entities.push(new Entity(vec2(420, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0F')));

    this.physicsSolver.entities.push(new Entity(vec2(450, 185), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0A')));
    this.physicsSolver.entities.push(new Entity(vec2(450, 215), vec2(0, 0), new Circle(vec2(250, 200), 10, '#F0A')));
    
    const center = vec2(350, 200);
    const size = vec2(400, 250);
    
    // this.physicsSolver.constraints.push(new RectangleConstraint(vec2(350, 200), 400, 250, 0, 0.8));

    const pA = center.copy().sub(size.copy().div(2));
    const pB = vec2(center.x + size.x / 2, pA.y);
    const pC = center.copy().add(size.copy().div(2));
    const pD = vec2(center.x - size.x / 2, pC.y);

    // segmentos de linha
    this.physicsSolver.constraints.push(new LineSegmentConstraint(pA, pB, 0.8));
    this.physicsSolver.constraints.push(new LineSegmentConstraint(pB, pC, 0.8));
    this.physicsSolver.constraints.push(new LineSegmentConstraint(pC, pD, 0.8));
    this.physicsSolver.constraints.push(new LineSegmentConstraint(pD, pA, 0.8));

    const triangleSize = 40;
    const centerOfTriangle = center.copy().add(vec2(0, -200));
    const points = triangleShape()
      .map(point => vec2(point[0], point[1]))
      .map(point => point.mul(triangleSize).add(centerOfTriangle));

    const lineSegments = [
      [points[0], points[1]],
      [points[1], points[2]],
      [points[2], points[0]],
    ]

    for (const segmentData of lineSegments) {
      this.physicsSolver.constraints.push(new LineSegmentConstraint(segmentData[0], segmentData[1], 1));
    }

    this.renderParams.lightSource = vec2(350, 200);

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

    const shootForce = 350;

    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        //ball.currentPosition.add(vec2(shootForce, 0));
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

      const velocity = this.ball.getCurrentVelocity();

      if (velocity.length() <= IN_MOVEMENT_THREASHOLD) {
        this.lastClick = Date.now();
      }
    });

    canvas.addEventListener('mousemove', event => {
      const boundings = canvas.getBoundingClientRect();
      this.mouseCoords = vec2((event.clientX - boundings.x) / canvas.clientWidth, (event.clientY - boundings.y) / canvas.clientHeight);
    });

    canvas.addEventListener('mouseup', event => {
      if (event.which !== 1) return;
      if (this.lastClick === null) return;

      const modifier = calculateForce(this.lastClick, Date.now());
      this.lastClick = null;

      // posição menos offset do canvas e reescalado para compensar o escalonamento atual do canvas
      // @note Calcula em cima das dimensões e offset reais, depois multiplica pelo tamanho da renderização interna (canvas.width, canvas.height)
      const boundings = canvas.getBoundingClientRect();
      const coords = { x: (event.clientX - boundings.x) / canvas.clientWidth, y: (event.clientY - boundings.y) / canvas.clientHeight, };

      // @todo João, ainda tem pequenas inconsistências na direção que a força aponta, porém está bom por hora
      const force = vec2(coords.x * canvas.width, coords.y * canvas.height)
        .sub(vec2(canvas.width / 2, canvas.height / 2))
        .div(this.camera.scale)
        .add(this.camera.position)
        .sub(ball.currentPosition)
        .normalize()
        .mul(shootForce * modifier)
        .mul(ball.lastDt);

      ball.currentPosition.add(force);
    });

    // @todo João, adicionar esse handler nas outras cenas para testar a funcionalidade de 'scale' melhor
    canvas.addEventListener('wheel', (event) => {
      this.camera.scale = between(this.camera.scale + event.deltaY * 0.001, 0.1, 2);
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

    render(this.ctx, this.physicsSolver, this.camera, this.renderParams, (ctx, ) => {
      if (this.lastClick) {
        const canvasCenter = vec2(ctx.canvas.width / 2, ctx.canvas.height / 2);
        
        const dir = vec2(this.mouseCoords.x * this.ctx.canvas.width, this.mouseCoords.y * this.ctx.canvas.height)
          .sub(vec2(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2))
          .div(this.camera.scale)
          .add(this.camera.position)
          .sub(this.ball.currentPosition)
          .normalize();
        
        const start = canvasCenter.copy().add(this.ball.currentPosition.copy().sub(this.camera.position).mul(this.camera.scale).sub(dir.copy().mul(10 + (calculateForce(this.lastClick, Date.now()) * 15)).mul(this.camera.scale)));
        const end = canvasCenter.copy().add(this.ball.currentPosition.copy().sub(this.camera.position).mul(this.camera.scale).sub(dir.copy().mul(200 + (calculateForce(this.lastClick, Date.now()) * 15)).mul(this.camera.scale)));
        drawLine(ctx, start, end, 'rgb(176, 79, 19)', 6 * this.camera.scale);
      }
    });

    if (this.lastClick) {
      drawRect(this.ctx, '#00F', 0, 0, calculateForce(this.lastClick, Date.now()) * 100, 10);
    }
  }
}
