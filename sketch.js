let terrain = [];
let cols = 100;
let rows = 100;

let scale = 0.02;
let detail = 3;
let heightMultiplier = 150;

let mic, fft;
let sRMS = 0, sPitch = 0, sTimbre = 0;
let smoothing = 0.1;

function setup() {
  createCanvas(700, 600, WEBGL);
  noFill();
  stroke(255);

  // initialize terrain array
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }

  // button to activate mic
  document.getElementById("activateMic").onclick = initMic;
}

function initMic() {
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  document.getElementById("activateMic").disabled = true;
}

function draw() {
  background(20);

  // rotate camera
  orbitControl();
  rotateX(PI / 3);
  translate(-cols * 3, -rows * 3);

  // get audio data if mic is active
  if (mic) {
    let spectrum = fft.analyze();
    let waveform = fft.waveform();

    // RMS - volume
    let rms = mic.getLevel();
    sRMS = sRMS * (1 - smoothing) + rms * 500;

    // dominant frequency
    let peakFreq = getPeakFreq(spectrum);
    sPitch = sPitch * (1 - smoothing) + peakFreq / 100;

    // spectral centroid as timbre
    let centroid = getSpectralCentroid(spectrum);
    sTimbre = sTimbre * (1 - smoothing) + centroid / 1000;

    // update terrain
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let nx = x * scale;
        let ny = y * scale;
        terrain[x][y] = layeredNoise(nx, ny) * heightMultiplier * sRMS * 0.5 + sTimbre * 50;
      }
    }
  }

  // draw terrain
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      let h = terrain[x][y];
      let hNext = terrain[x][y + 1];
      stroke(map(sPitch, 0, 20, 100, 255), 100, map(sPitch, 0, 20, 200, 255));
      vertex(x * 6, y * 6, h);
      vertex(x * 6, (y + 1) * 6, hNext);
    }
    endShape();
  }
}

// layered noise function
function layeredNoise(x, y) {
  let total = 0;
  let freq = 1;
  let amp = 1;
  let maxValue = 0;
  for (let i = 0; i < detail; i++) {
    total += noise(x * freq, y * freq) * amp;
    maxValue += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return total / maxValue;
}

// dominant frequency
function getPeakFreq(spectrum) {
  let maxAmp = 0;
  let index = 0;
  for (let i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > maxAmp) {
      maxAmp = spectrum[i];
      index = i;
    }
  }
  // convert bin index to Hz
  return index * (44100 / 2) / spectrum.length;
}

// spectral centroid
function getSpectralCentroid(spectrum) {
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < spectrum.length; i++) {
    numerator += i * spectrum[i];
    denominator += spectrum[i];
  }
  return denominator === 0 ? 0 : numerator / denominator;
}
