import { Color } from './color.js';
import { Rectangle } from './shape.js';
import { drawRect, drawText } from './utils.js';
import { vec2 } from './vec2.js';
export class GUIGlobals {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseClickedX = 0;
        this.mouseClickedY = 0;
        this.clickedInThisFrame = false;
        this.timestampLastUpdated = 0;
        this.mouseDown = false;
    }
    setupListeners(canvas) {
        canvas.addEventListener('mousedown', event => {
            this.mouseDown = true;
        });
        canvas.addEventListener('mousemove', event => {
            const boundings = canvas.getBoundingClientRect();
            this.mouseX = (event.clientX - boundings.x); //  / canvas.clientWidth;
            this.mouseY = (event.clientY - boundings.y); //  / canvas.clientHeight;
        });
    }
    update(deltaTime) {
        theGUIGlobals.timestampLastUpdated = deltaTime;
        theGUIGlobals.clickedInThisFrame = this.mouseDown;
        if (this.mouseDown) {
            theGUIGlobals.mouseClickedX = theGUIGlobals.mouseX;
            theGUIGlobals.mouseClickedY = theGUIGlobals.mouseY;
        }
        else {
            theGUIGlobals.mouseClickedX = 0;
            theGUIGlobals.mouseClickedY = 0;
        }
        this.mouseDown = false;
    }
    static buttonId() {
        return ++this.buttonSequencial;
    }
}
GUIGlobals.buttonSequencial = 0;
;
export const theGUIGlobals = new GUIGlobals;
export class Button {
    constructor() {
        this.fontSize = 14;
        this.fontFamily = 'monospace';
        this.textColor = new Color(0, 0, 0);
        this.id = GUIGlobals.buttonId();
        this.gui = theGUIGlobals;
        this.setInitialState();
    }
    get width() {
        return this.targetArea.size.x;
    }
    get height() {
        return this.targetArea.size.y;
    }
    get isClicked() {
        return this.hover && this.gui.clickedInThisFrame;
    }
    // @todo João implementar alguma forma de oclusão para poder criar overlays e considerar botões sobrepostos
    setInitialState(text = `botão@${this.id}`, targetArea = new Rectangle(vec2(0, 0), vec2(100, 100), 'white'), backgroundColor = new Color(0, 0, 0)) {
        this.text = text;
        this.hover = false;
        this.active = false;
        this.targetArea = targetArea;
        this.backgroundColor = backgroundColor;
        this.highlightBackgroundColor = backgroundColor.copy().darken(0.9);
        this.timestampLastUpdated = 0;
    }
    setBackgroundColorWithHighlightColor(color, darkenBy = 0.9) {
        this.backgroundColor = color;
        this.highlightBackgroundColor = color.copy().darken(darkenBy);
    }
    updateState() {
        this.hover = isPointInsideRect(this.gui.mouseX, this.gui.mouseY, this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
    }
    render(ctx) {
        let color = this.hover ? this.highlightBackgroundColor : this.backgroundColor;
        if (this.gui.clickedInThisFrame && this.hover) {
            color = this.highlightBackgroundColor.copy().darken(0.9);
        }
        drawRect(ctx, color.toString(), this.targetArea.position.x, this.targetArea.position.y, this.targetArea.size.x, this.targetArea.size.y);
        drawText(ctx, this.text, this.targetArea.position.copy().add(this.targetArea.size.copy().div(2)), this.fontSize, this.textColor.toString(), this.fontFamily, 'center', 'middle');
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
