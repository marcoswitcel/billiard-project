import { appDefaults } from './game-context.js';
import { GameScene, MenuScene } from './game-scene.js';
import { Params } from './params.js';
import { theGUIGlobals } from './ui.js';
import { between, drawRect } from './utils.js';

console.log('Olá mundo')

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) throw new Error('HTMLDivElement');
if (!(ctx instanceof CanvasRenderingContext2D)) throw new Error('CanvasRenderingContext2D');

canvas.width = appDefaults.width;
canvas.height = appDefaults.height;

app.append(canvas);
/**
 * @type {GameScene?}
 */
let scene  = null;
/**
 * @type {GameScene?}
 */
let newScene = new MenuScene(ctx);

const parameters = new URLSearchParams(window.location.search);

let lastTimestamp = 0;
// usado para saber qual era a taxa de refresh no momento que o programa iniciou... o refresh pode mudar, mas por hora
// não considero isso
let baseDeltaTime = 0;
requestAnimationFrame(function loop(timestamp) {
  requestAnimationFrame(loop);
  
  if (baseDeltaTime === 0 && lastTimestamp !== 0) {
    baseDeltaTime = timestamp - lastTimestamp;
  }

  if (lastTimestamp === 0) {
    lastTimestamp = timestamp;
    return;
  }

  const deltaTime = timestamp - lastTimestamp;
  const deltaTimeMs = Math.min(deltaTime, baseDeltaTime) / 1000;

  theGUIGlobals.update(deltaTime);

  drawRect(ctx, 'white', 0, 0, canvas.width, canvas.height);

  if (newScene) {
    if (scene) scene.cleanup();

    scene = newScene;
    scene.setup();

    newScene = null;
  }

  if (scene) {
    scene.update(deltaTimeMs * Params.get('speedFactor', 1));
    scene.render(deltaTimeMs * Params.get('speedFactor', 1));

    if (scene.newScene) {
      newScene = scene.newScene;
    }
  }
  
  lastTimestamp = timestamp;
});

canvas.addEventListener('dblclick', event => {
  app.requestFullscreen();
});

window.addEventListener('resize', () => {
  // @wip foi parcialmente adaptado para renderizar os elementos na nova resolução..
  // falta terminar de ajustar elementos de texto da UI e a própria UI (botões)
  /* if (isFullScreen()) {
    const proportion = 1.1;
    canvas.width = appDefaults.width * proportion;
    canvas.height = appDefaults.height * proportion;
  } else {
    canvas.width = appDefaults.width;
    canvas.height = appDefaults.height;
  } */
});

document.addEventListener('keydown', (event) => {
  const speedFactor = Params.get('speedFactor', 1);
  
  if (event.key === '+') {
    Params.set('speedFactor', between(speedFactor + 0.01, 0, 10));
  } else if (event.key === '-') {
    Params.set('speedFactor', between(speedFactor - 0.01, 0, 10));
  }
});

theGUIGlobals.setupListeners(canvas);
