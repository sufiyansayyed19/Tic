const playWith = document.querySelector(".playWith");
const iconChoice = document.querySelector(".iconChoice");
const showWinner = document.querySelector(".showWinner");
const game = document.querySelector(".game");
const draw = document.querySelector(".draw");
const buttons = document.querySelectorAll(".btn");
const turn = document.querySelector('#turn');

/*
playWith.style.display = "none";
playWith.style.display = "flex";
*/
let chooseX = false;
let chooseO = false; 
let matchDraw = false;
let matchWon = false;
let playerO = false;
let computer = false;
let count = 0;
let restart = false;

const winningPatterns = [
    //horizontal 
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonal
    [0, 4, 8],
    [2, 4, 6]
];

// console.log(buttons); // getting nodeList of button




function startGame(){
    iconChoice.style.display = "none";
    game.style.display = "flex";
    computerTurn();
}



function withPlayer(){
    playWith.style.display = "none";
    game.style.display = "flex";
    playerTurn();
}

function withComputer(){
    playWith.style.display = "none";
    iconChoice.style.display = "flex";
}



function computerTurn(){
    computer = true;
    const randomButton = getRandomButton();
    printSymbol(randomButton);
    randomButton.disabled = true;
    checkDraw();
    checkWinner();
    if (!matchDraw && !matchWon){
        playerTurn();
    }
}








function getRandomButton(){
    let randomButton;
    do {
        const randomIndex = Math.floor(Math.random() * buttons.length );
        randomButton = buttons[randomIndex];
        console.log(randomButton);
    } while (randomButton.disabled);
    return randomButton;
}

function printSymbol(randomButton){
    if (chooseX){
        addX(randomButton);
    }else{
        addO(randomButton);
    }
}

function checkDraw(){
    if (count == 9) {
        checkWinner();
        if(!matchWon){
             game.style.display = "none";
             draw.style.display = "flex";
             showWinner.style.display ="none";  
            console.log(draw);
            matchDraw = true;
        }  
    }
    return;
}
function choiceX(){
    chooseO = true;
    chooseX = false;
    startGame();
}

function choiceO(){
    chooseX = true;
    chooseO = false;
    startGame();
}
function checkWinner(){
   if (!matchDraw) {
        for (let pattern of winningPatterns){
            const x1 = buttons[pattern[0]].innerText;
            const x2 = buttons[pattern[1]].innerText;
            const x3 = buttons[pattern[2]].innerText;
            if (x1 != "" && x2 != "" && x3 != ""){
                if (x1 === x2 && x2 === x3 ){
                    console.log('we got winner');
                    game.style.display = 'none';
                    showWinner.style.display = 'flex';
                    const winnerHeading = document.getElementById("winner"); 
                        if (!computer){
                            winnerHeading.innerHTML = `Congratulation 🎉🥳🎊🎁 <br> Winner 🏆 is Player-${x1}`;    
                        }else if(computer){
                            if (chooseO && x1 == 'X'){
                                winnerHeading.innerHTML = `Congratulation 🎉🥳🎊🎁 <br> You are the Winner 🏆`;}
                            else if (chooseO && x1 == 'O'){
                                winnerHeading.innerHTML = `Oops!... <br> Better Luck Next Time`;
                            }else if (chooseX && x1 === 'O'){
                                winnerHeading.innerHTML = `Congratulation 🎉🥳🎊🎁 <br> You are Winner 🏆`;
                            }else if (chooseX && x1 === 'X'){
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





function playerTurn(){
    buttons.forEach((btn) => {
        btn.removeEventListener('click', handlePlayerClick);
        btn.addEventListener('click', handlePlayerClick);
    });
}

function handlePlayerClick(event) {
    const btn = event.target;
    if (!playerO){
        addX(btn);
    } else {
        addO(btn);
    }
    btn.disabled = true;
    checkWinner();
    checkDraw();
    if (computer && !matchDraw && !matchWon) {
        setTimeout(() => {
            computerTurn();
        }, 600); // Adding a delay to simulate thinking time
    }
}



function addX(btn){
    btn.innerText = 'X';
    playerO = true;
    btn.style.color = "#ff4a3a";
    turn.innerText = "O";
    turn.style.color = "rgb(47, 229, 169)";
    count++;
    console.log(count);
}

function addO(btn){
    btn.innerText = 'O';
    btn.style.color = "rgb(47, 229, 169)";
    playerO = false;
    turn.innerText = "X";
    turn.style.color = "#ff4a3a";
    count++;
    console.log(count);
}



function newGame(){
    resetGame();
    game.style.display = "flex";
    draw.style.display = "none";
    showWinner.style.display = "none";

}

function homePage(){
    restart = true;
    resetGame();
    playWith.style.display = 'flex';
    iconChoice.style.display = 'none';
    game.style.display = "none";
    draw.style.display = "none";
    showWinner.style.display = "none";
    restart = false;
}


function resetGame(){
    buttons.forEach((btn) => { 
        btn.innerText = "";
        btn.disabled = false;
    });
    playerO = false;
    turn.innerText = "X";
    turn.style.color = "#ff4a3a";
    count = 0;
    matchDraw = false;
    matchWon = false;
    if (!restart){
        if (computer){
            computerTurn();
        }
    }
    
    
}