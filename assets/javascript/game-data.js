window.gameInfo = {
  player: "playerOne",
  gameId: 1,
  opponent: "playerTwo",
  wind: false,
  wall: false,
  lowgravity: false,
  highgravity: false
};

var gameBot = (function() {
  /**
   * joinGame
   * joins existing game with a game ID and pulls all relevant game information from DB. the callback function for the join-game button
   * @param {number} newGameId - the ID of game to join
   * @param {object} db - the instance of the database
   * @returns {undefined}
   */
  function joinGame(newGameId, db) {
    db.ref("games/" + newGameId).once("value").then(function (snap) {
      if (snap.val()) {
        window.gameInfo = {
          player: "playerTwo",
          gameId: newGameId,
          opponent: "playerOne",
          wind: false,
          wall: false,
          lowgravity: false,
          highgravity: false
        };
        hideStartMenu();
        firebaseBot.getGameOptions(window.gameInfo);
        placeCannons(window.gameInfo);
        hideOppControls(window.gameInfo);
        playerTwoJoinsGame(window.gameInfo);
        addOpponentListeners(window.gameInfo);
      } else {
        $("#invalid-id").removeClass("invisible");
      };
    });
  }

  /**
   * playerTwoJoinsGame
   * updates gameStart property in the game database to true and sets DOM
   * accordingly
   * @param {object} gameInfo - the object that holds the current state of the
   * game
   * @returns {undefined}
   */
  function playerTwoJoinsGame(gameInfo) {
    firebaseBot.database.ref('games/' + gameInfo.gameId + "/" + gameInfo.opponent).update({
      gameStart: true
    });
    $(".fireButton").addClass("invisible");
    $(".gamemsgs").text("Player 1's Turn")
    $(".info").text("Welcome Player 2. You have joined Game " + window.gameInfo.gameId);
  }

  /**
   * startGame
   * starts a new instance of the game in the database. the callback funtion for
   * start-game button
   * @returns {undefined}
   */
  function startGame() {
    var newGameId = Math.floor(Date.now() / 1000);
    window.gameInfo = {
      player: "playerOne",
      gameId: newGameId,
      opponent: "playerTwo",
      wall: false,
      wind: false,
      lowgravity: false,
      highgravity: false
    };
    firebaseBot.createNewGame(newGameId);
    $(".info").text("Welcome Player 1. Your new game id is " + window.gameInfo.gameId);
    placeCannons(window.gameInfo)
    hideOppControls(window.gameInfo);
    waitForPlayerTwo(window.gameInfo);
    addOpponentListeners(window.gameInfo);
  }

  /**
   * hideStartMenu
   * hides the startup menu and displays the battlefield
   * @returns {undefined}
   */
  function hideStartMenu() {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    $(".overlay").addClass("hidden");
  }
  /**
   * waitForPlayerTwo
   * sets listener on value change to the gameStart property to update DOM when
   * player two joins the game
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function waitForPlayerTwo(gameInfo) {
    $(".fireButton").addClass("invisible");
    $(".gamemsgs").text("Waiting for Player 2.");
    var gameStartRef = firebaseBot.database.ref('games/' + gameInfo.gameId + '/' + gameInfo.player + '/gameStart');
    gameStartRef.on("value", function(snapshot) {
      if (snapshot.val()) {
        $(".fireButton").removeClass("invisible");
        $(".gamemsgs").text("Player 2 has joined the Game. Please take your turn.")
      }
    })
  }

  /**
   * hideOppControls
   * updates the DOM to only show player controls and hids the opponent sliders
   * locally
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function hideOppControls(gameInfo) {
    if (gameInfo.player === "playerOne") {
      $("#player-two-controls").addClass("invisible");
    } else {
      $("#player-one-controls").addClass("invisible");
    }
  }

  /**
   * addOpponentListeners
   * sets listeners for value changes on opponent inputs to animate opponent's
   * cannon locally
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function addOpponentListeners(gameInfo) {
    var opponent = gameInfo.opponent;
    var gameId = gameInfo.gameId;
    var opponentRef = firebaseBot.database.ref("games/" + gameId + "/" + opponent);
    var opponentShotsRef = firebaseBot.database.ref("games/" + gameId + "/" + opponent + "/shotsFired");
    opponentShotsRef.on("value", function(shotsSnap) {
      if (shotsSnap.val()) {
        opponentRef.once("value").then(function(snap) {
          var opponentAngle = 0;
          var opponentPower = 0;
          opponentAngle = snap.val().angle;
          if (opponent === "playerOne") {
            Matter.Body.setAngle(cannonA, cannonballBot.toRadians(opponentAngle) * -1);
          } else {
            Matter.Body.setAngle(cannonB, cannonballBot.toRadians(opponentAngle));
          }
          opponentPower = snap.val().power;
          cannonballBot.launchOpponentCannonBall(opponentAngle, opponentPower);
        });
      }
    });
  }

  /**
   * placeCannons
   * places the cannons randomly when game is started or joined
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function placeCannons(gameInfo) {
    if (gameInfo.player === "playerOne") {
      var playerOnePosition = Math.floor(Math.random() * (render.options.width * .28) + render.options.width * .02);
      var playerTwoPosition = Math.floor(Math.random() * (render.options.width * .28) + render.options.width * .70);
      firebaseBot.updatePositions(gameInfo, playerOnePosition, playerTwoPosition);
      $("#p-out").text("50");
      $("#pRange").val("50");
      $("#p-out2").text("50");
      $("#pRange2").val("50");
      $("#a-out").text("0");
      $("#aRange").val("0");
      $("#a-out2").text("0");
      $("#aRange2").val("0");
      createObjects(playerOnePosition, playerTwoPosition);
    } else {
      var gameRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/" + gameInfo.opponent);
      gameRef.once("value").then(function(snapshot) {
        var playerOnePosition = snapshot.val().playerOnePos;
        var playerTwoPosition = snapshot.val().playerTwoPos;
        $("#p-out").text("50");
        $("#pRange").val("50");
        $("#p-out2").text("50");
        $("#pRange2").val("50");
        $("#a-out").text("0");
        $("#aRange").val("0");
        $("#a-out2").text("0");
        $("#aRange2").val("0");
        createObjects(playerOnePosition, playerTwoPosition);
        firebaseBot.getWallOptions(window.gameInfo);
      });
    }
  }

  /**
   * setWindOptions
   * sets random directions of the wind and gets wind speed from open weather
   * API
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function setWindOptions(gameInfo) {
    direction = dirs[Math.floor(Math.random() * dirs.length)];
    getWindSpeed();
  }

  /**
   * waitForPlayerOne
   * sets listeners for value changes on playAgain to sync restart of game with
   * existing game id after win/loss and updates DOM
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function waitForPlayerOne(gameInfo) {
    $("#play-again-btn").addClass("invisible");
    var gameStartRef = firebaseBot.database.ref('games/' + gameInfo.gameId + '/playerOne/playAgain');
    gameStartRef.on("value", function(snapshot) {
      if (snapshot.val()) {
        $("#play-again-btn").removeClass("invisible");
        $(".player-alerts").empty();
        $(".gamemsgs").text("Player 1 has restarted the game. Would you like to join them?");
      }
    });
  }

  /**
   * resetGame
   * clears world of bodies and resets them randomly when restarting a game with
   * existing ID. Call back function for play-again button
   * @param {object} gameInfo - the object that holds the state of the game
   * @returns {undefined}
   */
  function resetGame(gameInfo) {
    if (gameInfo.player === "playerOne") {
      World.clear(engine.world);
      placeCannons(gameInfo);
      if (gameInfo.wall) {
        World.add(engine.world, wall);
      }
      if (gameInfo.wind) {
        setWindOptions(gameInfo); 
      }
      if (gameInfo.lowgravity) {
        setLGFlag(true); 
      }
      if (gameInfo.highgravity) {
        setHGFlag(true); 
      }
      waitForPlayerTwo(gameInfo);
      firebaseBot.restartGame(gameInfo);
    } else {
      World.clear(engine.world);
      firebaseBot.getGameOptions(gameInfo);
      placeCannons(gameInfo);
      playerTwoJoinsGame(gameInfo);
      firebaseBot.changePlayAgain(gameInfo);
    }
  }

  var publicAPI = {
    resetGame,
    joinGame,
    startGame,
    setWindOptions,
    waitForPlayerOne,
    hideStartMenu,
  }

  return publicAPI;
})();
