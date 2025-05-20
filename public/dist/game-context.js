import { Entity } from './entity.js';
import { SoundMixer } from './sounds/sound-mixer.js';
import { SoundResourceManager } from './sounds/sound-resource-manager.js';
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
        /**
         * @type {string?}
         */
        this.playerAColor = null;
        /**
         * @type {string?}
         */
        this.playerBColor = null;
        /**
         * @type {Entity[]}
         */
        this.ballsInTheBucket = [];
        this.color1 = '#FF0';
        this.color2 = '#F0A';
        const soundResourceManager = new SoundResourceManager();
        soundResourceManager.add('collision', './resource/audio/Pen Clicking.mp3');
        soundResourceManager.loadAll();
        this.soundMixer = new SoundMixer(soundResourceManager);
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
