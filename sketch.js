let mic;
let started = false;

function setup() {
  createCanvas(600, 300);

  document.getElementById("activateMic").onclick = () => {
    userStartAudio().then(() => {
      mic = new p5.AudioIn();
      mic.start(
        () => {
          console.log("Mic success");
          started = true;
        },
        (err) => {
          console.log("Mic error:", err);
        }
      );
    });
  };
}

function draw() {
  background(0);

  fill(255);
  textSize(16);

  if (!started) {
    text("Click Activate Mic", 20, 50);
    return;
  }

  let level = mic.getLevel();
  let scaled = level * 1000;

  text("Mic Level: " + scaled.toFixed(2), 20, 50);

  // VISUAL BAR (this MUST move)
  fill(0, 255, 200);
  rect(20, 100, scaled * 5, 30);
}
