const BROJ_CIGLI = 50;
const POC_BRZINA_LOPTICE = 3;
const BRZINA_PODLOGE = 10;
const UBRZAVANJE = 0.2;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
let bricks = [];
var player;
var ball;
let gameStarted = false;
let keyPressed = {};
let playerScore = 0;
let hitSound = new Audio("sounds/mjau.mp3");
let loseSound = new Audio("sounds/lose.mp3");
let winSound = new Audio("sounds/yippe.mp3");

document.addEventListener("keydown", (key) => {
    if (key.code === "ArrowLeft") {
        keyPressed["Left"] = true;
    } 
    if (key.code === "ArrowRight") {
        keyPressed["Right"] = true;
    }
});
document.addEventListener("keyup", (key) => {
    if (key.code === "ArrowLeft") {
        keyPressed["Left"] = false;
    } 
    if (key.code === "ArrowRight") {
        keyPressed["Right"] = false;
    }
});

mainMenu();

function mainMenu(){
    ctx.font= "bold 36px Verdana";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BREAKOUT", 550, 275);

    ctx.font= "italic bold 18px Verdana";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Press SPACE to begin", 550, 285);
    document.addEventListener("keydown", (key) => {
        if (key.code === "Space" && !gameStarted) {
            myGame.clear();
            startGame();
            gameStarted = true;
        }
    });
}

function startGame(){
    playerScore = 0;
    bricks = [];
    ball = new ball(535, 470, 30, "#ffffffff");
    player = new bat(475, 500, 180, 30, "#858585ff", ball);
    for (let i=0;i<10;i++){
        bricks.push(new brick(20 + i*108, 80, 90, 30, "#993300", ball));
    }
    for (let i=0;i<10;i++){
        bricks.push(new brick(20 + i*108, 130, 90, 30, "#ff0000", ball));
    }
    for (let i=0;i<10;i++){
        bricks.push(new brick(20 + i*108, 180, 90, 30, "#ff99cc", ball));
    }
    for (let i=0;i<10;i++){
        bricks.push(new brick(20 + i*108, 230, 90, 30, "#00ff00", ball));
    }
    for (let i=0;i<10;i++){
        bricks.push(new brick(20 + i*108, 280, 90, 30, "#ffff99", ball));
    }
    myGame.start();
}
function brick(x, y, width, height, color) {
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.color=color;
    this.create = function(){
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.update = function(index) {
        if(!this.hasCollided())
            this.create();
        else{
            hitSound.play();
            playerScore+=1;
            bricks.splice(index, 1);
        }
    }
    this.hasCollided = function() {
        let hitVertical = false;
        let hitHorizontal = false;
        if ((ball.x+ball.width) > this.x && ball.x < this.x && ball.y < (this.y + this.height) && ball.y > (this.y - ball.width)) { //dotaknuo lijevi rub cigle
            hitVertical = true;
        }
        if((ball.x + ball.width) > (this.x + this.width) && ball.x < (this.x + this.width) && ball.y < (this.y + this.height) && ball.y > (this.y - ball.width)){ //dotaknuo desni rub cigle
            hitVertical = true;
        }
        if((ball.y + ball.width)>this.y && ball.y < this.y && ball.x > (this.x - ball.width) && ball.x < (this.x + this.width)){ //dotaknuo gornji rub cigle
            hitHorizontal = true;
        }
        if((ball.y + ball.width)> (this.y + this.height) && ball.y < (this.y + this.height) && ball.x > (this.x - ball.width) && ball.x < (this.x + this.width)){ //dotaknuo donji rub cigle
            hitHorizontal = true;
        }
        if (hitHorizontal){
            ball.changeYDirection();
        }
        if (hitVertical){
            ball.changeXDirection();
        }
        if (hitHorizontal && hitVertical){
            ball.speed+=UBRZAVANJE;
        }
        return (hitVertical||hitHorizontal)
    }
    this.create();
}

function ball(x, y, width, color){
    this.x=x;
    this.y=y;
    this.width=width;
    this.color=color;
    this.speed=POC_BRZINA_LOPTICE;
    this.n = Math.random() * 100;
    this.n<50 ? this.n=1:this.n=-1;
    this.m = -1;
    this.create = function() {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.width);
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.width);
    }
    this.newPos = function() {
        if (this.x<=5 || this.x >= (1100-this.width-5)){
            this.changeXDirection();
        }
        if (this.y<=5){
            this.changeYDirection();
        }
        this.x = this.x + this.n*this.speed
        this.y = this.y + this.m*this.speed
    }
    this.changeXDirection = function() {
        this.n*=-1;
    }
    this.changeYDirection = function () {
        this.m*=-1;
    }
    this.update = function() {
        ctx.save();
        this.create();
        ctx.restore();
    }
    this.create();
}

function bat(x, y, width, height, color, ball){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.color=color;
    this.speed=BRZINA_PODLOGE;
    this.create = function(){
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if (this.x>6){
            if (keyPressed["Left"] && gameStarted){
                this.x = this.x - this.speed;
            }
        }
        if (this.x<(1100-this.width-6)){
            if (keyPressed["Right"] && gameStarted){
                this.x = this.x + this.speed;
            }
        }
        if((ball.y + ball.width)>this.y && ball.y < this.y && ball.x > (this.x - ball.width) && ball.x < (this.x + this.width)){ //dotaknuo gornji rub cigle
            ball.changeYDirection();
        }
    }
    this.update = function() {
        ctx.save();
        this.create();
        ctx.restore();
    }
    this.create()
}
function score(){
    ctx.shadowBlur = 0;
    ctx.font= "20px Verdana";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(playerScore.toString(), 20, 20);

    ctx.font= "20px Verdana";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "right";
    ctx.fillText(BROJ_CIGLI.toString(), 1000, 20);
}

var myGame = {
    start : function() {
        this.frameNo = 0;
        this.interval = setInterval(updateGame, 20);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        ctx.clearRect(0, 0, 1100, 550);
    }
}

function updateGame() {
    myGame.clear();
    ball.newPos();
    ball.update();
    for (let i = bricks.length - 1; i >= 0; i--){
        bricks[i].update(i);
    }
    player.newPos();
    player.update();
    score();
    if(ball.y + ball.width > 550){
        myGame.stop();
        myGame.clear();
        loseSound.play();
        gameOver();
    }
    if(playerScore==BROJ_CIGLI){
        myGame.stop();
        myGame.clear();
        winSound.play();
        congratulations();
    }
}

function gameOver(){
    ctx.shadowBlur = 0;
    ctx.font= "bold 40px Verdana";
    ctx.fillStyle = "#fff200ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", 550, 275);
    highScoreDisplay();
}

function congratulations(){
    ctx.shadowBlur = 0;
    ctx.font= "bold 40px Verdana";
    ctx.fillStyle = "#fff200ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CONGRATULATIONS", 550, 275);
    highScoreDisplay();
}

function highScoreDisplay(){
    if (typeof (Storage) !== "undefined") {
        if(localStorage.highScore){
            if (playerScore>localStorage.highScore)
                localStorage.highScore=playerScore;
        }else{
            localStorage.highScore=playerScore;
        }
        ctx.font= "bold 18px Verdana";
        ctx.fillStyle = "#ffffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Najbolji rezultat: " + localStorage.highScore.toString(), 550, 300);
    }
}
