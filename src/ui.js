import { Color } from './color.js';
import { Rectangle } from './shape.js';
import { drawRect, drawText } from './utils.js';


export class GUIGlobals {
  mouseX = 0;
  mouseY = 0;
  mouseClickedX = 0;
  mouseClickedY = 0;
  clickedInThisFrame = false;
  timestampLastUpdated = 0;
  mouseDown = false;

  setupListeners(canvas) {
    canvas.addEventListener('mousedown', event => {
      this.mouseDown = true;
    });
  }

  update(deltaTime) {
    theGUIGlobals.timestampLastUpdated = deltaTime;
    theGUIGlobals.clickedInThisFrame = this.mouseDown;
    if (this.mouseDown) {
      theGUIGlobals.mouseClickedX = theGUIGlobals.mouseX;
      theGUIGlobals.mouseClickedY = theGUIGlobals.mouseY;
    } else {
      theGUIGlobals.mouseClickedX = 0;
      theGUIGlobals.mouseClickedY = 0;
    }
    this.mouseDown = false;
  }
};

export const theGUIGlobals = new GUIGlobals;

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
   * @type {Color}
   */
  backgroundColor;
  /**
   * @type {Color}
   */
  highlightBackgroundColor;
  /**
   * @type {number}
   */
  timestampLastUpdated;

  fontSize = 14;

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
    this.timestampLastUpdated = 0;
  }

  updateState() {
    this.hover = isPointInsideRect(theGUIGlobals.mouseX, theGUIGlobals.mouseY, this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
  }

  render(ctx) {
    const color = this.hover ? this.backgroundColor.copy().darken(0.9) : this.backgroundColor;

    drawRect(ctx, color.toString(), this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
    drawText(ctx, this.text, this.targetArea.position.copy().add(this.targetArea.size.copy().div(2)), this.fontSize, 'white', 'monospace', 'center', 'middle');
  }

  resizeToFitContent(margin = 0) {
    this.targetArea.size.x = this.text.length * this.fontSize * 0.75 + (margin * 2);
    this.targetArea.size.y = this.text.split('\n').length * this.fontSize * 1.1 + (margin * 2);
  }
}

export function isPointInsideRect(pX, pY, rX, rY, rW, rH) {
  const result = (pX >= rX && pX <= (rX + rW)) && (pY >= rY && pY <= (rY + rH));
  return result;
}
