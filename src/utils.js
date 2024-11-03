
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
export function drawCircle(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}
