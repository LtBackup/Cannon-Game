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
  hitsprite,
  ghostball,
  // create an engine
  engine = Engine.create();
var world = engine.world;

var newGravity = 0;
var direction = "";
var canvasbg = "./assets/images/canvasbg.jpg";
var dirs = ["east", "west"];

//create the canvas with properties
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
    showAngleIndicator: false,
    wireframes: false,
    background: canvasbg
  }
});

/* var playerOnePosition = 0; */
/* var playerTwoPosition = 0; */
var groundHeight = (render.options.height * .3) / 2;
var groundPosition = render.options.height - groundHeight;
var ground;

/** Declare all game sound effects as an object (Needs to be an object to use with jQuery. */
var audio = {
  cannonSound: new Audio("assets/sounds/cannonShot.mp3"),
  winSound: new Audio("assets/sounds/explosion.mp3"),
  missSound: new Audio("assets/sounds/thump.mp3"),
  hoverSound: new Audio("assets/sounds/hover.mp3"),
  clickSound: new Audio("assets/sounds/click.mp3"),
  bgSound: new Audio("assets/sounds/bgMusic.mp3")
};

$(document).ready(function () {
  $(".overlay").addClass("opened");

  /** Sound Volume Controls */
  var musicVolume = document.getElementById("volume");
  var soundLevel = 0.3 + (musicVolume.value * 0.7);
  var bgSoundLevel = (musicVolume.value / 100 * 0.25);

  /**
   * This function will take in values from a slider input and adjust the volume of all sounds.
   * @param {number} value - Value taken from the input slider ranging from 0 to 100.
   * @returns {number} Number between 0 and 1 will be returned for all sounds.
   */
  musicVolume.oninput = function () {
    soundLevel = (this.value / 100);
    bgSoundLevel = (this.value / 100 * 0.25);
    audio.cannonSound.volume = soundLevel;
    audio.winSound.volume = soundLevel;
    audio.missSound.volume = soundLevel;
    audio.hoverSound.volume = soundLevel;
    audio.clickSound.volume = soundLevel;
    audio.bgSound.volume = bgSoundLevel;
    $(".fa-volume-down").toggleClass("fa-volume-off");
  }
  /** Sound Volume Controls */
  var bgMusic = audio.bgSound;
  bgMusic.play();
  bgMusic.loop = true;
  bgMusic.volume = bgSoundLevel;//Sets initial volue of the background music

  // Added by Natraj
  // Click to mute
  $(".fa-volume-off").click(function() {
    soundLevel = 0;
    bgSoundLevel = 0;
    audio.cannonSound.volume = soundLevel;
    audio.winSound.volume = soundLevel;
    audio.missSound.volume = soundLevel;
    audio.hoverSound.volume = soundLevel;
    audio.clickSound.volume = soundLevel;
    audio.bgSound.volume = bgSoundLevel;
    $("#volume").val("0");
  });

  $(".fa-volume-up").click(function() {
    soundLevel = 1;
    bgSoundLevel = (100 / 100 * 0.25);
    audio.cannonSound.volume = soundLevel;
    audio.winSound.volume = soundLevel;
    audio.missSound.volume = soundLevel;
    audio.hoverSound.volume = soundLevel;
    audio.clickSound.volume = soundLevel;
    audio.bgSound.volume = bgSoundLevel;
    $("#volume").val("100");
  });

  /** This function will reset the click sound to 0secs and then replays the sound. */
  function clickButton() {
    audio.clickSound.currentTime = 0;
    audio.clickSound.play();
  }

  /** This function will reset the click sound to 0secs and then replays the sound. */
  function hoverButton() {
    audio.hoverSound.currentTime = 0;//Resets sound to start from beginning
    audio.hoverSound.play();//Play sound when menu button is hovered over.
  }

  /** These functions will play hover sounds effects when the cursor hover over the HTML element with the IDs below.*/
  $("#start-game").mouseenter(function () {
    hoverButton();
  });
  $("#join-game").mouseenter(function () {
    hoverButton();
  });
  $("#settings").mouseenter(function () {
    hoverButton();
  });
  $(".highscore").mouseenter(function () {
    hoverButton();
  });
  //______________________________________________________________________________

  /** 
   * This function will run when HTML element with ID of #start-game is clicked. 
   * Function will hide the canvas shadow, and add a new canvas for the game.
   * Function will then run startGame() and clickButton() functions. 
   * Function will also check if wind, or wall option has been checked and include them in the game.
   */
  $("#start-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    gameBot.startGame();
    clickButton();
    if ($("#windcheckbox").is(":checked")) {
      setWindFlag(true);
      gameBot.setWindOptions(window.gameInfo);
    }
    if ($("#wallcheckbox").is(":checked")) {
      setWallFlag(true);
      World.add(engine.world, wall);
      firebaseBot.updateWallInfo(window.gameInfo);
    }
  });

  /** Adds click listener on join game button in modal */
  $("#join-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    // TODO: Implement logic to warn user that his wind selection was ignored
    var newGameId = Number($("#game-id-field").val());
    gameBot.joinGame(newGameId, firebaseBot.database);
    clickButton();
  });

  /** Adds click listener on settings button in modal */
  $("#settings").on("click", function () {
    $(".checkbox").removeClass("hidden");
  });

  /** 
   * This function will run when run when HTML element with class of fireButton is clicked. 
   * Function will run fireCannon() function and change the kinematics of player 1's or player 2's cannonball.
   */
  $(".fireButton").on("click", function () {
    cannonballBot.fireCannon(window.gameInfo);
    if (gameInfo.player === "playerOne") {
      cannonBallA.isStatic = false;
    }
    else {
      cannonBallB.isStatic = false;
    }
  });

  $(".mainRow").append(canvas);

  // make the world bounds a little bigger than the render bounds
  world.bounds.min.x = -1000;
  world.bounds.min.y = -1000;
  world.bounds.max.x = render.options.width + 1000;
  world.bounds.max.y = render.options.height + 1000;

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();
  runner.delta = 1000 / 60;
  Runner.run(runner, engine);

  
/**
* when a collision occurs, this function checks the pairs of colliding objects and acts based on what the cannonball is colliding with.
  Any Object: stops velocity and rotational velocity to avoid rolling and the ball moving when it is reset.
  Cannon: resets the cannonball and triggers winning/losing conditions based on the cannon.
  Ground: resets the cannonball and leaves a marker at the location of impact.
* @param {obj} engine - the game engine to check for collisions.
* @param {string} event - the name of the specific event occurring in the engine.
* @param {function} - anonymous function that runs the logic that compares the returned collision event pairs.
* @return {undefined}
*/
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
        Body.setAngularVelocity(cannonBallB, 0);
      }
      //checks for impact with enemy cannons and ground
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "cannonB") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "cannonB")) {
        //TODO trigger explosion
        cannonballBot.resetBallA();
        alertBot.playerOneWin(window.gameInfo);
        hitsprite = Bodies.circle(cannonB.position.x, cannonB.position.y, 16, {
          isStatic: true,
          isSensor: true,
          render: {
            opacity: 1,
            sprite: {
              texture: './assets/images/hit.png'
            }
          }
        });
        World.add(world, hitsprite);
        audio.winSound.play();//This will play the winning sound when p1 wins.
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "cannonA") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "cannonA")) {
        //TODO trigger explosion
        cannonballBot.resetBallB();
        audio.winSound.play();//This will play the winning sound when p2 wins.
        hitsprite = Bodies.circle(cannonA.position.x, cannonA.position.y, 16, {
          isStatic: true,
          isSensor: true,
          render: {
            opacity: 1,
            sprite: {
              texture: './assets/images/hit.png'
            }
          }
        });
        World.add(world, hitsprite);
        alertBot.playerTwoWin(window.gameInfo);
      }
      if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "ground")) {
        audio.missSound.load();
        audio.missSound.play();//This will play the miss sound when p1 misses.
        ghostball = Bodies.circle(cannonBallA.position.x, cannonBallA.position.y, 16, {
          isStatic: true,
          isSensor: true,
          render: {
            opacity: 1,
            sprite: {
              texture: './assets/images/miss.png'
            }
          }
        });

        World.add(world, ghostball);

        setTimeout(function () {
          ghostball.render.opacity = 0;
          ghostball.circleRadius = 16;
          ghostball.render.sprite.texture = "./assets/images/ghostball.png";
          ghostball.render.opacity = 1;
        }, 1000);

        cannonballBot.resetBallA();
        alertBot.playerOneMiss(window.gameInfo);
      }
      if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "ground")) {
        audio.missSound.load();
        audio.missSound.play();//This will play the miss sound when p2 misses.
        ghostball = Bodies.circle(cannonBallB.position.x, cannonBallB.position.y, 16, {
          isStatic: true,
          isSensor: true,
          render: {
            sprite: {
              texture: './assets/images/miss.png'
            }
          }
        });

        World.add(world, ghostball);

        setTimeout(function () {
          ghostball.render.opacity = 0;
          ghostball.circleRadius = 16;
          ghostball.render.sprite.texture = "./assets/images/ghostball.png";
          ghostball.render.opacity = 1;
        }, 1000);

        cannonballBot.resetBallB();
        alertBot.playerTwoMiss(window.gameInfo);
      }
    }
  });

/**
* Checks the game after every engine tick to see if the cannonball has exceeded the world bounds. Resets it if so.
* @param {obj} engine - the game engine to use for position checks
* @param {string} event - the name of the specific event - the end of an engine tick
* @return {undefined}
*/
  Events.on(engine, 'afterTick', function () {
    if (cannonBallA && cannonBallB) {
      if (cannonBallA.position.x > world.bounds.max.x || cannonBallA.position.x < world.bounds.min.x) {
        audio.missSound.load();
        audio.missSound.play();
        cannonballBot.resetBallA();
        alertBot.playerOneMiss(window.gameInfo);
      }
      if (cannonBallB.position.x > world.bounds.max.x || cannonBallB.position.x < world.bounds.min.x) {
        audio.missSound.load();
        audio.missSound.play();
        cannonballBot.resetBallB();
        alertBot.playerTwoMiss(window.gameInfo);
      }
    }
  });



  /** 
   * This block of code with retrieve power and angle values from player 1 controls
   */
  var angle; var power;
  var pRange = document.getElementById("pRange");
  var aRange = document.getElementById("aRange");
  var p_output = document.getElementById("p-out");
  var a_output = document.getElementById("a-out");
  p_output.innerHTML = pRange.value;
  a_output.innerHTML = aRange.value;

  /** 
   * This function takes in power values and updates the HTML page to display player 1's current power value.
   * @param {number} value - Values from 1 to 100.
   * @return {number} power - Number from 1 to 100.
   */
  pRange.oninput = function () {
    power = this.value;
    p_output.innerHTML = power;
  }

  /** 
   * This function takes in angle values and updates the HTML page to display player 1's current angle value.
   * Function will also animate/update player 1 cannon's angular position on the webpage using matter.js method. 
   * @param {number} value - Number from 0 to 90.
   * @return {number} Angle in degrees from 0 to 90. 
   */
  aRange.oninput = function () {
    angle = this.value;
    a_output.innerHTML = angle;
    Matter.Body.setAngle(cannonA, cannonballBot.toRadians(angle) * -1);
  }
  /** -------------------------------------------------------------------------*/

  /** 
   * This block of code with retrieve power and angle values from player 2 controls
   */
  var angle2; var power2;
  var pRange2 = document.getElementById("pRange2");
  var aRange2 = document.getElementById("aRange2");
  var p_output2 = document.getElementById("p-out2");
  var a_output2 = document.getElementById("a-out2");
  p_output2.innerHTML = pRange2.value;
  a_output2.innerHTML = aRange2.value;

  /** 
   * This function takes in power values and updates the HTML page to display player 2's current power value.
   * @param {number} value - Values from 1 to 100.
   * @return {number} power - Number from 1 to 100.
   */
  pRange2.oninput = function () {
    power2 = this.value;
    p_output2.innerHTML = power2;
  }

  /** 
   * This function takes in angle values and updates the HTML page to display player 2's current angle value.
   * Function will also animate/update player 2 cannon's angular position on the webpage using matter.js method. 
   * @param {number} value - Number from 0 to 90.
   * @return {number} Angle in degrees from 0 to 90. 
   */
  aRange2.oninput = function () {
    angle2 = this.value;
    a_output2.innerHTML = angle2;
    Matter.Body.setAngle(cannonB, cannonballBot.toRadians(angle2));
  }
});
