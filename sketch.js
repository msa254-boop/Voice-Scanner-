let mic, fft;
let smoothing = 0.8;
let waveformData = [];

function setup() {
  createCanvas(800, 400);
  noFill();

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
    text("Click 'Activate Mic' to start", width/2, height/2);
    return;
  }

  // get waveform
  waveformData = fft.waveform();

  // draw waveform
  stroke(0, 255, 200);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < waveformData.length; i++) {
    let x = map(i, 0, waveformData.length, 0, width);
    let y = map(waveformData[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();

  // optional: draw frequency spectrum overlay
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length; i += 5) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height / 2);
    stroke(255, 100, 150, 150);
    line(x, height, x, height - h);
  }
}
