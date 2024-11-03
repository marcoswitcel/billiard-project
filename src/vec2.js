
export class Vec2 {
  
  /**
   * @type {number}
   */
  x = 0;
  /**
   * @type {number}
   */
   y = 0;

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adiciona o valor do outro vetor ao vetor atual
   * @public
   * @param {Vec2} otherVec 
   */
  add(otherVec) {
    this.x += otherVec.x;
    this.y += otherVec.y;
  }

  /**
   * Subtrai o valor do outro vetor do vetor atual
   * @public
   * @param {Vec2} otherVec 
   */
  sub(otherVec) {
    this.x -= otherVec.x;
    this.y -= otherVec.y;
  }

  // @todo João, implementar normalized
  // @todo João, implementar length/magnitude
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {Vec2}
 */
export const vec2 = (x, y) => new Vec2(x, y);
