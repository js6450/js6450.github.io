let started = false;
let sounds = [];

let totalAmp;
let minDia;

/*
0: birds.mp3 - green fireworks
1: car-horn.mp3 - background brightness
2: car-squeek.mp3 - blue fireworks
3: construction.mp3 - wave
4: engine.mp3 - circle
5: footsteps.mp3 - white fireworks
6: metal.mp3 - blue rect
7: siren.mp3 - scale
8: skateboard.mp3 - wave
9: talk1.mp3 - rain 1
10: talk2.mp3 - rain 2
11: whistle.mp3 - pink rect
12: wind.mp3 - blobs
 */
function preload(){
    for(let i = 0; i < 13; i++){
        sounds.push(new Sound(i));
    }
}

let blobs = [];
let blobSound = 12;

let worldScale;

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(RGB, 255, 255, 255, 100);

    totalAmp = new p5.Amplitude();
    minDia = width / 2;

    blobs.push(new Blob(244, 167, 184));
    blobs.push(new Blob(208, 16, 76));
    blobs.push(new Blob(232, 122, 144));

    targetSize = width * 2;
    worldDia = targetSize;

    noCursor();
}

function draw(){

    background(0, sounds[1].returnLevel() * 20 + 10);

    worldScale = map(sounds[7].returnLevel(), 0, 1, 1, 0.3);

    if(started){

        sounds[blobSound].getSpectrum();

        if(sounds[blobSound].high > 0){
            blobs[0].alpha = 15;
        }

        if(sounds[blobSound].mid > 0){
            blobs[1].alpha = 15;
        }

        if(sounds[blobSound].low > 0){
            blobs[2].alpha = 15;
        }

        for(i = 0; i < blobs.length; i++){
            blobs[i].update();
            blobs[i].display();
        }

        sounds[3].drawWave(252, 250, 242);
        sounds[8].drawWave(189, 192, 186);

        sounds[0].drawFireworks(123, 144, 210);
        sounds[2].drawFireworks(125, 185, 222);
        sounds[5].drawFireworks(255, 255, 255);
        sounds[6].drawFireworks(88, 178, 220);
        sounds[11].drawFireworks(81, 168, 221);

        sounds[4].drawCircle();

        sounds[9].drawAsteroid(251, 226, 81);
        sounds[10].drawAsteroid(250, 214, 137);

        checkEnded();
    }
}

function checkEnded(){

    let soundsEnded = 0;
    for(let i = 0; i < sounds.length; i++){
        if(!sounds[i].soundFile._playing){
            soundsEnded++;
        }
    }

    if(soundsEnded > int(sounds.length / 2) && minDia > 0){
        minDia--;
    }

    if(soundsEnded == sounds.length && started){
        console.log("ended");
        started = false;
        minDia = width / 2;
    }
}

function mousePressed(){
    if(!started){
        started = true;
        for(let i = 0; i < sounds.length; i++){
            sounds[i].soundFile.play();
        }
    }
}

class Sound{
    constructor(id){
        this.soundFile = loadSound('assets/' + id + '.mp3');
        this.fft = new p5.FFT();
        this.fft.setInput(this.soundFile);
        this.amp = new p5.Amplitude();
        this.amp.setInput(this.soundFile);
        this.waveform = [];
        this.spectrum = [];
        this.low = 0;
        this.mid = 0;
        this.high = 0;
        this.level = 0;

        this.redRectPos = width;
        this.blueRectPos = 0;
        this.greenRectPos = 0;
        this.purpleRectPos = height;

        this.circleAngle = 0;

        this.trails = [];
        this.fireworks = [];

        this.asteroids = [];
    }

    async playSound(){
        try{
            await this.soundFile.play();
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
                //

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

    drawFireworks(r, g, b){
        this.getLevel();
        if(this.level > 0.1){
            this.fireworks.push(new Firework(100, this.level, r, g, b));
        }

        for(let i = 0; i < this.fireworks.length; i++){
            if(this.fireworks[i].isDead){
                this.fireworks.pop(i);
            }else{
                this.fireworks[i].update();
                this.fireworks[i].display();
            }

        }
    }

    drawStars(){

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

    drawAsteroid(r, g, b){
        this.getLevel();
        if(this.level > 0.2 && this.asteroids.length < 10){
            this.asteroids.push(new Asteroid(this.level * 10, r, g, b));
        }

        for(let i = 0; i < this.asteroids.length; i++){
            if(this.asteroids[i].isDead){
                this.asteroids.pop(i);
            }else{
                this.asteroids[i].applyAttraction(createVector(width / 2, height / 2));
                this.asteroids[i].update();
                this.asteroids[i].display();
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
        this.size = map(level, 0, 1, 25, 50);
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
        rotate(frameCount * this.lifeSpeed);
        let alpha = map(this.lifeSpan, 0.001, 1, 0, 50);
        noStroke();
        fill(this.r, this.g, this.b, alpha);
        let currentX = this.x * 3 * (1 - this.lifeSpan);
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

        this.nodes = int(random(12, 15));

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