
//object to hold the state of the keys
export const keys = {
    left: false,
    right: false
};
export const playerImg = new Image();
playerImg.src = "sprites/hero_sprites/New Piskel.png";


export class Bomb {
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
export class Lazer {
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
export class Invader{
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
}

export class alphaInvader extends Invader {
    constructor(x, y) {
        super(x, y);
        this.width = 40;
        this.height = 40;
    }

    static get fireType () {
        return "burst";
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
//player object
export class Player {
    constructor (canvasWidth, canvasHeight){
        this.width = 50;
        this.height = 50;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - this.height - 25;
    }

    draw(ctx) {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    }

    update(canvasWidth) {
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