let mic, fft;
let smoothing = 0.8;

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
  background(0);

  if (!mic) {
    fill(255);
    textAlign(CENTER);
    text("Click 'Activate Mic' to start", width / 2, height / 2);
    return;
  }

  // GET WAVEFORM
  let waveform = fft.waveform();

  // DRAW WAVEFORM LINE
  stroke(0, 255, 200);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();

  // OPTIONAL: DRAW FREQUENCY SPECTRUM BARS
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length; i += 5) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height / 2);
    stroke(255, 100, 150, 150);
    line(x, height, x, height - h);
  }
}
