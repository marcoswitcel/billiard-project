import { Entity } from "./entity";

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
  playerBallSelected = false;

  ballsInTheBucket = [];

  changePlayer() {
    if (this.state === 'player_a') {
      this.state = 'player_b';
    } else if (this.state === 'player_b') {
      this.state = 'player_a';
    }
  }
}
