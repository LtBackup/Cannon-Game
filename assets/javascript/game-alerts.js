var alertBot = (function() {
  function alertPOneMiss(gameInfo) {
    var turnP = $("<p>");
    if (gameInfo.player === "playerOne") {
      $(".gamemsgs").text("");
      var miss = $("<span id='red'>");
      miss.text("You missed! ");
      turnP.append(miss);
      turnP.append("Player 2's Turn");
      $(".gamemsgs").append(turnP);
    } else {
      $(".gamemsgs").text("Player 1 missed! Your Turn");
      $(".fireButton").removeClass("invisible");
    }
  }

  function alertPTwoMiss(gameInfo) {
    var turnP = $("<p>");
    if (gameInfo.player === "playerTwo") {
      $(".gamemsgs").text("");
      var miss = $("<span id='red'>");
      miss.text("You missed! ");
      turnP.append(miss);
      turnP.append("Player 1's Turn");
    } else {
      $(".gamemsgs").text("Player Two missed! Your Turn")
      $(".fireButton").removeClass("invisible");
    }
    $(".gamemsgs").append(turnP);
  }

  function alertPOneWin(gameInfo) {
    firebaseBot.resetGameData(gameInfo);
    placeReloadButton();
    if (gameInfo.player === "playerOne") {
      $(".player-alerts").text("You WIN!")
    } else {
      $(".player-alerts").text("You LOSE...")
    }
  }

  function alertPTwoWin(gameInfo) {
    firebaseBot.resetGameData(gameInfo);
    placeReloadButton();
    if (gameInfo.player === "playerTwo") {
      $(".player-alerts").text("You WIN!")
    } else {
      $(".player-alerts").text("You LOSE...")
    }
  }

  function placeReloadButton() {
    $("#player-one-controls").hide();
    $("#player-two-controls").hide();
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
    $("#end-game__alerts").append(alertDiv);
    $("#play-again-btn").on("click", function() {
      gameBot.resetGame(window.gameInfo);
      $("#end-game__alerts").empty();
      $("#player-one-controls").show();
      $("#player-two-controls").show();
    });
    $(".gamemsgs").empty();
  }

  var publicAPI = {
    alertPOneMiss,
    alertPTwoMiss,
    alertPOneWin,
    alertPTwoWin
  }

  return publicAPI;
})();
