let currentScreen = "start";
let endingText = "";

// Shared game state
let score = 0;
let round = 1;

let order = null; // { base, syrup, topping }
let orderPreviewUntil = 0; // millis() timestamp
let mixEndsAt = 0; // millis() timestamp
let phase = "PREVIEW"; // PREVIEW or MIX

let selection = { base: null, syrup: null, topping: null };

let visionMode = "CVD"; // NORMAL or CVD

let monsterColours = [
  [600, 170, 185],
  [185, 235, 170],
  [170, 210, 255],
  [240, 190, 255],
];

function setup() {
  createCanvas(800, 800);
  textFont("sans-serif");
}

function draw() {
  if (currentScreen === "start") drawStart();
  else if (currentScreen === "instr") drawInstr();
  else if (currentScreen === "game") drawGame();
  else if (currentScreen === "win") drawWin();
  else if (currentScreen === "lose") drawLose();
}

function mousePressed() {
  if (currentScreen === "start") startMousePressed();
  else if (currentScreen === "instr") instrMousePressed();
  else if (currentScreen === "game") gameMousePressed();
  else if (currentScreen === "win") winMousePressed();
  else if (currentScreen === "lose") loseMousePressed();
}

function keyPressed() {
  if (currentScreen === "start") startKeyPressed();
  else if (currentScreen === "instr") instrKeyPressed();
  else if (currentScreen === "game") gameKeyPressed();
  else if (currentScreen === "win") winKeyPressed();
  else if (currentScreen === "lose") loseKeyPressed();
}

// Shared hover helper (same pattern you learned)
function isHover(box) {
  return (
    mouseX > box.x - box.w / 2 &&
    mouseX < box.x + box.w / 2 &&
    mouseY > box.y - box.h / 2 &&
    mouseY < box.y + box.h / 2
  );
}
