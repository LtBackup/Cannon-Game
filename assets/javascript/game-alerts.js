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
  placeReloadButton();
  if (gameInfo.player === "playerOne") {
    $(".player-alerts").text("You WIN!")
  } else {
    $(".player-alerts").text("You LOSE...")
  }
  resetGame(gameInfo);
}

function alertPTwoWin(gameInfo) {
  placeReloadButton();
  if (gameInfo.player === "playerTwo") {
    $(".player-alerts").text("You WIN!")
  } else {
    $(".player-alerts").text("You LOSE...")
  }
  resetGame(gameInfo);
}

function placeReloadButton() {
  $("#control-box").empty();
  var alertDiv = $("<div>");
  alertDiv.addClass("col-md-4 col-md-offset-4 alert-box");
  var alertP = $("<p>");
  alertP.addClass("player-alerts");
  var playAgainBtn = $("<button>");
  playAgainBtn.attr("id", "play-again-btn");
  playAgainBtn.addClass("fireButton");
  playAgainBtn.text("PLAY AGAIN");
  alertDiv.append(alertP);
  alertDiv.append(playAgainBtn);
  $("#control-box").append(alertDiv);
  $("#play-again-btn").on("click", function() {
    location.reload();
  });
  $(".info").empty();
}

