import { Color } from './color.js';
import { Scene07 } from './scene07.js';
import { Button, theGUIGlobals } from './ui.js';
import { drawRect } from './utils.js';

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

  paused = false;

  constructor(ctx) {
    super(ctx);
    this.scene = new Scene07(ctx);
  }

  handlePause = (event) => {
    if (event.code === 'KeyP') {
      this.paused = !this.paused;
    }
  };

  setup() {
    const buttonA = new Button();
    const buttonPaused = new Button();

    // @todo João analisar se os handlers serão feitos assim
    buttonA['handlers'] = [() => { this.newScene = new MenuScene(this.ctx); }];
    buttonPaused['handlers'] = [() => { this.paused = false; }];

    this.components = [buttonA, buttonPaused];

    buttonA.text = 'Voltar';
    buttonA.fontSize = 18;
    buttonA.textColor = new Color(255, 255, 255);
    buttonA.setBackgroundColorWithHighlightColor(new Color(0, 0, 255, 0.9));
    
    buttonPaused.text = 'Retomar';
    buttonPaused.fontSize = 18;
    buttonPaused.textColor = new Color(255, 255, 255);
    buttonPaused.setBackgroundColorWithHighlightColor(new Color(0, 0, 255, 0.9));

    const xOffset = 10;
    let yOffset = 10;
    for (const button of this.components) {
      button.resizeToFitContent(button.fontSize);
      button.targetArea.position.x = xOffset;
      button.targetArea.position.y = yOffset;
      yOffset += button.height + 5;
    }

    document.addEventListener('keyup', this.handlePause);

    this.scene.setup();
  }

  update(deltaTimeMs) {
    if (this.paused) {
      for (const button of this.components) {
        button.updateState();
   
        if (button.isClicked) {
          if (button['handlers']) {
            for (const handler of button['handlers']) {
              handler();
            }
          }
        }
      }
    }

    this.scene.ignoreEvents = this.paused;
    this.scene.update(deltaTimeMs);
  }

  render(deltaTimeMs) {
    this.scene.render();

    if (this.paused) {
      drawRect(this.ctx, 'rgba(0,0,0,.7)', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      for (const button of this.components) {
        button.render(this.ctx);
      }
    }
  }

  cleanup() {
    document.removeEventListener('keyup', this.handlePause);

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

