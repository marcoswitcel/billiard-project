import { CircleConstraint, RectangleConstraint } from './constraints.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawLine, drawRect, drawText } from './utils.js';
import { vec2 } from './vec2.js';

const searchParams = new URLSearchParams(window.location.search);

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {PhysicsSolver} physicsSolver 
 */
export function render(ctx, physicsSolver) {
  const debugView = searchParams.has('debugView') && searchParams.get('debugView') === 'true';

  for (const constraint of physicsSolver.constraints) {
    if (constraint instanceof RectangleConstraint) {
      const position = constraint.position;
      const width = constraint.width;
      const height = constraint.height;
      const rotation = constraint.rotation; // @todo João, ignorando rotação
      const color = '#0F0';
      drawRect(ctx, color, position.x - width / 2, position.y - height / 2, width, height);
    } else if (constraint instanceof CircleConstraint) {
      const position = constraint.position;
      const radius = constraint.radius;
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

  // ctx.setLineDash([4, 2]);
  // drawLine(ctx, vec2(0,0), vec2(100, 100));
  // ctx.setLineDash([]);

  if (debugView) {
    const totalForce = physicsSolver.entities.reduce((p, c) => (p + c.getCurrentVelocity().length()), 0);
    drawText(ctx, 'energia interna: ' + totalForce.toFixed(2), vec2(25, 25), 20, 'white', 'monospace', 'left', 'middle');
    drawText(ctx, 'gravidade: ' + physicsSolver.gravity.length(), vec2(25, 45), 20, 'white', 'monospace', 'left', 'middle');
  }
}
