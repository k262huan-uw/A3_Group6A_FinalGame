let playBtn = { w: 280, h: 86, label: "START SHIFT" };
let instrBtn = { w: 280, h: 86, label: "INSTRUCTIONS" };

let titleFont;
let pinkMonster;
let blueMonster;
let greenMonster;
let orangeMonster;
let pinkMonsterNeutral;
let blueMonsterNeutral;
let greenMonsterNeutral;
let orangeMonsterNeutral;
let mainBg;

function preload() {
  titleFont = loadFont("assets/fonts/PressStart2P-Regular.ttf");

  // monsters
  pinkMonster = loadImage("assets/pinkmonsterhappy.png");
  pinkMonsterNeutral = loadImage("assets/pinkmonsterneutral.png");
  blueMonster = loadImage("assets/bluemonster.png");
  blueMonsterNeutral = loadImage("assets/bluemonsterneutral.png");
  greenMonster = loadImage("assets/greenmonster.png");
  greenMonsterNeutral = loadImage("assets/greenmonsterneutral.png");
  orangeMonster = loadImage("assets/orangemonster.png");
  orangeMonsterNeutral = loadImage("assets/orangemonsterneutral.png");

  mainBg = loadImage("assets/mainbackground.png");
}

function drawStart() {
  imageMode(CORNER);
  image(mainBg, 0, 0, width, height);
  noStroke();
  textFont(titleFont);

  // Update button sizes dynamically to maintain proportions
  playBtn.w = width * 0.233;
  playBtn.h = height * 0.108;
  instrBtn.w = width * 0.233;
  instrBtn.h = height * 0.108;

  // Buttons
  drawMenuButton(playBtn, true);
  playBtn.x = width / 2;
  playBtn.y = height / 2 - height * 0.038;
  drawMenuButton(instrBtn, false);
  instrBtn.x = width / 2;
  instrBtn.y = height / 2 + height * 0.1;

  cursor(isHover(playBtn) || isHover(instrBtn) ? HAND : ARROW);

  // monsters on counter
  drawMonsterLineDecor();
}

function startMousePressed() {
  if (isHover(playBtn)) {
    startNewShift();
    currentScreen = "game";
  } else if (isHover(instrBtn)) {
    currentScreen = "instr";
  }
}

function startKeyPressed() {
  if (keyCode === ENTER) {
    startNewShift();
    currentScreen = "game";
  }
  if (key === "i" || key === "I") currentScreen = "instr";
}

function drawMenuButton(btn, primary) {
  rectMode(CENTER);
  const hover = isHover(btn);

  noStroke();
  if (primary) {
    if (hover) fill(250, 190, 85);
    else fill(255, 205, 120);
  } else {
    if (hover) fill(247, 245, 242);
    else fill(255, 255, 255);
  }

  rect(btn.x, btn.y, btn.w, btn.h, 22);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(height * 0.028);
  text(btn.label, btn.x, btn.y);
}

function startNewShift() {
  score = 0;
  round = 1;
  visionMode = "CVD";
  startRound();
}

function drawMonsterLineDecor() {
  const count = 4;
  const spacing = width * 0.25;
  const totalWidth = (count - 1) * spacing;

  const startX = width / 2 - totalWidth / 2;

  for (let i = 0; i < count; i++) {
    const x = startX + i * spacing;
    drawMochiMonster(x, height * 0.8, height * 0.088, i, "waiting");
  }
}
