var cannonBallA,
  Body,
  Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events,
  cannonBallB,
  cannonB,
  cannonA,
  cannonBallAOrigin,
  cannonBallBOrigin,
  launchPlatformA,
  launchPlatformB,
  // create an engine
  engine = Engine.create();

//create the canvas dimensions
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.className = "hidden";
var element = document.getElementsByClassName("mainRow");
var render = Render.create({
    element: element,
    engine: engine,
    canvas: canvas,
    options: {
      width: 2280,
      height: 1000,
      //pixelRatio: "auto",
      hasBounds: true,
      showAngleIndicator: true,
      wireframes: false,
      background: './assets/images/canvasbg.jpg'
    }
  });
var playerOnePosition = 0;
var playerTwoPosition = 0;
var groundHeight = (render.options.height * .3)/2;
var groundPosition = render.options.height - groundHeight;
var ground;

$(document).ready(function () {
  $(".overlay").addClass("opened");

  //Set sound effects as an object (Needs to be an object to use with jQuery_________
  var audio = {
    cannonSound : new Audio("assets/sounds/cannonShot.mp3"),
    winSound : new Audio("assets/sounds/explosion.mp3"),
    missSound : new Audio("assets/sounds/thump.mp3")
  };
  //______________________________________________
  
  /* //create the canvas dimensions */
  /* var canvas = document.createElement("canvas"); */
  /* var context = canvas.getContext("2d"); */
  /* canvas.className = "hidden"; */
  /* var element = document.getElementsByClassName("mainRow"); */

  // adds click listener on join and start new game buttons in modal

  $("#start-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    // conditional re: wind option
    // if wind = true, make ajax call then start game
    // if wind = false, just start game
    startGame();
  });
  $("#join-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    var newGameId = Number($("#game-id-field").val());
    joinGame(newGameId, database);
  });
  
  $(".fireButton").on("click", function () {
    fireCannon(window.gameInfo);
    audio.cannonSound.play();
  });

  $(".mainRow").append(canvas);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();
  runner.delta = 1000/30;
  Runner.run(runner, engine);

  // Checks to see if the active collision involves the cannonball and stops it from spinning if so

  Events.on(engine, "collisionActive", function (event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      //stops rolling motion if on launch platform
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "launchPlatform") || (pair.bodyA.label === "launchPlatform" && pair.bodyB.label === "cannonBallA")) {
        Body.setVelocity(cannonBallA, { x: 0, y: 0 });
        Body.setAngularVelocity(cannonBallA, 0);
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "launchPlatform") || (pair.bodyA.label === "launchPlatform" && pair.bodyB.label === "cannonBallB")) {
        Body.setVelocity(cannonBallB, { x: 0, y: 0 });
        Body.setAngularVelocity(cannonBallB, 0)
      }
      //checks for impact with enemy cannons and ground
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "cannonB") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "cannonB")) {
        //TODO trigger explosion
        resetBallA();
        alertPOneWin(window.gameInfo);
        audio.winSound.play();//This will play the winning sound when p1 wins.
        console.log("1 win");
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "cannonA") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "cannonA")) {
        //TODO trigger explosion
        resetBallB();
        console.log("2 win");
        audio.winSound.play();//This will play the winning sound when p2 wins.
        alertPTwoWin(window.gameInfo);
      }
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "ground")) {
        audio.missSound.play();//This will play the miss sound when p1 misses.
        resetBallA();
        alertPOneMiss(window.gameInfo);
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "ground")) {
        audio.missSound.play();//This will play the miss sound when p2 misses.
        resetBallB();
        alertPTwoMiss(window.gameInfo);
      }
    }
  });

  //-Player 1 controls________________________________
  var angle; var power;
  var pRange = document.getElementById("pRange");
  var aRange = document.getElementById("aRange");
  var p_output = document.getElementById("p-out");
  var a_output = document.getElementById("a-out");
  p_output.innerHTML = pRange.value;
  a_output.innerHTML = aRange.value;

  pRange.oninput = function () {
    power = this.value;
    p_output.innerHTML = power;
    console.log("Power: ", typeof power);
  }
  aRange.oninput = function () {
    angle = this.value;
    a_output.innerHTML = angle;
    console.log("Angle: ", angle);
    Matter.Body.setAngle(cannonA, toRadians(angle) * -1);
  }
  //__________________________________________________


  //-Player 2 controls________________________________
  var angle2; var power2;
  var pRange2 = document.getElementById("pRange2");
  var aRange2 = document.getElementById("aRange2");
  var p_output2 = document.getElementById("p-out2");
  var a_output2 = document.getElementById("a-out2");
  p_output2.innerHTML = pRange2.value;
  a_output2.innerHTML = aRange2.value;

  pRange2.oninput = function () {
    power2 = this.value;
    p_output2.innerHTML = power2;
    console.log("Power2: ", power2);
  }
  aRange2.oninput = function () {
    angle2 = this.value;
    a_output2.innerHTML = angle2;
    console.log("Angle2: ", angle2);
    Matter.Body.setAngle(cannonB, toRadians(angle2));
  }
});

// TODO: enclose following code in module
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function resetBallA() {
  Body.setVelocity(cannonBallA, { x: 0, y: 0 });
  Body.setAngularVelocity(cannonBallA, 0);
  Body.setPosition(cannonBallA, cannonBallAOrigin);
}

function resetBallB() {
  Body.setVelocity(cannonBallB, { x: 0, y: 0 });
  Body.setAngularVelocity(cannonBallB, 0);
  Body.setPosition(cannonBallB, cannonBallBOrigin);
}

function launchCannonBall(angle, power) {
  var dampener = .003;
  var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  var launchVector2 = Matter.Vector.create(-Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  if (gameInfo.player === "playerOne") {
    console.log("playerOne fired");
    Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
  } else {
    console.log("playerTwo fired");
    Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
  }
}

function launchOpponentCannonBall(angle, power) {
  var dampener = .003;
  var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  var launchVector2 = Matter.Vector.create(-Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  if (gameInfo.opponent === "playerOne") {
    console.log("playerOne fired");
    Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
  } else {
    console.log("playerTwo fired");
    Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
  }
}
