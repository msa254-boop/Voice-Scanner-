let mic, fft;
let smoothing = 0.9;
let waveOffset = 0;

function setup() {
  createCanvas(800, 400);
  noFill();
  strokeWeight(2);
  document.getElementById("activateMic").onclick = initMic;
}

function initMic() {
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(smoothing, 1024);
  fft.setInput(mic);

  document.getElementById("activateMic").disabled = true;
}

function draw() {
  background(0, 20); // fading trail for motion

  if (!mic) {
    fill(255);
    textAlign(CENTER);
    text("Click 'Activate Mic' to start", width/2, height/2);
    return;
  }

  waveOffset += 5; // horizontal wave movement

  let waveform = fft.waveform();

  // Draw multiple wave layers
  for (let layer = 0; layer < 3; layer++) {
    beginShape();
    stroke(
      map(layer, 0, 2, 0, 255),
      map(layer, 0, 2, 255, 100),
      map(layer, 0, 2, 200, 255),
      180
    );
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y =
        height/2 + 
        waveform[i] * 300 * (layer + 1) +     // scale waveform amplitude
        sin((i + waveOffset) * 0.05) * 40 * (layer + 1); // flowing sine offset
      vertex(x, y);
    }
    endShape();
  }
}
