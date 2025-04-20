import { Color } from './color.js';
import { Button, theGUIGlobals } from './ui.js';

export class GameScene {

  newScene = null;

  setup() {}
  /**
   * @param {number} deltaTimeMs
   */
  update(deltaTimeMs) {}
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} deltaTimeMs
   */
  render(ctx, deltaTimeMs) {}
  cleanup() {}
}

export class BilliardScene extends GameScene {
 /**
   * @type {Button[]}
   */
 components = [];

 newScene = null;

 setup() {
  const buttonA = new Button();

  this.components = [buttonA];

  buttonA.text = 'Jogando';
  buttonA.fontSize = 20;
  buttonA.textColor = new Color(255, 255, 255);
  buttonA.setBackgroundColorWithHighlightColor(new Color(0, 0, 255));

  const xOffset = 10;
  let yOffset = 10;
  for (const button of this.components) {
    button.resizeToFitContent(button.fontSize);
    button.targetArea.position.x = xOffset;
    button.targetArea.position.y = yOffset;
    yOffset += button.height + 5;
  }

 }
 update(deltaTimeMs) {
  for (const button of this.components) {
    button.updateState();

    if (button.isClicked) {
      this.newScene = new MenuScene();
    }
  }
 }
 render(ctx, deltaTimeMs) {
    for (const button of this.components) {
      button.render(ctx);
    }
  }
}

export class MenuScene extends GameScene {
  /**
   * @type {Button[]}
   */
  components = [];

  newScene = null;

  setup() {
    const buttonA = new Button();
    const buttonB = new Button();

    this.components = [buttonA, buttonB];

    buttonA.text = 'Jogar';
    buttonA.fontSize = 20;
    buttonA.textColor = new Color(255, 255, 255);
    buttonA.setBackgroundColorWithHighlightColor(new Color(0, 0, 255));

    buttonB.text = 'Configurações';
    buttonB.fontSize = 20;
    buttonB.textColor = new Color(255, 255, 255);
    buttonB.setBackgroundColorWithHighlightColor(new Color(0, 0, 255));


    const xOffset = 10;
    let yOffset = 10;
    for (const button of this.components) {
      button.resizeToFitContent(button.fontSize);
      button.targetArea.position.x = xOffset;
      button.targetArea.position.y = yOffset;
      yOffset += button.height + 5;
    }

  }
  update(deltaTimeMs) {
    for (const button of this.components) {
      button.updateState();

      if (theGUIGlobals.clickedInThisFrame) {
        if (button.hover) {
          this.newScene = new BilliardScene();
        }
      }
    }
  }
  render(ctx, deltaTimeMs) {
    for (const button of this.components) {
      button.render(ctx);
    }
  }
  cleanup() {}
}

