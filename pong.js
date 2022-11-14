//global variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', 'e74c3c', '#9b59b6'];

//ball
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas,height / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 9
        };
    }
};

//paddle
var Paddle = {
    new: function (side) {
        return {
            width: 18,
            height: 70,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 10
        };
    }
};

var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas,getContext('2d');

        this.canvas.width = 1400;
        this.canvas.height = 1000;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        this.player = Paddle.new.call(this, 'left');
        this.paddle = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.paddle.speed = 8;
        this.running = this.over = false;
        this.turn = this.paddle;
        this.timer = this.round = 0;
        this.color = '#2c3e50';

        Pong.menu();
        Pong.listen();
    },

    endGameMenu: function (text) {
        //change canvas font size and color
        Pong.context.font = '50px Courier New';
        Pong.context.fillstyle = this.color;

        //rectangle behind 'Press any key...'
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );

        //change canvas color;
        Pong.context.fillStyle = '#ffffff';

        //End game menu text
        Pong.context.fillText(text,
            Pong.canvas.width / 2,
            Pong.canvas.height / 2 + 15
        );

        setTimeout(function () {
            Pong = Object.assign({}, Game);
            Pong.initialize();
        },  3000);
    },

    menu: function () {
        //Draw objects in current state
        Pong.draw();

        //change the canvas font size and color
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        //draw rectangle behind 'press any key'
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        //change canvas color
        this.context.fillStyle = '#ffffff';

        //press any key to begin text
        this.context.fillStyle('Press any key to begin',
           this.canvas.width / 2,
           this.canvas.height / 2 + 15
        );
    },

    //update all objects (move the player, paddle, ball, increment the score,etc)
    update: function () {
        if (!this.over) {
            // if the ball collides with the bound limits - correct the x and y coords
            if (this.ball.x <= 0) Pong._resetTurn.call(this, this.paddle, this.player);
            if (this.ball.x >= this.canvas.width - this.canvas.width) Pong._resetTurn.call(this, this.player, this.paddle);
            if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if (this.ball.y >= 0 this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

            //move player if the player move value was updated by a keyboard event
            if (this.player.move === DIRECTION.UP) this.player.y -= thia.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            //on start of each turn move the ball to the correct side
            //on random direction to add challenge.
            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }

            //if the player collide with the bound limits, update x and y coords.
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);
            
            //Move ball in intended direction based on moveY and moveX values
            if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            //AI handle paddle UP and DOWN movement
            if (this.paddle.y > this.ball.y - (this.paddle.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y -= this.paddle.speed / 1.5;
                else this.paddle.y -= this.paddle.speed / 4;
            }
            if (this.paddle.y < this.ball.y - (this.paddle.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y += this.paddle.speed / 1.5;
                else this.paddle.y += this.paddle.speed / 4;
            }

            //AI handle paddle wall colissions
            if (this.paddle.y >= this.canvas.height - this.paddle.height) this.paddle.y = this.canvas.height - this.paddle.height;
            else if (this.paddle.y <= 0) this.paddle.y = 0;

            //handle player-ball colissions.
            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;

                    beep1.play();
                }
            }

            //handle paddle ball collision
            if (this.ball.x - this.ball.width <= this.paddle.x && this.ball.x >= this.paddle.x - this.paddle.width) {
                if (this.ball.y <= this.paddle.y + this.paddle.height && this.ball.y + this.ball.height >= this.paddle.y) {
                    this.ball.x = (this.paddle.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;

                    beep1.play();
                }
            }
        }

        //handle end of round transition
        //check to see if the player won the round.
        if (this.player.score === rounds[this.round]) {
            //check to see if there is any more rounds/levels left and display the victory screen if
            //there are not
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
            } else {
                //if there is another round, reset all the values and increment the round number.
                this.color = this._generateRoundColor();
                this.player.score = this.paddle.score = 0;
                this.player.speed += 0.5;
                this.paddle.spped += 1;
                this.ball.speed += 1;
                this.round += 1;

                beep3.play();
            }
        }
        //check to see if the paddle/AI has won the round.
        
    }
}