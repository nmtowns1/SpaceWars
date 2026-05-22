
///////////////////////////////////////////////////////////////////////////////////////////////////
//Objects and Arrays
///////////////////////////////////////////////////////////////////////////////////////////////////

//array to hold the projectiles
const projectiles = [];

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

class Projectile {
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
});

window.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft" || e.key === "a") {
        keys.left = false;
    }
    if(e.key === "ArrowRight" || e.key === "d") {
        keys.right = false;
    }
});

window.addEventListener("Space", (e) => {
    if(e.code === "Space") {
        projectiles.push(new Projectile(player.x + player.width / 2, player.y));
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
//GAME LOOP
///////////////////////////////////////////////////////////////////////////////////////////////////

function gameLoop(){
    //clear the rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //update the player
    player.update();
    
    //iterate through the projectiles array and draw them
    projectiles.forEach((projectile) => {
        projectile.update();
        projectile.draw(ctx);
    });


    //draw the player
    player.draw(ctx);

    //loop the annimation
    requestAnimationFrame(gameLoop);
}

gameLoop();



