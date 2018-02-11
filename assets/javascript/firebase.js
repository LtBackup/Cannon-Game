var firebaseBot = (function() {
  var firebaseConfig = {
    apiKey: "AIzaSyD5Ev0o5EoYJiOBuHUVePoe22x-Nssfqd0",
    authDomain: "cannon-game.firebaseapp.com",
    databaseURL: "https://cannon-game.firebaseio.com",
    projectId: "cannon-game",
    storageBucket: "",
    messagingSenderId: "500614387480"
  };
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  function createNewGame(gameId) {
    database.ref('games/' + gameId).set({
      playerOne: {
        angle: 0,
        power: 0,
        shotsFired: 0,
        playerOnePos: 0,
        playerTwoPos: 0,
        windInfo: {
          wind: false,
          direction: "",
          speed: 0
        },
        gameStart: false,
        wall: false,
        playAgain: false,
      },
      playerTwo: {
        angle: 0,
        power: 0,
        shotsFired: 0
      }
    });
  }

  function updateAnglePower(gameId, player, angle, power) {
    database.ref('games/' + gameId + "/" + player).update({
      angle: angle,
      power: power,
    });
  }

  function incrementShotsFired(gameId, player) {
    var gameRef = database.ref("games/" + gameId + "/" + player + "/shotsFired");
    gameRef.once("value").then(function (snapshot) {
      var shotsFired = snapshot.val();
      shotsFired++;
      updateShotsFired(gameId, player, shotsFired);
    });
  }

  function updateShotsFired(gameId, player, updatedShots) {
    var gameRef = database.ref("games/" + gameId + "/" + player + "/");
    var newValue = { shotsFired: updatedShots, }
    gameRef.update(newValue);
  }

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

  function getWallOptions(gameInfo) {
    var wallRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/playerOne/wall");
    wallRef.once("value").then(function(snap) {
      if (snap.val()) {
        setWallFlag(true);
        World.add(engine.world, wall);
      }
    });
  }

  function resetGameData(gameInfo) {
    if (gameInfo.player === "playerOne") {
      database.ref('games/' + gameInfo.gameId + "/" + gameInfo.player).update({
        angle: 0,
        power: 0,
        shotsFired: 0,
        playerOnePos: 0,
        playerTwoPos: 0,
        gameStart: false,
        playAgain: false,
      });
    } else {
      database.ref('games/' + gameInfo.gameId + "/" + gameInfo.player).update({
        angle: 0,
        power: 0,
        shotsFired: 0,
      });
    }
  }

  function restartGame(gameInfo) {
    database.ref("games/" + gameInfo.gameId + "/" + "playerOne").update({
      playAgain: true,
    });
  }

  function changePlayAgain(gameInfo) {
    database.ref("games/" + gameInfo.gameId + "/" + "playerOne").update({
      playAgain: false,
    });
  }

  function updatePositions(gameInfo, positionOne, positionTwo) {
    database.ref('games/' + gameInfo.gameId + "/" + gameInfo.player).update({
      playerOnePos: positionOne,
      playerTwoPos: positionTwo,
    });
  }  

  function updateWindInfo(gameInfo) {
    if (gameInfo.wind) {
      database.ref('games/' + gameInfo.gameId + "/playerOne/windInfo").update({
        wind: gameInfo.wind,
        direction: direction,
        speed: windSpeed, 
      });
    }
  }  

  function updateWallInfo(gameInfo) {
    if (gameInfo.wall) {
      database.ref('games/' + gameInfo.gameId + "/playerOne").update({
        wall: true
      });  
    }
  }  

  var publicAPI = {
    database,
    updateWindInfo,
    updatePositions,
    resetGameData,
    createNewGame,
    incrementShotsFired,
    updateAnglePower,
    updateWallInfo,
    getWindOptions,
    getWallOptions,
    restartGame,
    changePlayAgain,
  };

  return publicAPI;
}());
