import { CircleConstraint, RectangleConstraint } from './constraints.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawLine, drawRect, drawText } from './utils.js';
import { vec2 } from './vec2.js';

const searchParams = new URLSearchParams(window.location.search);

class Camera {
  position = vec2(0, 0);
  size = vec2(100, 100);

  constructor(position, size) {
    this.position = position;
    this.size = size;
  }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {PhysicsSolver} physicsSolver 
 * @param {Camera | null} camera
 */
export function render(ctx, physicsSolver, camera = null) {
  const debugView = searchParams.has('debugView') && searchParams.get('debugView') === 'true';
  const debugGridView = searchParams.has('debugGridView') && searchParams.get('debugGridView') === 'true';

  
  if (camera === null) {
    camera = new Camera(vec2(0, 0), vec2(ctx.canvas.width, ctx.canvas.height));
  }

  // @todo João, avaliar como fazer a scale
  const scale = ctx.canvas.width / camera.size.x;

  for (const constraint of physicsSolver.constraints) {
    if (constraint instanceof RectangleConstraint) {
      const position = constraint.position.copy().sub(camera.position);
      const width = constraint.width; // ajustar scale
      const height = constraint.height; // ajustar scale
      const rotation = constraint.rotation; // @todo João, ignorando rotação
      const color = '#0F0';
      drawRect(ctx, color, position.x - width / 2, position.y - height / 2, width, height);
    } else if (constraint instanceof CircleConstraint) {
      const position = constraint.position.copy().sub(camera.position);
      const radius = constraint.radius; // ajustar scale
      const color = '#0F0';
      drawCircle(ctx, position.x, position.y, radius, color);
    }
  }
  
  for (const entity of physicsSolver.entities) {
    drawCircle(ctx, entity.currentPosition.x, entity.currentPosition.y, entity.shape.radius, entity.shape.color);
  

    if (!debugView) continue;

    const lineWidth = 2;
    const color = 'rgba(0, 0, 255, 1)';
    ctx.setLineDash([lineWidth, lineWidth]);
    drawCircle(ctx, entity.currentPosition.x, entity.currentPosition.y, entity.shape.radius, entity.shape.color, color, lineWidth);
    drawLine(ctx, entity.currentPosition, entity.currentPosition.copy().add(entity.getCurrentVelocity().mul(10)), color, lineWidth);
    ctx.setLineDash([]);
  }

  if (debugGridView) {
    const lineWidth = 2;
    const { width, height } = ctx.canvas;
    ctx.setLineDash([lineWidth * 2, lineWidth]);
    const spacing = 20;
    for (let i = 0; i < Math.floor(height / spacing); i++)
    {
      const left = vec2(0, i * spacing);
      const right = vec2(width, i * spacing);
      drawLine(ctx, left, right, 'rgba(0, 255, 0, .4)');
    }
    for (let i = 0; i < Math.floor(width / spacing); i++)
    {
      const top = vec2(i * spacing, 0);
      const bottom = vec2(i * spacing, height);
      drawLine(ctx, top, bottom, 'rgba(0, 255, 0, .4)');
    }
    ctx.setLineDash([]);
  }

  if (debugView) {
    const totalForce = physicsSolver.entities.reduce((p, c) => (p + c.getCurrentVelocity().length()), 0);
    drawText(ctx, 'energia interna: ' + totalForce.toFixed(2), vec2(25, 25), 20, 'white', 'monospace', 'left', 'middle');
    drawText(ctx, 'gravidade: ' + physicsSolver.gravity.length(), vec2(25, 45), 20, 'white', 'monospace', 'left', 'middle');
  }
}
