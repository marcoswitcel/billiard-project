import { Circle } from './circle.js';
import { drawCircle, drawRect } from './utils.js';
import { vec2 } from './vec2.js';

console.log('Olá mundo')


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 400;

document.body.append(canvas);

const circle = new Circle(vec2(250, 200), 100, '#0F0');

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
  
  lastTimestamp = timestamp;
});

