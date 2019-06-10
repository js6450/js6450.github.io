let mic;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0, 15);

  let waveform = fft.waveform();

  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);
  for (let i = 0; i < waveform.length; i++) {
    push();
    rotate(radians(i));
    let maxHeight = map(i, 0, waveform.length, 10, width / 2);
    let y = map(waveform[i], -1, 1, 0, maxHeight);

    stroke(0, 0, 100, 10);
    line(0, 0, 0, y);

    let h = map(waveform[i], -1, 1, 0, 360, 20);
    noStroke();
    fill(int(h), 100, 100);
    ellipse(0, y, 5, 5);
    pop();
  }
}