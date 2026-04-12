// ----------------------
// INGREDIENT DATA
// ----------------------
const TEA_BASES = [
  { id: "black", label: "Black Tea", c: [95, 60, 35] },
  { id: "milk", label: "Milk Tea", c: [190, 150, 105] },
];

const ROUND6_TEAS = [
  { id: "green", label: "Green Tea", c: [80, 155, 90] },
  { id: "oolong", label: "Oolong Tea", c: [230, 120, 75] },
];

const SYRUPS = [
  { id: "straw", label: "Strawberry", c: [225, 80, 105] },
  { id: "melon", label: "Honeydew", c: [105, 210, 120] },
];

const ROUND10_SYRUPS = [
  { id: "mango", label: "Mango", c: [245, 175, 60] },
  { id: "taro", label: "Taro", c: [185, 105, 210] },
];

const TOPPINGS = [
  { id: "boba", label: "Boba", c: [55, 35, 25] },
  { id: "jelly", label: "Lychee Jelly", c: [205, 120, 215] },
];

const ROUND6_TOPPINGS = [
  { id: "pud", label: "Pudding", c: [245, 215, 120] },
  { id: "coconut", label: "Coconut Jelly", c: [168, 160, 162] },
];

let cvdType = "DEUTAN";

// ----------------------
// MOCHI STYLE COLOURS
// ----------------------
const MOCHI = {
  sky: [233, 246, 255],
  hills: [255, 210, 225],
  counterTop: [200, 245, 235],
  counterFront: [170, 230, 220],
  outline: [40, 50, 70],
  inkDark: [30, 35, 45],
  accent: [255, 205, 120],
};

// ----------------------
// DIFFICULTY FUNCTION
// ----------------------

function getMonochromeFactor() {
  // increases every round
  let factor = (round - 1) * 0.12;

  // stronger effect in CVD mode
  if (visionMode === "CVD") {
    factor += 0.2;
  }

  // cap so it never becomes fully invisible
  return constrain(factor, 0, 0.9);
}

// ----------------------
// SCREEN DRAW
// ----------------------
function drawGame() {
  background("lavender");

  // HUD
  drawMochiHUD();

  if (phase === "PREVIEW") {
    drawPreviewPhaseMochi();
    if (millis() > orderPreviewUntil) phase = "MIX";
  } else {
    drawMixPhaseMochi();
  }
}

function drawPreviewPhaseMochi() {
  // Customer row + bubble (shows order clearly)
  drawCustomerRow(false);

  // Center hint
  fill(255, 255, 255, 235);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height * 0.669, width * 0.525, height * 0.375, 22);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(height * 0.038);
  text("MEMORIZE THE ORDER!", width / 2, height / 2 + height * 0.175);

  fill("red");
  textAlign(CENTER, CENTER);
  textSize(height * 0.025);
  text(cvdType + " • Round " + round, width / 2, height / 2 + height * 0.075);

  const tLeft = max(0, orderPreviewUntil - millis());
  fill("red");
  textSize(height * 0.025);
  text(
    "Order disappears in " + (tLeft / 1000).toFixed(1) + "s",
    width / 2,
    height / 2 + height * 0.225,
  );
}

function drawMixPhaseMochi() {
  // Customer row (bubble still exists but now follows vision mode feel)
  drawCustomerRow(false);

  // Counter
  drawCounter();

  // Ingredient bins (bottom)
  drawIngredientBins();

  // Serve button
  drawServeButtonMochi();

  // Auto-serve when timer ends
  const tLeft = max(0, mixEndsAt - millis());
  if (tLeft <= 0) serveDrink();
}

function drawMochiHUD() {
  const tLeft = max(0, mixEndsAt - millis());
  const secs = (tLeft / 1000).toFixed(1);

  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, height * 0.067, width * 0.792, height * 0.055, 22);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(height * 0.012);
  text(
    "Round " +
      round +
      "  •  Score " +
      score +
      "  •  Time " +
      secs +
      "s" +
      "  •  Vision " +
      visionMode +
      " (" +
      cvdType +
      ") (V) •  C = Switch •  R = Restart",
    width / 2,
    height * 0.067,
  );
}

let customerSwap = [0, 1, 2, 3];

function drawCustomerRow(showTrueOrder) {
  // row panel
  noStroke();
  fill(233, 246, 255);
  rectMode(CORNER);
  rect(width * 0.025, height * 0.13, width * 0.95, height * 0.22, 22);

  // customers
  const panelLeft = width * 0.025;
  const panelWidth = width * 0.4;
  const spacing = panelWidth / 4;
  const xs = [];
  for (let i = 0; i < 4; i++) {
    xs.push(panelLeft + spacing * (i + 1.4));
  }

  for (let i = 0; i < 4; i++) {
    const mood = i === monsterSwap ? "active" : "waiting";
    drawMochiMonster(
      xs[i],
      height * 0.3,
      height * 0.088,
      customerSwap[i],
      mood,
    );
  }

  // order bubble
  if (phase === "PREVIEW") {
    drawOrderBubble(width * 0.058, height * 0.156, order, showTrueOrder);
  }
}

function drawMochiMonster(x, y, size, idx, mood) {
  const happyMonster = [pinkMonster, blueMonster, greenMonster, orangeMonster];
  const neutralMonster = [
    pinkMonsterNeutral,
    blueMonsterNeutral,
    greenMonsterNeutral,
    orangeMonsterNeutral,
  ];

  const monsterMood = mood === "active" ? neutralMonster : happyMonster;
  const img = monsterMood[idx];
  if (!img) return;

  imageMode(CENTER);
  image(img, x, y, 150, 150);
  imageMode(CORNER);
  noStroke();
}

function drawOrderBubble(x, y, ord, showTrueOrder) {
  const bubbleWidth = round >= 4 ? width * 0.438 : width * 0.329;

  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CORNER);
  rect(x, y, bubbleWidth, height * 0.075, 30);

  // bubble tail
  triangle(
    x + width * 0.025,
    y + height * 0.075,
    x + width * 0.058,
    y + height * 0.075,
    x + width * 0.08,
    y + height * 0.15,
  );

  const slots = [
    { label: "Tea", item: ord.base, px: x + width * 0.015 },
    { label: "Syrup", item: ord.syrup, px: x + width * 0.1 },
    { label: "Topping", item: ord.topping, px: x + width * 0.2 },
  ];
  if (round >= 4) {
    slots.push({ label: "Straw", item: ord.straw, px: x + width * 0.321 });
  }

  for (let i = 0; i < slots.length; i++) {
    let col = slots[i].item.c;

    // When previewing, show true colours. During mixing, show what player sees.
    if (showTrueOrder) col = getShownColor(col);

    drawIngredientIcon(slots[i].px, y, col, slots[i].label);
  }
}

function drawIngredientIcon(x, y, col, label) {
  fill(col[0], col[1], col[2]);
  ellipse(x + width * 0.022, y + height * 0.038, width * 0.02, height * 0.038);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(height * 0.015);
  text(label, x + width * 0.038, y + height * 0.038);
}

function drawCounter() {
  // counter top
  noStroke();
  fill(MOCHI.counterTop[0], MOCHI.counterTop[1], MOCHI.counterTop[2]);
  rectMode(CORNER);
  rect(30, height * 0.42, width - 60, height * 0.18, 22);

  // counter front
  fill(MOCHI.counterFront[0], MOCHI.counterFront[1], MOCHI.counterFront[2]);
  rect(30, height * 0.52, width - 60, height * 0.48, 22);

  // cup in the middle
  drawCupMochi(width / 2, height * 0.488);
}

function drawCupMochi(cx, cy) {
  const baseC = selection.base ? selection.base.c : [230, 230, 230];
  const syrupC = selection.syrup ? selection.syrup.c : [240, 240, 240];
  const topC = selection.topping ? selection.topping.c : [220, 220, 220];
  const strawC = selection.straw ? selection.straw.c : [200, 200, 200];

  // straw
  stroke(strawC[0], strawC[1], strawC[2]);
  strokeWeight(height * 0.013);
  strokeCap(SQUARE);
  line(cx, cy - height * 0.15, cx, cy + height * 0.085);
  noStroke();

  stroke(MOCHI.outline[0], MOCHI.outline[1], MOCHI.outline[2]);
  strokeWeight(width * 0.003);
  fill(255, 255, 255, 220);
  rectMode(CENTER);
  rect(cx, cy, width * 0.108, height * 0.213, 22);

  noStroke();
  fill(baseC[0], baseC[1], baseC[2], 200);
  rect(
    cx,
    cy + height * 0.213 * 0.282,
    width * 0.108 * 0.862,
    height * 0.213 * 0.353,
    16,
  );

  fill(syrupC[0], syrupC[1], syrupC[2], 190);
  rect(
    cx,
    cy - height * 0.213 * 0.029,
    width * 0.108 * 0.862,
    height * 0.213 * 0.277,
    16,
  );

  fill(topC[0], topC[1], topC[2], 180);
  rect(
    cx,
    cy - height * 0.213 * 0.282,
    width * 0.108 * 0.862,
    height * 0.213 * 0.235,
    16,
  );

  // pearls
  if (selection.topping && selection.topping.id === "boba") {
    fill(30, 30, 30, 120);
    for (let i = 0; i < 6; i++) {
      ellipse(
        cx - width * 0.108 * 0.346 + i * width * 0.108 * 0.138,
        cy + height * 0.213 * 0.365 + (i % 2) * height * 0.213 * 0.035,
        width * 0.01,
        height * 0.015,
      );
    }
  }
}

function sixTea() {
  if (round >= 7) {
    return TEA_BASES.concat(ROUND6_TEAS);
  }
  return TEA_BASES;
}

function sixTopping() {
  if (round >= 7) {
    return TOPPINGS.concat(ROUND6_TOPPINGS);
  }
  return TOPPINGS;
}

function tenSyrup() {
  if (round >= 10) {
    return SYRUPS.concat(ROUND10_SYRUPS);
  }
  return SYRUPS;
}

function drawIngredientBins() {
  const y = height * 0.7;
  const binWidth = width * 0.158;
  const spacing = width * 0.02;
  const startX = width * 0.108;

  drawBinColumn("TEA", sixTea(), startX, y, "base", binWidth);
  drawBinColumn(
    "SYRUP",
    tenSyrup(),
    startX + binWidth + spacing,
    y,
    "syrup",
    binWidth,
  );
  drawBinColumn(
    "TOPPING",
    sixTopping(),
    startX + 2 * (binWidth + spacing),
    y,
    "topping",
    binWidth,
  );
  if (round >= 4) {
    drawBinColumn(
      "STRAW",
      STRAWS,
      startX + 3 * (binWidth + spacing),
      y,
      "straw",
      binWidth,
    );
  }
}

function drawBinColumn(title, list, x, y, slotKey, binWidth) {
  const binHeight = height * 0.288;
  fill(255, 255, 255, 220);
  rectMode(CORNER);
  rect(x - width * 0.017, y - height * 0.063, binWidth, binHeight, 18);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(height * 0.018);
  text(title, x + binWidth / 2 - 30, y - height * 0.053);

  for (let i = 0; i < list.length; i++) {
    const cardHeight = binHeight * 0.191; // 44/230 ≈ 0.191
    const card = {
      x: x + binWidth / 2,
      y: y + i * (binHeight * 0.213),
      w: binWidth,
      h: cardHeight,
    };
    const hover = isHover(card);
    const chosen = selection[slotKey] && selection[slotKey].id === list[i].id;

    list[i]._card = card;

    // drink selection
    rectMode(CORNER);
    noStroke();
    if (chosen) fill(180, 220, 255, 230);
    else fill(255, 255, 255, hover ? 235 : 195);
    rect(x - width * 0.017, card.y - card.h / 2, card.w, card.h);

    // colours
    const shown = getShownColor(list[i].c);
    const size = min(width, height) * 0.025;
    fill(shown[0], shown[1], shown[2]);
    ellipse(
      x + width * 0.015,
      y + i * (binHeight * 0.213),
      width * 0.018,
      height * 0.034,
      size,
      size,
    );

    // text
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(height * 0.015);
    text(list[i].label, x + width * 0.03, y + i * (binHeight * 0.213));
  }
}

function serveSize() {
  return {
    x: width * 0.91,
    y: height * 0.5,
    w: width * 0.15,
    h: height * 0.1,
  };
}
function drawServeButtonMochi() {
  const serveBtn = serveSize();
  const enabled =
    selection.base &&
    selection.syrup &&
    selection.topping &&
    (round < 4 || selection.straw);
  const hover = isHover(serveBtn);

  rectMode(CENTER);
  noStroke();

  if (!enabled) fill("lightgrey");
  else if (hover) fill(250, 190, 85);
  else fill(255, 205, 120);

  rect(serveBtn.x, serveBtn.y, serveBtn.w, serveBtn.h, 22);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(height * 0.028);
  text("SERVE", serveBtn.x, serveBtn.y);

  cursor(enabled && hover ? HAND : ARROW);
}

// ----------------------
// INPUT HANDLERS
// ----------------------
function gameMousePressed() {
  if (phase !== "MIX") return;

  checkPick("base", sixTea());
  checkPick("syrup", tenSyrup());
  checkPick("topping", sixTopping());
  checkPick("straw", STRAWS);

  const enabled =
    selection.base &&
    selection.syrup &&
    selection.topping &&
    (round < 4 || selection.straw);
  if (enabled && isHover(serveSize())) serveDrink();
}

function gameKeyPressed() {
  if (key === "v" || key === "V") {
    visionMode = visionMode === "NORMAL" ? "CVD" : "NORMAL";
  }

  if (key === "r" || key === "R") {
    currentScreen = "start";
  }

  if (keyCode === ENTER) {
    if (
      phase === "MIX" &&
      selection.base &&
      selection.syrup &&
      selection.topping
    ) {
      serveDrink();
    }
  }

  // switch CVD type
  if (key === "c" || key === "C") {
    if (cvdType === "DEUTAN") cvdType = "PROTAN";
    else if (cvdType === "PROTAN") cvdType = "TRITAN";
    else cvdType = "DEUTAN";
  }
}

function checkPick(slotKey, list) {
  for (let i = 0; i < list.length; i++) {
    const card = list[i]._card;
    if (card && isHover(card)) {
      selection[slotKey] = list[i];
      return;
    }
  }
}

let monsterSwap = 0;
let cvdTime = 0;

// ----------------------
// ROUND LOGIC
// ----------------------
function startRound() {
  const cvdTypes = ["DEUTAN", "PROTAN", "TRITAN"];
  const count = floor(random(1, 5));
  customerSwap = shuffle([0, 1, 2, 3]).slice(0, count);

  cvdType = cvdTypes[(round - 1) % cvdTypes.length];

  order = {
    base: random(sixTea()),
    syrup: random(tenSyrup()),
    topping: random(sixTopping()),
    straw: round >= 4 ? random(STRAWS) : null,
  };

  monsterSwap = floor(random(4));

  selection.base = null;
  selection.syrup = null;
  selection.topping = null;
  selection.straw = null;

  orderPreviewUntil = millis() + (round >= 4 ? 3000 : 5000);
  phase = "PREVIEW";

  let timeLimit = 10000 - (round - 1) * 400;
  timeLimit = max(1800, timeLimit);

  cvdTime = millis() + 3000;

  mixEndsAt = orderPreviewUntil + timeLimit;
}

function serveDrink() {
  const ok =
    selection.base &&
    selection.syrup &&
    selection.topping &&
    selection.base.id === order.base.id &&
    selection.syrup.id === order.syrup.id &&
    selection.topping.id === order.topping.id &&
    (round < 4 || selection.straw?.id === order.straw?.id);

  if (ok) {
    score += 100;
    endingText = "Perfect boba!\nCustomer tips you $2.";
    currentScreen = "win";
  } else {
    score = max(0, score - 30);
    endingText =
      'MYSTERY BOBA CREATED.\nCustomer: "' +
      random([
        "Why is it... savory?",
        "This tastes like tax season.",
        "Honeydew? More like honey-don't.",
        "My boba is spiritually confused.",
        "It’s giving ‘oops’.",
      ]) +
      '"';
    currentScreen = "lose";
  }
}

// In CVD mode, compress red & green closer → harder to tell some choices apart.
// choose which deficiency you want to simulate

function getMonochromeFactor() {
  // if NORMAL → no fade at all
  if (visionMode === "NORMAL") return 0;

  let factor = (round - 1) * 0.1;

  return constrain(factor, 0, 0.92);
}

function applyCVD(rgb) {
  let r = rgb[0];
  let g = rgb[1];
  let b = rgb[2];

  if (visionMode !== "CVD") {
    return [r, g, b];
  }

  if (cvdType === "DEUTAN") {
    // greens shift toward red
    let rg = (r + g) / 2;
    r = lerp(r, rg, 0.5);
    g = lerp(g, rg, 0.8);
  } else if (cvdType === "PROTAN") {
    // reds shift toward green and look less bright
    let rg = (r + g) / 2;
    r = lerp(r, rg, 0.8);
    g = lerp(g, rg, 0.4);
    r *= 0.6;
  } else if (cvdType === "TRITAN") {
    // blue-green confusion, plus some yellow-red confusion
    let bg = (b + g) / 2;
    b = lerp(b, bg, 0.85);
    g = lerp(g, bg, 0.5);

    let yr = (r + g) / 2;
    r = lerp(r, yr, 0.25);
  }

  return [constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255)];
}

function getShownColor(rgb) {
  let r = rgb[0];
  let g = rgb[1];
  let b = rgb[2];

  // IF NORMAL → return original colour immediately
  if (visionMode === "NORMAL") {
    return [r, g, b];
  }

  let cvd = applyCVD(rgb);

  // grayscale fade after CVD shift
  let gray = 0.299 * cvd[0] + 0.587 * cvd[1] + 0.114 * cvd[2];
  let mono = getMonochromeFactor();

  return [
    lerp(cvd[0], gray, mono),
    lerp(cvd[1], gray, mono),
    lerp(cvd[2], gray, mono),
  ];
}

//straw colour options for round 4
const STRAWS = [
  { id: "dark", label: "Black", c: [40, 50, 70] },
  { id: "red", label: "Red", c: [220, 60, 60] },
  { id: "pink", label: "Pink", c: [240, 130, 170] },
  { id: "yellow", label: "Yellow", c: [245, 210, 60] },
];
