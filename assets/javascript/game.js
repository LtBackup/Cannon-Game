$(document).ready(function () {
  var angle;
  var power;

  var fireCannon = function () {
    var currentPlayer = $(this).attr("data-player");
    var gameId = parseInt($(this).attr("data-gameId"));
    var angleInput = parseInt($("#" + currentPlayer + "-angle").val());
    var powerInput = parseInt($("#" + currentPlayer + "-power").val());

    // var currentPlayer = "playerOne";
    // var gameId = 1;
    // var angleInput = 45;
    // var powerInput = 100;

    // console.log(currentPlayer);
    // console.log(gameId);
    // console.log(angleInput);
    // console.log(powerInput);

    // set db stats
    updateAnglePower(gameId, currentPlayer, angleInput, powerInput);

    // Firebase listeners

    var playerAngleRef = database.ref("games/" + gameId + "/" + currentPlayer + "/angle");
    var playerPowerRef = database.ref("games/" + gameId + "/" + currentPlayer + "/power");

    playerAngleRef.on("value", function (snapshot) {
      angle = snapshot.val();
    });

    playerPowerRef.on("value", function (snapshot) {
      power = snapshot.val();
    });

    // physics
    launchCannonBall(angle, power);
    incrementShotsFired(gameId, currentPlayer);
  };

  $("#fireButton").on("click", fireCannon);

  //begin matter.js logic

  // module aliases
  var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

  // create an engine
  var engine = Engine.create();

  //create the canvas dimensions
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  canvas.width = 2000;
  canvas.height = 1500;

  document.body.appendChild(canvas);
  // create a renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 2000,
      height: 1500
    }
  });

  // create two boxes and a ground
  var boxA = Bodies.rectangle(400, 200, 80, 80);
  var boxB = Bodies.rectangle(450, 50, 80, 80);
  var cannonBall = Bodies.circle(200, 585, 25);
  cannonBall.friction = 1;
  cannonBall.restitution = 0;
  var launchVector = Matter.Vector.create(100, 0);
  launchVector = Matter.Vector.rotate(launchVector, .8);

  var ground = Bodies.rectangle(600, 610, 4000, 60, { isStatic: true });
  ground.friction = 1;

  // add all of the bodies to the world
  World.add(engine.world, [cannonBall, ground]);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  function launchCannonBall(angle, power) {
    var dampener = .001;
    var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));

    Body.applyForce(cannonBall, { x: cannonBall.position.x, y: cannonBall.position.y }, launchVector);
  }
});
