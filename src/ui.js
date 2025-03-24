import { Rectangle } from './shape.js';
import { drawRect } from './utils.js';


export class GUIGlobals {
  mouseX;
  mouseY;
  mouse_clicked_x;
  mouse_clicked_y;
  clicked_in_this_frame;
  timestamp_last_updated;
};

export const theGUIGlobals = {
  mouse_x : 0,
  mouse_y : 0,
  mouse_clicked_x : 0,
  mouse_clicked_y : 0,
  clicked_in_this_frame : false,
  timestamp_last_updated : 0,
};

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

  updateState() {
    this.hover = isPointInsideRect(theGUIGlobals.mouse_x, theGUIGlobals.mouse_y, this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
  }

  render(ctx) {
    const margin = 5; // @todo João, deixar mais flexível isso aqui

    const color = this.hover ? 'rgba(0,0,0,.1)' : this.backgroundColor;

    drawRect(ctx, color, this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
  }
}

export function isPointInsideRect(pX, pY, rX, rY, rW, rH) {
  const result = (pX >= rX && pX <= (rX + rW)) && (pY >= rY && pY <= (rY + rH));
  return result;
}
