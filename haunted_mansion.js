//Haunted Mansion game

//state
let state = 0; //0 = starting or dead, 1 = playing, 2 = pause 

//difficulty
let difficulty = 0;

let playerCharacter;
let playerX;
let playerY; 
let bulletList = [];
let coinX;
let coinY;
let score = 0;
let highscore;

let direction;

//let refillCounter = 0;
let refillList = [];

//let zombieCounter = 0;
let zombieList = [];
let zombieNum = 0;

//let ghostCounter = 0;
let ghostList = [];
let ghostNum = 0;
let frozen = [];

//let statueCounter = 0;
let statueAnger = false;
let statueAngerLevel = 0;
let laserCounter = 0;

let mapCanvas;

let causeOfDeath;

let message = "Come to get some treasure?";

let deathTime = 0;


//asset variables
//images
let player_image_list = [];
let ghost_image_list = [];
let zombie_image_list = [];
let statueImage;
let statue_eyes;
let statue_eyes_red;
let mapImage;

//sounds
let gunshot;
let dryfire;
let reload;
let money;
let human_scream;

//preload for assets
function preload(){
    //images
    player_image_list.push(loadImage('Assets/player_right.png'));
    player_image_list.push(loadImage('Assets/player_left.png'));
    ghost_image_list.push(loadImage('Assets/ghost_right.png'));
    ghost_image_list.push(loadImage('Assets/ghost_left.png'));
    zombie_image_list.push(loadImage('Assets/zombie_right.png'));
    zombie_image_list.push(loadImage('Assets/zombie_left.png'));
    statueImage = loadImage('Assets/statue.png');
    statue_eyes = loadImage('Assets/statue_eyes.png');
    statue_eyes_red = loadImage('Assets/statue_eyes_red.png');
    mapImage = loadImage('Assets/map.png');
    
    //sounds
    gunshot = loadSound("Assets/gunshot.wav");
    dryfire = loadSound("Assets/dryfire.wav");
    reload = loadSound("Assets/reload.wav");
    money = loadSound("Assets/money.wav");
    human_scream = loadSound("Assets/human_scream.wav");
    
    //zombieList.push("dummyZombie");
}

//main canvas
//console.log("test");
//main game canvas
function setup(){
    mapCanvas = createCanvas(800,500);
    mapCanvas.parent("mapDiv");
    playerCharacter = new Player(width/2, height/2, player_image_list);
    coinX = random(790);
    coinY = random(490);
    //window.localStorage.setItem("highscore", highscore);
    if(window.localStorage.getItem("highscore")){
        highscore = window.localStorage.getItem("highscore");
    }
    else{
        highscore = 0;
    }
}

function draw(){
    //start menu //dead 
    if (state == 0){
        //makes the start menu visible
        document.getElementById("startMenu").style.visibility = "visible";
        
        //displays the message at the top of the menu
        document.getElementById("specialMessage").innerHTML = message;
        
        //displays score
        document.getElementById("startMenuScore").innerHTML = "Score: " + score;
        //displays highscore
        document.getElementById("startMenuHighScore").innerHTML = "Highscore: " + highscore;
        
        //sets the difficulty
        difficulty = document.getElementById("difficultyRange").value;
        
        //hides the map 
        document.getElementById("mapDiv").style.display = "none";
        //hides the pause button
        document.getElementById("pauseDiv").style.display = "none";
        
        document.getElementById("playDiv").style.display = "none";
        playerX = mouseX;
        playerY = mouseY;
    }
    
    //playing 
    else if (state == 1){
         direction = atan2(mouseY - playerCharacter.y, mouseX - playerCharacter.x);
        
        //hides the startMenu
        document.getElementById("startMenu").style.display = "none";
        document.getElementById("mapDiv").style.display = "flex";
        
        //displays the score
        document.getElementById("scorePrint").innerHTML = "Score: " + score;

        //displays the ammo
        //document.getElementById("ammoPrint").innerHTML = "Ammo: " + playerCharacter.ammo;
        
        //displays the pause button
        document.getElementById("pauseDiv").style.display = "";
        
        //hides the pause menu
        document.getElementById("pauseMenu").style.display = "none";
        
        //hides the play button
        document.getElementById("playDiv").style.display = "none";
        
        image(mapImage, 0,0);

        //coin drawing 
        fill(255,215,0);
        noStroke();
        rect(coinX, coinY, 20, 20);
        fill(218,165,32);
        rect(coinX + 5, coinY + 5, 10, 10);

        //refill drawing 
        for (let i = 0; i < refillList.length; i++){
            refillList[i].display();

            //refill collision detection 
            if (refillList[i].x + 10 > playerCharacter.x - 20 && refillList[i].x < playerCharacter.x + 20){
                if(refillList[i].y + 30 > playerCharacter.y - 20 && refillList[i].y  < playerCharacter.y + 20){
                    playerCharacter.ammo += 2;
                    refillList.splice(i, 1);
                    reload.play();
                }
            }
        }
        //shooting
        for (let i = 0; i < bulletList.length; i++){
            bulletList[i].display();
            bulletList[i].move();

            //tracks bullet collision with zombies
            for(let j = 0; j < zombieList.length; j++){
                //bullet
                //console.log(zombieList[i].x);
                //console.log(playerCharacter.x);
                if (zombieList[j].x + 20 > bulletList[i].x && zombieList[j].x - 20 < bulletList[i].x){
                   if (zombieList[j].y + 20 > bulletList[i].y && zombieList[j].y - 20 <bulletList[i].y){
                       zombieList.splice(j, 1);
                       bulletList[i] = new Bullet();
                       zombieNum--;
                       console.log(bulletList);
                   }
                }
            }
        }

        //zombie drawing
        for (let i = 0; i < zombieList.length; i++){
            zombieList[i].display();
            zombieList[i].move();
        }

        //player's movements
        playerCharacter.display();
        playerCharacter.move();
        playerX = playerCharacter.x;
        playerY = playerCharacter.y; //for the secondary canvi tracking
        
         //ghost drawing
        for (let i = 0; i < ghostList.length; i++){
            ghostList[i].display();
            ghostList[i].move();
        }

        //coin collision detection 
        if (coinX + 20 > playerCharacter.x - 20 && coinX < playerCharacter.x + 20){
            if(coinY + 20 > playerCharacter.y - 20 && coinY  < playerCharacter.y + 20){
                score++;
                money.play();
                coinX = random(790);
                coinY = random(490);
            }
        }

        //player collision with zombies
        for (let j = 0; j <zombieList.length; j++){
            if (zombieList[j].x + 20 > playerCharacter.x - 20 && zombieList[j].x - 20 < playerCharacter.x +20){
                if (zombieList[j].y + 20 > playerCharacter.y-20 && zombieList[j].y -20 < playerCharacter.y +20){
                   playerCharacter.alive = false;
                    causeOfDeath = "zombie";
                    message = "You got eaten by a zombie";
                }
            }
        }

        //player collision with ghosts
        let touching = false;
        for (let j = 0; j <ghostList.length; j++){
            //when ghost touches player
            if (ghostList[j].x + 20 > playerCharacter.x - 20 && ghostList[j].x - 20 < playerCharacter.x +20){
                if (ghostList[j].y + 20 > playerCharacter.y-20 && ghostList[j].y -20 < playerCharacter.y +20){
                   //remembers the player's starting position
                    frozen.push([playerCharacter.x, playerCharacter.y, mouseX, mouseY]);
                    touching = true;
                    ghostList[j].speed = 1;
                    //console.log(frozen);

                    //if the ghost is ontop of the player (with a range)
                    if (ghostList[j].x <= playerCharacter.x + 3 && ghostList[j].x >= playerCharacter.x - 3){
                        if (ghostList[j].y <= playerCharacter.y + 3 && ghostList[j].y >= playerCharacter.y - 3){
                            ghostList.splice(j, 1);//kills the ghost
                            touching = false;
                            frozen = [];
                            ghostNum--;
                            //console.log("Ghosts: ", ghostNum);
                        }
                    }
                }
            }
        }

        //kills a player if they move while touching a ghost
        if (touching){
            if (frozen[0][0] != playerCharacter.x || frozen[0][1] != playerCharacter.y || frozen[0][2] != mouseX || frozen[0][3] != mouseY){
                playerCharacter.alive = false;
                causeOfDeath = "Ghost";
                message = "Possessed";
            }
        }


        //creates a bullet refill after so many frames
        //refillCounter++;
        if (int(random(240 * difficulty)) == 1){
            refillList.push(new Refill(random(790), random(490))); //adds one to the refill list
            //refillCounter = 0;
        }

        //creates a zombie after so many frames
        //zombieCounter++;
        if (int(random(600/difficulty)) == 1 && zombieNum < 5){ //100 SHOULD BE 600
            //randomly decidese from what sid to spawn zombie (1 = top, 2 = right, 3 = bottom, 4 = bottom)
            let sideSpawn = int(random(4));
            let zombieX = 0;
            let zombieY = 0;
            if (sideSpawn == 0){//top side
                zombieX = random(800);
                zombieY = 0;
            }
            if (sideSpawn == 1){//right side
                zombieX = 800;
                zombieY = random(500);
            }
            if (sideSpawn == 2){//bottom
                zombieX = random(800);
                zombieY = 500;
            }
            if (sideSpawn == 3){//left
                zombieX = random(0);
                zombieY = random(500);
            }
            zombieList.push(new Zombie(zombieX, zombieY, zombie_image_list));
            zombieCounter = 0;
            zombieNum++;
            //console.log("zombies: " + zombieNum);
        }

        //controls the ghost spawning
        //ghostCounter++;
        if (int(random(480/difficulty)) == 1 && ghostNum < 4){
            //randomly decidese from what sid to spawn zombie (1 = top, 2 = right, 3 = bottom, 4 = bottom)
            let sideSpawn = int(random(4));
            let ghostX = 0;
            let ghostY = 0;
            if (sideSpawn == 0){//top side
                ghostX = random(800);
                ghostY = 0;
            }
            if (sideSpawn == 1){//right side
                ghostX = 800;
                ghostY = random(500);
            }
            if (sideSpawn == 2){//bottom
                ghostX = random(800);
                ghostY = 500;
            }
            if (sideSpawn == 3){//left
                ghostX = random(0);
                ghostY = random(500);
            }
            ghostList.push(new Ghost(ghostX,ghostY, ghost_image_list));
            ghostCounter = 0;
            ghostNum++;
            //console.log("ghosts: " + ghostNum);
        }

        //controls the statues
        //statueCounter++;
        if (int(random(480/difficulty)) == 1 && statueAnger == false){
            statueAnger = true;
            statuePlayerX = playerCharacter.x;
            statuePlayerY = playerCharacter.y;
            //console.log(statuePlayerX, " ", statuePlayerY);
        }

        if (statueAnger == true){
            statueAngerLevel++;
            stroke(255,0,0);
            noFill();
            ellipse(statuePlayerX, statuePlayerY, statueAngerLevel, statueAngerLevel);
            if (statueAngerLevel >= 110 && statueAngerLevel <= 120){
                //fill(255, 0, 0);
                //ellipse(statuePlayerX, statuePlayerX, 100, 100); 
                strokeWeight(10);
                stroke(255, 0, 0);
                line(-75, -75, statuePlayerX, statuePlayerY);
                line(-75, 575, statuePlayerX, statuePlayerY);
                line(875, -75, statuePlayerX, statuePlayerY);
                line(875, 575, statuePlayerX, statuePlayerY);
                strokeWeight(1);
                //shoot
                ///tracks how close player is to the place they were
                if (dist(statuePlayerX, statuePlayerY, playerCharacter.x, playerCharacter.y) <= 80){
                    playerCharacter.alive = false;
                    causeOfDeath = "statue";
                    message = "Told you not to piss of the statues";
                    //console.log(playerCharacter.x, " ", playerCharacter.y);
                    //console.log(statuePlayerX, " ", statuePlayerY);
                }
                //statueCounter = 0;
                statueAngerLevel = 0;
                statueAnger = false;
            }
        }

        //highscore check 
        if (score > highscore){
            highscore = score;
            document.getElementById("scorePrint").style.color = "red";  
        }   



        //ends the game if player character dies
        if (playerCharacter.alive == false){
            human_scream.play();
            state = 3;
            console.log("Game Over");
            console.log(causeOfDeath);
            window.localStorage.setItem("highscore", highscore);
            //console.log(window.localStorage.getItem("highscore"));
        }
    }
        
    //pause
    else if (state == 2){
        //hides the mapDiv
        //document.getElementById("mapDiv").style.display = "none";
        //makes the pause menu visible
        document.getElementById("pauseMenu").style.visibility = "visible";
        document.getElementById("pauseScreenScoreDisplay").innerHTML = "Score: " + score;
        document.getElementById("pauseScreenAmmoDisplay").innerHTML = "Ammo: " + playerCharacter.ammo;
        document.getElementById("highscorePrint").innerHTML = "Highscore: " + highscore;
        
        //hides the pause button
        document.getElementById("pauseDiv").style.display = "none";
        
        //displays the pause menu
        document.getElementById("pauseMenu").style.display = "";
        
        //makes the play button visible
        document.getElementById("playDiv").style.display = "";
    }
    
    else if (state == 3){
        deathTime++;
        if (deathTime > 45 ){
            death();
            deathTime = 0;
        }
    }
}

function mousePressed(){
    if (state == 1 && mouseX > 840 && mouseX < 910 && mouseY > 210 && mouseY < 290){
       state = 2; //pause
        console.log(zombieList);
    }
    
    if (state == 2 && mouseX > -110 && mouseX < -40 && mouseY > 210 && mouseY < 290){
        state = 1;
        
    }
    //console.log(mouseX, ",", mouseY);
    else if (playerCharacter.ammo > 0 && state == 1){
        bulletList.push(new Bullet(playerCharacter.x, playerCharacter.y, direction));
        playerCharacter.ammo -= 1;
        gunshot.play();
        console.log(bulletList);
        //console.log(playerCharacter.ammo);
    }
    
    else if (playerCharacter.ammo == 0 && state == 1){
        dryfire.play();
    }
    
}

function startGame(){
    state = 1;   
    playerCharacter.alive = true;
    playerCharacter.ammo = 6;
    playerCharacter.x = width/2;
    playerCharacter.y = height/2;
    bulletList = [];
    score = 0;
    
    refillCounter = 0;
    refillList = [];

    zombieCounter = 0;
    zombieList = [];
    zombieNum = 0;

    ghostCounter = 0;   
    ghostList = [];
    ghostNum = 0;
    frozen = [];
    
    statueCounter = 0;
    statueAnger = false;
    statueAngerLevel = 0;
    
    coinX = random(790);
    coinY = random(490);
}

function death(){
    //hides the startMenu
    state = 0;
    document.getElementById("startMenu").style.display = "";
    deathTime = 0;
}


//secondary canvii --at the four corners of the game map screen 
//topLeft
let sketchCode1 = function(p, parentDiv){
    p.setup = function(){
        let statueCanvas = p.createCanvas(150,150);
        statueCanvas.id("statueCanvas");
        statueCanvas.parent(parentDiv)
    }
    
    let eyeX;
    let eyeY;
    p.draw = function(){
        p.fill(0);
        p.clear();
        
        p.image(statueImage,0,0);
        //p.fill(255);
        //p.ellipse(75, 75, 20, 20);
        if (statueAnger == false){
            let theta = atan2(((playerX - 20 + 150 -75)-75) /2, ((playerY - 20 + 150 - 10) - 10) / 2);
            eyeX = 5 * Math.sin(theta);
            eyeY = 5 * Math.cos(theta);
            //p.tint(255, 127);
        }
        //p.tint(255, 255);
        p.image(statue_eyes, eyeX, eyeY);
        //p.tint(255, 127);
        //console.log(eyeX, eyeY);
        
        if (statueAnger){
            //p.fill(255, 0, 0);
            p.tint(255, 127 + (128 * (statueAngerLevel / 120)));
            p.image(statue_eyes_red, eyeX, eyeY);
            p.tint(255,255);
        }
        
        if (statueAngerLevel == 120){
            p.stroke(255,0,0);
            p.strokeWeight(10);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
            p.strokeWeight(1);
        }
        
        if (statueAnger == false) {
            p.stroke(255);
            //p.image(statue_eyes,0-0,0);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
        }   
        
    }
}
let statue1 = new p5 (sketchCode1, "topLeft");

//topRight
let sketchCode2 = function(p, parentDiv){
    p.setup = function(){
        let statueCanvas = p.createCanvas(150,150);
        statueCanvas.id("statueCanvas");
        statueCanvas.parent(parentDiv)
    }
    
    let eyeX;
    let eyeY;
    p.draw = function(){
        p.fill(0);
        p.clear();
        
        p.image(statueImage,0,0);
        //p.fill(255);
        //p.ellipse(75, 75, 20, 20);
        if (statueAnger == false){
            let theta = atan2(((playerX - 20 -800)-75) /2, ((playerY - 20 +150) - 10) / 2);
            eyeX = 5 * Math.sin(theta);
            eyeY = 5 * Math.cos(theta);
            p.tint(255, 255);
        }
        //p.tint(255, 255);
        p.image(statue_eyes, eyeX, eyeY);
        //p.tint(255, 127);
        //console.log(eyeX, eyeY);
        
        if (statueAnger){
            //p.fill(255, 0, 0);
            p.tint(255, 127 + (128 * (statueAngerLevel / 120)));
            p.image(statue_eyes_red, eyeX, eyeY);
            p.tint(255,255);
        }
        
        if (statueAngerLevel == 120){
            p.stroke(255,0,0);
            p.strokeWeight(10);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
            p.strokeWeight(1);
        }
        
        if (statueAnger == false) {
            p.stroke(255);
            //p.image(statue_eyes,0-0,0);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
        }   
        
    }
}
let statue2 = new p5 (sketchCode2, "topRight");

//BottomRight
let sketchCode3 = function(p, parentDiv){
    p.setup = function(){
        let statueCanvas = p.createCanvas(150,150);
        statueCanvas.id("statueCanvas");
        statueCanvas.parent(parentDiv)
    }
    
    let eyeX;
    let eyeY;
    p.draw = function(){
        p.fill(0);
        p.clear();
        
        p.image(statueImage,0,0);
        //p.fill(255);
        //p.ellipse(75, 75, 20, 20);
        if (statueAnger == false){
            let theta = atan2(((playerX - 20 - 800)-75) /2, ((playerY - 20 - 500) - 10) / 2);
            eyeX = 5 * Math.sin(theta);
            eyeY = 5 * Math.cos(theta);
            p.tint(255, 255);
        }
        //p.tint(255, 255);
        p.image(statue_eyes, eyeX, eyeY);
        //p.tint(255, 127);
        //console.log(eyeX, eyeY);
        
        if (statueAnger){
            //p.fill(255, 0, 0);
            p.tint(255, 127 + (128 * (statueAngerLevel / 120)));
            p.image(statue_eyes_red, eyeX, eyeY);
            p.tint(255,255);
        }
        
        if (statueAngerLevel == 120){
            p.stroke(255,0,0);
            p.strokeWeight(10);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
            p.strokeWeight(1);
        }
        
        if (statueAnger == false) {
            p.stroke(255);
            //p.image(statue_eyes,0-0,0);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
        }   
        
    }
}
let statue3 = new p5 (sketchCode3, "bottomRight");

//BottomLeft
let sketchCode4 = function(p, parentDiv){
    p.setup = function(){
        let statueCanvas = p.createCanvas(150,150);
        statueCanvas.id("statueCanvas");
        statueCanvas.parent(parentDiv)
    }
    
    let eyeX;
    let eyeY;
    p.draw = function(){
        p.fill(0);
        p.clear();
        
        p.image(statueImage,0,0);
        //p.fill(255);
        //p.ellipse(75, 75, 20, 20);
        if (statueAnger == false){
            let theta = atan2(((playerX - 20 + 150)-75) /2, ((playerY - 20  - 500) - 10) / 2);
            eyeX = 5 * Math.sin(theta);
            eyeY = 5 * Math.cos(theta);
            p.tint(255, 255);
        }
        //p.tint(255, 255);
        p.image(statue_eyes, eyeX, eyeY);
        //p.tint(255, 127);
        //console.log(eyeX, eyeY);
        
        if (statueAnger){
            //p.fill(255, 0, 0);
            p.tint(255, 127 + (128 * (statueAngerLevel / 120)));
            p.image(statue_eyes_red, eyeX, eyeY);
            p.tint(255,255);
        }
        
        if (statueAngerLevel == 120){
            p.stroke(255,0,0);
            p.strokeWeight(10);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
            p.strokeWeight(1);
        }
        
        if (statueAnger == false) {
            p.stroke(255);
            //p.image(statue_eyes,0-0,0);
            //p.line(75, 75, playerX -20 +150, playerY -20 +150);
        }   
        
    }
}
let statue4 = new p5 (sketchCode4, "bottomLeft");


//pause canvas
let pauseCanvas = function(p, parentDiv){
    p.setup = function(){
        let statueCanvas = p.createCanvas(150,500);
        statueCanvas.id("pauseCanvas");
        statueCanvas.parent(parentDiv)
        //p.background(128,128,128);
    }

    p.draw = function(){
        p.clear()
        //tracks if the mouse is inside the pause box
        if (mouseX > 840 && mouseX < 910 && mouseY > 210 && mouseY < 290){
            noStroke();
            p.fill(100);
        }
        else {
            p.fill(100, 100, 100, 200);
        }
        p.noStroke();
        p.rect(40, 210, 20, 80);
        p.rect(90, 210, 20, 80);
        
    }
}

let pause = new p5 (pauseCanvas, "pauseDiv");

//pause canvas
let playCanvas = function(p, parentDiv){
    p.setup = function(){
        let statueCanvas = p.createCanvas(150,500);
        statueCanvas.id("pauseCanvas");
        statueCanvas.parent(parentDiv)
        //p.background(128,128,128);
    }

    p.draw = function(){  
        p.clear();
        if (mouseX > -110 && mouseX < -40 && mouseY > 210 && mouseY < 290){
           p.fill(100); 
        }
        else{
            p.fill(100, 100, 100, 200);
        }
        p.noStroke();
        p.beginShape();
            p.vertex(40, 210);
            p.vertex(110, 250);
            p.vertex(40, 290);
        p.endShape();
        
    }
}
let play = new p5 (playCanvas, "playDiv");

let backgroundWidth;
let backgroundHeight;

let flameCounter;
let flameList = [];


let flameTipX;
let flameTipY;
let flameWidth;

//background canvas
let backgroundCanvas = function(p, parentDiv){
    p.preload = function(){
        backgroundWidth = document.getElementById("mainMain").offsetWidth;
        backgroundHeight = document.getElementById("mainMain").offsetHeight;
    }
    p.setup = function(){
        let backgroundCanvas = p.createCanvas(backgroundWidth, backgroundHeight);
        backgroundCanvas.id("backgroundCanvas");
        backgroundCanvas.parent(parentDiv);
        //console.log(backgroundWidth, backgroundHeight);
        p.background(0);
    }
    
    p.draw = function(){
        p.background(0);
        flameCounter = int(random(30)); //<--change number to edit flame generation speed
        if (flameCounter == 1){
            //randomly decides new flame tip coordinates
            flameTipX = int(p.random(backgroundWidth));
            flameTipY = int(p.random(backgroundHeight));
            flameWidth = int(p.random(40,300));
            
            //console.log(flameTipX, flameTipY, flameWidth);
            
            //spawns new flame
            flameList.push(new Flame(p, flameTipX, flameTipY, flameWidth, backgroundHeight, 5));
        }
        
        for (let i = 0; i < flameList.length; i++){
            flameList[i].display();
            flameList[i].move();
            //console.log(flameList[i].tipX, flameList[i].tipY, flameList[i].width);
            if (flameList[i].direction == -1 && flameList[i].currentTipY < 0){
                p.flameList.splice(i, 1);
            }
        }
    }
}

let bg = new p5 (backgroundCanvas, "backgroundHolder");