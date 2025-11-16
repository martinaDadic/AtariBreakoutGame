const BROJ_CIGLI = 50;
const POC_BRZINA_LOPTICE = 3;
const BRZINA_PODLOGE = 10;
const UBRZAVANJE = 0.2;

var c = document.getElementById("myCanvas"); //set up za canvas
var ctx = c.getContext("2d"); //kontekst
let bricks = []; //ovdje ce se spremati bricks objekti
var player; //ovo je podloga
var ball; //ovo je loptica, tj. kockica tehnički (kvadratić*)
let gameStarted = false;
let keyPressed = {};
let playerScore = 0; 
let hitSound = new Audio("sounds/mjau.mp3"); //zvukovi igri
let loseSound = new Audio("sounds/lose.mp3");
let winSound = new Audio("sounds/yippe.mp3");

 //event listeneri koji prate je li igrač drži lijevu tj. desnu strelicu
document.addEventListener("keydown", (key) => { //ako pritisnu
    if (key.code === "ArrowLeft") {
        keyPressed["Left"] = true;
    } 
    if (key.code === "ArrowRight") {
        keyPressed["Right"] = true;
    }
});
document.addEventListener("keyup", (key) => { //promijeni u false ako ne drže više
    if (key.code === "ArrowLeft") {
        keyPressed["Left"] = false;
    } 
    if (key.code === "ArrowRight") {
        keyPressed["Right"] = false;
    }
});

mainMenu(); //pokreće glavni menu igre

function mainMenu(){
    //definiranje fonta i ostalih vrijednosti
    ctx.font= "bold 36px Verdana";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BREAKOUT", 550, 275); //ispisuje breakout

    ctx.font= "italic bold 18px Verdana";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Press SPACE to begin", 550, 285); //ispisuje press space to begin
    document.addEventListener("keydown", (key) => {
        if (key.code === "Space" && !gameStarted) { //prati je li pritisnut space da moze zapoceti igra
            myGame.clear();
            startGame();
            gameStarted = true;
        }
    });
}

function startGame(){
    playerScore = 0; //resetira score
    bricks = [];
    ball = new ball(535, 470, 30, "#ffffffff"); //stvara objekt kvadratića
    player = new bat(475, 500, 180, 30, "#858585ff", ball); //stvara objekt podloge
    for (let i=0;i<10;i++){ //stvara 10 smeđih cigli
        bricks.push(new brick(20 + i*108, 80, 90, 30, "#993300", ball));
    }
    for (let i=0;i<10;i++){ //stvara 10 crvenih cigli
        bricks.push(new brick(20 + i*108, 130, 90, 30, "#ff0000", ball));
    }
    for (let i=0;i<10;i++){ //stvara 10 rozih cigli
        bricks.push(new brick(20 + i*108, 180, 90, 30, "#ff99cc", ball));
    }
    for (let i=0;i<10;i++){ //stvara 10 zelenih cigli
        bricks.push(new brick(20 + i*108, 230, 90, 30, "#00ff00", ball));
    }
    for (let i=0;i<10;i++){ //stvara 10 žutih cigli
        bricks.push(new brick(20 + i*108, 280, 90, 30, "#ffff99", ball));
    }
    myGame.start();
}
function brick(x, y, width, height, color) {
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.color=color; //spremanje svih vrijednosti
    this.create = function(){ //funkcija za iscrtavanje oblika
        ctx.shadowBlur = 10; //sjencanje
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.update = function(index) {
        if(!this.hasCollided()) //ako se nije sudario s lopticom, ponovo iscrtaj, ako je ne iscrtavaj
            this.create();
        else{
            hitSound.play(); //svira zvuk udara
            playerScore+=1; //povećava se score
            bricks.splice(index, 1); //briše ciglu iz bricks da se ne iscrtava
        }
    }
    this.hasCollided = function() { //funkcija koja provjerava je li se loptica sudarila s ciglom
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
        if (hitHorizontal){ //ako je udario gornji ili donji rub, mijenja se y smjer
            ball.changeYDirection();
        }
        if (hitVertical){ //ako lijevi ili desni, mijenja se x smjer
            ball.changeXDirection();
        }
        if (hitHorizontal && hitVertical){ //ako oboje kuglica se ubrzava
            ball.speed+=UBRZAVANJE;
        }
        return (hitVertical||hitHorizontal) //vraca true ako su se sudarili
    }
    this.create();
}

function ball(x, y, width, color){
    this.x=x;
    this.y=y;
    this.width=width;
    this.color=color;
    this.speed=POC_BRZINA_LOPTICE; //stavlja pocetnu brzinu loptice
    this.n = Math.random() * 100;
    this.n<50 ? this.n=1:this.n=-1; //random broj 1 ili -1 koji određuje početni x smjer loptice
    this.m = -1; //pocetni y smjer
    this.create = function() { //iscrtavanje
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.width);
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.width);
    }
    this.newPos = function() { //funkcija koja racuna novu poziciju
        if (this.x<=5 || this.x >= (1100-this.width-5)){ //ako je sudar sa zidom (lijevi i desni)
            this.changeXDirection();
        }
        if (this.y<=5){ //ako je sudar sa zidom (gornji)
            this.changeYDirection();
        }
        this.x = this.x + this.n*this.speed //pomicanje pod kutom od 45 stupnjeva (x i y se povecavaju linearno)
        this.y = this.y + this.m*this.speed
    }
    this.changeXDirection = function() { //funkcija za mijenjanje smjera
        this.n*=-1;
    }
    this.changeYDirection = function () { //funkcija za mijenjanje smjera
        this.m*=-1;
    }
    this.update = function() { //ponovo isrtavanje oblika na novoj lokaciji
        ctx.save(); //sprema se kontekst
        this.create();
        ctx.restore(); //pa se vraća
    }
    this.create();
}

function bat(x, y, width, height, color, ball){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.color=color;
    this.speed=BRZINA_PODLOGE; //brzina pomicanja lijevo-desno
    this.create = function(){
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if (this.x>6){ //ako nije na skroz lijevoj poziciji
            if (keyPressed["Left"] && gameStarted){ //ako je pritisnuta lijeva strelica ovaj frame
                this.x = this.x - this.speed; //micanje ulijevo
            }
        }
        if (this.x<(1100-this.width-6)){ //ako nije na skroz desnoj poziciji
            if (keyPressed["Right"] && gameStarted){ //ako je pritisnuta desna strelica ovaj frame
                this.x = this.x + this.speed; //micanje udesno
            }
        }
        if((ball.y + ball.width)>this.y && ball.y < this.y && ball.x > (this.x - ball.width) && ball.x < (this.x + this.width)){ //dotaknuo gornji rub cigle
            ball.changeYDirection(); //ako je kolizija loptice i podloge, loptica se odbija
        }
    }
    this.update = function() {
        ctx.save(); //isto kao za ball
        this.create();
        ctx.restore();
    }
    this.create()
}
function score(){ //ispisivanje trenutnog i maksimalnog rezultata
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
        this.interval = setInterval(updateGame, 20); //poziva updateGame svako 20ms
    },
    stop : function() {
        clearInterval(this.interval); //zaustavlja zvanje updateGame
    },
    clear : function() {
        ctx.clearRect(0, 0, 1100, 550); //resetira canvas, tj. brise sadrzaj sa njega
    }
}

function updateGame() {
    myGame.clear(); //brisemo sve, da bi mogli ponovo iscrtati sljedeci okvir
    ball.newPos(); //racunamo nove pozicije lopte i ponovo ih iscrtajemo
    ball.update();
    for (let i = bricks.length - 1; i >= 0; i--){ //zovemo od nazad jer se brišu
        bricks[i].update(i); //za svaku ciglu zovemo update
    }
    player.newPos(); //racunamo nove pozicije podloge i ponovo ih iscrtajemo
    player.update();
    score(); //ispis trenutnog i max scorea
    if(ball.y + ball.width > 550){ //ako je lopta takla dno ekrana
        myGame.stop(); //zaustavljamo igru
        myGame.clear(); //resettiramo canvas
        loseSound.play(); //pusta se zvuk za gubitak
        gameOver(); //igra zavrsava i ispisuje se rezultat
    }
    if(playerScore==BROJ_CIGLI){ //ako smo razbili sve cigle
        myGame.stop(); 
        myGame.clear();
        winSound.play(); //pusta se zvuk pobjede
        congratulations(); //igra zavrsava i ispisuje se rezultat
    }
}

function gameOver(){
    ctx.shadowBlur = 0;
    ctx.font= "bold 40px Verdana";
    ctx.fillStyle = "#fff200ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", 550, 275); //ispis game over
    highScoreDisplay(); //ispisuje se najbolji rezultat
}

function congratulations(){
    ctx.shadowBlur = 0;
    ctx.font= "bold 40px Verdana";
    ctx.fillStyle = "#fff200ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CONGRATULATIONS", 550, 275); //ispis congratulations
    highScoreDisplay(); //ispisuje se najbolji rezultat
}

function highScoreDisplay(){
    if (typeof (Storage) !== "undefined") { //ako website podrzaje local storage
        if(localStorage.highScore){
            if (playerScore>localStorage.highScore) //ako je trenutni score bolji od prethodnog najboljeg, promijeni ga
                localStorage.highScore=playerScore;
        }else{
            localStorage.highScore=playerScore; //ako nema zapisa zapisi trenutni score
        }
        ctx.font= "bold 18px Verdana";
        ctx.fillStyle = "#ffffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Najbolji rezultat: " + localStorage.highScore.toString(), 550, 300); //ispis najboljeg rezultata
    }
}
