let mic;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //create & start an audio input
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(220);
  
  //get the level of amplitude of the mic
  let level = mic.getLevel();
  
  //draw ellipse in the middle of canvas
  //use value of level for the width and height of ellipse
  ellipse(width / 2, height / 2, level * width / 2, level * width / 2);
}