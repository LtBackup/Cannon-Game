function alertPOneMiss(gameInfo) {
  if (gameInfo.player === "playerOne") {
    $(".info").text("You missed!")
  } else {
    $(".info").text("Player One missed!")
  }
}

function alertPTwoMiss(gameInfo) {
  if (gameInfo.player === "playerTwo") {
    $(".info").text("You missed!")
  } else {
    $(".info").text("Player Two missed!")
  }
}

function alertPOneWin(gameInfo) {
  if (gameInfo.player === "playerOne") {
    $(".info").text("You WIN!")
  } else {
    $(".info").text("You LOSE...")
  }
  placeReloadButton();
  hideControls();
}

function alertPTwoWin(gameInfo) {
  if (gameInfo.player === "playerTwo") {
    $(".info").text("You WIN!")
  } else {
    $(".info").text("You LOSE...")
  }
  placeReloadButton();
  hideControls();
}

function placeReloadButton() {
  $("#play-again-placeholder").html("<button id='play-again-btn' class='fireButton'>PLAY AGAIN</button>");
  $("#play-again-btn").on("click", function() {
    location.reload();
  });
}

function hideControls() {
  $("#player-one-controls").hide();
  $("#player-two-controls").hide();
}
