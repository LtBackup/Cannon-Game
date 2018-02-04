var cannonBallA,
  Body,
  Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events,
  cannonBallB,
  cannonB,
  cannonA,
  cannonBallAOrigin,
  cannonBallBOrigin,
  // create an engine
  engine = Engine.create();

$(document).ready(function () {
  $(".overlay").addClass("opened");
  // adds click listener on join and start new game buttons in modal

  $("#start-game").on("click", startGame);
  $("#join-game").on("click", function () {
    var newGameId = Number($("#game-id-field").val());
    joinGame(newGameId, database);
  });
  $("#fireButton").on("click", function () {
    fireCannon(window.gameInfo);
  });
  $("#fireButton2").on("click", function () {
    fireCannon(window.gameInfo);
  });

  // TODO: add firebase listeners on opponent player's data change

  //create the canvas dimensions
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.className = "canvas";
  var element = document.getElementsByClassName("mainRow");

  // canvas.width = 2000;
  // canvas.height = 1500;
  // // console.log(canvas);
  // document.body.appendChild(canvas);
  $(".mainRow").append(canvas);
  //begin matter.js logic

  // create a renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 1140,
      height: 500,
      showAngleIndicator: true,
      showWireframes: true,
    }
  });

  // console.log(render);

  //function createObjects(){
  cannonA = Bodies.rectangle(90, 360, 75, 64, { isStatic: true });
  cannonA.label = "cannonA";
  cannonB = Bodies.rectangle(1000, 360, 75, 64, { isStatic: true });
  cannonB.label = "cannonB";
  cannonBallA = Bodies.circle(90, 260, 16);
  cannonBallA.label = "cannonBallA";
  cannonBallA.friction = 1;
  cannonBallA.restitution = 0;
  cannonBallA.mass = 1.9444530819999999;
  cannonBallAOrigin = { x: cannonBallA.position.x, y: cannonBallA.position.y };
  cannonBallB = Bodies.circle(1000, 250, 16);
  cannonBallB.label = "cannonBallB";
  cannonBallB.friction = 1;
  cannonBallB.restitution = 0;
  cannonBallB.mass = 1.9444530819999999;
  cannonBallBOrigin = { x: cannonBallB.position.x, y: cannonBallB.position.y };
  ground = Bodies.rectangle(570, 442, 1140, 100, { isStatic: true });
  ground.label = "ground";
  ground.friction = 1;

  // add all of the bodies to the world
  World.add(engine.world, [cannonA, cannonB, cannonBallA, cannonBallB, ground]);
  //}


  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  // Checks to see if the active collision involves the cannonball and stops it from spinning if so

  Events.on(engine, "collisionActive", function (event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      if (pair.bodyA.label === "cannonBallA" || pair.bodyB.label === "cannonBallA") {
        Body.setVelocity(cannonBallA, { x: 0, y: 0 });
        Body.setAngularVelocity(cannonBallA, 0);
      }

      //checks for impact with cannonB
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "cannonB") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "cannonB")) {
        //TODO trigger explosion
        resetBallA();
        console.log("Player 1 wins");
      }
      //checks for impact with cannonA
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "cannonA") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "cannonA")) {
        //TODO trigger explosion
        resetBallB();
        console.log("Player 2 wins");
      }
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "ground")) {
        resetBallA();
        console.log("miss");
      }
    }
  });
});

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function resetBallA() {
  Body.setPosition(cannonBallA, cannonBallAOrigin);
}

function resetBallB() {
  Body.setPosition(cannonBallB, cannonBallBOrigin);
}

//need to pass in the cannonball object for the active player
function launchCannonBall(angle, power) {
  console.log("fired");
  var dampener = .001;
  var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));

  Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
}

// // an example of using collisionStart event on an engine
// Events.on(engine, 'collisionStart', function (event) {
//     var pairs = event.pairs;

//     // change object colours to show those starting a collision
//     for (var i = 0; i < pairs.length; i++) {
//         var pair = pairs[i];
//         pair.bodyA.render.fillStyle = '#333';
//         pair.bodyB.render.fillStyle = '#333';
//     }
// });

    //distance equation is ([velocity]^2*sin(2*angle))/grav

// });
