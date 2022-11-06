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
            
        }
    }
}