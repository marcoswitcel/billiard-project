import { Rectangle } from './shape.js';
import { drawRect } from './utils.js';

export class Button {
  /**
   * @type {string}
   */
  text;
  /**
   * @type {boolean}
   */
  hover;
  /**
   * @type {boolean}
   */
  active;
  /**
   * @type {Rectangle}
   */
  targetArea;
  /**
   * @type {string}
   */
  backgroundColor;
  /**
   * @type {string}
   */
  highlightBackgroundColor;
  /**
   * @type {number}
   */
  timestamp_last_updated;

  constructor(text) {
    this.setInitialState();
  }

  setInitialState(text = this.text, targetArea = this.targetArea, backgroundColor = this.backgroundColor, highlightBackgroundColor = this.highlightBackgroundColor) {
    this.text = text;
    this.hover = false;
    this.active = false;
    this.targetArea = targetArea;
    this.backgroundColor = backgroundColor;
    this.highlightBackgroundColor = highlightBackgroundColor;
    this.timestamp_last_updated = 0;
  }

  render(ctx) {
    const margin = 5; // @todo João, deixar mais flexível isso aqui

    drawRect(ctx, 'black', this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
  }
}
