import { drawCircle, drawRect } from './utils.js';

console.log('Olá mundo')


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 400;

document.body.append(canvas);

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

  
  
  lastTimestamp = timestamp;
});

