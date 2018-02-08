var alertBot = (function() {
  function alertPOneMiss(gameInfo) {
    var turnP = $("<p>");
    if (gameInfo.player === "playerOne") {
      turnP.text("Player Two's Turn")
      $(".gamemsgs").text("You missed!")
    } else {
      turnP.text("Your Turn")
      $(".gamemsgs").text("Player One missed!")
      $(".fireButton").removeClass("invisible");
    }
    $(".gamemsgs").append(turnP);
  }

  function alertPTwoMiss(gameInfo) {
    var turnP = $("<p>");
    if (gameInfo.player === "playerTwo") {
      turnP.text("Player One's Turn")
      $(".gamemsgs").text("You missed!")
    } else {
      $(".gamemsgs").text("Player Two missed!")
      turnP.text("Your Turn")
      $(".fireButton").removeClass("invisible");
    }
    $(".gamemsgs").append(turnP);
  }

  function alertPOneWin(gameInfo) {
    placeReloadButton();
    if (gameInfo.player === "playerOne") {
      $(".player-alerts").text("You WIN!")
    } else {
      $(".player-alerts").text("You LOSE...")
    }
    firebaseBot.resetGame(gameInfo);
  }

  function alertPTwoWin(gameInfo) {
    placeReloadButton();
    if (gameInfo.player === "playerTwo") {
      $(".player-alerts").text("You WIN!")
    } else {
      $(".player-alerts").text("You LOSE...")
    }
    firebaseBot.resetGame(gameInfo);
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
    $(".gamemsgs").empty();
  }

  var publicAPI = {
    alertPOneMiss: alertPOneMiss,
    alertPTwoMiss: alertPTwoMiss,
    alertPOneWin: alertPOneWin,
    alertPTwoWin: alertPTwoWin
  }

  return publicAPI;
})();
