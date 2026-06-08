let board = [];
let rows = 8;
let columns = 8;

let minesCount = 10;
let minesLocation = [];

let tilesClicked = 0; // Goal to click all tiles except the ones containing mines
let flagEnabled = false;

let gameOver = false;

window.onload = function() {
    startGame();
}

function setMines() {
    minesLocation = []; // Reset minesLocation
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    gameOver = false;
    tilesClicked = 0;
    minesLocation = [];
    setMines();

    // Reset Mines Count Display
    document.getElementById("mines-count").innerText = minesCount;

    // Clear the previous board
    document.getElementById("board").innerHTML = "";

    // Populate our board
    board = []; // Reset board array
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", clickTile); // Add click event to tile
            document.getElementById("board").appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        } else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        setTimeout(startGame, 2000); // Auto restart after 2 seconds without showing any message
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // Top 3
    minesFound += checkTile(r - 1, c - 1);      // top left
    minesFound += checkTile(r - 1, c);          // top
    minesFound += checkTile(r - 1, c + 1);      // top right

    // Left and right
    minesFound += checkTile(r, c - 1);          // left
    minesFound += checkTile(r, c + 1);          // right

    // Bottom 3
    minesFound += checkTile(r + 1, c - 1);      // bottom left
    minesFound += checkTile(r + 1, c);          // bottom
    minesFound += checkTile(r + 1, c + 1);      // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        board[r][c].innerText = "";

        // Top 3
        checkMine(r - 1, c - 1);    // top left
        checkMine(r - 1, c);        // top
        checkMine(r - 1, c + 1);    // top right

        // Left and right
        checkMine(r, c - 1);        // left
        checkMine(r, c + 1);        // right

        // Bottom 3
        checkMine(r + 1, c - 1);    // bottom left
        checkMine(r + 1, c);        // bottom
        checkMine(r + 1, c + 1);    // bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        setTimeout(startGame, 2000); // Auto restart after 2 seconds without showing any message
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
