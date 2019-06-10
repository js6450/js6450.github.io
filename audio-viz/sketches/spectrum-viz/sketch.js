let mic;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
  
  colorMode(HSB, 360, 100, 100, 100);

  background(0, 0, 100);
}

function draw() {

  let spectrum = fft.analyze();

  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);

  for (let i = 0; i < spectrum.length; i++) {
    if(spectrum[i] > 10){
      let y = map(spectrum[i], 0, 255, 0, width / 2);
      let h = map(i, 0, spectrum.length, 0, 360);
      let alpha = map(spectrum[i], 0, 255, 0, 15);

      strokeWeight(0.1);
      stroke(h, 80, 80, alpha);
      line(0, 0, 0, y);
      noStroke();
      fill(h, 80, 100, 5);
      ellipse(0, y, 5, 5);
    }
  }
}