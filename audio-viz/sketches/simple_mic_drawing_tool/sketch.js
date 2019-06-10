let mic;

let x = 0;
let y = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //create & start an audio input
  mic = new p5.AudioIn();
  mic.start();

  background(0);
}

function draw() {  
  //get the level of amplitude of the mic
  let level = mic.getLevel();
  
  stroke(255, 50);
  fill(255, 10);
  //draw ellipse in the middle of canvas
  //use value of level for the width and height of ellipse
  ellipse(x, y, level * width / 2, level * width / 2);
  
  x += 2;
  
  if(x > width){
    x = 0;
    y += 50;
  }
  
  if(y > height){
    y = 0;  
  }
}