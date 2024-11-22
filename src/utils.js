import { Vec2 } from './vec2.js';

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} color 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 */
export function drawRect(ctx, color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} radius
 * @param {string} color 
 */
export function drawCircle(ctx, x, y, radius, color, strokeStyle = null, lineWidth = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  if (strokeStyle && lineWidth) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
}

export function drawLine(ctx, pointA, pointB, strokeStyle = '#FFFFFF', lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

/**
 * @note links úteis:
 * * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign}
 * * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline}
 * * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textRendering}
 * 
 * @param {CanvasRenderingContext2D} ctx contexto atual
 * @param {string} text texto a ser exibido
 * @param {Vec2} position posição do texto
 * @param {number} size tamanho do texto de 0 a 1, será mapeado para uma fração do tamanho do canvas
 * @param {string} fillStyle cor de preenchimento
 * @param {string} fontFamily fonta desejada
 * @param {CanvasTextAlign} textAlign alinhamento horizontal do texto
 * @param {CanvasTextBaseline} textBaseline alinhamento vertical do texto
 */
export function drawText(ctx, text, position, size, fillStyle = '#FFFFFF', fontFamily = 'monospace', textAlign = 'center', textBaseline = 'middle') {
  ctx.font = `${size}px ${fontFamily}`;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillText(text, position.x, position.y);
}
