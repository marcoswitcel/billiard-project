import { Circle } from './circle.js';
import { LineSegmentConstraint, RectangleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity, symMarkedForRemoval } from './entity.js';
import { table01Shape, tableBordersPolygonShape, triangleShape } from './figures.js';
import { GameContex } from './game-context.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render, RenderParams } from './render.js';
import { Circle2, Polygon, Rectangle } from './shape.js';
import { drawRect, drawCircle, between, drawLine } from './utils.js';
import { Vec2, vec2 } from './vec2.js';


const calculateForce = (start, now) => Math.min((now - start), 2000) / 1000;

const colorA = '#F0F';
const colorB = '#F0A';

/**
 * 
 * @param {PhysicsSolver} physicsSolver 
 * @returns {boolean}
 */
const allBallsStoped = (physicsSolver) => {
  return !physicsSolver.entities.find(e => !e.isStoped())
}

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
    this.visualElements = [];
    this.gameContext = new GameContex();
    // @note temporário
    this.gameContext.state = 'player_a';
  }

  setup() {
    const ball = this.ball;

    this.physicsSolver.gravity.set(0, 0);
    this.physicsSolver.friction = 60;
    // player ball
    this.physicsSolver.entities.push(ball);

    const ballRadius = 10;

    this.physicsSolver.entities.push(new Entity(vec2(380, 200), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, colorA)));
    this.physicsSolver.entities.push(new Entity(vec2(420, 200), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, colorA)));

    this.physicsSolver.entities.push(new Entity(vec2(450, 185), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, colorB)));
    this.physicsSolver.entities.push(new Entity(vec2(450, 215), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, colorB)));
    
    this.visualElements.push(new Rectangle(vec2(350, 200), vec2(500 * 0.9, 250), '#0F0'));
    {
      const center = vec2(350, 200);
      const size = vec2(500, 500);
      
      const { points, lineSegments } = table01Shape();
      
      const trianglePoints = points
      .map(point => vec2(point[0], point[1]))
      .map(point => point.mulVec(size.copy().div(2)).add(center));
      
      for (const segmentData of lineSegments) {
        this.physicsSolver.constraints.push(new LineSegmentConstraint(trianglePoints[segmentData[0]], trianglePoints[segmentData[1]], 0.8));
      }

      const { polygons } = tableBordersPolygonShape();

      // @note João, avaliar se armazeno os pontos no sistema de coordenadas do jogo ou se crio um atributo scale na classe 'Shape' e multiplico...
      for (const polygon of polygons) {
        const points = polygon.map(p => vec2(p[0], p[1]));
        this.visualElements.push(new Polygon(center, 'rgba(0,0,0,0.18)', points, 250))
      }
      
    }

    // @todo João, posicionar melhor
    this.visualElements.push(new Circle2(vec2(145, 95), 'rgba(0,0,0,0.6)', 13));

    this.renderParams.lightSource = vec2(350, 200);

    /**
     * @todo João, adicionar funcionalidade para detectar quando as bolas "pararam" de ser mover. Não
     * sei bem como quero implementar isso, mas é necessário definir isso para saber se a "tacada" acertou ou não
     * alguma bola.
     */
    this.physicsSolver.reportCollision = (e1, e2) => {
      if (e1 === ball || e2 === ball) {
        const other = e1 === ball ? e2 : e1;
        console.log(this.gameContext.state + ' hitted: ' + other.shape.color);
        this.gameContext.hittedAnyBall = true;
      }
    }

    /* @wip aguardar corrigir reportStoped
    this.physicsSolver.reportStoped = (e1) => {
      console.log(e1)
    }
    */

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

      if (allBallsStoped(this.physicsSolver)) {
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

      // sinaliza a espera do término do movimento
      this.gameContext.waitingStop = true;
      this.gameContext.hittedAnyBall = false;
    });

    canvas.addEventListener('wheel', (event) => {
      this.camera.scale = between(this.camera.scale + event.deltaY * 0.001, 0.1, 2);
    });
  }

  update(deltaTimeMs) {
    /**
     * @note tentei implementar um mecanismo simples, onde atualizo 3 vezes passando o deltaTimeMs dividido por três;
     * dessa forma ficou mais estável a simualação.
     */
    this.physicsSolver.update(deltaTimeMs);

    this.checkForPoints();

    if (this.gameContext.waitingStop && allBallsStoped(this.physicsSolver)) {
      this.gameContext.waitingStop = false;

      if (!this.gameContext.hittedAnyBall) {
        if (this.gameContext.state === 'player_b') this.gameContext.state = 'win_a';
        else if (this.gameContext.state === 'player_a') this.gameContext.state = 'win_b';
      }

      if (this.physicsSolver.entities.length > 1 && this.gameContext.state.startsWith('player')) {
        this.gameContext.changePlayer();
      }
    }
  }
  checkForPoints() {
    const circles = this.visualElements.filter(e => e instanceof Circle2);
    
    for (const entity of this.physicsSolver.entities) {
      for (const circle of circles) {
        const toObj = entity.currentPosition.copy().sub(circle.position);
        const dist = toObj.length();
  
        if (dist < circle.radius) {
          entity[symMarkedForRemoval] = true;
        }
      }
    }

    this.physicsSolver.entities = this.physicsSolver.entities.filter(e => !e[symMarkedForRemoval]);
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
    }, this.visualElements);

    if (this.lastClick) {
      drawRect(this.ctx, '#00F', 0, 0, calculateForce(this.lastClick, Date.now()) * 100, 10);
    }
  }
}
