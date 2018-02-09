var cannonBallA,
  wall,
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
var world = engine.world;

var newGravity = 0;
var direction = "";
var canvasbg = "./assets/images/canvasbg.jpg";
var dirs = ["east", "west"];

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
    background: canvasbg
  }
});

var playerOnePosition = 0;
var playerTwoPosition = 0;
var groundHeight = (render.options.height * .3) / 2;
var groundPosition = render.options.height - groundHeight;
var ground;

//Set sound effects as an object (Needs to be an object to use with jQuery.
var audio = {
  cannonSound: new Audio("assets/sounds/cannonShot.mp3"),
  winSound: new Audio("assets/sounds/explosion.mp3"),
  missSound: new Audio("assets/sounds/thump.mp3"),
  hoverSound: new Audio("assets/sounds/hover.mp3"),
  clickSound: new Audio("assets/sounds/click.mp3"),
  bgSound : new Audio("assets/sounds/bgMusic.mp3")
};

$(document).ready(function () {
  $(".overlay").addClass("opened");

  //Sound for Game________________________________________________________________
  //This will adjust the volume for all the sounds in the game
  var musicVolume = document.getElementById("volume");
  var soundLevel = 0.3 + (musicVolume.value * 0.7);
  var bgSoundLevel = (musicVolume.value / 100 * 0.25);
  musicVolume.oninput = function () {
    soundLevel = (this.value / 100);
    bgSoundLevel = (this.value / 100 * 0.25);
    audio.cannonSound.volume = soundLevel;//Updates background music volume
    audio.winSound.volume = soundLevel;//Updates background music volume
    audio.missSound.volume = soundLevel;//Updates background music volume
    audio.hoverSound.volume = soundLevel;//Updates background music volume
    audio.clickSound.volume = soundLevel;//Updates background music volume
    audio.bgSound.volume = bgSoundLevel;//Updates background music volume
  }
  //Run opening background music
  var bgMusic = audio.bgSound;
  bgMusic.play();
  bgMusic.loop = true;
  bgMusic.volume = bgSoundLevel;//Sets initial volue of the background music

  //This will create main menu click and hover sounds
  function clickButton(){
    audio.clickSound.currentTime = 0;//Resets sound to start from beginning
    audio.clickSound.play();//Play sound when menu button is clicked.
  }
  function hoverButton(){
    audio.hoverSound.currentTime = 0;//Resets sound to start from beginning
    audio.hoverSound.play();//Play sound when menu button is hovered over.
  }

  //Play hover sound effects for game main menu.
  $("#start-game").mouseenter(function() {
        hoverButton();
  });
  $("#join-game").mouseenter(function() {
        hoverButton();
  });
  $("#settings").mouseenter(function() {
        hoverButton();
  });
  $(".highscore").mouseenter(function() {
        hoverButton();
  });
  //______________________________________________________________________________

  $("#start-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    startGame();
    clickButton();
    if($("#windcheckbox").is(":checked")) {
      setWindFlag(true);
      setWindOptions(window.gameInfo);
    }
    if($("#wallcheckbox").is(":checked")) {
      setWallFlag(true);
      World.add(engine.world, wall);
      firebaseBot.updateWallInfo(window.gameInfo);
    }
  });

  // adds click listener on join game button in modal
  $("#join-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");

    // TODO: Implement logic to warn user that his wind selection was ignored
    var newGameId = Number($("#game-id-field").val());
    joinGame(newGameId, firebaseBot.database);
    clickButton();
  });

   // adds click listener on settings button in modal
  $("#settings").on("click", function() {
    $(".checkbox").removeClass("hidden");
  });

  $(".fireButton").on("click", function () {
    cannonballBot.fireCannon(window.gameInfo);
    if (gameInfo.player === "playerOne") {
      cannonBallA.isStatic = false;
    }
    else {
      cannonBallB.isStatic = false;
    }
    // audio.cannonSound.currentTime = 0;
    // audio.cannonSound.load();
    // audio.cannonSound.play();
  });

  $(".mainRow").append(canvas);

  // make the world bounds a little bigger than the render bounds
  world.bounds.min.x = -600;
  world.bounds.min.y = -600;
  world.bounds.max.x = render.options.width + 600;
  world.bounds.max.y = render.options.height + 600;

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();
  runner.delta = 1000 / 60;
  Runner.run(runner, engine);

  // Checks to see if the active collision involves the cannonball and stops it from spinning if so
  
  Events.on(engine, "collisionActive", function (event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      //stops rolling motion if on launch platform
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "launchPlatform") || (pair.bodyA.label === "launchPlatform" && pair.bodyB.label === "cannonBallA")) {
        cannonBallA.isStatic = true;
        Body.setVelocity(cannonBallA, { x: 0, y: 0 });
        Body.setAngularVelocity(cannonBallA, 0);
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "launchPlatform") || (pair.bodyA.label === "launchPlatform" && pair.bodyB.label === "cannonBallB")) {
        cannonBallB.isStatic = true;
        Body.setVelocity(cannonBallB, { x: 0, y: 0 });
        Body.setAngularVelocity(cannonBallB, 0)
      }
      //checks for impact with enemy cannons and ground
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "cannonB") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "cannonB")) {
        //TODO trigger explosion
        cannonballBot.resetBallA();
        alertBot.alertPOneWin(window.gameInfo);
        audio.winSound.play();//This will play the winning sound when p1 wins.
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "cannonA") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "cannonA")) {
        //TODO trigger explosion
        cannonballBot.resetBallB();
        audio.winSound.play();//This will play the winning sound when p2 wins.
        alertBot.alertPTwoWin(window.gameInfo);
      }
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "ground")) {
        audio.missSound.load();
        audio.missSound.play();//This will play the miss sound when p1 misses.
        World.add(world, Bodies.circle(cannonBallA.position.x, cannonBallA.position.y, 16, {
          isStatic: true,
          isSensor: true,
          render: {
            sprite: {
              texture: './assets/images/cannonball.png'
            }
          }
        }));
        cannonballBot.resetBallA();
        alertBot.alertPOneMiss(window.gameInfo);
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "ground")) {
        audio.missSound.load();
        audio.missSound.play();//This will play the miss sound when p2 misses.
        World.add(world, Bodies.circle(cannonBallB.position.x, cannonBallB.position.y, 16, {
          isStatic: true,
          isSensor: true,
          render: {
            sprite: {
              texture: './assets/images/cannonball.png'
            }
          }
        }));
        cannonballBot.resetBallB();
        alertBot.alertPTwoMiss(window.gameInfo);
      }
    }
  });

  Events.on(engine, 'afterTick', function () {
    if (cannonBallA && cannonBallB) {
      if (cannonBallA.position.x > world.bounds.max.x || cannonBallA.position.x < world.bounds.min.x) {
        audio.missSound.load();
        audio.missSound.play();
	      cannonballBot.resetBallA();
        alertBot.alertPOneMiss(window.gameInfo);
      }
      if (cannonBallB.position.x > world.bounds.max.x || cannonBallB.position.x < world.bounds.min.x) {
        audio.missSound.load();
        audio.missSound.play();
	      cannonballBot.resetBallB();
        alertBot.alertPTwoMiss(window.gameInfo);
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
  }
  aRange.oninput = function () {
    angle = this.value;
    a_output.innerHTML = angle;
    Matter.Body.setAngle(cannonA, cannonballBot.toRadians(angle) * -1);
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
  }
  aRange2.oninput = function () {
    angle2 = this.value;
    a_output2.innerHTML = angle2;
    Matter.Body.setAngle(cannonB, cannonballBot.toRadians(angle2));
  }
});