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
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    speedX: 4 * ballSpeedFactor,
    speedY: -4 * ballSpeedFactor
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
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Keyboard controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler
