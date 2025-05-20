export class Vec2 {
    /**
     *
     * @param x
     * @param y
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Adiciona o valor do outro vetor ao vetor atual
     * @param otherVec
     * @return
     */
    add(otherVec) {
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
    sub(otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        return this;
    }
    /**
     *
     * @param scalarValue
     * @returns
     */
    mul(scalarValue) {
        this.x *= scalarValue;
        this.y *= scalarValue;
        return this;
    }
    /**
     *
     * @param scalarValue
     * @returns
     */
    div(scalarValue) {
        this.x /= scalarValue;
        this.y /= scalarValue;
        return this;
    }
    /**
     * Faz uma cópia do vetor
     * @returns
     */
    copy() {
        return new Vec2(this.x, this.y);
    }
    /**
     * seta os valores do vetor
     * @param x
     * @param y
     */
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     *
     * @returns  novo vetor
     */
    normalized() {
        const length = this.length();
        if (length > 0) {
            return this.copy().div(length);
        }
        return new Vec2(0, 0);
    }
    /**
     * Normaliza o próprio vetor
     */
    normalize() {
        const length = this.length();
        if (length > 0) {
            this.div(length);
        }
        return this;
    }
    /**
     * @note Avaliar se essa será a função padrão para a multiplicação de vetores. Não sei se é intuitivo, pesquisar...
     * @param otherVec
     * @returns
     */
    mulVec(otherVec) {
        this.x *= otherVec.x;
        this.y *= otherVec.y;
        return this;
    }
    /**
     * Calcula a 'magnitude' ou 'comprimento' do vetor
     * @returns
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
/**
 *
 * @param x
 * @param y
 * @returns
 */
export const vec2 = (x, y) => new Vec2(x, y);
