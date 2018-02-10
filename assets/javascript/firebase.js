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
        wall: false
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

  function resetGame(gameInfo) {
    if (gameInfo.player === "playerOne") {
      database.ref('games/' + gameInfo.gameId + "/" + gameInfo.player).update({
        angle: 0,
        power: 0,
        shotsFired: 0,
        playerOnePos: 0,
        playerTwoPos: 0,
        gameStart: false,
      });
      World.remove(engine.world, [cannonA, cannonB, launchPlatformA, launchPlatformB, cannonBallA, cannonBallB, ground]);
      removeWall(gameInfo);
      placeCannons(gameInfo);
      if(gameInfo.wall){
        World.add(engine.world, wall);
      }
      waitForPlayerTwo(gameInfo);
    } else {
      database.ref('games/' + gameInfo.gameId + "/" + gameInfo.player).update({
        angle: 0,
        power: 0,
        shotsFired: 0,
      });
      World.remove(engine.world, [cannonA, cannonB, launchPlatformA, launchPlatformB, cannonBallA, cannonBallB, ground]);
      removeWall(gameInfo);
      placeCannons(gameInfo);
      playerTwoJoinsGame(gameInfo);
    }
  }

  function removeWall(gameInfo) {
    if (gameInfo.wall) {
      World.remove(engine.world, wall);
    }
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
    database: database,
    updateWindInfo: updateWindInfo,
    updatePositions: updatePositions,
    resetGame: resetGame,
    createNewGame: createNewGame,
    incrementShotsFired: incrementShotsFired,
    updateAnglePower: updateAnglePower,
    updateWallInfo: updateWallInfo,
  };

  return publicAPI;
}());
