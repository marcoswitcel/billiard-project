
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
   * @return {Vec2}
   */
  add(otherVec) {
    this.x += otherVec.x;
    this.y += otherVec.y;

    return this;
  }

  /**
   * Subtrai o valor do outro vetor do vetor atual
   * @public
   * @param {Vec2} otherVec 
   * @return {Vec2}
   */
  sub(otherVec) {
    this.x -= otherVec.x;
    this.y -= otherVec.y;

    return this;
  }

  /**
   * 
   * @param {number} scalarValue 
   * @returns {Vec2}
   */
  mul(scalarValue) {
    this.x *= scalarValue;
    this.y *= scalarValue;

    return this;
  }

  /**
   * Faz uma cópia do vetor
   * @returns {Vec2}
   */
  copy() {
    return new Vec2(this.x, this.y);
  }

  /**
   * seta os valores do vetor
   * @param {number} x 
   * @param {number} y 
   */
  set(x, y) {
    this.x = x;
    this.y = y;
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
