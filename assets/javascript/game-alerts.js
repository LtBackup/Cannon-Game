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
      $(".player-alerts").html("<p>You LOSE...<p><p>Waiting on Player 1 to restart the game</p>");
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
    // $("#player-one-controls").hide();
    // $("#player-two-controls").hide();
    $("#control-box").addClass("nodisplay");

    canvas.classList.add("below");
    var overlayDiv = $("<div class='overlay2' aria-hidden='false'>");
    var endgameDiv = $("<div class='endgamemenu'>");
    endgameDiv.addClass("above");
    var row = $("<p>");
    var row2 = $("<p>");
    var row3 = $("<p>");
    row3.addClass("player-alerts");
    var restartGameSess = $("<button class='btn btn-default play-again-btn' id='play-again-btn' type='button'>PLAY AGAIN</button>");
    var reloadGame = $("<button class='btn btn-default reload-game' id='reload-game' type='button'>NEW SESSION</button>");
    overlayDiv.removeClass("hidden");
    overlayDiv.addClass("opened");
    row.append(restartGameSess);
    endgameDiv.append(row3);
    endgameDiv.append(row);
    row2.append(reloadGame);
    endgameDiv.append(row2);
    overlayDiv.append(endgameDiv);

    $("#end-game__alerts").append(overlayDiv);
    $("#play-again-btn").on("click", function() {
      gameBot.resetGame(window.gameInfo);

      canvas.classList.remove("below");
      overlayDiv.addClass("hidden");
      endgameDiv.removeClass("above");
      $("#end-game__alerts").empty();
      
      $("#player-one-controls").show();
      $("#player-two-controls").show();
      $("#control-box").removeClass("nodisplay");
    });
    $("#reload-game").on("click", function() {
      window.location.reload();
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
