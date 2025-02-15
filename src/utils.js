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

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Vec2} pointA 
 * @param {Vec2} pointB 
 * @param {string} strokeStyle 
 * @param {number} lineWidth 
 */
export function drawLine(ctx, pointA, pointB, strokeStyle = '#FFFFFF', lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Vec2[]} polygon 
 * @param {string|null} fillStyle
 * @param {string|null} strokeStyle 
 * @param {number} lineWidth 
 */
export function drawPolygon(ctx, polygon, fillStyle = '#FFFFFF', strokeStyle = '#FFFFFF', lineWidth = 1) {
  let point = polygon[0];
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  for (let i = 1; i < polygon.length; i++) {
    point = polygon[i];
    ctx.lineTo(point.x, point.y);
  }
  point = polygon[0];
  ctx.lineTo(point.x, point.y);
  ctx.closePath();
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  if (strokeStyle) {
    ctx.stroke();
  }
  ctx.fill();
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

export function between(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

/**
 * 
 * @param {Vec2} s0 
 * @param {Vec2} e0 
 * @param {Vec2} o 
 * @returns {0|1|2}
 */
export function orientationOfTriplet(s0, e0, o) {
  const result = (e0.y - s0.y) * (o.x - e0.x) - (e0.x - s0.x) * (o.y - e0.y); 

  if (result === 0) return 0;

  return (result > 0) ? 1 : 2;
}

/**
 * 
 * @param {Vec2} s0 
 * @param {Vec2} e0 
 * @param {Vec2} point 
 * @returns {boolean}
 */
export function isPointOnSegment(s0, e0, point) { 
  return e0.x <= Math.max(s0.x, point.x) &&
         e0.x >= Math.min(s0.x, point.x) && 
         e0.y <= Math.max(s0.y, point.y) &&
         e0.y >= Math.min(s0.y, point.y);
} 

/**
 * @references
 * @url https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
 * @url https://www.geeksforgeeks.org/orientation-3-ordered-points/
 * 
 * @param {Vec2} s0 
 * @param {Vec2} e0 
 * @param {Vec2} s1 
 * @param {Vec2} e1 
 * @returns {boolean}
 */
export function isLineSegmentIntersecting(s0, e0, s1, e1) {

  const o1 = orientationOfTriplet(s0, e0, s1); 
  const o2 = orientationOfTriplet(s0, e0, e1); 
  const o3 = orientationOfTriplet(s1, e1, s0); 
  const o4 = orientationOfTriplet(s1, e1, e0); 
  
  if (o1 != o2 && o3 != o4) return true; 
  
  if (o1 == 0 && isPointOnSegment(s0, s1, e0)) return true; 
  
  if (o2 == 0 && isPointOnSegment(s0, e1, e0)) return true; 
  
  if (o3 == 0 && isPointOnSegment(s1, s0, e1)) return true; 
  
  if (o4 == 0 && isPointOnSegment(s1, e0, e1)) return true; 
  
  return false;
} 

/**
 * @reference https://www.inf.pucrs.br/~pinho/CG/Aulas/OpenGL/Interseccao/CalcIntersec.html
 * 
 * @param {Vec2} s0 
 * @param {Vec2} e0 
 * @param {Vec2} s1 
 * @param {Vec2} e1 
 * @returns {null | Vec2}
 */
export function calculateIntersectionOfLineSegments(s0, e0, s1,  e1) {
  const det = (e1.x - s1.x) * (e0.y - s0.y) - (e1.y - s1.y) * (e0.x - s0.x);
  
  if (det === 0.0) { // @todo João, não funciona dessa forma, verificar se não é por causa da ordem dos pontos...
    return null;
  }

  const s = ((e1.x - s1.x) * (s1.y - s0.y) - (e1.y - s1.y) * (s1.x - s0.x)) / det;
  // const t = ((e0.x - s0.x) * (s1.y - s0.y) - (e0.y - s0.y) * (s1.x - s0.x)) / det;

  const intersection = new Vec2(0, 0);

  intersection.x = s0.x + (e0.x-s0.x) * s;
  intersection.y = s0.y + (e0.y-s0.y) * s;

  return intersection;
}


/**
 * @url https://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d#answer-2259502
 * 
 * @param {Vec2} origin 
 * @param {Vec2} point 
 * @param {number} angle ângulo em radianos
 * @returns 
 */
export function rotatePoint(origin, point, angle) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  // deixa ponto relativo a origem
  point.x -= origin.x;
  point.y -= origin.y;

  // rotaciona o ponto
  const newX = point.x * c - point.y * s;
  const newY = point.x * s + point.y * c;

  // faz a translação de volta ao sistema de coordenadas original
  point.x = newX + origin.x;
  point.y = newY + origin.y;

  return point;
}

/**
 * @url https://stackoverflow.com/questions/135909/what-is-the-method-for-converting-radians-to-degrees
 * @param {*} radians 
 * @returns 
 */
export function toDegrees(radians) {
  return radians * (180 / Math.PI);
}
