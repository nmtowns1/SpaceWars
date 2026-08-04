
//object to hold the state of the keys
export const keys = {
    left: false,
    right: false
};
export const playerImg = new Image();
export const gruntInvaderImg = new Image();
export const alphaInvaderImg = new Image();

playerImg.src = "sprites/hero_sprites/blue_ship.png";
gruntInvaderImg.src = "sprites/enemy_sprites/black_ship.png";
alphaInvaderImg.src = "sprites/enemy_sprites/alpha_ship.png";


export class Moon{
    constructor(x, y, canvasHeight) {
        this.canvasHeight = canvasHeight;
        this.x = x;
        this.y = y;
        this.height = Math.round(Math.random() * 30 + 10); // Random height between 20 and 50
        this.width = this.height; // Make the width equal to the height for a circular shape
        this.speed = Math.random() * 0.5 + 0.2; // Random speed between 0.2 and 0.7

        //create moon canvas
        this.moonCanvas = document.createElement("canvas");
        this.moonCanvas.width = this.width;
        this.moonCanvas.height = this.height;
        this.moonCtx = this.moonCanvas.getContext("2d");

        //the light is coming from the upper-left corner
        //draw the moon with a gradient to simulate lighting
        let gradient = this.moonCtx.createRadialGradient(this.width * 0.3, this.height * 0.3, 
            this.width * 0.1, this.width * 0.5, this.height * 0.5, this.width * 0.5);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.60, "rgb(145, 143, 143)");
        gradient.addColorStop(0.85, "rgb(46, 45, 45)");
        gradient.addColorStop(1, "rgb(19, 18, 18)");


        
        
        //draw the moon
        this.moonCtx.fillStyle = gradient;
        //draw a circle for the moon
        this.moonCtx.beginPath();
        this.moonCtx.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2);

        //fill the circle with the gradient
        this.moonCtx.fill();

        //draw some craters on the moon
        const craterCount = Math.floor(Math.random() * 5 + 3); // Random number of craters between 3 and 7
        for (let i = 0; i < craterCount; i++) {
            //get the crater radius
            const craterRadius = Math.random() * (this.width  * 0.1);
            //pick a random angle
            const angle = Math.random() * Math.PI * 2;
            //pick a random radius
            const radius = Math.random() * (this.moonCanvas.width / 2 - craterRadius); // Crater radius between 0 and 80% of the moon's radius
            const craterX = this.width / 2 + radius * Math.cos(angle);
            const craterY = this.height / 2 + radius * Math.sin(angle);
            this.moonCtx.beginPath();
            this.moonCtx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
            this.moonCtx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.moonCtx.fill();
        }
    }
    
    draw(ctx) {
        ctx.drawImage(this.moonCanvas, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
        if(this.y > this.canvasHeight) {
            this.y = 0;
        }
    }
}
export class Star{
    constructor(x, y, speed, canvasHeight) {
        this.canvasHeight = canvasHeight;
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, 1, 1);
    }
    
    update() {
        this.y += this.speed;
        if(this.y > this.canvasHeight) {
            this.y = 0;
        }
    }
}
export class Bomb {
    constructor (x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 6;
        this.direction = direction;
    }

    static get bombDirection () {
        return this.direction;
    }


    draw(ctx) {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(){
        if(this.direction === "down") {
            this.y += 5;
        } else if(this.direction === "left-down") {
            this.x -= 2;
            this.y += 5;
        } else if(this.direction === "right-down") {
            this.x += 2;
            this.y += 5;
        }
    }
}
export class Lazer {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 8;
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(){
        this.y -= 7;
    }
}
export class Invader{
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
export class gruntInvader extends Invader {
    constructor(x, y) {
        super(x, y);
        this.width = 40;
        this.height = 40;
    } 
        get fireType () {
        return "single";
    }

    draw(ctx) {
        ctx.drawImage(gruntInvaderImg, this.x, this.y, this.width, this.height);
    }
}

export class alphaInvader extends Invader {
    constructor(x, y) {
        super(x, y);
        this.width = 40;
        this.height = 40;
    }

        get fireType () {
        return "spray";
    }

    draw(ctx) {
        ctx.drawImage(alphaInvaderImg, this.x, this.y, this.width, this.height);
    }
}
//player object
export class Player {
    constructor (canvasWidth, canvasHeight){
        this.width = 50;
        this.height = 50;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - this.height - 25;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 3;
    }

    draw(ctx) {
        let column = this.currentFrame % 8;
        let row = Math.floor(this.currentFrame / 8);
        let sx = column * 32; // source x position
        let sy = row * 32; // source y position
        let sWidth = 32; // source width
        let sHeight = 32; // source height
        ctx.drawImage(playerImg, sx, sy, sWidth, sHeight, this.x, this.y, this.width, this.height);
    }

    update(canvasWidth) {
        this.frameTimer++;
        if(this.frameTimer >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % 71;
            this.frameTimer = 0;
        }
        if(keys.left) {
            if(this.x > 0) {
                this.x -= 5;
            }
        }
        if(keys.right) {
            if(this.x < canvasWidth - this.width) {
                this.x += 5;
            }
        }
    }

    resetPosition(canvasWidth, canvasHeight) {
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - this.height - 25;
    }
}