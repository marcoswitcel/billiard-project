import { DemonstrationScene } from './demonstration-scene.js';
import { Params } from './params.js';
import { Scene01 } from './scene01.js';
import { Scene02 } from './scene02.js';
import { Scene03 } from './scene03.js';
import { Scene04 } from './scene04.js';
import { Scene05 } from './scene05.js';
import { Scene06 } from './scene06.js';
import { Scene07 } from './scene07.js';

console.log('Olá mundo')

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const application = {
  state: 'running',
}

/**
 * @type {HTMLSelectElement|HTMLElement|null}
 */
const select = document.getElementById('scene');
/**
 * @type {HTMLDivElement|HTMLElement|null}
 */
const app = document.getElementById('app');

if (!(select instanceof HTMLSelectElement)) throw new Error('HTMLSelectElement');
if (!(app instanceof HTMLDivElement)) throw new Error('HTMLDivElement');

canvas.width = 800;
canvas.height = 600;

app.append(canvas);

const updateScene = () => {
  const classType = scenes[select.value];

  if (classType) {
    if (scene) scene.cleanup();
    scene = new classType(ctx);
    scene.setup();
  }
};

/**
 * @type {DemonstrationScene|null}
 */
let scene = null;
const scenes = {
  scene01: Scene01,
  scene02: Scene02,
  scene03: Scene03,
  scene04: Scene04,
  scene05: Scene05,
  scene06: Scene06,
  scene07: Scene07,
}

const parameters = new URLSearchParams(window.location.search);

if (parameters.has('scene')) {
  select.value = parameters.get('scene');
}

updateScene();

let lastTimestamp = 0;
requestAnimationFrame(function loop(timestamp) {
  requestAnimationFrame(loop);
  
  if (lastTimestamp == 0) {
    lastTimestamp = timestamp;
    return;
  }

  const deltaTime = timestamp - lastTimestamp;
  const deltaTimeMs = deltaTime / 1000;

  if (scene) {
    // @todo João, considerar pausar ou definir um limite máximo de valor para o deltaTime ou no update da física
    // const DELTA_TIME_MAX_SPAN = 0.016;
    if (application.state === 'running') scene.update(deltaTimeMs * Params.get('speedFactor', 1));
    scene.render();
  }
  
  lastTimestamp = timestamp;
});

select.addEventListener('change', updateScene)

/**
 * @todo João, notei um @bug aqui, quando em fullscreen o cálculo da posição do click muda...
 * Avaliar e corrigir em todos locais apropriados
 */
canvas.addEventListener('dblclick', event => {
  canvas.requestFullscreen();
});

document.addEventListener('keyup', event => {
  if (event.code === 'KeyP') {
    application.state = (application.state === 'running') ? 'paused' : 'running';
  }
});

