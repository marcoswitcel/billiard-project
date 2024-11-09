import { Circle } from './circle.js';
import { CircleConstraint } from './constraints.js';
import { DemonstrationScene, Scene01, Scene02 } from './demonstration-scene.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawRect } from './utils.js';
import { vec2 } from './vec2.js';

console.log('Olá mundo')

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
/**
 * @type {HTMLSelectElement|HTMLElement|null}
 */
const select = document.getElementById('scene');

if (!(select instanceof HTMLSelectElement)) throw new Error('HTMLSelectElement');

canvas.width = 700;
canvas.height = 500;

document.body.append(canvas);

/**
 * @type {DemonstrationScene}
 */
let scene = new Scene01(ctx);
const scenes = {
  scene01: Scene01,
  scene02: Scene02,
}

scene.setup();

let lastTimestamp = 0;
requestAnimationFrame(function loop(timestamp) {
  requestAnimationFrame(loop);
  
  if (lastTimestamp == 0) {
    lastTimestamp = timestamp;
    return;
  }

  const deltaTime = timestamp - lastTimestamp;
  const deltaTimeMs = deltaTime / 1000;

  scene.update(deltaTimeMs);

  scene.render();
  
  lastTimestamp = timestamp;
});

select.addEventListener('change', event => {
  const classType = scenes[select.value];

  if (classType) {
    scene.cleanup();
    scene = new classType(ctx);
    scene.setup();
  }
})

