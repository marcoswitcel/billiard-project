import { Color } from './color.js';
import { GameScene, MenuScene } from './game-scene.js';
import { Rectangle } from './shape.js';
import { Button, GUIGlobals, theGUIGlobals } from './ui.js';
import { drawRect, drawText, isFullScreen } from './utils.js';
import { vec2 } from './vec2.js';

console.log('Olá mundo')

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const application = {
  state: 'running',
}

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) throw new Error('HTMLDivElement');

canvas.width = 800;
canvas.height = 600;

app.append(canvas);
/**
 * @type {GameScene}
 */
let scene  = null;
let newScene = new MenuScene();

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
    scene.update(deltaTimeMs);
    scene.render(ctx, deltaTimeMs);

    if (scene.newScene) {
      newScene = scene.newScene;
    }
  }

  if (application.state === 'paused') {
    drawText(ctx, 'pausado', vec2(10, ctx.canvas.height - 40), 40, 'black', 'monospace', 'left', 'middle');
  }
  
  lastTimestamp = timestamp;
});

/**
 * @todo João, notei um @bug aqui, quando em fullscreen o cálculo da posição do click muda...
 * Avaliar e corrigir em todos locais apropriados
 */
canvas.addEventListener('dblclick', event => {
  canvas.requestFullscreen();
});

window.addEventListener('resize', () => {
  /* if (isFullScreen()) {
    canvas.width = 800 * 2;
    canvas.height = 600 * 2;
  } else {
    canvas.width = 800;
    canvas.height = 600;
  } */
});

document.addEventListener('keyup', event => {
  if (event.code === 'KeyP') {
    application.state = (application.state === 'running') ? 'paused' : 'running';
  }
});


theGUIGlobals.setupListeners(canvas);

canvas.addEventListener('mousemove', event => {
  const boundings = canvas.getBoundingClientRect();

  theGUIGlobals.mouseX =(event.clientX - boundings.x); //  / canvas.clientWidth;
  theGUIGlobals.mouseY = (event.clientY - boundings.y); //  / canvas.clientHeight;

});
