
// $(document).ready(function(){
//   console.log("ready");

//   sizeAndPos();
// });

// $(window).resize(function(){
//   sizeAndPos();
// });

// function sizeAndPos(){
//   var relSize = $(window).height();
//   var titleWidth = $(window).width() * 0.1;
//   $('#title').css({"width": titleWidth + "px", "height": "auto"});
//   if($(window).width() * 0.75 > $(window).height()){
//     relSize = $(window).width();
//     titleHeight = $(window).height() * 0.75;
//     $('#title').css({"width": "auto", "height": titleHeight + "px"});
//   }



//   var pSize = relSize * 0.018;
//   $('.project').css({"font-size": pSize + "px"});

//   var mLeft = ($(window).width() - $('#container').width()) / 2;
//   var mTop = ($(window).height() - $('#container').height()) / 2;
//   $('#container').css({"margin-top": mTop + "px"});
// }

var barSize = 5;
var bigBarSize = barSize * 3;
var hueStart, hueRange;
var titleWidth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  hueRange = random(0, 180);
  hueStart = random(hueRange, 360 - hueRange);

  titleWidth = 100;
}

function draw() {
  background(255, 15);
  for(var i = 0; i <= height; i += barSize){
    var h = sin((frameCount + i) * 0.01) * hueRange;
    var opacity = 50;
    if(random() < 0.005){
      opacity = 40;
    }
    var xOffset = 0;
    if(random() < 0.01){
      xOffset = random(10, width);
    }
    fill(hueStart + h, 30, 70, opacity);
    rect(0 + xOffset, i, width, barSize);
  }

  for(var i = 0; i <= height; i += barSize * 2){
    var h = sin((frameCount + i) * 0.01) * hueRange;
    var xOffset = sin((frameCount + i * 2) * 0.01) * titleWidth * 0.75 + noise(h) * titleWidth * 2;
    fill(hueStart + h, 30, 70, 60);
    rect(width / 2 + xOffset, i, width, barSize * 1.5);
  }

  for(var i = 0; i <= height; i += barSize * 4){
    var h = sin((frameCount + i) * 0.01) * hueRange;
    var xOffset = sin((frameCount + i * 2) * 0.01) * titleWidth * 0.5 + noise(h) * titleWidth * 2;
    fill(hueStart + h, 30, 70, 75);
    rect(width - titleWidth * 5 + xOffset, i, width, barSize * 3);
  }

  for(var i = 0; i <= height; i += barSize * 6){
    var h = sin((frameCount + i) * 0.01) * hueRange;
    var xOffset = sin((frameCount + i * 2) * 0.01) * titleWidth * 0.5 + noise(360 - h) * titleWidth * 0.5;
    fill(hueStart + h, 30, 70, 100);
    rect(width - titleWidth * 3 + xOffset, i, width, barSize * 5);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  saveFrames();
}