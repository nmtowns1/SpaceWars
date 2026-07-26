
//object to hold the state of the keys
export const keys = {
    left: false,
    right: false
};
export const playerImg = new Image();
playerImg.src = "sprites/hero_sprites/New Piskel.png";


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
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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