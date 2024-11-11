// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Ball properties with adjustable speed factor
const ballSpeedFactor = 0.5; // Adjust this factor to slow down the ball
const initialBallSpeedX = 4 * ballSpeedFactor;
const initialBallSpeedY = -4 * ballSpeedFactor;
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    speedX: initialBallSpeedX,
    speedY: initialBallSpeedY
};

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = Math.floor(canvas.width / brickColumnCount) - 10; // Adjust brick width to fit
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 45;

// Bricks array
let bricks = [];
function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}
createBricks(); // Initialize bricks

// Keyboard controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Draw the bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickWidth &&
                    ball.y > b.y &&
                    ball.y < b.y + brickHeight
                ) {
                    ball.speedY = -ball.speedY;
                    b.status = 0;
                    score += 10;
                    updateScore();
                }
            }
        }
    }
}

// Reset ball position and speed for a new life
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.speedX = initialBallSpeedX;
    ball.speedY = initialBallSpeedY;
}

// Game logic
function updateGame() {
    // Move the paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }

    // Move the ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.speedX = -ball.speedX;
    }
    if (ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    } else
