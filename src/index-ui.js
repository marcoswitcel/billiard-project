import { Color } from './color.js';
import { Rectangle } from './shape.js';
import { Button, theGUIGlobals } from './ui.js';
import { drawRect, drawText, isFullScreen } from './utils.js';
import { vec2 } from './vec2.js';

console.log('Olá mundo')

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const application = {
  state: 'running',
}

const app = document.getElementById('app');
const button = new Button();

button.text = 'botão de teste';
button.backgroundColor = new Color(0, 0, 255);
button.targetArea = new Rectangle(vec2(10, 10), vec2(100, 100), 'white');

button.resizeToFitContent(10);

if (!(app instanceof HTMLDivElement)) throw new Error('HTMLDivElement');

canvas.width = 800;
canvas.height = 600;

app.append(canvas);

const parameters = new URLSearchParams(window.location.search);

let lastTimestamp = 0;
// usado para saber qual era a taxa de refresh no momento que o programa iniciou... o refresh pode mudar, mas por hora
// não considero isso
let baseDeltaTime = 0;
let mouseDown = false;
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

  theGUIGlobals.timestampLastUpdated = deltaTime;
  theGUIGlobals.clickedInThisFrame = mouseDown;
  if (mouseDown) {
    theGUIGlobals.mouseClickedX = theGUIGlobals.mouseX;
    theGUIGlobals.mouseClickedY = theGUIGlobals.mouseY;
  } else {
    theGUIGlobals.mouseClickedX = 0;
    theGUIGlobals.mouseClickedY = 0;
  }
  mouseDown = false;

  drawRect(ctx, 'white', 0, 0, canvas.width, canvas.height);
  button.updateState();
  button.render(ctx);
  // @todo João, refatorar tudo isso, só testando
  if (theGUIGlobals.clickedInThisFrame) {
    if (button.hover) console.log('clicked');
  }

  if (application.state === 'paused') {
    drawText(ctx, 'pausado', vec2(10, ctx.canvas.height - 40), 40, 'white', 'monospace', 'left', 'middle');
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


canvas.addEventListener('mousedown', event => {
  mouseDown = true;
});

canvas.addEventListener('mousemove', event => {
  const boundings = canvas.getBoundingClientRect();

  theGUIGlobals.mouseX =(event.clientX - boundings.x); //  / canvas.clientWidth;
  theGUIGlobals.mouseY = (event.clientY - boundings.y); //  / canvas.clientHeight;

});
