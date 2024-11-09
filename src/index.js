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

canvas.width = 700;
canvas.height = 500;

document.body.append(canvas);

const scene = new Scene02(ctx);

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

