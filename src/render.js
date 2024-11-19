import { RectangleConstraint } from './constraints.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawLine, drawRect } from './utils.js';

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {PhysicsSolver} physicsSolver 
 */
export function render(ctx, physicsSolver) {
  const debugView = true;

  for (const constraint of physicsSolver.constraints) {
    if (constraint instanceof RectangleConstraint) {
      const position = constraint.position;
      const width = constraint.width;
      const height = constraint.height;
      const rotation = constraint.rotation; // @todo João, ignorando rotação
      const color = '#0F0';
      drawRect(ctx, color, position.x - width / 2, position.y - height / 2, width, height);
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
}
