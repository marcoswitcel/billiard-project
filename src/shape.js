import { Vec2, vec2 } from './vec2.js';

export class Shape {
  position = vec2(0, 0);
  color = '#0F0';

  /**
   * 
   * @param {Vec2} position 
   * @param {string} color 
   */
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }
}

export class ImageShape extends Shape {
  size = vec2(1, 1);
  image = null;

  /**
   * @param {Vec2} position 
   * @param {Vec2} size 
   * @param {any} image 
   * @param {string} color 
   */
  constructor(position, size, image, color) {
    super(position, color);
    this.size = size;
    // @note João, longe do ideal ou mais flexível, mas por hora...
    this.image = image;
  }
}

export class Rectangle extends Shape {
  size = vec2(1, 1);

  /**
   * @param {Vec2} position 
   * @param {Vec2} size 
   * @param {string} color 
   */
  constructor(position, size, color) {
    super(position, color);
    this.size = size;
  }
}

export class Polygon extends Shape {
  points;
  scale;

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
  radius;

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
