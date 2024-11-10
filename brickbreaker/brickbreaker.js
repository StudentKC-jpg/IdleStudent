// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Ball properties
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = 70;
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
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
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
                    ballX > b.x &&
                    ballX < b.x + brickWidth &&
                    ballY > b.y &&
                    ballY < b.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                }
            }
        }
    }
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
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height) {
        document.location.reload(); // Game over, reload the page
    }

    // Ball collision with the paddle
    if (
        ballY + ballRadius > canvas.height - paddleHeight - 10 &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
    ) {
        ballSpeedY = -ballSpeedY;
    }

    collisionDetection();
}

// Drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    updateGame();

    requestAnimationFrame(draw);
}
// Select the score display element
const scoreDisplay = document.getElementById("score");

// Define the score variable
let score = 0;

// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Increase the score when a brick is hit (assuming a collision detection function is already set up)
function checkBrickCollision(brick) {
    // Use ballX, ballY instead of ball in the collision logic
    if (collisionDetected) { // Replace with actual collision logic involving ballX and ballY
        score += 10;  // Increase score by 10 or any number per brick
        updateScore(); // Update score display
        brick.isDestroyed = true; // Example of marking the brick as destroyed
    }
}

// Example game loop or function where brick collision checks occur
function gameLoop() {
    // Other game logic...

    // Call brick collision check (this is where you handle all bricks)
    bricks.forEach(brick => checkBrickCollision(brick));

    // Redraw canvas, update positions, etc.
    requestAnimationFrame(gameLoop);
}



// Start the game loop
gameLoop();


// Start the game
draw();

document.getElementById("gameCanvas").addEventListener("click", e => {
    console.log(666);  
 });
