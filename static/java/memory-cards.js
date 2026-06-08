var cardList = [
    "darkness",
    "double",
    "fairy",
    "fighting",
    "fire",
    "grass",
    "lightning",
    "metal",
    "psychic",
    "water"
];

var cardSet;
var board = [];
var rows = 4;
var columns = 5;

var card1Selected;
var card2Selected;

var errors = 0; // Track errors
var matchedPairs = 0; // Track matched pairs

window.onload = function() {
    startGame();
}

function shuffleCards() {
    cardSet = cardList.concat(cardList); // two of each card
    // Shuffle the cards
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); // get random index
        // Swap cards
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
    matchedPairs = 0; // Reset matched pairs counter
    errors = 0; // Reset errors counter
    card1Selected = null;
    card2Selected = null;
    
    shuffleCards();
    
    // Clear the board
    document.getElementById("board").innerHTML = "";
    document.getElementById("errors").innerText = errors; // Update error counter display
    
    // Arrange the board (4x5 grid)
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg); 

            // Create card element
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = `static/image/memory-cards-img/back.jpg`; // Show the back initially
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }

    setTimeout(hideCards, 1000); // Hide cards after 1 second to shuffle
}

function hideCards() {
    // Hide all cards by showing the back
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = `static/image/memory-cards-img/back.jpg`;
        }
    }
}

function selectCard() {
    if (this.src.includes("back")) {
        if (!card1Selected) {
            // Select first card
            card1Selected = this;
            let coords = card1Selected.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);
            card1Selected.src = `static/image/memory-cards-img/` + board[r][c] + ".jpg";
        } else if (!card2Selected && this != card1Selected) {
            // Select second card and check
            card2Selected = this;
            let coords = card2Selected.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);
            card2Selected.src = `static/image/memory-cards-img/` + board[r][c] + ".jpg";;

            // Delay checking for match
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    // Check if cards match
    if (card1Selected.src === card2Selected.src) {
        matchedPairs += 1; // Increment matched pairs counter
    } else {
        // Flip both cards back if not a match
        card1Selected.src = `static/image/memory-cards-img/back.jpg`;
        card2Selected.src = `static/image/memory-cards-img/back.jpg`;
        errors += 1; // Increment errors counter
        document.getElementById("errors").innerText = errors; // Update error counter display
    }

    // Reset the selected cards
    card1Selected = null;
    card2Selected = null;

    // Check if the game is finished (all pairs are matched)
    if (matchedPairs === (rows * columns) / 2) {
        setTimeout(startGame, 1000); // Restart game automatically after 1 second
    }
}