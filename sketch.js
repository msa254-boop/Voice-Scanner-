let mic;
let started = false;
let smoothVol = 0;

function setup() {
  createCanvas(800, 400);
  noFill();
  strokeWeight(2);

  document.getElementById("activateMic").onclick = () => {
    userStartAudio().then(() => {
      mic = new p5.AudioIn();
      mic.start(() => {
        started = true;
      });
    });
  };
}

function draw() {
  background(0);

  if (!started) {
    fill(255);
    textAlign(CENTER);
    text("Click Activate Mic", width / 2, height / 2);
    return;
  }

  // GET MIC VOLUME
  let vol = mic.getLevel();

  // SMOOTHING (important so it doesn’t jitter)
  smoothVol = smoothVol * 0.9 + vol * 0.1;

  // SCALE IT UP (so it’s visible)
  let amp = smoothVol * 1000;

  // DEBUG TEXT
  fill(255);
  text("Volume: " + amp.toFixed(2), 10, 20);

  stroke(0, 255, 200);

  beginShape();

  for (let x = 0; x < width; x++) {

    // BASELINE (flat when no sound)
    let y = height / 2;

    // ONLY deform when there is sound
    if (amp > 1) {
      y += sin(x * 0.02) * amp;
    }

    vertex(x, y);
  }

  endShape();
}
