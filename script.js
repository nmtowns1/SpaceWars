///////////////////////////////////////////////////////////////////////////////////////////////////
//SETTINGS AND VARIABLES
///////////////////////////////////////////////////////////////////////////////////////////////////

const invaderDropDistance = 20;
let score = 0;
let invaderSpeed = 2;
let lazers = [];
let invaders = [];
let isGameOver = false;
let didWin = false;






///////////////////////////////////////////////////////////////////////////////////////////////////
//Objects and Arrays
///////////////////////////////////////////////////////////////////////////////////////////////////

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
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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






///////////////////////////////////////////////////////////////////////////////////////////////////
//key listeners
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






///////////////////////////////////////////////////////////////////////////////////////////////////
//elements
///////////////////////////////////////////////////////////////////////////////////////////////////
const canvas = document.getElementById("myCanvas");
let ctx;
let player;

if(canvas) {
    ctx = canvas.getContext("2d");
    player = new Player(canvas.width, canvas.height);
} else {
    console.error("Canvas not found");
}



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


///////////////////////////////////////////////////////////////////////////////////////////////////
//GAME LOOP
///////////////////////////////////////////////////////////////////////////////////////////////////

function gameLoop(){
    //clear the rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    //score display
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 30);







    //update the player
    player.update();
    
    //iterate through the lazers array and draw them
    lazers.forEach((projectile) => {
        projectile.update();
        projectile.draw(ctx);
    });

    //remove lazers that are off the screen  
    lazers = lazers.filter((projectile) => projectile.y > 0);

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

    //collision detection
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
    if(invaders.length === 0) {
        isGameOver = true;
        didWin = true;
    }



    //draw the player
    player.draw(ctx);

    //loop the annimation
    requestAnimationFrame(gameLoop);
}

gameLoop();



