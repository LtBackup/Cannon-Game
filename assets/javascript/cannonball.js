var cannonballBot = (function() {
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  function resetBallA() {
    Body.setVelocity(cannonBallA, { x: 0, y: 0 });
    Body.setAngularVelocity(cannonBallA, 0);
    engine.world.gravity.x = 0;
    Body.setPosition(cannonBallA, cannonBallAOrigin);
  }

  function resetBallB() {
    Body.setVelocity(cannonBallB, { x: 0, y: 0 });
    Body.setAngularVelocity(cannonBallB, 0);
    engine.world.gravity.x = 0;
    Body.setPosition(cannonBallB, cannonBallBOrigin);
  }

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

  function launchCannonBall(angle, power) {
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

  function launchOpponentCannonBall(angle, power) {
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

