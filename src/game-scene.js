import { Color } from './color.js';
import { appDefaults } from './game-context.js';
import { Scene07 } from './scene07.js';
import { ImageShape, Shape } from './shape.js';
import { SoundMixer } from './sounds/sound-mixer.js';
import { SoundResourceManager } from './sounds/sound-resource-manager.js';
import { Button, sDescription, theGUIGlobals } from './ui.js';
import { drawImage, drawRect, drawText } from './utils.js';
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

  /**
   * @type {GameScene|null}
   */
  newScene = null;

  scene;

  paused = false;

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  constructor(ctx) {
    super(ctx);
    this.scene = new Scene07(ctx);
    // @note configurando a cena
    this.scene.camera.scale = 1.65;
    this.scene.camera.position.y -= 20;
  }

  /**
   * 
   * @param {KeyboardEvent} event 
   */
  handlePause = ( event) => {
    if (event.code === 'KeyP') {
      this.paused = !this.paused;
    }
  };

  setup() {
    const buttonA = new Button();
    const buttonPaused = new Button();
    const buttonRestart = new Button();

    buttonA['handlers'] = [() => { this.newScene = new MenuScene(this.ctx); }];
    buttonPaused['handlers'] = [() => { this.paused = false; }];
    buttonRestart['handlers'] = [() => { this.scene.resetGame(); this.paused = false; }];

    this.components = [buttonA, buttonRestart, buttonPaused, ];

    buttonA.text = 'Menu';
    applyButtonStyle(buttonA);
    buttonA.fontSize = 16;


    buttonRestart.text = 'Reiniciar';
    applyButtonStyle(buttonRestart);
    buttonRestart.fontSize = 16;
    
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

  /**
   * @param {number} deltaTimeMs
   */
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

  /**
   * @param {number} deltaTimeMs
   */
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

export class MenuScene extends GameScene {
  /**
   * @type {Button[]}
   */
  components = [];

  /**
   * @type {GameScene|null}
   */
  newScene = null;
  /**
   * @type {Shape[]}
   */
  visualElements = [];
  /**
   * @type {SoundMixer}
   */
  soundMixer = new SoundMixer(new SoundResourceManager());

  setup() {
    // som de colisão entre bolas
    this.soundMixer.soundResourceManager.add('button-hover', './resource/audio/Pen Clicking.mp3');
    this.soundMixer.soundResourceManager.loadAll();

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

    const image = new Image();
    image.src = './resource/image/background.svg'; // @todo João, trocar a arte do menu...
    const scale = 1;
    this.visualElements.push(new ImageShape(vec2(appDefaults.width / 2, appDefaults.height / 2), vec2(appDefaults.height * 1.4 * scale, appDefaults.height * scale), image,  '#0F0'));
  }
  /**
   * @param {number} deltaTimeMs
   */
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
        // @note João, adicionar sons ao click?
        // this.soundMixer.play('button-hover');

        this.newScene = new BilliardScene(this.ctx);
      }
    }
  }

  /**
   * @param {number} deltaTimeMs
   */
  render(deltaTimeMs) {
    drawRect(this.ctx, '#2576da', 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    // @note João, abstrair o render do menu?
    const canvasCenter = vec2(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    const screenScale = this.ctx.canvas.width / appDefaults.width; 
    const scale = 1 * screenScale;
    
    for (const visualElement of this.visualElements) {
      const position = canvasCenter.copy().add(visualElement.position.copy().sub(canvasCenter).mul(scale));
  
      if (visualElement instanceof ImageShape) {
        const width = visualElement.size.x * scale;
        const height = visualElement.size.y * scale;
  
        drawImage(this.ctx, visualElement.image, position.x - width / 2, position.y - height / 2, width, height);
      }
    }

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

