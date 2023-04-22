// board / canvas

let board = null;
let boardWidth = 360;
let boardHeight = 640;
let context;

// when page loads

window.onload = function(){
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d') // used for drawing on the board

// now we want to draw the flappy bird here as well on load 
   // context.fillStyle = 'green';
   // context.fillRect(bird.x, bird.y, bird.width, bird.height);  
    birdImg = new Image() 
    birdImg.src="./flappybird.png"
    birdImg.onload = function(){ // calling a function when image loadd - display it!
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 
       }
    // lets load pipe images and bottom pipe images load

    topPipeImg = new Image();
    topPipeImg.src="./toppipe.png"
    bottomPipeImg = new Image();
    bottomPipeImg.src="./bottompipe.png";
    
    setInterval(placePipes,1500); // its going to call these pipes every 1.5s

    requestAnimationFrame(update);// function which calls back function to update                       
    document.addEventListener('keydown',moveBird); // when u tap on a key will call this function which is defined below
}   

//variables for bird 

let birdHeight = 24;
let birdWidth = 34;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;


let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
} 
// MAIN GAME loop
// this function will re-draw the image repeatedly, pull more frames (2nd step), 
// before that get background image and bird to load on screen 
function update(){
requestAnimationFrame(update);
if (gameOver){
    return;
}
context.clearRect(0,0,board.width, board.height);// everytime we re-draw 
//on canvas we want to clear ALL of the previous frame, otherwise frames will stack up on each other

// draw bird over over again but with gravity 
velocityY+=gravity
bird.y =Math.max(bird.y + velocityY,0);//either apply gravity to bird or make sure it cannot reach top of canvas
context.drawImage(birdImg,bird.x,bird.y,bird.width, bird.height);

if (bird.y >board.height){
    gameOver = true;
}
// lets add the pipes 
for (let i=0; i<pipeArray.length; i++){
    let pipe =pipeArray[i];
    pipe.x += velocityX;
    //before we draw the pipe we are going to update its x position shown above 
    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width, pipe.height)

    if (!pipe.passed && bird.x > pipe.x + pipe.width){ // basically if pipe passed is true and bird x position has passed the pipe x position + the width of the pipe then increment score
        score+= 0.5; // by 0.5 as their are two pipes so each time bird passes then will be +1
        pipe.passed = true // so it does not keep counting on infinite loop  
    }
    if (detectCollision(bird, pipe) )
    gameOver = true;
} 

// lets remove the pipes when they pass the bird using a while condition
while(pipeArray.length > 0 && pipeArray[0].x <-pipeWidth){
pipeArray.shift()// removes first element of array (first pipe)

}

//score
context.fillStyle ='white';
context.font = "45px sans-serif";
context.fillText(score,5,45);
if (gameOver){
    context.fillText("GAME OVER", 5, 90);
     
}
}

// variables for the pipes 
let pipeArray =[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

function placePipes() {
    if (gameOver){
        return;
    }
    //lets randomise the number Y on each iteration 1.5s 
    let randomPipeY = Math.floor(Math.random()*(-pipeHeight/4))+ -pipeHeight/6;
    let openingSpace = board.height/4; 
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY, // link it to the array RandomPipeY
        width: pipeWidth,
        height: pipeHeight,
        passed: false,// checks if bird has passed this object yet 

    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY +pipeHeight+openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,

    }

    pipeArray.push(bottomPipe);

}

// we want pipes to move left with negative velocity X
let velocityX =-2; //pipes moving left speed
//lets make the bird jump and give it velocity y
let velocityY = 0; 

function moveBird(e)// e is the keyEvent 
{
    if (e.code == "Space" || e.code == "ArrowUp"){

        // make bird jump 
        velocityY = -6;
    }
    // reset the game 
    if  (gameOver){
        bird.y = birdY;
        pipeArray =[];
        score = 0;
         gameOver = false // back to default starting state 
    }
}

// add gravity 
let gravity =0.2 ;

// collision function 

function detectCollision(a,b){
    return a.x <  b.x + b.width &&
    a.x + a.width > b.x &&
    a.y <b.y+ b.height &&
    a.y + a.height > b.y

}

let gameOver = false;
let score =0; 