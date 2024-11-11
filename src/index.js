import { DemonstrationScene } from './demonstration-scene.js';
import { Scene01 } from './scene01.js';
import { Scene02 } from './scene02.js';

console.log('Olá mundo')

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
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

canvas.width = 700;
canvas.height = 500;

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

  if (scene) scene.update(deltaTimeMs);

  if (scene) scene.render();
  
  lastTimestamp = timestamp;
});

select.addEventListener('change', updateScene)

canvas.addEventListener('dblclick', event => {
  canvas.requestFullscreen();
});

