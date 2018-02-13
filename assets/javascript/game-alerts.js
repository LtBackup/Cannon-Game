var alertBot = (function() {
  /**
   * playerOneMiss
   * updates DOM to display alerts when player one misses and it's player two's
   * turn
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function playerOneMiss(gameInfo) {
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

  /**
   * playerTwoMiss
   * updates DOM to display alerts when player two misses and it's player one's
   * turn
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function playerTwoMiss(gameInfo) {
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

  /**
   * playerOneWin
   * updates DOM to display alerts when player one wins
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function playerOneWin(gameInfo) {
    firebaseBot.resetGameData(gameInfo);
    placeReloadButton();
    if (gameInfo.player === "playerOne") {
      $(".player-alerts").text("You WIN!")
    } else {
      $(".player-alerts").text("You LOSE...")
      gameBot.waitForPlayerOne(gameInfo);
    }
  }

  /**
   * playerTwoWin
   * updates DOM to display alerts when player two wins
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function playerTwoWin(gameInfo) {
    firebaseBot.resetGameData(gameInfo);
    placeReloadButton();
    if (gameInfo.player === "playerTwo") {
      $(".player-alerts").text("You WIN!")
      gameBot.waitForPlayerOne(gameInfo);
    } else {
      $(".player-alerts").text("You LOSE...")
    }
  }

  /**
   * placeReloadButton
   * updates the DOM to display play-again button when someone wins
   * @returns {undefined}
   */
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
    playerOneMiss,
    playerTwoMiss,
    playerOneWin,
    playerTwoWin
  }

  return publicAPI;
})();
