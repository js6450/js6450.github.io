let soundIn;
let soundInStarted = false;
let fft;
let amp;

let scene = 1;

let flowers = [];
let fId = 0;
let flowerParticles = [];
let lastFlowerChange = 0;

let r = 0;
let g = 0;
let b = 0;

let rains = [];
let rainDirection = 0;

let bgColors = [
    [0, 0, 0],
    [203, 27, 69],
    [0, 0, 0],
    [102, 186, 183],
    [0, 0, 0],
    [138, 107, 190],
    [0, 0, 0],
    [27, 129, 62],
    [0, 0, 0],
    [247, 217, 76]
];

async function startInput(){
    try{
        soundIn = new p5.AudioIn();
        soundIn.start();
        soundInStarted = true;

        fft = new p5.FFT();
        fft.setInput(soundIn);
        amp = new p5.Amplitude();
        amp.setInput(soundIn);
    }catch(err){
        console.log(err);
    }
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);

    // sound = new p5.AudioIn();

    for(let i = 1; i < 9; i++){
        flowers.push(createVideo('assets/flower-0' + i + '.mp4'));
        flowers[i - 1].hide();
    }

    for(let i = 0; i < 100; i++){
        //particles.push(new Flower(int(random(flowers.length))));

        flowerParticles.push(new Flower(fId));
    }

    for(let i = 0; i < 50; i++){
        rains.push(new Rain());
    }

    rectMode(CENTER);
    noStroke();

    background(0);
}

function mousePressed(){
    startInput();

    for(let i = 0; i < flowers.length; i++){
        flowers[i].loop();
    }
}

function draw(){

    if(soundInStarted){
        background(r, g, b, 30);

        if(scene == 1){
            let waves = fft.waveform();

            for(let i = 0; i < waves.length; i += int(waves.length * 0.1)){
                let x = map(i, 0, waves.length, 0, width) + noise(waves[i]) * 10;
                let y = map(waves[i], -1, 1, height / 2 - 100, height / 2 + 100) + sin(frameCount * 0.05 * waves[i]) * 100;
                let r = map(abs(waves[i]), 0, 1, 10, 500);
                fill(255, 150);
                ellipse(x, y, r, r);
                fill(255, 100);
                ellipse(x, y + random(-y, y), 15, 15);
                ellipse(x, y + random(-y, y), 10, 10);
                ellipse(x, y + random(-y, y), 5, 5);
            }

            if(random() < 0.01){
                let colorIndex = int(random(bgColors.length));
                r = bgColors[colorIndex][0];
                g = bgColors[colorIndex][1];
                b = bgColors[colorIndex][2];
            }
        }

        if(scene == 2){
            let spectrum = fft.analyze();

            push();
            translate(width / 2, height / 2);
            for(let i = 0; i < spectrum.length; i += 10){
                let r = map(i, 0, spectrum.length, 0, PI * 3 + cos(frameCount * 0.01) * PI);
                let h = map(spectrum[i], 0, 255, height - 100 + sin(frameCount * 0.02) * 100 , 0);
                push();
                rotate(r + frameCount * 0.01);
                let alpha = map(spectrum[i], 0, 255, 0, 255);
                fill(255, alpha);
                rect(0, 0, 10, h);
                pop();
            }
            pop();

            for(let i = 0; i < rains.length; i++){
                rains[i].update();
                rains[i].display();
            }

            if(random() < 0.01){
                let colorIndex = int(random(bgColors.length));
                r = bgColors[colorIndex][0];
                g = bgColors[colorIndex][1];
                b = bgColors[colorIndex][2];
            }

            if(random() < 0.01){
                rainDirection = random(-0.02, 0.02);
            }
        }

        if(scene == 3){

            r = 0;
            g = 0;
            b = 0;

            let level = amp.getLevel();

            console.log(level)

            if(level > 0.1 && millis() - lastFlowerChange > 1000){
                console.log("change");

                fId = int(random(flowers.length));

                for(let i = 0; i < flowerParticles.length; i++){
                    let f = flowerParticles[i];
                    f.xpos = random(-100, width + 100);
                    f.ypos = random(-100, height + 100);
                    f.s = random(0.25, 1.5);
                }

                lastFlowerChange = millis();

            }

            for(let i = 0; i < flowerParticles.length; i++){
                flowerParticles[i].flowerId = fId;
                flowerParticles[i].display();
            }
        }

        if(scene == 4){

            let level = amp.getLevel();

            r = g = b = level * 255;

            for(let i = 0; i < rains.length; i++){
                rains[i].update();
                rains[i].display();
            }

            if(random() < 0.01){
                rainDirection = random(-0.02, 0.02);
            }
        }
    }
}


function keyPressed(){
    if(!isNaN(key)){
        scene = key;
        console.log("scene", scene);
    }
}

class Flower{
    constructor(id){
        this.flowerId = id;
        this.xpos = random(-100, width + 100);
        this.ypos = random(-100, height + 100);
        this.s = random(0.25, 1.5);

        //this.xSpeed = random(0, )
    }

    update(){

    }

    display(){
        push();
        scale(this.s);
        image(flowers[this.flowerId], this.xpos, this.ypos);
        pop();
    }
}

class Rain{
    constructor(){
        this.xpos = random(width);
        this.ySpeed = random(10, 25);
        this.w = random(2, 10);
        this.h = random(20, 50);
        this.ypos = - this.h * 2;
    }

    update(){
        this.ypos += this.ySpeed;

        if(this.ypos > height + this.h * 2){
            this.xpos = random(width);
            this.ySpeed = random(10, 25);
            this.w = random(2, 10);
            this.h = random(20, 50);
            this.ypos = - this.h * 2;
        }
    }

    display(){
        push();
        rotate(rainDirection);
        fill(255, 100);
        rect(this.xpos, this.ypos, this.w, this.h);
        pop();
    }
}