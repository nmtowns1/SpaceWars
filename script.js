import { Bomb, Lazer, Invader, Player, keys, playerImg } from './entities.js';
import { STATES, maxLevel, invaderSpacingX, invaderSpacingY, invaderOffsetX, invaderOffsetY, invaderDropDistance, intitialInvaderCols, intitialInvaderRows } from './constraints.js';



export let gameState = STATES.START_MENU;
export let score = 0;
export let lazers = [];
export let invaders = [];
export let bombs = [];
export let player;
let invaderSpeed = 2;
let speedOfEnemyFire = 0.02;
let currentRound = 1;
let isRoundOver = false;
let isGameOver = false;
let didWin = false;
let ctx;
let lives = 3;

//const variables for the game loop and animation frame

export const canvas = document.getElementById("myCanvas");
export const startMenuElement = document.getElementById("start-menu");
export const startButton = document.getElementById("start-button");
export const restartButton = document.getElementById("restart-button");
export const pauseButton = document.getElementById("pause-button");
export const pauseMenu = document.getElementById("pause-menu");
export const resumeButton = document.getElementById("resume-button");
export const restartButtonPause = document.getElementById("restart-button-pause");
export const playingMenu = document.getElementById("playing-menu");
export const gameOverMenu = document.getElementById("game-over-menu");
export const finalScoreElement = document.getElementById("final-score");

const canvasWidth = canvas ? canvas.width : 800; //default width if canvas is not found
const canvasHeight = canvas ? canvas.height : 600; //default height if canvas is not found


//check if the canvas element exists and get the 2D context, then create a new player object
if(canvas) {
    ctx = canvas.getContext("2d");
    player = new Player(canvas.width, canvas.height);
} else {
    console.error("Canvas not found");
}



///////////////////////////////////////////////////////////////////////////////////////////////////
//GRID FOR INVADERS SETUP
///////////////////////////////////////////////////////////////////////////////////////////////////
let invaderRows = intitialInvaderRows;
let invaderCols = intitialInvaderCols;

export function changeGameState(newState) {
    gameState = newState;
}

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

export function resetGame(){
    //reset all variables to their initial state
    score = 0;
    lives = 3;
    invaderCols = intitialInvaderCols;
    invaderRows = intitialInvaderRows;
    currentRound = 1;
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

        //create a new bomb at the random invader's position
        if(randomInvader) {
            bombs.push(new Bomb(randomInvader.x + randomInvader.width / 2, randomInvader.y + randomInvader.height));
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

export function updateLivesDisplay(){
    document.getElementById("lives").textContent = "Lives: " + lives;
}

function drawGame(ctx){
    startMenuElement.style.display = "none";
    //draw message if game is over
    if(isRoundOver) {
        gameState = STATES.ROUND_OVER;
        return;
    }
    if(isGameOver) {
        gameState = STATES.GAME_OVER;
        return;
    }
    

    displayScore(ctx);



    //update the player
    player.update(canvasWidth);

    
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

    //remove bombs that are off the screen
    bombs = bombs.filter((bomb) => {

        if(bomb.y > canvas.height) {
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



