// Any global variables can be defined up here
var shipSprite;
var shipX;
var shipY;
var shipBulletsX = [];
var shipBulletsY = [];
var cooldown = 0;
const bulletCoolDown = 10;
const bulletSpeed = 15;
const shipSpeed = 10;

function preload() {
  shipSprite = loadImage('imgs/spaceshipsprite.png');
}

/*
    Code in the setup function will only be run once at the start of the animation
*/
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    shipX = width / 2;
    shipY = height / 2;
}

/*
    The draw function is executed once per frame.
*/
function draw() {
    // Update
    cooldown++;
    if (keys[LEFT_ARROW]) {
        shipX = shipX - shipSpeed;
    }
    if (keys[RIGHT_ARROW]) {
        shipX = shipX + shipSpeed;
    }
    if (keys[UP_ARROW]) {
        shipY = shipY - shipSpeed;
    }
    if (keys[DOWN_ARROW]) {
        shipY = shipY + shipSpeed;
    }
    if (keys[SPACE] && cooldown >= bulletCoolDown) {
        shipBulletsX.push(shipX);
        shipBulletsY.push(shipY);
        cooldown = 0;
    }

    for (let i = 0 ; i < shipBulletsY.length; i++) {
        shipBulletsY[i] -= bulletSpeed;
    }

    // Render
    background(0, 0, 0)
    fill(0, 255, 0);
    for (let i = 0; i < shipBulletsX.length; i++) {
        ellipse(shipBulletsX[i], shipBulletsY[i], 5, 5);
    }
    imageMode(CENTER);
    image(shipSprite, shipX, shipY, 50, 50);
}
