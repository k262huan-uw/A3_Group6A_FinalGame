function drawLose() {
  background("#ff9385");
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, height / 2, width * 0.542, height * 0.525, 26);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(height * 0.056);
  text("MYSTERY BOBA", width / 2, height * 0.45);

  fill(70, 75, 90);
  textSize(height * 0.018);
  text(endingText, width / 2, height / 2);

  fill("red");
  textSize(height * 0.018);
  text("Click or press ENTER for next customer.", width / 2, height * 0.75);
}

function loseMousePressed() {
  round += 1;
  startRound();
  currentScreen = "game";
}

function loseKeyPressed() {
  if (keyCode === ENTER) {
    round += 1;
    startRound();
    currentScreen = "game";
  }
}
