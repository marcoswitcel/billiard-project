var _a;
import { Circle } from './circle.js';
import { IN_MOVEMENT_THREASHOLD } from './physics-solver.js';
import { vec2, Vec2 } from './vec2.js';
export const symMarkedForRemoval = Symbol('Entity@markedForRemoval:boolean');
const IdGenerator = {
    id: Math.round(Math.random() * 1000),
    generate() {
        return this.id++;
    }
};
export class Entity {
    /**
     *
     * @param {Vec2} currentPosition
     * @param {Vec2} acceleration
     * @param {Circle} shape
     */
    constructor(currentPosition, acceleration, shape) {
        this.wasMoving = false;
        /**
         * @type {number}
         * @readonly
         */
        this.id = IdGenerator.generate();
        /**
         * @type {boolean}
         */
        this[_a] = false;
        this.currentPosition = currentPosition;
        this.oldPosition = currentPosition;
        this.lastDt = 0;
        this.acceleration = acceleration;
        this.shape = shape;
    }
    /**
     * @param {number} deltaTime
     */
    updatePosition(deltaTime) {
        // calcula velocidade
        const velocity = this.getCurrentVelocity();
        this.lastDt = deltaTime;
        // salva a posição atual
        this.oldPosition = this.currentPosition.copy();
        // realiza o cálculo usando o método de Verlet
        this.currentPosition
            .add(velocity.mul(deltaTime))
            .add(this.acceleration.mul(deltaTime));
        // @todo João, analisar a diferença, não lembro porque era dt ao quadrado
        //.add(this.acceleration.mul(deltaTime * deltaTime));
        // reseta aceleração
        this.acceleration.set(0, 0);
    }
    /**
     *
     * @param {Vec2} acc
     */
    accelerate(acc) {
        this.acceleration.add(acc);
    }
    /**
     * @returns {Vec2}
     */
    getCurrentVelocity() {
        return this.lastDt === 0 ? vec2(0, 0) : this.currentPosition.copy().sub(this.oldPosition).div(this.lastDt);
    }
    /**
     * reporta se a entidade está em estado 'estacionário'
     * @returns {boolean}
     */
    isStoped() {
        return this.getCurrentVelocity().length() <= IN_MOVEMENT_THREASHOLD;
    }
}
_a = symMarkedForRemoval;
