import { Entity } from './entity.js';
import { SoundMixer } from './sounds/sound-mixer.js';

export class GameContex {
  /**
   * @type {'not_started'|'player_a'|'player_b'|'win_a'|'win_b'}
  */
  state = 'not_started';
  
  waitingStop = false;
  /**
   * Response se foi atingido alguma bola e qual foi a primeira
   * @type {Entity | null}
   */
  firstBallHitted = null;
  /**
   * @type {boolean}
   */
  playerBallSelected = false;

  /**
   * @type {string?}
   */
  playerAColor = null;
  /**
   * @type {string?}
   */
  playerBColor = null;

  /**
   * @type {Entity[]}
   */
  ballsInTheBucket = [];

  color1 = '#FF0';
  color2 = '#F0A';

  /**
   * @type {SoundMixer?}
   */
  soundMixer = null;

  changePlayer() {
    if (this.state === 'player_a') {
      this.state = 'player_b';
    } else if (this.state === 'player_b') {
      this.state = 'player_a';
    }
  }

  reset() {
    this.state = 'not_started';
    this.waitingStop = false;
    this.firstBallHitted = null;
    this.playerBallSelected = false;
    this.playerAColor = null;
    this.playerBColor = null;
    this.ballsInTheBucket = [];
  }
}
