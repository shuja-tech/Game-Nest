
var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; // Keeps track of which row each column is at.

window.onload = function () {
    setGame();

    // Add event listener to the restart button
    document.getElementById("restart-button").addEventListener("click", restartGame);
};

function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear the board in case of restart

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // JS
            row.push(" ");
            // HTML
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            boardElement.append(tile);
        }
        board.push(row);
    }

    document.getElementById("winner").innerText = ""; // Clear the winner text
    gameOver = false; // Reset the gameOver flag
    currPlayer = playerRed; // Reset to the starting player
}

function restartGame() {
    setGame(); // Reset the game by reinitializing the board
}

function setPiece() {
    if (gameOver) {
        return;
    }

    // Get coords of the tile clicked
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // Figure out which row the current column should be on
    r = currColumns[c];

    if (r < 0) {
        return;
    }

    board[r][c] = currPlayer; // Update JS board
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    r -= 1; // Update the row height for that column
    currColumns[c] = r; // Update the array

    checkWinner();
}

function checkWinner() {
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != " ") {
                if (
                    board[r][c] == board[r][c + 1] &&
                    board[r][c + 1] == board[r][c + 2] &&
                    board[r][c + 2] == board[r][c + 3]
                ) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != " ") {
                if (
                    board[r][c] == board[r + 1][c] &&
                    board[r + 1][c] == board[r + 2][c] &&
                    board[r + 2][c] == board[r + 3][c]
                ) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Anti-diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != " ") {
                if (
                    board[r][c] == board[r + 1][c + 1] &&
                    board[r + 1][c + 1] == board[r + 2][c + 2] &&
                    board[r + 2][c + 2] == board[r + 3][c + 3]
                ) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != " ") {
                if (
                    board[r][c] == board[r - 1][c + 1] &&
                    board[r - 1][c + 1] == board[r - 2][c + 2] &&
                    board[r - 2][c + 2] == board[r - 3][c + 3]
                ) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Red Wins";
    } else {
        winner.innerText = "Yellow Wins";
    }
    gameOver = true;
}
