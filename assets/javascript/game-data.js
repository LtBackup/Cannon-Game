window.gameInfo = {
  player: "playerOne",
  gameId: 1,
  opponent: "playerTwo",
};

function joinGame(newGameId, db) {
  db.ref("games/" + newGameId).once("value").then(function (snap) {
    if (snap.val()) {
      window.gameInfo = {
        player: "playerTwo",
        gameId: newGameId,
        opponent: "playerOne",
      };
      $(".overlay").addClass("hidden");
      placeCannons(window.gameInfo)
      addOpponentListeners(window.gameInfo);
      hideOppControls(window.gameInfo);
    } else {
      alert("Please enter a valid id or start a new game");
    };
  });
}

function startGame() {
  var newGameId = Math.floor(Date.now() / 1000);
  window.gameInfo = {
    player: "playerOne",
    gameId: newGameId,
    opponent: "playerTwo",
  };
  createNewGame(newGameId);
  $(".overlay").addClass("hidden");
  $(".info").text("Welcome Player 1. Your new game id is " + window.gameInfo.gameId);
  placeCannons(window.gameInfo)
  hideOppControls(window.gameInfo);
  addOpponentListeners(window.gameInfo);
}

function hideOppControls(gameInfo) {
  if(gameInfo.player === "playerOne") {
    $("#player-two-controls").addClass("invisible");
  } else {
    $("#player-one-controls").addClass("invisible");
  }
}

function fireCannon(gameInfo) {
  var currentPlayer = gameInfo.player;
  var gameId = gameInfo.gameId;
  var angleInput;
  var powerInput;
  if (gameInfo.player === "playerOne") {
    angleInput = Number($("#aRange").val());
    powerInput = Number($("#pRange").val());
  } else {
    angleInput = Number($("#aRange2").val());
    powerInput = Number($("#pRange2").val());
  }
  launchCannonBall(angleInput, powerInput);
  updateAnglePower(gameId, currentPlayer, angleInput, powerInput);
  incrementShotsFired(gameId, currentPlayer);
}

function addOpponentListeners(gameInfo) {
  var opponent = gameInfo.opponent;
  var gameId = gameInfo.gameId;
  var opponentAngleRef = database.ref("games/" + gameId + "/" + opponent + "/angle");
  var opponentPowerRef = database.ref("games/" + gameId + "/" + opponent + "/power");
  var opponentShotsRef = database.ref("games/" + gameId + "/" + opponent + "/shotsFired");
  opponentShotsRef.on("value", function(shotsSnap) {
    if(shotsSnap.val()){
      // checks for opponent angle input
      opponentAngleRef.once("value").then(function (angleSnap) {
        var opponentAngle = 0;
        var opponentPower = 0;
        opponentAngle = angleSnap.val();
        if (opponent === "playerOne") {
          Matter.Body.setAngle(cannonA, toRadians(opponentAngle) * -1);
        } else {
          Matter.Body.setAngle(cannonB, toRadians(opponentAngle));
        }
        // checks for opponent power input
        opponentPowerRef.once("value").then(function (powerSnap) {
          opponentPower = powerSnap.val();
          launchOpponentCannonBall(opponentAngle, opponentPower);
        });
      });
    }
  });
}

function placeCannons(gameInfo) {
  if (gameInfo.player === "playerOne") {
    playerOnePosition = Math.floor(Math.random()*(render.options.width *.28) + render.options.width *.02);
    playerTwoPosition = Math.floor(Math.random()*(render.options.width *.28) + render.options.width *.70);
    updatePositions(gameInfo);
    createObjects(playerOnePosition, playerTwoPosition);
  } else {
    var gameRef = database.ref("games/" + gameInfo.gameId + "/" + gameInfo.opponent);
    gameRef.once("value").then(function (snapshot) {
      playerOnePosition = snapshot.val().playerOnePos;
      playerTwoPosition = snapshot.val().playerTwoPos;
      createObjects(playerOnePosition, playerTwoPosition);
    });
  }
}
