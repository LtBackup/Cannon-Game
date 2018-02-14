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

  /**
   * createNewGame
   * creates a new game in the database at the gameID provided
   * @param {number} gameId - the ID of the new game being created
   * @returns {undefined}
   */
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
        lowgravity: false,
        highgravity: false,
        playAgain: false,
      },
      playerTwo: {
        angle: 0,
        power: 0,
        shotsFired: 0
      }
    });
  }

  /**
   * updateAnglePower
   * updates the database with player input for angle and power
   * @param {number} gameId - the ID of the current game
   * @param {string} player - the player that made the input
   * @param {number} angle - the angle that the player entered
   * @param {number} power - the power that the player entered
   * @returns {undefined}
   */
  function updateAnglePower(gameId, player, angle, power) {
    database.ref('games/' + gameId + "/" + player).update({
      angle: angle,
      power: power,
    });
  }

  /**
   * incrementShotsFired
   * increases the number of shots fired by one in the database
   * @param {number} gameId - the ID of the current game
   * @param {string} player - the current player
   * @returns {undefined}
   */
  function incrementShotsFired(gameId, player) {
    var gameRef = database.ref("games/" + gameId + "/" + player + "/shotsFired");
    gameRef.once("value").then(function (snapshot) {
      var shotsFired = snapshot.val();
      shotsFired++;
      updateShotsFired(gameId, player, shotsFired);
    });
  }

  /**
   * updateShotsFired
   * updates the number of shots fired in the database after incrementing after
   * each turn
   * @param {number} gameId - the ID of the current game
   * @param {string} player - the current player
   * @param {number} updatedShots - the number of shots fired after increment
   * @returns {undefined}
   */
  function updateShotsFired(gameId, player, updatedShots) {
    var gameRef = database.ref("games/" + gameId + "/" + player + "/");
    var newValue = { shotsFired: updatedShots, }
    gameRef.update(newValue);
  }

  /**
   * getWindOptions
   * reads the game wind options from the database for the game to set wind
   * conditions locally
   * @param {object} gameInfo - The object that holds the state of the current
   * game
   * @returns {undefined}
   */
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

  function getLowGravity(gameInfo) {
    var gameRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/playerOne/lowgravity");
    gameRef.once("value").then(function (snapshot) {
      if (snapshot.val().lowgravity) {
        setLGFlag(true);
      }
    });
  }

  function getHighGravity(gameInfo) {
    var gameRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/playerOne/highgravity");
    gameRef.once("value").then(function (snapshot) {
      if (snapshot.val().highgravity) {
        setHGFlag(true);
      }
    });
  }

  /**
   * getWallOptions
   * reads the game wall options from the database for the game to set wall
   * location locally
   * @param {object} gameInfo - The object that holds the state of the current
   * game
   * @returns {undefined}
   */
  function getWallOptions(gameInfo) {
    var wallRef = firebaseBot.database.ref("games/" + gameInfo.gameId + "/playerOne/wall");
    wallRef.once("value").then(function(snap) {
      if (snap.val()) {
        setWallFlag(true);
        World.add(engine.world, wall);
      }
    });
  }

  /**
   * resetGameData
   * resets the game state in the database to default
   * @param {object} gameInfo - the object that hold the state of the current
   * game
   * @returns {undefined}
   */
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

  /**
   * restartGame
   * sets property playAgain to true in the database
   * @param {object} gameInfo - the object that hold the state of the current
   * @returns {undefined}
   */
  function restartGame(gameInfo) {
    database.ref("games/" + gameInfo.gameId + "/" + "playerOne").update({
      playAgain: true,
    });
  }

  /**
   * changePlayAgain
   * sets property playAgain to false in the database
   * @param {object} gameInfo - the object that hold the state of the current
   * @returns {undefined}
   */
  function changePlayAgain(gameInfo) {
    database.ref("games/" + gameInfo.gameId + "/" + "playerOne").update({
      playAgain: false,
    });
  }

  /**
   * updatePositions
   * updates the positions of the cannons in the database
   * @param {object} gameInfo - the object that hold the state of the current
   * @param {number} positionOne - the position of playerOne's cannon
   * @param {number} positionTwo - the position of playerTwo's cannon
   * @returns {undefined}
   */
  function updatePositions(gameInfo, positionOne, positionTwo) {
    database.ref('games/' + gameInfo.gameId + "/" + gameInfo.player).update({
      playerOnePos: positionOne,
      playerTwoPos: positionTwo,
    });
  }  

  /**
   * updateWindInfo
   * updates the wind conditions in the database
   * @param {object} gameInfo - the object that hold the state of the current
   * @returns {undefined}
   */
  function updateWindInfo(gameInfo) {
    if (gameInfo.wind) {
      database.ref('games/' + gameInfo.gameId + "/playerOne/windInfo").update({
        wind: gameInfo.wind,
        direction: direction,
        speed: windSpeed, 
      });
    }
  }  

  function updateLowGravityInfo(gameInfo) {
    if (gameInfo.lowgravity) {
      database.ref('games/' + gameInfo.gameId + "/playerOne/lowgravity").update({
        lowgravity: gameInfo.lowgravity 
      });
    }
  }

  function updateHighGravityInfo(gameInfo) {
    if (gameInfo.highgravity) {
      database.ref('games/' + gameInfo.gameId + "/playerOne/highgravity").update({
        highgravity: gameInfo.highgravity 
      });
    }
  }

  /**
   * updateWallInfo
   * updates the existence of a wall in the database
   * @param {object} gameInfo - the object that hold the state of the current
   * @returns {undefined}
   */
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
    updateLowGravityInfo,
    updateHighGravityInfo,
    updatePositions,
    resetGameData,
    createNewGame,
    incrementShotsFired,
    updateAnglePower,
    updateWallInfo,
    getWindOptions,
    getLowGravity,
    getHighGravity,
    getWallOptions,
    restartGame,
    changePlayAgain
  };

  return publicAPI;
}());
