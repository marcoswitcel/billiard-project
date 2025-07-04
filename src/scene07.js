import { Circle } from './circle.js';
import { LineSegmentConstraint, RectangleConstraint } from './constraints.js';
import { DemonstrationScene } from './demonstration-scene.js';
import { Entity, symMarkedForRemoval } from './entity.js';
import { table01Shape, tableBordersPolygonShape, triangleShape } from './figures.js';
import { appDefaults, GameContex } from './game-context.js';
import { Params } from './params.js';
import { PhysicsSolver } from './physics-solver.js';
import { Camera, render, RenderParams } from './render.js';
import { Circle2, ImageShape, Polygon, Rectangle, Shape } from './shape.js';
import { SoundHandle, SoundHandleState, SoundMixer } from './sounds/sound-mixer.js';
import { drawRect, between, drawLine, renderLines, drawText, imageAsset } from './utils.js';
import { Vec2, vec2 } from './vec2.js';

/**
 * 
 * @param {number} start 
 * @param {number} now 
 * @returns 
 */
const calculateForce = (start, now) => Math.sin((now - start) / 180 / 2) + 1;

const ballRadius = 10;
const initialCameraScale = 1.5;

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

  camera;
  renderParams;
  mouseCoords;
  /**
   * @type {Shape[]}
   */
  visualElements;
  shouldSkipTillStoped = false;
  ignoreEvents = false;

  /**
   * @type {Entity}
   */
  // @ts-expect-error
  ball;

  /**
   * @type {Map<string, SoundHandle>}
   */
  collisionSounds = new Map;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super();

    this.ctx = ctx;
    
    this.camera = new Camera(vec2(350, 200), vec2(this.ctx.canvas.width, this.ctx.canvas.height), initialCameraScale);
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
      const image = imageAsset('./resource/image/background-in-game.svg');
      this.visualElements.push(new ImageShape(vec2(350, 200), vec2(appDefaults.height * 1.4, appDefaults.height), image,  '#0F0'));
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

    this.physicsSolver.reportCollision = (e1, e2) => {
      if (e1 === this.ball || e2 === this.ball) {
        const other = e1 === this.ball ? e2 : e1;
        if (!this.gameContext.firstBallHitted) this.gameContext.firstBallHitted = other;
      }

      this.playCollisionSound(e1, e2);
    };

    this.physicsSolver.reportConstraintMovement = (e, c) => {
      // @todo João, avaliar, debugar e melhorar...
      if (c instanceof LineSegmentConstraint) {
        const handle = this.gameContext.soundMixer.play('wall-collision', false, 0.15, true);
      }
    }

    // @note acabei resolvendo isso de outra forma, mas agora funciona...
    this.physicsSolver.reportStoped = (e1) => {};

    document.addEventListener('keyup', this.handleKeyup);
    document.addEventListener('keydown', this.handleKeydown);
    this.ctx.canvas.addEventListener('mousedown', this.handleMousedown);
    this.ctx.canvas.addEventListener('mousemove', this.handleMousemove);
    this.ctx.canvas.addEventListener('mouseup', this.handleMouseup);
    this.ctx.canvas.addEventListener('wheel', this.handleWheel, { passive: true });
  }

  /**
   * 
   * @param {number} deltaTimeMs 
   * @returns 
   */
  update(deltaTimeMs) {
    /**
     * @note tentei implementar um mecanismo simples, onde atualizo 3 vezes passando o deltaTimeMs dividido por três;
     * dessa forma ficou mais estável a simualação.
     */
    this.physicsSolver.update(deltaTimeMs);

    if (this.gameContext.waitingStop && this.shouldSkipTillStoped) {
      // 3 vezes a velocidade normal, considerando o update de cima
      this.physicsSolver.update(deltaTimeMs);
      this.physicsSolver.update(deltaTimeMs);
    }

    // sistema de som
    this.gameContext.soundMixer.clear();

    this.checkForPointsAndRemoveBalls();

    if (!this.gameContext.waitingStop || !allBallsStoped(this.physicsSolver)) return;
    
    // sinaliza que pode parar o speed up 
    this.shouldSkipTillStoped = false;

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
      for (const entity of this.gameContext.ballsInTheBucket) {
        if (entity === this.ball) continue;
        
        this.gameContext.playerBallSelected = true;
        if (this.gameContext.state === 'player_a') {
          this.gameContext.playerAColor = entity.shape.color;
          this.gameContext.playerBColor = (entity.shape.color === this.gameContext.color1) ? this.gameContext.color2 : this.gameContext.color1;
        } else {
          this.gameContext.playerBColor = entity.shape.color;
          this.gameContext.playerAColor = (entity.shape.color === this.gameContext.color1) ? this.gameContext.color2 : this.gameContext.color1;
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

  /**
   * @param {string | null} fromColor
   */
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
          this.gameContext.soundMixer.play('bucket', false, 0.2, true);
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
        const screenScale = ctx.canvas.width / appDefaults.width;
        const scale = this.camera.scale * screenScale;
        
        // @todo João, sanitizar esse valor e considerar puxar das configurações...
        const aimType = Params.get('aim', 1);
        const dir = vec2(this.mouseCoords.x * this.ctx.canvas.width, this.mouseCoords.y * this.ctx.canvas.height)
          .sub(vec2(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2))
          .div(scale)
          .add(this.camera.position)
          .sub(this.ball.currentPosition)
          .mul(aimType)
          .normalize();
        
        const start = canvasCenter.copy().add(this.ball.currentPosition.copy().sub(this.camera.position).mul(scale).sub(dir.copy().mul(10 + (calculateForce(this.lastClick, Date.now()) * 15)).mul(scale)));
        const end = canvasCenter.copy().add(this.ball.currentPosition.copy().sub(this.camera.position).mul(scale).sub(dir.copy().mul(200 + (calculateForce(this.lastClick, Date.now()) * 15)).mul(scale)));
        drawLine(ctx, start, end, 'rgb(176, 79, 19)', 6 * scale);
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

    if (Params.is('soundDebugView')) {
      renderSoundDebugView(this.ctx, this.gameContext.soundMixer);
    }
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
    this.camera.scale = initialCameraScale;
    
    this.addBalls();
  }

  /**
   * @param {KeyboardEvent} event 
   * @returns 
   */
  handleKeyup = (event) => {
    if (this.ignoreEvents) return;
    
    if (event.key === ' ') {
      //ball.currentPosition.add(vec2(shootForce, 0));
    } else if (event.key === 'r') {
      this.resetGame();
    } else if (event.key === 'k') {
      this.shouldSkipTillStoped = true;
    }
  }

  /**
   * @param {KeyboardEvent} event 
   * @returns 
   */
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

  /**
   * @param {WheelEvent} event 
   * @returns 
   */
  handleWheel = (event) => {
    if (this.ignoreEvents) return;
    
    this.camera.scale = between(this.camera.scale + event.deltaY * 0.001, 0.1, 2);
  }

  /**
   * @param {MouseEvent} event 
   * @returns 
   */
  handleMousedown = event => {
    if (this.ignoreEvents) return;
    
    if (event.which !== 1) return;

    if (this.gameContext.state.startsWith('win_')) return;

    if (allBallsStoped(this.physicsSolver)) {
      this.lastClick = Date.now();
    }
  }

  /**
   * @param {MouseEvent} event 
   * @returns 
   */
  handleMousemove = (event) => {
    if (this.ignoreEvents) return;
    
    const canvas = this.ctx.canvas;
    const boundings = canvas.getBoundingClientRect();
    this.mouseCoords = vec2((event.clientX - boundings.x) / canvas.clientWidth, (event.clientY - boundings.y) / canvas.clientHeight);
  }

  /**
   * @param {MouseEvent} event 
   * @returns 
   */
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

    // @todo João, sanitizar esse valor e considerar puxar das configurações...
    const aimType = Params.get('aim', 1);
    // @todo João, ainda tem pequenas inconsistências na direção que a força aponta, porém está bom por hora
    const force = vec2(coords.x * canvas.width, coords.y * canvas.height)
      .sub(vec2(canvas.width / 2, canvas.height / 2))
      .div(this.camera.scale)
      .add(this.camera.position)
      .sub(this.ball.currentPosition)
      .normalize()
      .mul(aimType)
      .mul(shootForce * modifier)
      .mul(this.ball.lastDt);

    this.ball.currentPosition.add(force);

    // sinaliza a espera do término do movimento
    this.gameContext.waitingStop = true;
    this.gameContext.firstBallHitted = null;
  }

  /**
   * Executa o som de colisão para um determinado par de entidades, sem permitir duplicar
   * @param {Entity} e1 
   * @param {Entity} e2 
   */
  playCollisionSound(e1, e2) {
    const id = e1.id > e2.id ? `${e2.id}-${e1.id}` : `${e1.id}-${e2.id}`;

    const currentHandle = this.collisionSounds.get(id);

    if (currentHandle && currentHandle.status == SoundHandleState.PLAYING)  {
      return;
    }

    // @note Não tenho a informação da velocidade na hora da colisão... então improvisando temporariamente assim
    const impactForce = (e1.getCurrentVelocity().length() + e2.getCurrentVelocity().length()) / 2 / 200;
    // @todo João, checar por colisões duplicadas, está de fato reportando duas vezes para cadas colisão... debugar pelo console
    // @todo João, trocar esse som... talvez implementar vários samples e vincular o volume a força da colisão
    // para agregar a experiência sonora do jogo...
    const handle = this.gameContext.soundMixer.play('collision', false, impactForce, true);

    if (handle) {
      this.collisionSounds.set(id, handle);
    }
  }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {SoundMixer} soundMixer 
 */
function renderSoundDebugView(ctx, soundMixer) {
  // Deixando a largura da linha escalável
  const color = '#0f0';
  const fontFamily = 'monospace';
  const fontSize = 14;
  const lineHeight = 1.6;
  const textXOffset = 14;
  const textYOffset = 14;
  
  {
    const title = `Total: ${soundMixer.getTotalSounds()} ` +
        `| Tocando: ${soundMixer.countSoundsInState(SoundHandleState.PLAYING)} ` +
        `| Pausados: ${soundMixer.countSoundsInState(SoundHandleState.STOPED)}`;

    const position = new Vec2(textXOffset, textYOffset + (fontSize * lineHeight * 1));
    drawText(ctx, title, position, fontSize, color, fontFamily, 'start');
  }

  let i = 2; // @note por que dois?
  for (const soundHandle of soundMixer.getPlayingSoundsIter()) {
    const position = new Vec2(textXOffset, textYOffset + (fontSize * lineHeight * i));
    drawText(ctx, soundHandle.getDescription(), position, fontSize, color, fontFamily, 'start');
    i++;
  }
}
