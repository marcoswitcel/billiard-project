import { Vec2, vec2 } from './vec2.js';
export class Shape {
    /**
     *
     * @param {Vec2} position
     * @param {string} color
     */
    constructor(position, color) {
        this.position = vec2(0, 0);
        this.color = '#0F0';
        this.position = position;
        this.color = color;
    }
}
export class ImageShape extends Shape {
    /**
     * @param {Vec2} position
     * @param {Vec2} size
     * @param {any} image
     * @param {string} color
     */
    constructor(position, size, image, color) {
        super(position, color);
        this.size = vec2(1, 1);
        this.image = null;
        this.size = size;
        // @note João, longe do ideal ou mais flexível, mas por hora...
        this.image = image;
    }
}
export class Rectangle extends Shape {
    /**
     * @param {Vec2} position
     * @param {Vec2} size
     * @param {string} color
     */
    constructor(position, size, color) {
        super(position, color);
        this.size = vec2(1, 1);
        this.size = size;
    }
}
export class Polygon extends Shape {
    /**
     *
     * @param {Vec2} position
     * @param {string} color
     * @param {Vec2[]} points
     */
    constructor(position, color, points, scale) {
        super(position, color);
        this.points = points;
        this.scale = scale;
    }
}
export class Circle2 extends Shape {
    /**
     *
     * @param {Vec2} position
     * @param {string} color
     * @param {number} radius
     */
    constructor(position, color, radius) {
        super(position, color);
        this.radius = radius;
    }
}
