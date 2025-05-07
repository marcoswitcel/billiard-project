import { Circle } from './circle.js';
import { LineSegmentConstraint, RectangleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity, symMarkedForRemoval } from './entity.js';
import { table01Shape, tableBordersPolygonShape, triangleShape } from './figures.js';
import { GameContex } from './game-context.js';
import { Params } from './params.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render, RenderParams } from './render.js';
import { Circle2, ImageShape, Polygon, Rectangle } from './shape.js';
import { drawRect, drawCircle, between, drawLine, renderLines, drawText } from './utils.js';
import { Vec2, vec2 } from './vec2.js';


const calculateForce = (start, now) => Math.min((now - start), 2000) / 1000;

const ballRadius = 10;

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
  ignoreEvents = false;

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
    
    this.camera = new Camera(vec2(350, 200), vec2(this.ctx.canvas.width, this.ctx.canvas.height), 1.50);
    this.renderParams = new RenderParams();
    this.mouseCoords = vec2(0, 0);
    this.visualElements = [];
    this.gameContext = new GameContex();
    // @note temporário
    this.gameContext.state = 'player_a';
  }

  setup() {
    this.physicsSolver.gravity.set(0, 0);
    this.physicsSolver.friction = 60;
    
    this.addBalls();

    // @todo João, fazer o push de uma imagem para background...
    // avaliar como vou garantir a ordem da renderização...
    // Vou deixar comentado para avaliar...
    {
      // const image = new Image();
      // image.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg'; // @note test image
      // this.visualElements.push(new ImageShape(vec2(350, 200), vec2(500 * 0.9 * 2, 250 * 2), image,  '#0F0'));
    }
    
    this.visualElements.push(new Rectangle(vec2(350, 200), vec2(500 * 0.9, 250), '#0F0'));
    {
      const center = vec2(350, 200);
      const size = vec2(500, 500);
      
      const { points, lineSegments } = table01Shape();
      
      const trianglePoints = points
      .map(point => vec2(point[0], point[1]))
      .map(point => point.mulVec(size.copy().div(2)).add(center));
      
      for (const segmentData of lineSegments) {
        this.physicsSolver.constraints.push(new LineSegmentConstraint(trianglePoints[segmentData[0]], trianglePoints[segmentData[1]], 0.75));
      }

      const { polygons } = tableBordersPolygonShape();

      // @note João, avaliar se armazeno os pontos no sistema de coordenadas do jogo ou se crio um atributo scale na classe 'Shape' e multiplico...
      for (const polygon of polygons) {
        const points = polygon.map(p => vec2(p[0], p[1]));
        this.visualElements.push(new Polygon(center, 'rgba(0,0,0,0.25)', points, 250))
      }
    }

    // @todo João, posicionar melhor...
    this.visualElements.push(new Circle2(vec2(145, 95), 'rgba(0,0,0,0.60)', 13));
    this.visualElements.push(new Circle2(vec2(145, 305), 'rgba(0,0,0,0.60)', 13));
    this.visualElements.push(new Circle2(vec2(350, 90), 'rgba(0,0,0,0.60)', 13));
    this.visualElements.push(new Circle2(vec2(350, 310), 'rgba(0,0,0,0.60)', 13));
    this.visualElements.push(new Circle2(vec2(555, 95), 'rgba(0,0,0,0.60)', 13));
    this.visualElements.push(new Circle2(vec2(555, 305), 'rgba(0,0,0,0.60)', 13));

    this.renderParams.lightSource = vec2(350, 200);

    /**
     * @todo João, adicionar funcionalidade para detectar quando as bolas "pararam" de ser mover. Não
     * sei bem como quero implementar isso, mas é necessário definir isso para saber se a "tacada" acertou ou não
     * alguma bola.
     */
    this.physicsSolver.reportCollision = (e1, e2) => {
      if (e1 === this.ball || e2 === this.ball) {
        const other = e1 === this.ball ? e2 : e1;
        if (!this.gameContext.firstBallHitted) this.gameContext.firstBallHitted = other;
      }
    };

    // @note acabei resolvendo isso de outra forma, mas agora funciona...
    this.physicsSolver.reportStoped = (e1) => {};

    document.addEventListener('keyup', this.handleKeyup);
    document.addEventListener('keydown', this.handleKeydown);
    this.ctx.canvas.addEventListener('mousedown', this.handleMousedown);
    this.ctx.canvas.addEventListener('mousemove', this.handleMousemove);
    this.ctx.canvas.addEventListener('mouseup', this.handleMouseup);
    this.ctx.canvas.addEventListener('wheel', this.handleWheel, { passive: true });
  }

  update(deltaTimeMs) {
    /**
     * @note tentei implementar um mecanismo simples, onde atualizo 3 vezes passando o deltaTimeMs dividido por três;
     * dessa forma ficou mais estável a simualação.
     */
    this.physicsSolver.update(deltaTimeMs);

    this.checkForPointsAndRemoveBalls();

    if (!this.gameContext.waitingStop || !allBallsStoped(this.physicsSolver)) return;

    const isWhiteBallRemoved = this.gameContext.ballsInTheBucket.indexOf(this.ball) !== -1;
    const isThereBallsInTheBucket = this.gameContext.ballsInTheBucket.length > 0;

    this.gameContext.waitingStop = false;
    const colorOtherPlayer = this.gameContext.state === 'player_a' ? this.gameContext.playerBColor : this.gameContext.playerAColor;

    // @todo João, se a bola branca estiver removida também deve considerar a lógica de remover bolas ou mover para estado de vitória
    if (this.gameContext.playerBallSelected && (!this.gameContext.firstBallHitted || isWhiteBallRemoved)) {

      if (this.physicsSolver.entities.findIndex(ball => ball.shape.color === colorOtherPlayer) !== -1) {
        // 'paga' uma bola por ter errado...
        this.removeABall(colorOtherPlayer);
      }
    }

    if (isThereBallsInTheBucket) {
      // @note pega a cor da primeira bola que encontrar na caçapa
      // @todo joão, iterar e pular a bola branca, causando bug quando apenas acerta a caçapa duas vezes seguida
      for (const entity of this.gameContext.ballsInTheBucket) {
        if (entity !== this.ball) {
          this.gameContext.playerBallSelected = true;
          if (this.gameContext.state === 'player_a') {
            this.gameContext.playerAColor = entity.shape.color;
            this.gameContext.playerBColor = (entity.shape.color === this.gameContext.color1) ? this.gameContext.color2 : this.gameContext.color1;
          } else {
            this.gameContext.playerBColor = entity.shape.color;
            this.gameContext.playerAColor = (entity.shape.color === this.gameContext.color1) ? this.gameContext.color2 : this.gameContext.color1;
          }
        }
      }
      this.gameContext.ballsInTheBucket.length = 0;
    }

    if (isWhiteBallRemoved) {
      this.ball = new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#FFF'));
      this.physicsSolver.entities.push(this.ball);
    }

    const playerABallsEnded = this.physicsSolver.entities.findIndex(ball => ball.shape.color === this.gameContext.playerAColor) === -1;
    const playerBBallsEnded = this.physicsSolver.entities.findIndex(ball => ball.shape.color === this.gameContext.playerBColor) === -1;

    if (this.gameContext.playerBallSelected && (playerABallsEnded || playerBBallsEnded)) {
      // @todo João, há cenários aonde todas as bolas podem acabar de uma vez... analisar e ajustar
      if (playerABallsEnded) this.gameContext.state = 'win_a';
      if (playerBBallsEnded) this.gameContext.state = 'win_b';
    } else if (this.gameContext.state.startsWith('player')) {
      if (!isThereBallsInTheBucket || isWhiteBallRemoved) {
        this.gameContext.changePlayer();
      }
    }
  }

  removeABall(fromColor) {
    const entities = this.physicsSolver.entities;
    const newEntities = [];
    let removed = false;
    for (const entity of entities) {
      if (entity.shape.color === fromColor && !removed) {
        removed = true;
        continue;
      } else {
        newEntities.push(entity);
      }
    }
    this.physicsSolver.entities = newEntities;
  }

  checkForPointsAndRemoveBalls() {
    const buckets = this.visualElements.filter(e => e instanceof Circle2);
    
    for (const ball of this.physicsSolver.entities) {
      for (const bucketCircle of buckets) {
        const toObj = ball.currentPosition.copy().sub(bucketCircle.position);
        const dist = toObj.length();
  
        if (dist < bucketCircle.radius) {
          ball[symMarkedForRemoval] = true;
          this.gameContext.ballsInTheBucket.push(ball);
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

    const lines = [];

    if (Params.is('showGameContext')) lines.push(JSON.stringify(this.gameContext));

    if (this.gameContext.state.startsWith('player_')) {
      const offsetX = (this.gameContext.state === 'player_a') ? this.ctx.canvas.width * 0.1 : this.ctx.canvas.width * 0.9;
      drawText(this.ctx, this.gameContext.state, vec2(offsetX, this.ctx.canvas.height * 0.1), 20, 'white', 'monospace', 'center', 'middle');
    }

    if (this.gameContext.state.startsWith('win_')) {
      drawText(this.ctx, this.gameContext.state, vec2(this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.1), 40, 'white', 'monospace', 'center', 'middle');
    }

    renderLines(this.ctx, lines, vec2(15, 550), 16);
  }

  addBalls() {
    this.physicsSolver.entities.length = 0;

    this.ball = new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#FFF'));

    // player ball
    this.physicsSolver.entities.push(this.ball);

    this.physicsSolver.entities.push(new Entity(vec2(380, 200), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, this.gameContext.color1)));
    this.physicsSolver.entities.push(new Entity(vec2(420, 200), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, this.gameContext.color1)));

    this.physicsSolver.entities.push(new Entity(vec2(450, 185), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, this.gameContext.color2)));
    this.physicsSolver.entities.push(new Entity(vec2(450, 215), vec2(0, 0), new Circle(vec2(250, 200), ballRadius, this.gameContext.color2)));
  }

  cleanup() {
    document.removeEventListener('keyup', this.handleKeyup);
    document.removeEventListener('keydown', this.handleKeydown);
    this.ctx.canvas.removeEventListener('wheel', this.handleWheel);
    this.ctx.canvas.removeEventListener('mousedown', this.handleMousedown);
    this.ctx.canvas.removeEventListener('mousemove', this.handleMousemove);
    this.ctx.canvas.removeEventListener('mouseup', this.handleMouseup);
  }

  resetGame() {
    this.gameContext.reset();
    this.gameContext.state = 'player_a';

    this.addBalls();
  }

  handleKeyup = (event) => {
    if (this.ignoreEvents) return;
    
    if (event.key === ' ') {
      //ball.currentPosition.add(vec2(shootForce, 0));
    } else if (event.key === 'r') {
      this.resetGame();
    }
  }

  handleKeydown = (event) => {
    if (this.ignoreEvents) return;
    
    if (event.key === 'ArrowRight') {
      this.camera.position.x++;
    } if (event.key === 'ArrowLeft') {
      this.camera.position.x--;
    } if (event.key === 'ArrowUp') {
      this.camera.position.y--;
    } if (event.key === 'ArrowDown') {
      this.camera.position.y++;
    }
  }

  handleWheel = (event) => {
    if (this.ignoreEvents) return;
    
    this.camera.scale = between(this.camera.scale + event.deltaY * 0.001, 0.1, 2);
  }

  handleMousedown = event => {
    if (this.ignoreEvents) return;
    
    if (event.which !== 1) return;

    if (this.gameContext.state.startsWith('win_')) return;

    if (allBallsStoped(this.physicsSolver)) {
      this.lastClick = Date.now();
    }
  }

  handleMousemove = (event) => {
    if (this.ignoreEvents) return;
    
    const canvas = this.ctx.canvas;
    const boundings = canvas.getBoundingClientRect();
    this.mouseCoords = vec2((event.clientX - boundings.x) / canvas.clientWidth, (event.clientY - boundings.y) / canvas.clientHeight);
  }

  handleMouseup = (event) => {
    if (this.ignoreEvents) return;
    
    if (event.which !== 1) return;
    if (this.lastClick === null) return;

    const canvas = this.ctx.canvas;
    const shootForce = 350;
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
      .sub(this.ball.currentPosition)
      .normalize()
      .mul(shootForce * modifier)
      .mul(this.ball.lastDt);

    this.ball.currentPosition.add(force);

    // sinaliza a espera do término do movimento
    this.gameContext.waitingStop = true;
    this.gameContext.firstBallHitted = null;
  }
}
