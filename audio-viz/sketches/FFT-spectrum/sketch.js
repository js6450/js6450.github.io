let mic;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
  
  noStroke();
}

function draw() {
  background(0, 15);

  let spectrum = fft.analyze();

  fill(255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    
    ellipse(x, y, 5, 5);
  }
}