let mic, fft;
let smoothing = 0.9;
let waveSpeed = 0;

function setup() {
  createCanvas(800, 400);
  noFill();
  strokeWeight(2);
  document.getElementById("activateMic").onclick = initMic;
}

function initMic() {
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(smoothing, 512);
  fft.setInput(mic);

  document.getElementById("activateMic").disabled = true;
}

function draw() {
  background(0, 20); // trailing effect

  if (!mic) {
    fill(255);
    textAlign(CENTER);
    text("Click 'Activate Mic' to start", width/2, height/2);
    return;
  }

  waveSpeed += 2; // horizontal movement

  let spectrum = fft.analyze();
  let waveform = fft.waveform();

  // Draw multiple layered waves
  for (let layer = 0; layer < 3; layer++) {
    beginShape();
    stroke(
      map(layer, 0, 2, 0, 255),
      map(layer, 0, 2, 255, 100),
      map(layer, 0, 2, 200, 255),
      200
    );
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y =
        height/2 +
        waveform[i] * 200 * (layer + 1) +
        sin((i + waveSpeed) * 0.05) * 30 * (layer + 1);
      vertex(x, y);
    }
    endShape();
  }
}
