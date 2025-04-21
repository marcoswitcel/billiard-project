import { Color } from './color.js';
import { Scene07 } from './scene07.js';
import { Button, theGUIGlobals } from './ui.js';

export class GameScene {

  /**
   * @type {GameScene|null} 
   */
  newScene = null;

  /**
   * @type {CanvasRenderingContext2D} 
   */
  ctx;

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  setup() {}

  /**
   * @param {number} deltaTimeMs
   */
  update(deltaTimeMs) {}

  /**

   * @param {number} deltaTimeMs
   */
  render(deltaTimeMs) {}
  
  cleanup() {}
}

export class BilliardScene extends GameScene {
  /**
   * @type {Button[]}
   */
  components = [];

  newScene = null;

  scene;

  constructor(ctx) {
    super(ctx);
    this.scene = new Scene07(ctx);
  }

  setup() {
    const buttonA = new Button();

    this.components = [buttonA];

    buttonA.text = 'Voltar';
    buttonA.fontSize = 20;
    buttonA.textColor = new Color(255, 255, 255, 0.5);
    buttonA.setBackgroundColorWithHighlightColor(new Color(255, 255, 255, 0.3));

    const xOffset = 10;
    let yOffset = 10;
    for (const button of this.components) {
      button.resizeToFitContent(button.fontSize);
      button.targetArea.position.x = xOffset;
      button.targetArea.position.y = yOffset;
      yOffset += button.height + 5;
    }

    this.scene.setup();
  }

  update(deltaTimeMs) {
    for (const button of this.components) {
      button.updateState();
 
      if (button.isClicked) {
        this.newScene = new MenuScene(this.ctx);
      }
    }

    this.scene.update(deltaTimeMs);
  }

  render(deltaTimeMs) {
    this.scene.render();
    for (const button of this.components) {
      button.render(this.ctx);
    }
  }

  cleanup() {
    this.scene.cleanup();
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
          this.newScene = new BilliardScene(this.ctx);
        }
      }
    }
  }
  render(deltaTimeMs) {
    for (const button of this.components) {
      button.render(this.ctx);
    }
  }
  cleanup() {}
}

