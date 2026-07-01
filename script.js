///////////////////////////////////////////////////////////////////////////////////////////////////
//SETTINGS AND VARIABLES
///////////////////////////////////////////////////////////////////////////////////////////////////


const invaderDropDistance = 20;

const STATES = {
    START_MENU: "START_MENU",
    SETTINGS: "SETTINGS",
    PLAYING: "PLAYING",
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
let isGameOver = false;
let didWin = false;
let ctx;
let player;
let lives = 3;

//const variables for the game loop and animation frame
//get the canvas element from the HTML
const canvas = document.getElementById("myCanvas");
const startMenuElement = document.getElementById("start-menu");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const pauseButton = document.getElementById("pause-button");
const playingMenu = document.getElementById("playing-menu");


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
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 6;
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
    //reset all variables to their initial state
    score = 0;
    lives = 3;
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
const invaderRows = 5;
const invaderCols = 10;
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

function createBomb(){
    //get a random number between 0 and 1
    randomNumber = Math.random();

    if(randomNumber < speedOfEnemyFire && invaders.length > 0) {

        lowestInvader = invaders[0];

        //find the lowest invader in the array
        if(randomNumber < speedOfEnemyFire && invaders.length > 0) {
            invaders.forEach((invader) => {
                if(invader.y > lowestInvader.y) {
                    lowestInvader = invader;
                }
            });
        }

        //filter the invaders array to only include invaders that are at the same y position or close to it, so that the bomb is dropped from the lowest invader in that column
        invaderTempArr = invaders.filter((invader) => (lowestInvader.y <= invader.y + invaderSpacingY));

        //get a random invader from the filtered array
        randomInvader = invaderTempArr[Math.floor(Math.random() * invaderTempArr.length)];

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
            bombs.splice(i, 1);
            lives--;
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



function drawGame(ctx){
    startMenuElement.style.display = "none";
    //draw message if game is over
    if(isGameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        if(didWin) {
            ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
        } else {
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        }
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
    bombs = bombs.filter((bomb) => bomb.y < canvas.height); 

    //draw the invaders
    let hitWall = false;
    invaders.forEach((invader) => {
        invader.x += invaderSpeed;
            if(invader.x + invader.width >= canvas.width || invader.x <= 0) {
                hitWall = true;
            }
            if(invader.y + invader.height >= player.y) {
                isGameOver = true;
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
        isGameOver = true;
        didWin = true;
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
    }
    
    //loop the annimation
    requestAnimationFrame(gameLoop);
}



