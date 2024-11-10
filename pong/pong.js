const pongBoard = document.getElementById("pongBoard");
const ctx = pongBoard.getContext("2d");
const resetButton = document.getElementById("resetButton");
const pauseButton = document.getElementById("pauseButton");

resetButton.addEventListener("click", resetGame);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
pauseButton.addEventListener('click',gamePause);

const boardWidth = 1200;
const boardHeight = 600;

let paused = false; 

let player1Score = 0;
let player2Score = 0;

let player1Paddle = {
    x: 0,
    y: (boardHeight - 150) / 2,
    width: 30,
    height: 150,
    dy: 0
};

let player2Paddle = {
    x: boardWidth - 30,
    y: (boardHeight - 150) / 2,
    width: 30,
    height: 150,
    dy: 0
};

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    radius: 10,
    dx: 3,
    dy: 3
};

startGame();
// starts the game and then updates the game (helps constantly redraw the board, paddle, ball)
function startGame() {
    if(paused){
        return;
    }
    ctx.fillStyle = "black"; 
    ctx.fillRect(0, 0, boardWidth, boardHeight);
    drawScore();
    drawPaddles();
    drawBall();
    moveBall();
    drawCenterLines();
    requestAnimationFrame(startGame);
}

// draws score
function drawScore() {
    ctx.font = "50px Arial"
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText(`${player1Score}     ${player2Score}`, boardWidth / 2, 50);
}

function drawPaddles() {
    ctx.fillStyle = "white";
    ctx.fillRect(player1Paddle.x, player1Paddle.y, player1Paddle.width, player1Paddle.height);
    ctx.fillRect(player2Paddle.x, player2Paddle.y, player2Paddle.width, player2Paddle.height);
}

// dy is the vertical speed, is used with the setInterval to change where the paddle is positioned.
function keyDownHandler(e) {
    if (e.key === "w") player1Paddle.dy = -5;
    if (e.key === "s") player1Paddle.dy = 5;
    if (e.key === "ArrowUp") player2Paddle.dy = -5;
    if (e.key === "ArrowDown") player2Paddle.dy = 5;
}
// when keys are released, changes dy to 0.
function keyUpHandler(e) {
    if (e.key === "w" || e.key === "s") player1Paddle.dy = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") player2Paddle.dy = 0;
}

// everytime the pause button is paused, paused is changed from true to false and vice versa. 
// if pause is false, !pause makes it true, starting the game back up.
function gamePause() {
    paused = !paused;
    if (!paused) {
        startGame();
    }
}

document.addEventListener('keydown', function(e) {
    if(e.key === 'p' || e.key === 'P'){
        gamePause();
    }
});

// Paddle movement, uses the change of dy to change the speed of the paddle.
setInterval(() => {
    if(!paused){
    player1Paddle.y += player1Paddle.dy;
    player2Paddle.y += player2Paddle.dy;

    player1Paddle.y = Math.max(0, Math.min(boardHeight - player1Paddle.height, player1Paddle.y));
    player2Paddle.y = Math.max(0, Math.min(boardHeight - player2Paddle.height, player2Paddle.y));
    }
}, 1000 / 60);

// draws the ball, arc creates a circle
function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
// reset the ball back into the middle position Math.random() returns a random number between 0 and 1 (including 0 but excluding 1). Using a ternary statement, i can return a 1 or -1
// Math.random() returns a random number between 0 and 1 (including 0 but excluding 1). 
// Using a ternary statement, i can return a 1 or -1 to change direction for left or right.
function resetBall() {
    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;
    ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1); // returns a number 0 >= x < 1
    ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}
// changes the direction of the ball

function moveBall() {
    if (!paused){
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.y + ball.radius > boardHeight || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (ball.x - ball.radius < player1Paddle.x + player1Paddle.width && 
        ball.y > player1Paddle.y && ball.y < player1Paddle.y + player1Paddle.height) {
        ball.dx = Math.abs(ball.dx);
    }

    if (ball.x + ball.radius > player2Paddle.x && 
        ball.y > player2Paddle.y && ball.y < player2Paddle.y + player2Paddle.height) {
        ball.dx = -Math.abs(ball.dx);
    }

    if (ball.x - ball.radius < 0) {
        player2Score++;
        resetBall();
    } else if (ball.x + ball.radius > boardWidth) {
        player1Score++;
        resetBall();
    }
    }
}
//resets the game
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    resetBall();
} 
//draws the stripes going down the center of the board
function drawCenterLines() {
    const stripeWidth = 10;
    const stripeSpacing = 20;
    const center = boardWidth / 2;
    ctx.fillStyle = "white";

    for (let i = -150; i < boardHeight; i += stripeWidth + stripeSpacing) {
        ctx.fillRect(center - stripeWidth / 2, i, stripeWidth, stripeWidth);
    }
}
