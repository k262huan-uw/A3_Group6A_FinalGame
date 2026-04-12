let backBtn = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  label: "BACK",
};

function drawInstr() {
  background("lavender");
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, height * 0.45, width * 0.567, height * 0.65, 26);

  fill(40, 45, 60);
  textAlign(CENTER, TOP);
  textSize(height * 0.05);
  text("HOW TO PLAY", width / 2, height * 0.225);

  fill(70, 75, 90);
  textSize(height * 0.014);
  textLeading(height * 0.035);
  textAlign(CENTER, TOP);

  text(
    "You run a bubble tea counter for mochi monsters.\n\n" +
      "Mechanic 1: Memory\n" +
      "1. Once the order appears briefly, memorize the colours.\n\n" +
      "2. Choose 1 Tea Base, 1 Syrup, 1 Topping\n" +
      "3. Click SERVE before time runs out\n\n" +
      "Keys:\n" +
      "R = restart (back to title)\n" +
      "V = toggle vision mode (Normal/CVD)",
    width / 2,
    height * 0.338,
  );

  // Button
  backBtn.x = width / 2;
  backBtn.y = height * 0.86;
  backBtn.w = width * 0.25;
  backBtn.h = height * 0.1;

  drawInstrButton(backBtn);
}

function instrMousePressed() {
  if (isHover(backBtn)) {
    currentScreen = "start";
  }
}

function drawInstrButton(btn) {
  rectMode(CENTER);
  const hover = isHover(btn);

  noStroke();
  if (hover) fill(250, 190, 85);
  else fill(255, 205, 120);

  rect(btn.x, btn.y, btn.w, btn.h, 22);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(height * 0.028);
  text(btn.label, btn.x, btn.y);
}
