
export class Vec2 {
  
  x: number;
  y: number;

  /**
   * 
   * @param x 
   * @param y 
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adiciona o valor do outro vetor ao vetor atual
   * @param otherVec 
   * @return 
   */
  add(otherVec: Vec2): Vec2 {
    this.x += otherVec.x;
    this.y += otherVec.y;

    return this;
  }

  /**
   * Subtrai o valor do outro vetor do vetor atual
   * @public
   * @param otherVec 
   * @return 
   */
  sub(otherVec: Vec2) {
    this.x -= otherVec.x;
    this.y -= otherVec.y;

    return this;
  }

  /**
   * 
   * @param scalarValue 
   * @returns 
   */
  mul(scalarValue: number): Vec2 {
    this.x *= scalarValue;
    this.y *= scalarValue;

    return this;
  }

  /**
   * 
   * @param scalarValue 
   * @returns 
   */
  div(scalarValue: number): Vec2 {
    this.x /= scalarValue;
    this.y /= scalarValue;

    return this;
  }

  /**
   * Faz uma cópia do vetor
   * @returns 
   */
  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * seta os valores do vetor
   * @param x 
   * @param y 
   */
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * 
   * @returns  novo vetor
   */
  normalized(): Vec2 {
    const length = this.length();
    
    if (length > 0)
    {
      return this.copy().div(length);
    }
  
    return new Vec2(0, 0);
  }

  /**
   * Normaliza o próprio vetor
   */
  normalize() {
    const length = this.length();
    
    if (length > 0)
    {
      this.div(length);
    }

    return this;
  }

  /**
   * @note Avaliar se essa será a função padrão para a multiplicação de vetores. Não sei se é intuitivo, pesquisar...
   * @param otherVec 
   * @returns 
   */
  mulVec(otherVec: Vec2): Vec2 {
    this.x *= otherVec.x;
    this.y *= otherVec.y;

    return this;
  }

  /**
   * Calcula a 'magnitude' ou 'comprimento' do vetor
   * @returns 
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

/**
 * 
 * @param x 
 * @param y 
 * @returns 
 */
export const vec2 = (x: number, y: number) => new Vec2(x, y);
