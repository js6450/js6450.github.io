let mic;
let fft;

let spectrumX = 0;
let spectrumY = 0;

let spectrumSpeed = 2;

let skyLayer;

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  skyLayer = createGraphics(width, height);

  skyLayer.colorMode(HSB, 360, 100, 100, 100);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0, 0, 0, 15);

  let waveform = fft.waveform();
  let spectrum = fft.analyze();

  spectrumX += spectrumSpeed;
  spectrumY = noise(frameCount * 0.001) * height / 2;

  if(spectrumX > width || spectrumX < 0){
    spectrumSpeed *= -1;
  }

  for(let i = 0; i < spectrum.length; i++){

    let spectrumHeight = map(spectrum[i], 0, 255, 0, height / 2);

    let h = map(spectrum[i], 0, 255, 0, 360);
    skyLayer.strokeWeight(0.1);
    skyLayer.stroke(int(h), 100, 100, 5);
    skyLayer.line(spectrumX, spectrumY, spectrumX, spectrumY - spectrumHeight);
  }

  image(skyLayer, 0, 0);

  for (let i = 0; i < waveform.length; i += 10) {

    let x = map(i, 0, waveform.length, -25, width + 25);
    let y = map(waveform[i] * 2, -1, 1, height / 4 * 3, height / 2);

    let h = map(waveform[i], -1, 1, 150, 290);
    noStroke();
    fill(int(h), 100, 100, 10);
    rect(x, y, 50, height / 2, 20);
  }

  console.log(mic.getLevel());

  if(mic.getLevel() > 0.02){

    for(let i = 0; i < 10; i++){
      fill(0, 0, 100, random(20, 80));
      ellipse(random(width), random(0, height / 4 * 3), random(3, 5), random(3, 5));
    }

  }
}