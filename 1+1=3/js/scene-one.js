let sound;

let drawingFireworks = false;
let drawingCircle = false;
let drawingWave = false;
let drawingBlobs = false;
let drawingAsteroid = false;
let drawingStars = false;

let minDia;

let blobs = [];
let bColors = [
    [244, 167, 184],
    [208, 16, 76],
    [232, 122, 144],
    [254, 223, 225],
    [203, 27, 69],
    [142, 53, 74],
    [253, 122, 119]
];

let sColors = [
    [217, 205, 144],
    [190, 194, 63],
    [177, 180, 121],
    [144, 180, 75],
    [181, 202, 160]
];

let sIndex;

let worldScale;

function setup() {
    createCanvas(windowWidth, windowHeight);

    for(let i = 0; i < 3; i++){
        let bIndex = int(random(bColors.length));
        blobs.push(new Blob(bColors[bIndex][0], bColors[bIndex][1], bColors[bIndex][2]));
    }

    minDia = width / 2;

    sound = new Sound();
    sIndex = int(random(sColors.length));

    background(0);
}

function draw() {

    if(sound.soundInStarted){

        background(0, sound.returnLevel() * 20 + 10);
        worldScale = map(sound.returnLevel(), 0, 1, 1, 0.3);

        if(drawingFireworks){
            sound.drawFireworks();
        }

        if(drawingCircle){
            sound.drawCircle();
        }

        if(drawingWave){
            sound.drawWave(252, 250, 242);
        }

        if(drawingBlobs){
            sound.getSpectrum();

            for(i = 0; i < blobs.length; i++){

                if(i % 3 == 0 && sound.high > 0){
                    blobs[i].alpha = 15;
                }

                if(i % 3 == 1 && sound.mid > 0){
                    blobs[i].alpha = 15;
                }

                if(i % 3 == 2 && sound.low > 0){
                    blobs[i].alpha = 15;
                }

                blobs[i].update();
                blobs[i].display();
            }
        }

        if(drawingAsteroid){
           sound.drawAsteroid();
        }

        if(drawingStars){
            sound.drawStars(sColors[sIndex][0], sColors[sIndex][1], sColors[sIndex][2]);
        }

    }
}

function mousePressed(){
    sound.startInput();
}

function keyPressed(){
    if(key == 0){
        drawingFireworks = !drawingFireworks;
    }
    if(key == 1){
        drawingCircle = !drawingCircle;
    }
    if(key == 2){
        drawingWave = !drawingWave;
    }
    if(key == 3){
        drawingBlobs = !drawingBlobs;
    }
    if(key == 'w'){
        if(blobs.length > 0){
            blobs.pop(blobs.length - 1);
        }
    }
    if(key == 'e'){
        if(blobs.length < 10){
            let bIndex = int(random(bColors.length));
            blobs.push(new Blob(bColors[bIndex][0], bColors[bIndex][1], bColors[bIndex][2]));
        }
    }
    if(key == 4){
        drawingAsteroid = !drawingAsteroid;
    }
    if(key == 5){
        drawingStars = !drawingStars;
    }
    if(key == 't'){
        sIndex = int(random(sColors.length));
    }
}

class Sound{
    constructor(){
        this.soundIn;
        this.fft;
        this.amp;
        this.soundInStarted = false;

        this.waveform = [];
        this.spectrum = [];
        this.low = 0;
        this.mid = 0;
        this.high = 0;
        this.level = 0;

        this.fireworks = [];
        this.fColors = [
            [123, 144, 210],
            [125, 185, 222],
            [225, 225, 225],
            [88, 178, 220],
            [81, 168, 221],
        ];

        this.asteroids = [];
        this.aColors = [
            [251, 226, 81],
            [250, 214, 137]
        ];
    }

    async startInput(){
        try{
            this.soundIn = new p5.AudioIn();
            this.soundIn.start();
            this.soundInStarted = true;

            this.fft = new p5.FFT();
            this.fft.setInput(this.soundIn);
            this.amp = new p5.Amplitude();
            this.amp.setInput(this.soundIn);
        }catch(err){
            console.log(err);
        }
    }

    getWaveform(){
        this.waveform = this.fft.waveform();
    }

    getSpectrum(){
        this.spectrum = this.fft.analyze();

        if(this.spectrum != null){
            this.low = 0;
            this.mid = 0;
            this.high = 0;
            for(let i = 0; i < this.spectrum.length; i++){

                let spec = this.spectrum[i];

                if(i < this.spectrum.length / 4){
                    this.low += spec;
                }

                if(i >= this.spectrum.length / 4 && i < this.spectrum.length / 2){
                    //console.log('mid');
                    this.mid = spec;
                }

                if(i >= this.spectrum.length / 2){
                    this.high += spec;
                }

            }

            this.low /= int(this.spectrum.length / 4);
            this.mid /= int(this.spectrum.length / 4);
            this.high /= int(this.spectrum.length / 2);

           // console.log(this.low + "," + this.mid + "," + this.high);
        }
    }

    returnLevel(){
        this.getLevel();
        return this.level;
    }

    getLevel(){
        this.level = this.amp.getLevel();
    }

    drawCircle(){
        this.getLevel();
        let dia = map(this.level, 0, 1, minDia, width * 3 / 4);
        noFill();
        stroke(255, 80);
        strokeWeight(10);
        ellipse(width / 2, height / 2, dia * worldScale, dia * worldScale);
    }

    drawFireworks(){
        this.getLevel();
        if(this.level > 0.1){
            let colorIndex = int(random(this.fColors.length));
            this.fireworks.push(new Firework(100, this.level, this.fColors[colorIndex][0], this.fColors[colorIndex][1], this.fColors[colorIndex][2]));
        }

        for(let i = 0; i < this.fireworks.length; i++){
            this.fireworks[i].update();
            this.fireworks[i].display();
        }

        for(let i = this.fireworks.length - 1; i >= 0; i--){
            if(this.fireworks[i].isDead){
                this.fireworks.pop(i);
            }
        }
    }

    drawStars(r, g, b){
        this.getLevel();
        this.getWaveform();

        if(this.level > 0.1){
            push();
            translate(width / 2, height / 2);
            for(let i = 0; i < this.waveform.length; i += 10){
                rotate(radians(i) + frameCount * 0.01);
                stroke(r, g, b, this.level * 30 + 30);
                strokeWeight(3);
                noFill();
                rect(0, 0, this.level * 5 + 5, this.waveform[i] * height);
            }
            pop();
        }
    }

    drawWave(r, g, b){
        this.getLevel();
        this.getWaveform();

        if(this.level > 0.1){
            push();
            translate(width / 2, height / 2);
            for(let i = 0; i < this.waveform.length; i += 10){
                rotate(radians(i) + frameCount * 0.01);
                stroke(r, g, b, this.level * 30 + 30);
                strokeWeight(3);
                noFill();
                rect(0, width / 2 * worldScale, this.level * 5 + 5, this.waveform[i] * height);
            }
            pop();
        }
    }

    drawAsteroid(){
        this.getLevel();
        if(this.level > 0.1 && this.asteroids.length < 200){
            for(let i = 0; i < 5; i++){
                let aIndex = int(random(this.aColors.length));
                //console.log(aIndex);
                this.asteroids.push(new Asteroid(this.level * 10, this.aColors[aIndex][0], this.aColors[aIndex][1], this.aColors[aIndex][2]));
            }

        }

        for(let i = 0; i < this.asteroids.length; i++){
            // if(this.asteroids[i].isDead){
            //     this.asteroids.pop(i);
            // }else{
               // console.log('here');
                this.asteroids[i].applyAttraction(createVector(width / 2, height / 2));
                this.asteroids[i].update();
                this.asteroids[i].display();
           // }
        }

        for(let i = this.asteroids.length - 1; i >= 0; i--){
            if(this.asteroids[i].isDead){
                this.asteroids.pop(i);
            }
        }

    }
}

class Asteroid{
    constructor(mass, r, g, b){


        let x = random(-200, width + 200);
        let y = random(-200, height + 200);

        while(dist(x, y, width / 2, height / 2) < width / 2){
            x = random(-100, width + 100);
            y = random(-100, height + 100);
        }

//        console.log('here');


        this.pos = createVector(x, y);

        this.mass = mass;

        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.r = r;
        this.g = g;
        this.b = b;

        this.lifeSpan = 1;
        this.lifeSpeed = 0.03;

        this.isDead = false;

        this.starsX = [];
        this.starsY = [];

        for(let i = 0; i < 5; i++){
            this.starsX.push(random(width));
            this.starsY.push(random(height));
        }

    }

    applyAttraction(other){
        // let distance = this.pos.dist(other);
        // let mag = (distance * distance) / (this.mass * ;

        let force = p5.Vector.sub(other, this.pos);
        force.normalize();
        //force.mult(mag);
        this.acc.add(force);
    }

    update(){
        if(this.lifeSpan > 0.01){
            this.lifeSpan -= this.lifeSpeed;
        }else{
            this.isDead = true;
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    display(){

       // console.log('draw');

        push();
        for(let i = 0; i < 5; i++){
            noStroke();
            fill(255, random() * 100);
            ellipse(this.starsX[i], this.starsY[i], random() * 3 + 2, random() * 3 + 2);
        }
        pop();

        push();
        translate(this.pos.x, this.pos.y);
        noStroke();
        fill(this.r, this.g, this.b, map(this.lifeSpan, 0, 1, 0, 80));
        ellipse(0, 0, this.mass * 10, this.mass * 10);
        pop();
    }

}

class Firework{

    constructor(x, level, r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
        this.x = x;
        this.size = map(level, 0, 1, 25, 100);
        this.level = level;
        this.lifeSpan = 1.0;
        this.lifeSpeed = map(level, 0, 1, 0.01, 0.03);
        this.isDead = false;
    }

    update(){
        if(this.lifeSpan > 0.001){
            this.lifeSpan -= this.lifeSpeed;
        }else{
            this.isDead = true;
        }
    }

    display(){
        push();
        translate(width / 2, height / 2);
        rotate(frameCount * this.lifeSpeed * 5);
        let alpha = map(this.lifeSpan, 0.001, 1, 0, 50);
        noStroke();
        fill(this.r, this.g, this.b, alpha);
        let currentX = this.x * 5 * (1 - this.lifeSpan);
        let currentSize = this.size + this.size * 2 * (1 - this.lifeSpan) * worldScale;
        ellipse(currentX, 0, currentSize);
        pop();
    }

}


class Blob{
    constructor(r, g, b){
        this.targetX = random(width);
        this.targetY = random(height);
        this.centerX = int(random(width));
        this.centerY = int(random(height));
        this.radius = int(random(200, height / 4));
        this.rad = this.radius;
        this.rotAngle = -40;
        this.accelX = 0.0;
        this.accelY = 0.0;
        this.deltaX = 0.0;
        this.deltaY = 0.0;
        this.springing = 0.0005;
        this.damping = 0.9;

        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = 15;
        this.changeFrame = int(random(60, 120));

        this.nodes = int(random(3, 15));

        this.nodeStartX = [];
        this.nodeStartY = [];
        this.nodeX = [];
        this.nodeY = [];
        this.angle = [];
        this.frequency = [];

        this.organicConstant = 1.0;

        for(let i = 0; i < this.nodes; i++){
            this.nodeStartX[i] = this.nodeStartY[i] = this.nodeX[i] = this.nodeY[i] = this.angle[i] = 0;
            this.frequency[i] = random(5, 12);
        }
    }

    update(){
        this.rad = this.radius * worldScale;
        //
        if(this.alpha > 0){
            this.alpha -= 0.5;
        }
        //
        if(frameCount % this.changeFrame == 0){
            this.targetX = random(width);
            this.targetY = random(height);
          //  this.alpha = 30;
        }

        this.deltaX = this.targetX - this.centerX;
        this.deltaY = this.targetY - this.centerY;

        this.deltaX *= this.springing;
        this.deltaY *= this.springing;
        this.accelX += this.deltaX;
        this.accelY += this.deltaY;

        this.centerX += this.accelX;
        this.centerY += this.accelY;

        this.accelX *= this.damping;
        this.accelY *= this.damping;

        this.organicConstant = 1 - (abs(this.accelX) + abs(this.accelY)) * 0.1;

        for(let i = 0; i < this.nodes; i++){
            this.nodeX[i] = this.nodeStartX[i] + sin(radians(this.angle[i])) * this.accelX * 2;
            this.nodeY[i] = this.nodeStartY[i] + sin(radians(this.angle[i])) * this.accelY * 2;
            this.angle[i] += this.frequency[i];
        }

    }

    display(){
        noStroke();

        for(let i = 0; i < this.nodes; i++){
            this.nodeStartX[i] = this.centerX + cos(radians(this.rotAngle)) * this.rad;
            this.nodeStartY[i] = this.centerY + sin(radians(this.rotAngle)) * this.rad;

            this.rotAngle += 360 / this.nodes;
        }

        curveTightness(this.organicConstant);
        fill(this.r, this.g, this.b, this.alpha);
        beginShape();
        for(let i = 0; i < this.nodes; i++){
            curveVertex(this.nodeX[i], this.nodeY[i]);
        }

        for(let i = 0; i < this.nodes - 1; i++){
            curveVertex(this.nodeX[i], this.nodeY[i]);
        }
        endShape(CLOSE);
    }
}