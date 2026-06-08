
//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

// Responsive scaling
function getScaledDimensions() {
    const screenWidth = window.innerWidth;
    let scale = 1;
    
    if (screenWidth <= 480) {
        scale = 0.5;
    } else if (screenWidth <= 768) {
        scale = 0.7;
    } else if (screenWidth <= 1024) {
        scale = 0.85;
    }
    
    return {
        width: Math.floor(750 * scale),
        height: Math.floor(250 * scale),
        scale: scale
    };
}

function updateBoardDimensions() {
    const dims = getScaledDimensions();
    boardWidth = dims.width;
    boardHeight = dims.height;
    
    if (board) {
        board.width = boardWidth;
        board.height = boardHeight;
    }
    
    // Update positions based on scale
    dinoX = Math.floor(50 * dims.scale);
    dinoY = boardHeight - Math.floor(94 * dims.scale);
    dino.width = Math.floor(88 * dims.scale);
    dino.height = Math.floor(94 * dims.scale);
    dino.x = dinoX;
    dino.y = dinoY;
    
    cactusX = Math.floor(700 * dims.scale);
    cactusY = boardHeight - Math.floor(70 * dims.scale);
    cactus1Width = Math.floor(34 * dims.scale);
    cactus2Width = Math.floor(69 * dims.scale);
    cactus3Width = Math.floor(102 * dims.scale);
    cactusHeight = Math.floor(70 * dims.scale);
    velocityX = Math.floor(-8 * dims.scale);
}

window.onload = function() {
    board = document.getElementById("board");
    
    // Initial setup with responsive dimensions
    updateBoardDimensions();
    
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur (using image from static folder)
    dinoImg = new Image();
    dinoImg.src = "/static/image/dino-img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
    
    // No cactus images available, use canvas drawing
    cactus1Img = null;
    cactus2Img = null;
    cactus3Img = null;

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateBoardDimensions();
    });
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    
    // Draw dino using image
    if (dinoImg && dinoImg.complete) {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } else {
        // Fallback to rectangle if image not loaded
        context.fillStyle = "#555";
        context.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        
        // Draw cactus (rectangle as fallback)
        if (cactus.img && cactus.img.complete) {
            context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        } else {
            // Draw fallback cactus rectangle
            context.fillStyle = "#2a9d8f";
            context.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
        }

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            // Draw game over message
            context.fillStyle = "red";
            context.font = "40px courier";
            context.fillText("Game Over!", boardWidth/2 - 100, boardHeight/2);
            context.font = "20px courier";
            context.fillText("Press SPACE to restart", boardWidth/2 - 110, boardHeight/2 + 40);
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText("Score: " + Math.floor(score/10), 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        // Restart game on space/arrowup
        if (e.code == "Space" || e.code == "ArrowUp") {
            // Reset game variables
            dino.y = dinoY;
            velocityY = 0;
            cactusArray = [];
            score = 0;
            gameOver = false;
            requestAnimationFrame(update);
        }
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}