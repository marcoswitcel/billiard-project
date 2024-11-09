import { Circle } from './circle.js';
import { CircleConstraint } from './constraints.js';
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

const circle = new Circle(vec2(250, 200), 100, '#0F0');

const physicsSolver = new PhysicsSolver();
physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), 10, '#00F')));

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

  for (const constraint of physicsSolver.constraints) {
    if (constraint instanceof CircleConstraint) {
      const position = constraint.position;
      const radius = constraint.radius;
      const color = '#0F0';
      drawCircle(ctx, position.x, position.y, radius, color);
    }
  }

  /**
   * @todo João, implementar o sistema de 'sub-steps' no update das entidades.
   * @note tentei implementar um mecanismo simples, onde atualizo 3 vezes passando o deltaTimeMs dividido por três;
   * dessa forma ficou mais estável a simualação.
   */
  physicsSolver.update(deltaTimeMs);

  for (const entity of physicsSolver.entities) {
    drawCircle(ctx, entity.currentPosition.x, entity.currentPosition.y, entity.shape.radius, entity.shape.color);
  }
  
  lastTimestamp = timestamp;
});

document.addEventListener('keyup', event => {
  if (event.key === ' ') {
    const radius = Math.random() * 5 + 5;
    const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    physicsSolver.entities.push(new Entity(vec2(265, 200), vec2(0, 0), new Circle(vec2(250, 200), radius, color)));
  }
});

