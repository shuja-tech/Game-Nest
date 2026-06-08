let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// Ship variables
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight,
};

let shipImg;
let shipVelocityX = tileSize; // Ship movement speed

// Alien variables
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // Number of aliens to defeat
let alienVelocityX = 1.5; // Alien movement speed

// Bullet variables
let bulletArray = [];
let bulletVelocityY = -10; // Bullet movement speed

let score = 0;
let gameOver = false;
let animationFrameId;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Load images
    shipImg = new Image();
    shipImg.src = `static/image/space-invaders-img/ship.png`;
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    alienImg = new Image();
    alienImg.src = `static/image/space-invaders-img/alien.png`;

    // Initialize game
    createAliens();
    animationFrameId = requestAnimationFrame(update);

    // Event listeners
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    // Restart button
    document.getElementById("restart-btn").addEventListener("click", restartGame);
};

function update() {
    if (gameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    animationFrameId = requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Draw ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // Draw and move aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // If alien touches borders
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                // Move all aliens down one row
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }

            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            // Check if aliens reach the ship
            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    // Draw and move bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    // Remove used or off-screen bullets
    bulletArray = bulletArray.filter(bullet => !bullet.used && bullet.y >= 0);

    // Check for next level
    if (alienCount == 0) {
        score += alienColumns * alienRows * 100; // Bonus points
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); // Cap at 6
        alienRows = Math.min(alienRows + 1, rows - 4); // Cap at 12
        alienVelocityX = Math.sign(alienVelocityX) * (Math.abs(alienVelocityX) + 0.5); // Increase alien speed

        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    // Display score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) return;

    if (e.code === "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    } else if (e.code === "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true,
            };
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver) return;

    if (e.code === "Space") {
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false,
        };
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function restartGame() {
    cancelAnimationFrame(animationFrameId);

    // Reset variables
    score = 0;
    gameOver = false;
    ship.x = shipX;
    ship.y = shipY;
    alienColumns = 3;
    alienRows = 2;
    alienVelocityX = 1.5;
    alienArray = [];
    bulletArray = [];
    createAliens();

    // Restart game loop
    animationFrameId = requestAnimationFrame(update);
}