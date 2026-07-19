///////////////////////////////////////////////////////////////////////////////////////////////////
//SETTINGS AND VARIABLES
///////////////////////////////////////////////////////////////////////////////////////////////////


const invaderDropDistance = 20;

const STATES = {
    START_MENU: "START_MENU",
    SETTINGS: "SETTINGS",
    PLAYING: "PLAYING",
    ROUND_OVER: "ROUND_OVER",
    GAME_OVER: "GAME_OVER"
}

//let variables to hold the state of the game, score, invader speed, lazers, invaders, and game over status
let gameState = STATES.START_MENU;
let score = 0;
let invaderSpeed = 2;
let speedOfEnemyFire = 0.02;
let lazers = [];
let invaders = [];
let bombs = [];
let currentRound = 1;
let isRoundOver = false;
let isGameOver = false;
let didWin = false;
let ctx;
let player;
let lives = 3;
let mlTrainingData = [];

//const variables for the game loop and animation frame
//get the canvas element from the HTML
const maxLevel = 3;

const canvas = document.getElementById("myCanvas");
const startMenuElement = document.getElementById("start-menu");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const pauseButton = document.getElementById("pause-button");
const playingMenu = document.getElementById("playing-menu");
const gameOverMenu = document.getElementById("game-over-menu");
const finalScoreElement = document.getElementById("final-score");


///////////////////////////////////////////////////////////////////////////////////////////////////
//Objects and Classes
///////////////////////////////////////////////////////////////////////////////////////////////////

//image objects
const playerImg = new Image();
playerImg.src = "sprites/hero_sprites/New Piskel.png";

//object to hold the state of the keys
const keys = {
    left: false,
    right: false
};

//player object
class Player {
    constructor (canvasWidth, canvasHeight){
        this.width = 50;
        this.height = 50;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - this.height - 25;
    }

    draw(ctx) {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    }

    update(){
        if(keys.left) {
            if(this.x > 0) {
                this.x -= 5;
            }
        }
        if(keys.right) {
            if(this.x < canvas.width - this.width) {
                this.x += 5;
            }
        }
    }

    resetPosition(canvasWidth, canvasHeight) {
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - this.height - 25;
    }
}

class Invader{
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

     update(){
        //invader movement logic will go here
    }
}

class Lazer {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(){
        this.y -= 7;
    }
}

class Bomb {
    constructor (x, y, mlSnapshot) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 6;
        this.mlSnapshot = mlSnapshot;
    }

    draw(ctx) {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(){
        this.y += 5;
    }
}


//check if the canvas element exists and get the 2D context, then create a new player object
if(canvas) {
    ctx = canvas.getContext("2d");
    player = new Player(canvas.width, canvas.height);
} else {
    console.error("Canvas not found");
}



///////////////////////////////////////////////////////////////////////////////////////////////////
//key/event listeners
///////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft" || e.key === "a") {
        keys.left = true;
    }
    if(e.key === "ArrowRight" || e.key === "d") {
        keys.right = true;
    }
    if(e.code === "Space") {
        lazers.push(new Lazer(player.x + player.width / 2, player.y));
    }
});

window.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft" || e.key === "a") {
        keys.left = false;
    }
    if(e.key === "ArrowRight" || e.key === "d") {
        keys.right = false;
    }
});

startButton.addEventListener("click", () => {
    gameState = STATES.PLAYING;
    playingMenu.style.display = "flex";
});

restartButton.addEventListener("click", () => {
    resetGame();
    playingMenu.style.display = "flex";
    
    gameOverMenu.style.display = "none";
    updateLivesDisplay();
});

pauseButton.addEventListener("click", () => {
    if(gameState === STATES.PLAYING) {
        gameState = STATES.START_MENU;
        startMenuElement.style.display = "flex";
    } else if(gameState === STATES.START_MENU) {
        gameState = STATES.PLAYING;
        startMenuElement.style.display = "none";
    }
});



///////////////////////////////////////////////////////////////////////////////////////////////////
//GRID FOR INVADERS SETUP
///////////////////////////////////////////////////////////////////////////////////////////////////
let invaderRows = 2;
let invaderCols = 3;
const invaderSpacingX = 20;
const invaderSpacingY = 20;
const invaderOffsetX = 50;
const invaderOffsetY = 50;

function createGrid() {
    for(let col = 0; col < invaderCols; col++) {
        for(let row = 0; row < invaderRows; row++) {
            const x = col * (40 + invaderSpacingX) + invaderOffsetX;
            const y = row * (40 + invaderSpacingY) + invaderOffsetY;
            invaders.push(new Invader(x,y));
        }
    }
}

createGrid();



function drawStartMenu(ctx){
    //potentially add some animation or effects to the start menu in the future
}

//update the invader grid and ability based on the current level
function updateInvaderSettings() {
    invaderRows = 2 + currentRound - 1; //increase rows as level increases
    invaderCols = 3 + currentRound - 1; //increase columns as level increases
    speedOfEnemyFire = 0.01 + (currentRound - 1) * 0.005; //increase enemy fire rate as level increases
}

function roundOver() {
    isRoundOver = true;
    if(currentRound >= maxLevel) {
        isGameOver = true;
    } else {
        currentRound++;
        updateInvaderSettings();
        softResetGame();
    }
}

function softResetGame() {
    //reset the game state to playing
    gameState = STATES.PLAYING;
    isRoundOver = false;

    //reset the player position
    player.resetPosition(canvas.width, canvas.height);

    //clear the lazers and bombs arrays
    lazers = [];
    bombs = [];

    //make the grid of invaders again
    invaders = [];
    createGrid();
}

function resetGame(){
    //reset all variables to their initial state
    score = 0;
    lives = 3;
    gameState = STATES.PLAYING;
    isGameOver = false;
    didWin = false;
    updateLivesDisplay();

    //make the grid of invaders again
    invaders = [];
    createGrid();

    //reset the player position
    player.resetPosition(canvas.width, canvas.height);
}

function createBomb(){
    //get a random number between 0 and 1
    const randomNumber = Math.random();


    if(randomNumber < speedOfEnemyFire && invaders.length > 0) {

        let lowestInvader = invaders[0];

        //find the lowest invader in the array
        if(randomNumber < speedOfEnemyFire && invaders.length > 0) {
            invaders.forEach((invader) => {
                if(invader.y > lowestInvader.y) {
                    lowestInvader = invader;
                }
            });
        }

        //filter the invaders array to only include invaders that are at the same y position or close to it, so that the bomb is dropped from the lowest invader in that column
        const invaderTempArr = invaders.filter((invader) => (lowestInvader.y <= invader.y + invaderSpacingY));

        //get a random invader from the filtered array
        const randomInvader = invaderTempArr[Math.floor(Math.random() * invaderTempArr.length)];

        //record the information for the machine learning model
        let mlSnapshot = {
            //what the AI sees at the moment the shot is fired
            playerX: player.x,
            playerDirection: keys.left ? -1 : keys.right ? 1 : 0,
            invaderX: randomInvader.x,
            invaderY: randomInvader.y,

            //the result of the shot
            result: null //this will be filled in later when the player is hit or not hit by the bomb

        };
        //create a new bomb at the random invader's position
        if(randomInvader) {
            bombs.push(new Bomb(randomInvader.x + randomInvader.width / 2, randomInvader.y + randomInvader.height, mlSnapshot));
        }
    }

}

function checkCollisions() {
    for(let i = lazers.length - 1; i >= 0; i--){
        for(let j = invaders.length - 1; j >= 0; j--){
            const leftEdgeLazer = lazers[i].x;
            const leftEdgeInvaders = invaders[j].x;
            const rightEdgeLazer = lazers[i].x + lazers[i].width;
            const rightEdgeInvaders = invaders[j].x + invaders[j].width;
            const topOfLazer = lazers[i].y;
            const topOfInvader = invaders[j].y;
            const bottomOfLazer = lazers[i].y + lazers[i].height;
            const bottomOfInvader = invaders[j].y + invaders[j].height;

            if(leftEdgeLazer < rightEdgeInvaders && rightEdgeLazer > leftEdgeInvaders 
                && topOfLazer < bottomOfInvader && bottomOfLazer > topOfInvader
            ){
                lazers.splice(i, 1);
                invaders.splice(j, 1);
                score += 10;

                break;
            }
        }
    }
    for(let i = bombs.length - 1; i >= 0; i--){
        const leftEdgeBomb = bombs[i].x;
        const rightEdgeBomb = bombs[i].x + bombs[i].width;
        const topOfBomb = bombs[i].y;
        const bottomOfBomb = bombs[i].y + bombs[i].height;

        if(leftEdgeBomb < player.x + player.width && rightEdgeBomb > player.x
            && topOfBomb < player.y + player.height && bottomOfBomb > player.y
        ){
            //record the result of the bomb for machine learning
            bombs[i].mlSnapshot.result = 1; //hit
            mlTrainingData.push(bombs[i].mlSnapshot);

            //remove the bomb and decrease lives
            bombs.splice(i, 1);
            lives--;

            //update the lives display
            updateLivesDisplay();

            if(lives <= 0) {
                isGameOver = true;
            }

            break;
        }
    }
}

function displayScore(ctx) {
    document.getElementById("score").textContent = "Score: " + score;
}

function updateLivesDisplay(){
    document.getElementById("lives").textContent = "Lives: " + lives;
}

async function sendDataToServer() {
    if(mlTrainingData.length === 0) {
        console.log("No data to send");
        return;
    }

    const currentHost = window.location.hostname;
    const backendHost = currentHost.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev");
    const url = `https://${backendHost}/train`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ snapshots: mlTrainingData })
        });

        const result = await response.json();
        console.log("Results from round:", result);

        mlTrainingData = []; //clear the training data after sending it to the server
    } catch (error) {
        console.error("Error sending data to server:", error);
    }
}



function drawGame(ctx){
    startMenuElement.style.display = "none";
    //draw message if game is over
    if(isRoundOver) {
        if(gameState !== STATES.ROUND_OVER) {
            sendDataToServer();
        }
        gameState = STATES.ROUND_OVER;
        return;
    }
    if(isGameOver) {
        if(gameState !== STATES.GAME_OVER) {
            sendDataToServer();
        }
        gameState = STATES.GAME_OVER;
        return;
    }
    

    displayScore(ctx);



    //update the player
    player.update();

    
    //update the projectiles of both the player and the invaders
    //add bombs
    bombs.forEach((bomb) => {
        bomb.update();
        bomb.draw(ctx);
    });

    //iterate through the lazers array and draw them
    lazers.forEach((projectile) => {
        projectile.update();
        projectile.draw(ctx);
    });

    createBomb();


    //remove lazers that are off the screen  
    lazers = lazers.filter((projectile) => projectile.y > 0);

    //remove bombs that are off the screen and record their result for machine learning
    bombs = bombs.filter((bomb) => {

        //record the result of the bomb for machine learning if it goes off screen
        if(bomb.y > canvas.height) {
            bomb.mlSnapshot.result = 0; //miss
            mlTrainingData.push(bomb.mlSnapshot);

            //remove the bomb from the array
            return false;
        }
        //keep the bomb in the array
        return true;
    }); 

    //draw the invaders
    let hitWall = false;
    invaders.forEach((invader) => {
        invader.x += invaderSpeed;
            if(invader.x + invader.width >= canvas.width || invader.x <= 0) {
                hitWall = true;
            }
            if(invader.y + invader.height >= player.y) {
                isRoundOver = true;
            }
        invader.draw(ctx);
    });

    //if an invader hits the wall, move them down and reverse direction
    if(hitWall) {
        invaders.forEach((invader) => {
            invader.y += invaderDropDistance;
        });
        invaderSpeed *= -1;
    }



    checkCollisions();

    if(invaders.length === 0) {
        roundOver();
    }

    //draw the player
    player.draw(ctx);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//GAME LOOP
///////////////////////////////////////////////////////////////////////////////////////////////////

//load the player image and start the game loop once it's loaded
playerImg.onload = function() {
    gameLoop();
};

function gameLoop(){
    //clear the rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(gameState === STATES.PLAYING) {
        drawGame(ctx);
    } else if(gameState === STATES.GAME_OVER) {
        finalScoreElement.textContent = score;
        gameOverMenu.style.display = "flex";
        playingMenu.style.display = "none";
    }
    
    //loop the annimation
    requestAnimationFrame(gameLoop);
}



