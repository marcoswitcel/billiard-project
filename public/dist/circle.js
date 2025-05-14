import { Vec2 } from './vec2.js';
export class Circle {
    /**
     *
     * @param {Vec2} position
     * @param {number} radius
     * @param {string} color
     */
    constructor(position, radius, color) {
        /**
         * @type {Vec2}
         */
        this.position = null;
        /**
         * @type {number}
         */
        this.radius = 0;
        /**
         * @type {string}
         */
        this.color = '#FFFFFF';
        this.position = position;
        this.radius = radius;
        this.color = color;
    }
}
