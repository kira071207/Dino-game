let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Game Over assets
let gameOverTag = new Image();
gameOverTag.src = "./Images/game-over.png";

let retryButton = new Image();
retryButton.src = "./Images/reset.png";

// Dino
let dinoImg = new Image();
dinoImg.src = "./Images/dino.png";

let dinoDeadImg = new Image();
dinoDeadImg.src = "./Images/dino-dead.png";

let dinoRun1 = new Image();
dinoRun1.src = "./Images/dino-run1.png";

let dinoRun2 = new Image();
dinoRun2.src = "./Images/dino-run2.png";

let dinoWidth = 68;
let dinoHeight = 74;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight - 12;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
    isDucking : false
};

// Track
let trackImg = new Image();
trackImg.src = "./Images/track.png";

let trackArray = [];
let trackHeight = 24;
let trackY = boardHeight - trackHeight;

// Cactus
let cactus1Img = new Image();
cactus1Img.src = "./Images/cactus1.png";

let cactus2Img = new Image();
cactus2Img.src = "./Images/cactus2.png";

let cactus3Img = new Image();
cactus3Img.src = "./Images/cactus3.png";

let cactusArray = [];
let cactusHeight = 70;
let cactusX = 700;

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 98;

// Bird
let bird1Img = new Image();
bird1Img.src = "./Images/bird1.png";

let bird2Img = new Image();
bird2Img.src = "./Images/bird2.png";

let birdArray = [];
let birdWidth = 67;

// Physics
let velocityX = -8;
let birdVelocityX = -6;
let velocityY = 0;
let gravity = 0.4;

// Game State
let gameOver = false;
let score = 0;
let run = 0;
let birdFrameToggle = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

trackArray.push({ x: 0, y: trackY });
trackArray.push({ x: boardWidth, y: trackY });

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    setInterval(abird, 6000);
    setInterval(() => run = run === 0 ? 1 : 0, 200);
    setInterval(() => birdFrameToggle = birdFrameToggle === 0 ? 1 : 0, 200);
    setInterval(clouds, 2000);
    setInterval(() => duckToggle = duckToggle === 0 ? 1 : 0 , 100);

    document.addEventListener("keydown", moveDino);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        context.drawImage(gameOverTag, boardWidth / 2 - 150, boardHeight / 2 - 75, 300, 25);
        context.drawImage(retryButton, boardWidth / 2 - 25, boardHeight / 2, 50, 40);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    for(let i = 0; i < cloudArray.length; i++){
        let cloud = cloudArray[i];
        cloud.x += velocityX/2;
        context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height)
    }


    // Track
    for (let i = 0; i < trackArray.length; i++) {
        let track = trackArray[i];
        track.x += velocityX;
    
        if (track.x + boardWidth <= 0) {
            track.x = boardWidth;
        }
    
        context.drawImage(trackImg, track.x, track.y, boardWidth, trackHeight);
    }

    // Physics
    velocityY += gravity;
    dino.y += velocityY;

    // Ground collision
    if (dino.y > dinoY) {
        dino.y = dinoY;
        velocityY = 0;
    }

    // Dino
    if (dino.isDucking && dino.y === dinoY) {
        dino.width = duckWidth;
        dino.height = duckHeight;
        let currentDuck = (duckToggle === 0) ? duck : duck2;
        context.drawImage(currentDuck, dino.x, dino.y + (dinoHeight - duckHeight), dino.width, dino.height);
    } else {
        dino.width = dinoWidth;
        dino.height = dinoHeight;
        let currentDino = (run === 0) ? dinoRun1 : dinoRun2;
        context.drawImage(currentDino, dino.x, dino.y, dino.width, dino.height);
    }

    // Cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
        }
    }

    // Bird
    for (let i = 0; i < birdArray.length; i++) {
        let bird = birdArray[i];
        bird.x += birdVelocityX;
        let currentBird = (birdFrameToggle === 0) ? bird1Img : bird2Img;
        context.drawImage(currentBird, bird.x, bird.y, bird.width, bird.height);

        if (detectCollision(dino, bird)) {
            gameOver = true;
        }
    }

    // Score
    context.fillStyle = "black";
    context.font = "20px Courier";
    score++;
    context.fillText(score, 5, 20);
}


document.addEventListener("keydown", (e) => {
        if (gameOver && e.code === "Enter") {
            window.location.reload();
            return;
        }
        if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
            velocityY = -9;
        }
        if(e.code === "ArrowDown"){
            dino.isDucking = true;
        }
    })
document.addEventListener("keyup", (e) => {
    if(e.code === "ArrowDown"){
        dino.isDucking = false;
    }
})
    


function placeCactus() {
    if (gameOver) return;

    let cactus = {
        img: null,
        x: cactusX,
        y: boardHeight - cactusHeight,
        width: null,
        height: cactusHeight
    };

    let chance = Math.random();
    if (chance > 0.9) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    } else if (chance > 0.7) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else if (chance > 0.5) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else {
        return;
    }

    cactusArray.push(cactus);
    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function abird() {
    if (gameOver) return;

    let bird = {
        x: boardWidth,
        y: Math.random() * (boardHeight - 150),
        width: birdWidth,
        height: 44
    };
    birdArray.push(bird);
    if (birdArray.length > 1) {
        birdArray.shift();
    }
}

function moveTrack() {
    let track = {
        x: boardWidth,
        y: trackY
    };
    trackArray.push(track);
    if (trackArray.length > 2) {
        trackArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

let duck = new Image();
duck.src = "./Images/dino-duck1.png"
let duckHeight = 60;
let duckWidth = 74;
let duck2 = new Image();
duck2.src = "./Images/dino-duck2.png"
duckToggle = 0;




let cloudImg = new Image()
cloudImg.src = "./Images/cloud.png"
let cloudWidth = 84;
let cloudHeight = 101;
let cloudX = Math.random()*(boardWidth -350)+750;
let cloudY = Math.random()*(boardHeight -150)+ 75
let cloudArray = [];


function clouds (){
    if (gameOver){
        return;
    }
  let cloud = {
   img : cloudImg,
   x : cloudX,
   y : cloudY,
   width : cloudWidth,
   height : cloudHeight
  } 
  cloudArray.push(cloud)

  if (cloudArray.length > 5){
    cloudArray.shift()
  }
}



   
        
     
