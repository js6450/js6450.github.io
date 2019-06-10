let sound;

function preload() {
    sound = loadSound('../audio/0.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    if (sound.isPlaying() == true) {
        background(255, 0, 0);
    } else {
        background(0, 0, 255);
    }
}

function mousePressed() {
    if (sound.isPlaying() == true) {
        sound.pause();
    } else {
        sound.play();
    }
}