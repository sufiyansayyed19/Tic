const playWith = document.querySelector(".playWith");
const iconChoice = document.querySelector(".iconChoice");
const showWinner = document.querySelector(".showWinner");
const game = document.querySelector(".game");
const draw = document.querySelector(".draw");
const buttons = document.querySelectorAll(".btn");
const turn = document.querySelector("#turn");

// Button Node list to array
const buttonArray = Array.from(buttons);

// Game state variables
let chooseX = false;
let chooseO = false;
let matchDraw = false;
let matchWon = false;
let playerO = false;
let computer = false;
let count = 0;
let restart = false;

// Board state array
let origBoard = Array.from(Array(9).keys());

// Define players
const huPlayer = "O"; // Human player
const aiPlayer = "X"; // AI player

const winningPatterns = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize the game with player choice
function withPlayer() {
  computer = false;
  console.log("Mode:", computer ? "Computer" : "Player");
  playWith.style.display = "none";
  game.style.display = "flex";
  playerTurn();
}

// Initialize the game with computer choice
function withComputer() {
  computer = true;
  playWith.style.display = "none";
  iconChoice.style.display = "flex";
  console.log("withComputer function-->Mode:", computer ? "Computer" : "Player");
}

// Player chooses X
function choiceX() {
  chooseO = true;
  chooseX = false;
  startGame();
  console.log("Choice:", chooseO ? "computer-O" : "Computer-X");
}

// Player chooses O
function choiceO() {
  chooseX = true;
  chooseO = false;
  startGame();
  console.log("Choice:", chooseO ? "computer-O" : "Computer-X");
}

// Start the game based on choices
function startGame() {
  iconChoice.style.display = "none";
  game.style.display = "flex";
  setTimeout(() => {
    computerTurn();
  },50);
  console.log("Start-game function-->Mode:", computer ? "Computer" : "Player");
}

// Handle computer's turn with Minimax
function computerTurn() {
  const bestMove = bestSpot(); // Get the best move using Minimax
  const gotButton = buttonArray[bestMove];
  printSymbol(gotButton);
  gotButton.disabled = true;
  checkDraw();
  checkWinner();
  if (!matchDraw && !matchWon) {
    playerTurn();
  }
}

// Determine the best spot using Minimax
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

// Minimax algorithm for choosing the best move
function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

// Check for empty squares
function emptySquares(board) {
  return board.filter((s) => typeof s === "number");
}

// Check for a winner using board state
function checkWin(board, player) {
  let plays = board.reduce(
    (a, e, i) => (e === player ? a.concat(i) : a),
    []
  );
  let gameWon = null;
  for (let [index, win] of winningPatterns.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

// Print the symbol on the board
function printSymbol(gotButton) {
  const index = Array.from(buttons).indexOf(gotButton);
  if (chooseX) {
    addX(gotButton);
    origBoard[index] = "X";
  } else {
    addO(gotButton);
    origBoard[index] = "O";
  }
}

// Check if the game is a draw
function checkDraw() {
  if (count === 9) {
    checkWinner();
    if (!matchWon) {
      game.style.display = "none";
      draw.style.display = "flex";
      showWinner.style.display = "none";
      matchDraw = true;
    }
  }
  return;
}

// Check for a winner
function checkWinner() {
  if (!matchDraw) {
    for (let pattern of winningPatterns) {
      const x1 = buttons[pattern[0]].innerText;
      const x2 = buttons[pattern[1]].innerText;
      const x3 = buttons[pattern[2]].innerText;
      if (x1 !== "" && x2 !== "" && x3 !== "") {
        if (x1 === x2 && x2 === x3) {
          game.style.display = "none";
          showWinner.style.display = "flex";
          const winnerHeading = document.getElementById("winner");
          if (!computer) {
            winnerHeading.innerHTML = `Congratulation 🎉🥳🎊🎁 <br> Winner 🏆 is Player-${x1}`;
          } else if (computer) {
            if (chooseO && x1 === "X") {
              winnerHeading.innerHTML = `Congratulation 🎉🥳🎊🎁 <br> You are the Winner 🏆`;
            } else if (chooseO && x1 === "O") {
              winnerHeading.innerHTML = `Oops!... <br> Better Luck Next Time`;
            } else if (chooseX && x1 === "O") {
              winnerHeading.innerHTML = `Congratulation 🎉🥳🎊🎁 <br> You are Winner 🏆`;
            } else if (chooseX && x1 === "X") {
              winnerHeading.innerHTML = `Oops!... <br> Better Luck Next Time`;
            }
          }
          matchWon = true;
        }
      }
    }
    return;
  }
}

// Handle player's turn
function playerTurn() {
  buttons.forEach((btn) => {
    btn.removeEventListener("click", handlePlayerClick);
    btn.addEventListener("click", handlePlayerClick);
});

console.log(typeof buttonArray);
}

// Handle player clicks
function handlePlayerClick(event) {
const btn = event.target;
const index = Array.from(buttons).indexOf(btn);

if (!playerO) {
  addX(btn);
  origBoard[index] = "X";
} else {
  addO(btn);
  origBoard[index] = "O";
}
btn.disabled = true;

checkWinner();
checkDraw();

console.log("Player Turn-->Mode:", computer ? "Computer" : "Player");
if (computer && !matchDraw && !matchWon) {
  setTimeout(() => {
    computerTurn();
  }, 600); // Adding a delay to simulate thinking time
}
}

// Add X to the button and update the board state
function addX(btn) {
btn.innerText = "X";
playerO = true;
btn.style.color = "#ff4a3a";
turn.innerText = "O";
turn.style.color = "rgb(47, 229, 169)";
count++;
console.log(count);
}

// Add O to the button and update the board state
function addO(btn) {
btn.innerText = "O";
btn.style.color = "rgb(47, 229, 169)";
playerO = false;
turn.innerText = "X";
turn.style.color = "#ff4a3a";
count++;
console.log(count);
}

// Start a new game
function newGame() {
resetGame();
game.style.display = "flex";
draw.style.display = "none";
showWinner.style.display = "none";
}

// Return to the home page
function homePage() {
computer = false;
chooseO = false;
chooseX = false;
restart = true;
resetGame();
playWith.style.display = "flex";
iconChoice.style.display = "none";
game.style.display = "none";
draw.style.display = "none";
showWinner.style.display = "none";
restart = false;
console.log("Resetting Game");
console.log("Restart function-->Mode:", computer ? "Computer" : "Player");
console.log("Choices - X:", chooseX, ", O:", chooseO);
}

// Reset the game state and board
function resetGame() {
buttons.forEach((btn) => {
  btn.innerText = "";
  btn.disabled = false;
});
origBoard = Array.from(Array(9).keys()); // Reset the board state
playerO = false;
turn.innerText = "X";
turn.style.color = "#ff4a3a";
count = 0;
matchDraw = false;
matchWon = false;
if (!restart && computer) {
  // If restarting and playing against the computer, it should be the computer's turn
  setTimeout(() => {
    // Adding a delay to simulate the computer's "thinking"
    computerTurn();
  }, 600);
}
}

