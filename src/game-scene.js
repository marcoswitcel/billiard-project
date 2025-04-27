import { Color } from './color.js';
import { Scene07 } from './scene07.js';
import { Button, theGUIGlobals } from './ui.js';
import { drawRect, drawText } from './utils.js';
import { vec2 } from './vec2.js';

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

    buttonA.text = 'Menu';
    applyButtonStyle(buttonA);
    buttonA.fontSize = 16;
    
    buttonPaused.text = 'Voltar ao Jogo';
    applyButtonStyle(buttonPaused);
    buttonPaused.fontSize = 18;

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

/**
 * 
 * @param {Button} button 
 */
const applyButtonStyle = (button) => {
  button.fontSize = 20;
  button.fontFamily = 'monospace';
  button.textColor = new Color(255, 255, 255);
  button.backgroundColor = new Color(0, 0, 255).darken(0.75);
  button.highlightBackgroundColor = new Color(0, 0, 255);
}

const sDescription = Symbol('Button.description');

export class MenuScene extends GameScene {
  /**
   * @type {Button[]}
   */
  components = [];

  newScene = null;

  setup() {
    const buttonA = new Button();
    const buttonB = new Button();
    const buttonPlacar = new Button();

    // @note acredito que seria melhor exibir essas descrições no canvas ao invés de usar o atributo 'title'
    buttonA[sDescription] = 'Modo um jogador e 2 jogadores';
    buttonB[sDescription] = 'Preferências do jogador';
    buttonPlacar[sDescription] = 'Veja seus placares';

    this.components = [buttonA, buttonB, buttonPlacar];

    buttonA.text = 'Jogar';
    buttonB.text = 'Configurações';
    buttonPlacar.text = 'Placar';

    const xOffset = this.ctx.canvas.width / 2;
    let yOffset = this.ctx.canvas.height / 2;
    for (const button of this.components) {
      applyButtonStyle(button);

      button.resizeToFitContent(button.fontSize * 0.75);
      button.targetArea.position.x = xOffset - button.width / 2;
      button.targetArea.position.y = yOffset - button.height / 2;
      yOffset += button.height + 5;
    }

  }
  update(deltaTimeMs) {
    // @note ajustar para atualizar menos o dom :titleThing
    this.ctx.canvas.removeAttribute('title');

    for (const button of this.components) {
      button.updateState();

      if (button.hover && button[sDescription]) {
        // @note adicionar textos significativos aqui :titleThing
        this.ctx.canvas.setAttribute('title', button[sDescription]);
      }

      if (button.isClicked) {
        this.newScene = new BilliardScene(this.ctx);
      }
    }
  }
  render(deltaTimeMs) {
    drawRect(this.ctx, 'rgba(0, 0, 0, 1)', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    drawText(this.ctx, 'Project: Billiard', vec2(this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.25), 40, 'white', 'monospace', 'center', 'middle');

    for (const button of this.components) {
      button.render(this.ctx);
    }
  }
  cleanup() {
    // :titleThing
    this.ctx.canvas.removeAttribute('title');
  }
}

