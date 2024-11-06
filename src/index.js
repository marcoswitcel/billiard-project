import { Circle } from './circle.js';
import { Entity } from './entity.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawRect } from './utils.js';
import { vec2 } from './vec2.js';

console.log('Olá mundo')


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 400;

document.body.append(canvas);

const circle = new Circle(vec2(250, 200), 100, '#0F0');

const physicsSolver = new PhysicsSolver();
physicsSolver.entities.push(new Entity(vec2(100, 0), vec2(0, 0), null))

let lastTimestamp = 0;
requestAnimationFrame(function loop(timestamp) {
  requestAnimationFrame(loop);
  
  if (lastTimestamp == 0) {
    lastTimestamp = timestamp;
    return;
  }

  const deltaTime = timestamp - lastTimestamp;
  const deltaTimeMs = deltaTime / 1000;

  // background
  drawRect(ctx, '#000', 0, 0, canvas.width, canvas.height);

  // circle.position.add(vec2(1, 1));

  drawCircle(ctx, circle.position.x, circle.position.y, circle.radius, circle.color);

  physicsSolver.update(deltaTimeMs);

  drawCircle(ctx, physicsSolver.entities[0].currentPosition.x, physicsSolver.entities[0].currentPosition.y, 10, circle.color);
  
  lastTimestamp = timestamp;
});

