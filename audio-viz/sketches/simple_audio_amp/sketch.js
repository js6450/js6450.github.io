let sound;
let amp;

function preload() {
    sound = loadSound('../audio/0.mp3');
}
function setup() {
    createCanvas(windowWidth, windowHeight);

    amp = new p5.Amplitude();
    noStroke();
}

function draw() {
    if (sound.isPlaying() == true) {
        background(0, 30);
    } else {
        background(255);
    }

    let level = amp.getLevel();
    ellipse(width / 2, height / 2, level * 500, level * 500);
}

function mousePressed() {
    if (sound.isPlaying() == true) {
        sound.pause();
    } else {
        sound.play();
    }
}