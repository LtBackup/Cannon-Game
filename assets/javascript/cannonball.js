var cannonballBot = (function() {
  /**
   * toRadians
   * converts an angle in degrees to radians
   * @param {number} angle - the angle to convert to radians
   * @returns {number} - the angle in radians
   */
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  /**
   * toDegrees
   * converts an angle in randians to degreens
   * @param {number} angle - the angle to convert to degrees
   * @returns {number} - the angle in degrees
   */
  function toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  /**
   * resetBallA
   * returns the position of cannonballA to its original location
   * @returns {undefined}
   */
  function resetBallA() {
    Body.setVelocity(cannonBallA, { x: 0, y: 0 });
    Body.setAngularVelocity(cannonBallA, 0);
    engine.world.gravity.x = 0;
    Body.setPosition(cannonBallA, cannonBallAOrigin);
  }

  /**
   * resetBallB
   * returns the position of cannonballB to its original location
   * @returns {undefined}
   */
  function resetBallB() {
    Body.setVelocity(cannonBallB, { x: 0, y: 0 });
    Body.setAngularVelocity(cannonBallB, 0);
    engine.world.gravity.x = 0;
    Body.setPosition(cannonBallB, cannonBallBOrigin);
  }

  /**
   * fireCannon
   * takes player input for angle and power and shoots the player's cannon accordingly
   * @param {object} gameInfo - object that holds the state of the game
   * @returns {undefined}
   */
  function fireCannon(gameInfo) {
    var currentPlayer = gameInfo.player;
    var gameId = gameInfo.gameId;
    var angleInput;
    var powerInput;
    $(".fireButton").addClass("invisible");
    if (gameInfo.player === "playerOne") {
      angleInput = Number($("#aRange").val());
      powerInput = Number($("#pRange").val());
    } else {
      angleInput = Number($("#aRange2").val());
      powerInput = Number($("#pRange2").val());
    }
    launchCannonBall(angleInput, powerInput);
    firebaseBot.updateAnglePower(gameId, currentPlayer, angleInput, powerInput);
    firebaseBot.incrementShotsFired(gameId, currentPlayer);
  }

  /**
   * launchCannonBall
   * calculates launch vector based on the player's angle/power inputs and shoots the cannonball
   * @param {number} angle - the angle at which to launch the cannonball
   * @param {number} power - the power at which to launch the cannonball
   * @returns {undefined}
   */
  function launchCannonBall(angle, power) {
    audio.cannonSound.load();
    audio.cannonSound.play();
    var dampener = .003;
    var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
    var launchVector2 = Matter.Vector.create(-Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
    if (gameInfo.player === "playerOne") {
      if (gameInfo.wind) {
        engine.world.gravity.x = newGravity;
      }
      Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
    } else {
      if (gameInfo.wind) {
        engine.world.gravity.x = newGravity;
      }
      Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
    }
  }

  /**
   * launchOpponentCannonBall
   * calculates launch vector based on opponent's angle/power inputs and shoots the cannonball
   * @param {number} angle - the angle at which to launch the cannonball
   * @param {number} power - the power at which to launch the cannonball
   * @returns {undefined}
   */
  function launchOpponentCannonBall(angle, power) {
    audio.cannonSound.load();
    audio.cannonSound.play();
    var dampener = .003;
    var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
    var launchVector2 = Matter.Vector.create(-Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
    if (gameInfo.opponent === "playerOne") {
      cannonBallA.isStatic = false;
      if (gameInfo.wind) {
        engine.world.gravity.x = newGravity;
      }
      Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
    } else {
      cannonBallB.isStatic = false;
      if (gameInfo.wind) {
        engine.world.gravity.x = newGravity;
      }
      Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
    }
  }

  var publicAPI = {
    toRadians: toRadians,
    resetBallA: resetBallA,
    resetBallB: resetBallB,
    fireCannon: fireCannon,
    launchOpponentCannonBall: launchOpponentCannonBall
  }

  return publicAPI;
})();

