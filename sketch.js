let mic;
let waveOffset = 0;
let volume = 0;

function setup() {
  createCanvas(800, 400);
  noFill();
  strokeWeight(2);

  document.getElementById("activateMic").onclick = startMic;
}

function startMic() {
  userStartAudio().then(() => {
    mic = new p5.AudioIn();
    mic.start();

    console.log("Mic started");
  });

  document.getElementById("activateMic").disabled = true;
}

function draw() {
  background(0, 30);

  if (!mic) {
    fill(255);
    textAlign(CENTER);
    text("Click Activate Mic", width / 2, height / 2);
    return;
  }

  // GET VOLUME (THIS IS THE KEY FIX)
  volume = mic.getLevel();

  // amplify it so it's visible
  let scaledVol = volume * 1000;

  // DEBUG TEXT (VERY IMPORTANT)
  fill(255);
  text("Volume: " + scaledVol.toFixed(2), 10, 20);

  waveOffset += 3;

  // DRAW WAVE
  stroke(0, 255, 200);
  beginShape();

  for (let x = 0; x < width; x++) {
    let y =
      height / 2 +
      sin((x + waveOffset) * 0.05) * 50 + // base wave
      scaledVol * sin(x * 0.02); // voice influence

    vertex(x, y);
  }

  endShape();
}
