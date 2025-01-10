import { CircleConstraint, LineSegmentConstraint, RectangleConstraint } from './constraints.js';
import { PhysicsSolver } from './physics-solver.js';
import { drawCircle, drawLine, drawRect, drawText } from './utils.js';
import { vec2 } from './vec2.js';

const searchParams = new URLSearchParams(window.location.search);

export class RenderParams {
  lightSource =  vec2(0, 0)
}

export class Camera {
  position = vec2(0, 0);
  size = vec2(100, 100);
  scale = 1;

  constructor(position, size, scale = 1) {
    this.position = position;
    this.size = size;
    this.scale = scale;
  }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {PhysicsSolver} physicsSolver 
 * @param {Camera} camera
 * @param {RenderParams} renderParams
 * @param {(ctx: CanvasRenderingContext2D, physicsSolver: PhysicsSolver, camera: Camera, renderParams: RenderParams) => void | null} customDrawRoutine
 */
export function render(ctx, physicsSolver, camera, renderParams, customDrawRoutine = null) {
  const debugView = searchParams.has('debugView') && searchParams.get('debugView') === 'true';
  const debugGridView = searchParams.has('debugGridView') && searchParams.get('debugGridView') === 'true';

  const canvasCenter = vec2(ctx.canvas.width / 2, ctx.canvas.height / 2);
  
  const scale = camera.scale;
  const lineWidth = 2 * scale;

  for (const constraint of physicsSolver.constraints) {
    // @todo João, todo esse código na verdade seria referente a visão de debug, os elementos visuais devem ser
    // adicionados separadamente da constraint
    if (constraint instanceof RectangleConstraint) {
      const position = canvasCenter.copy().add(constraint.position.copy().sub(camera.position).mul(scale));
      const width = constraint.width * scale;
      const height = constraint.height * scale;
      const color = '#0F0';
      drawRect(ctx, color, position.x - width / 2, position.y - height / 2, width, height);
    } else if (constraint instanceof CircleConstraint) {
      const position = canvasCenter.copy().add(constraint.position.copy().sub(camera.position).mul(scale));
      const radius = constraint.radius * scale;
      const color = '#0F0';
      drawCircle(ctx, position.x, position.y, radius, color);
    } else if (constraint instanceof LineSegmentConstraint) {
      const start = canvasCenter.copy().add(constraint.start.copy().sub(camera.position).mul(scale));
      const end = canvasCenter.copy().add(constraint.end.copy().sub(camera.position).mul(scale));
      const color = '#1F1';
      ctx.setLineDash([lineWidth, lineWidth]);
      drawLine(ctx, start, end, color, lineWidth);
      ctx.setLineDash([]);
    } else {
      console.warn("Constraint ainda não implementada");
    }
  }

  // desenhando sombras
  if (renderParams && renderParams.lightSource) {
    const lightSourcePositionTranslated = renderParams.lightSource.copy().sub(camera.position);
    for (const entity of physicsSolver.entities) {
      const currentPositionTranslated = canvasCenter.copy().add(entity.currentPosition.copy().sub(camera.position).mul(scale));
      const dir = lightSourcePositionTranslated.copy().sub(currentPositionTranslated);
      const shadowPosition = dir.mul(-1).normalized().mul(entity.shape.radius * 0.35 * Math.min(100, dir.length()) / 100);
      
      drawCircle(ctx, currentPositionTranslated.x + shadowPosition.x, currentPositionTranslated.y + shadowPosition.y, entity.shape.radius * scale, 'rgba(0, 0, 0, 0.33)');
    }
  }

  // desenhando "bolas"
  for (const entity of physicsSolver.entities) {
    const currentPositionTranslated = canvasCenter.copy().add(entity.currentPosition.copy().sub(camera.position).mul(scale));
    
    drawCircle(ctx, currentPositionTranslated.x, currentPositionTranslated.y, entity.shape.radius * scale, entity.shape.color);
  

    if (!debugView) continue;

    const color = 'rgba(0, 0, 255, 1)';
    ctx.setLineDash([lineWidth, lineWidth]);
    drawCircle(ctx, currentPositionTranslated.x, currentPositionTranslated.y, entity.shape.radius * scale, entity.shape.color, color, lineWidth);
    drawLine(ctx, currentPositionTranslated, currentPositionTranslated.copy().add(entity.getCurrentVelocity().mul(scale)), color, lineWidth);
    ctx.setLineDash([]);
  }

  // custom render
  if (typeof customDrawRoutine === 'function') {
    customDrawRoutine(ctx, physicsSolver, camera, renderParams);
  }

  if (debugGridView) {
    const { width, height } = ctx.canvas;
    ctx.setLineDash([lineWidth * 2, lineWidth]);
    // @todo João, quando o scale não é 1, acaba acontecendo erros de posicionamento das linhas.
    // Isso provavelemente ocorre por causa do spacing não ser um número inteiro.
    const spacing = 40 * scale;
    const offsetY = spacing - (camera.position.y % spacing);
    const offsetX = spacing - (camera.position.x % spacing);
    for (let i = 0; offsetY + i * spacing < height; i++)
    {
      const left = vec2(0, offsetY + i * spacing);
      const right = vec2(width, offsetY + i * spacing);
      drawLine(ctx, left, right, 'rgba(0, 255, 0, .4)');
    }
    for (let i = 0; offsetX + i * spacing < width; i++)
    {
      const top = vec2(offsetX + i * spacing, 0);
      const bottom = vec2(offsetX + i * spacing, height);
      drawLine(ctx, top, bottom, 'rgba(0, 255, 0, .4)');
    }
    ctx.setLineDash([]);
  }

  if (debugView) {
    const totalForce = physicsSolver.entities.reduce((p, c) => (p + c.getCurrentVelocity().length()), 0);
    drawText(ctx, 'energia interna: ' + totalForce.toFixed(2), vec2(15, 25), 20, 'white', 'monospace', 'left', 'middle');
    drawText(ctx, 'gravidade: ' + physicsSolver.gravity.length(), vec2(15, 45), 20, 'white', 'monospace', 'left', 'middle');
    drawText(ctx, 'fricção: ' + physicsSolver.friction, vec2(15, 65), 20, 'white', 'monospace', 'left', 'middle');
    drawText(ctx, 'substeps:' + physicsSolver.substepping, vec2(15, 85), 20, 'white', 'monospace', 'left', 'middle');
    // @ts-expect-error
    if (performance && performance.memory) {
      // @ts-expect-error
      drawText(ctx, 'Memória Usada (KB): ' + (performance.memory.usedJSHeapSize / 1024).toFixed(2), vec2(15, 105), 20, 'white', 'monospace', 'left', 'middle');
    }
  }
}
