//Character classes 

class Player{
    constructor(x,y, playerImage){
        this.x = x;//position
        this.y = y;
        this.ammo = 6; //ammunition
        this.alive = true; //alive or dead
        this.speed = 5; //<---------CHANGE TO EDIT PLAYER SPEED
        this.fire = false;
        this.characterRight= playerImage[0];
        this.characterLeft = playerImage[1];
    }
    
    display = function(){
        noStroke();
        if (mouseX > this.x){
            image(this.characterRight, this.x-20, this.y-20);
            this.characterRight.resize(50, 50);
        }
        if (mouseX < this.x){
            image(this.characterLeft, this.x-20, this.y-20);
            this.characterLeft.resize(50, 50);
        }
        
        //draws the crosshairs where the player is aiming
        let crossDirection = atan2(mouseY - playerCharacter.y, mouseX - playerCharacter.x);
        
        let crossX = this.x + (80 * Math.cos(crossDirection));
        let crossY = this.y + (80 * Math.sin(crossDirection));
        
        stroke(0);
        noFill();
        ellipse(crossX, crossY, 20, 20);
        line(crossX+20, crossY, crossX -20, crossY);
        line(crossX, crossY + 20, crossX , crossY - 20);
    }
    
    move = function(){
        //player movements controlled by keyboard
        if (keyIsDown(87)){ // S
            this.y -= this.speed;
        }
        if (keyIsDown(83)){ //W
            this.y += this.speed;
        }
        if (keyIsDown(65)){ //A
            this.x -= this.speed;
        }
        if (keyIsDown(68)){ //D
            this.x += this.speed;
        } 
        
        //constrain within the walls
        if(this.x < 19){
            this.x = 20;
        }
        else if(this.x > 781){
            this.x = 780;
        }
        else if(this.y <= 19){
            this.y = 20;
        }
        else if(this.y >= 481){
            this.y = 480;
        }
        
        if(this.fire){
            if (this.ammo > 0){
                stroke(255);
                line(this.x, this.y, mouseX, mouseY);
                //this.ammo -= 1;
            }
            console.log(this.ammo);
            this.fire = false; 
            noStroke();
        }

    }
    
    //shoot function 
    shoot = function(){
        //creating a bullet for the bullets in the air
        this.fire = true;
    }    
}

class Zombie{
    constructor(x, y, zombieImage){
        this.x = x;
        this.y = y;
        this.speed = 1; //<--- change to edit zombie speed
        this.characterRight = zombieImage[0];
        this.characterLeft = zombieImage[1];
        this.characterDraw = this.characterRight;
    }
    
    move = function(){
        if (playerCharacter.x > this.x){
            this.x += this.speed;
            this.characterDraw = this.characterRight;
        }
        if (playerCharacter.x < this.x){
            this.x -= this.speed;
            this.characterDraw = this.characterLeft;
        }
        if (playerCharacter.y > this.y){
            this.y += this.speed;
        }
        if (playerCharacter.y < this.y){
            this.y -= this.speed;
        }
    }
    
    display = function(){
        //fill(0, 255, 0);
        //rect(this.x - 20 , this.y - 20, 40, 40);
        image(this.characterDraw, this.x-20, this.y-20);
        this.characterDraw.resize(50, 50);
    }
}

class Ghost {
    constructor(x, y, ghostImage){
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.characterRight = ghostImage[0];
        this.characterLeft = ghostImage[1];
        this.characterDraw = this.characterRight;
    }
    
    move = function(){
        if (playerCharacter.x > this.x){
            this.x += this.speed;
            this.characterDraw = this.characterRight;
        }
        if (playerCharacter.x < this.x){
            this.x -= this.speed;
            this.characterDraw = this.characterLeft;
        }
        if (playerCharacter.y > this.y){
            this.y += this.speed;
        }
        if (playerCharacter.y < this.y){
            this.y -= this.speed;
        }
    }
        
    display = function(){
        //fill(255);
        //rect(this.x - 20 , this.y - 20, 40, 40);
        image(this.characterDraw, this.x-20, this.y-20);
        this.characterDraw.resize(50, 50);
    }
}

//class for bullets
class Bullet {
    constructor(x, y, direction){
        this.speed = 25; //<------CHANGE TO EDIT BULLET SPEED
        this.x = x; //bullet position
        this.y = y;
        this.direction = direction; //direction of the bullet
    }
    
    display = function (){
        noStroke();
        fill(218,165,32);
        ellipse(this.x, this.y, 4, 4);
    }
    
    move = function(){
        this.x += this.speed * (Math.cos(this.direction));
        this.y += this.speed * (Math.sin(this.direction));
    }
}

class Refill{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    display = function(){
        noStroke();
        fill(207, 181, 59);
        rect(this.x, this.y, 10, 30);
    }
}

class Flame{
    constructor(p, x, y, width, bottom, speed){
        this.p = p;
        this.tipX = x;
        this.tipY = y;
        this.width = width;
        this.currentTipY = 0;
        this.direction = 1;
        this.bottom = bottom;
        this.speed = speed;
    }
    
    display = function(){
        this.p.noStroke();
        this.p.fill(226,88,44);
        this.p.beginShape();
            this.p.vertex(this.tipX-(this.width / 2), this.bottom);
            this.p.vertex(this.tipX, this.currentTipY);
            this.p.vertex(this.tipX + (this.width / 2), this.bottom);
        this.p.endShape();
        //console.log(this.currentTipY);
    }
    
    move = function(){
        if (this.currentTipY < this.y){
            this.direction = -1;
        }
        this.currentTipY += this.direction * this.speed;
    }
}