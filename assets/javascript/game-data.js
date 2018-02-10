window.gameInfo = {
  player: "playerOne",
  gameId: 1,
  opponent: "playerTwo",
  wind: false,
  wall: false
};

// MINA - relocate to fbBot
function getWindOptions(gameInfo) {
  var gameRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/playerOne/windInfo");
  gameRef.once("value").then(function (snapshot) {
    if (snapshot.val().wind) {
      gameInfo.wind = true; 
      direction = snapshot.val().direction;
      windSpeed = snapshot.val().speed;
      setGravityAndBg();
    }
  });
}

function getWallOption(gameInfo) {
  var wallRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/playerOne/wall");
  wallRef.once("value").then(function(snap) {
    if (snap.val()) {
      setWallFlag(true);
      World.add(engine.world, wall);
    }
  });
}

function joinGame(newGameId, db) {
  db.ref("games/" + newGameId).once("value").then(function (snap) {
    if (snap.val()) {
      window.gameInfo = {
        player: "playerTwo",
        gameId: newGameId,
        opponent: "playerOne",
        wind: false,
        wall: false
      };
      $(".overlay").addClass("hidden");
      getWindOptions(window.gameInfo);
      placeCannons(window.gameInfo);
      hideOppControls(window.gameInfo);
      playerTwoJoinsGame(window.gameInfo);
      addOpponentListeners(window.gameInfo);
    } else {
      alert("Please enter a valid id or start a new game");
    };
  });
}

function playerTwoJoinsGame(gameInfo) {
  firebaseBot.database.ref('games/' + gameInfo.gameId + "/" + gameInfo.opponent).update({
    gameStart: true
  });
  $(".fireButton").addClass("invisible");
  $(".gamemsgs").text("Player 1's Turn")
  $(".info").text("Welcome Player 2. You have joined Game #" + window.gameInfo.gameId);
}

function startGame() {
  var newGameId = Math.floor(Date.now() / 1000);
  window.gameInfo = {
    player: "playerOne",
    gameId: newGameId,
    opponent: "playerTwo",
    wall: false,
    wind: false,
  };
  firebaseBot.createNewGame(newGameId);
  $(".overlay").addClass("hidden");
  $(".info").text("Welcome Player 1. Your new game id is " + window.gameInfo.gameId);
  placeCannons(window.gameInfo)
  hideOppControls(window.gameInfo);
  waitForPlayerTwo(window.gameInfo);
  addOpponentListeners(window.gameInfo);
}

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

function hideOppControls(gameInfo) {
  if(gameInfo.player === "playerOne") {
    $("#player-two-controls").addClass("invisible");
  } else {
    $("#player-one-controls").addClass("invisible");
  }
}

function setWindFlag (value) {
  window.gameInfo.wind = value;
}

function getWind() {
  return gameInfo.wind;
}

function setWallFlag (value) {
  window.gameInfo.wall = value;
}

function getWall() {
  return gameInfo.wall;
}

function addOpponentListeners(gameInfo) {
  var opponent = gameInfo.opponent;
  var gameId = gameInfo.gameId;
  var opponentAngleRef = firebaseBot.database.ref("games/" + gameId + "/" + opponent + "/angle");
  var opponentPowerRef = firebaseBot.database.ref("games/" + gameId + "/" + opponent + "/power");
  var opponentShotsRef = firebaseBot.database.ref("games/" + gameId + "/" + opponent + "/shotsFired");
  opponentShotsRef.on("value", function(shotsSnap) {
    if(shotsSnap.val()){
      opponentAngleRef.once("value").then(function (angleSnap) {
        var opponentAngle = 0;
        var opponentPower = 0;
        opponentAngle = angleSnap.val();
        if (opponent === "playerOne") {
          Matter.Body.setAngle(cannonA, cannonballBot.toRadians(opponentAngle) * -1);
        } else {
          Matter.Body.setAngle(cannonB, cannonballBot.toRadians(opponentAngle));
        }
        opponentPowerRef.once("value").then(function (powerSnap) {
          opponentPower = powerSnap.val();
          cannonballBot.launchOpponentCannonBall(opponentAngle, opponentPower);
        });
      });
    }
  });
}

function placeCannons(gameInfo) {
  if (gameInfo.player === "playerOne") {
    var playerOnePosition = Math.floor(Math.random()*(render.options.width *.28) + render.options.width *.02);
    var playerTwoPosition = Math.floor(Math.random()*(render.options.width *.28) + render.options.width *.70);
    firebaseBot.updatePositions(gameInfo, playerOnePosition, playerTwoPosition);
    createObjects(playerOnePosition, playerTwoPosition);
  } else {
    var gameRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/" + gameInfo.opponent);
    gameRef.once("value").then(function (snapshot) {
      var playerOnePosition = snapshot.val().playerOnePos;
      var playerTwoPosition = snapshot.val().playerTwoPos;
      createObjects(playerOnePosition, playerTwoPosition);
      getWallOption(window.gameInfo);
    });
  }
}

function setWindOptions(gameInfo) {
    direction = dirs[Math.floor(Math.random() * dirs.length)];
    getWindSpeed();
}
