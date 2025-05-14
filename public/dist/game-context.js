import { Entity } from './entity.js';
export class GameContex {
    constructor() {
        /**
         * @type {'not_started'|'player_a'|'player_b'|'win_a'|'win_b'}
        */
        this.state = 'not_started';
        this.waitingStop = false;
        /**
         * Response se foi atingido alguma bola e qual foi a primeira
         * @type {Entity | null}
         */
        this.firstBallHitted = null;
        /**
         * @type {boolean}
         */
        this.playerBallSelected = false;
        this.playerAColor = null;
        this.playerBColor = null;
        /**
         * @type {Entity[]}
         */
        this.ballsInTheBucket = [];
        this.color1 = '#FF0';
        this.color2 = '#F0A';
    }
    changePlayer() {
        if (this.state === 'player_a') {
            this.state = 'player_b';
        }
        else if (this.state === 'player_b') {
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
