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
  // create an engine
  engine = Engine.create();
var world = engine.world;

var newGravity = 0;
var direction = "";
var canvasbg = "./assets/images/canvasbg.jpg";
var dirs = ["east", "west"];

$(document).ready(function () {
  $(".overlay").addClass("opened");

  // decides direction of wind and sets the canvas background accordingly
  direction = dirs[Math.floor(Math.random() * dirs.length)];
  if (direction === "west") {
    canvasbg = "./assets/images/canvasbgwestwind.jpg";
  }
  else if (direction === "east") {
    canvasbg = "./assets/images/canvasbgeastwind.jpg";
  }
  else {
    canvasbg = canvasbg;
  }

  //Set sound effects as an object (Needs to be an object to use with jQuery_________
  var audio = {
    cannonSound: new Audio("assets/sounds/cannonShot.mp3"),
    winSound: new Audio("assets/sounds/explosion.mp3"),
    missSound: new Audio("assets/sounds/thump.mp3")
  };
  //______________________________________________

  //create the canvas dimensions
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.className = "hidden";
  var element = document.getElementsByClassName("mainRow");

  // adds click listener on join and start new game buttons in modal

  $("#start-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    // wind logic  
    getWindSpeed();
    startGame();
  });
  $("#join-game").on("click", function () {
    $(".canvas").addClass("hidden");
    canvas.classList.remove("hidden");
    canvas.classList.add("canvas");
    // wind logic  
    getWindSpeed();
    var newGameId = Number($("#game-id-field").val());
    joinGame(newGameId, database);
  });

  $(".fireButton").on("click", function () {
    fireCannon(window.gameInfo);
    if (gameInfo.player === "playerOne") {
      cannonBallA.isStatic = false;
    }
    else {
      cannonBallB.isStatic = false;
    }
    audio.cannonSound.play();
  });

  $(".mainRow").append(canvas);
  //begin matter.js logic

  // create a renderer
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

  // make the world bounds a little bigger than the render bounds
  world.bounds.min.x = -300;
  world.bounds.min.y = -300;
  world.bounds.max.x = render.options.width + 300;
  world.bounds.max.y = render.options.height + 300;

  // define our categories (as bit fields, there are up to 32 available)
  var defaultCategory = 0x0001,
    playerOne = 0x0002,
    playerTwo = 0x0004,
    neutralPlatform = 0x0008;

  var playerOneColor = '#C44D58',
    playerTwoColor = '#4ECDC4';

  var playerOnePosition = Math.floor(Math.random() * (render.options.width * .28) + render.options.width * .02);
  var playerTwoPosition = Math.floor(Math.random() * (render.options.width * .28) + render.options.width * .70);
  var groundHeight = (render.options.height * .3) / 2;
  var groundPosition = render.options.height - groundHeight;

  //function createObjects(){
  cannonA = Bodies.rectangle(playerOnePosition, groundPosition - 20, 75, 70, {
    isStatic: true,
    label: "cannonA",
    collisionFilter: {
      category: playerOne
    },
    render: {
      sprite: {
        texture: './assets/images/cannon.png'
      }
    }
  });

  launchPlatformA = Bodies.rectangle(playerOnePosition, groundPosition + 25, 60, 60, {
    isStatic: true,
    label: "launchPlatform",
    friction: 1,
    collisionFilter: {
      category: neutralPlatform
    },
    render: {
      fillStyle: 'transparent',
      visible: true
    }
  });

  cannonB = Bodies.rectangle(playerTwoPosition, groundPosition - 20, 75, 70, {
    isStatic: true,
    label: "cannonB",
    collisionFilter: {
      category: playerTwo
    },
    render: {
      sprite: {
        texture: './assets/images/cannon2.png'
      }
    }
  });

  launchPlatformB = Bodies.rectangle(playerTwoPosition, groundPosition + 25, 60, 60, {
    isStatic: true,
    label: "launchPlatform",
    friction: 1,
    collisionFilter: {
      category: neutralPlatform
    },
    render: {
      fillStyle: 'transparent',
      visible: true
    }
  });

  cannonBallA = Bodies.circle(playerOnePosition, render.options.height - (5 + 16 + groundHeight), 16, {
    label: "cannonBallA",
    friction: 1,
    frictionAir: 0,
    restitution: 0,
    mass: 1.9444530819999999,
    collisionFilter: {
      mask: defaultCategory | playerTwo | neutralPlatform
    },
    render: {
      fillStyle: playerOneColor,
      sprite: {
        texture: './assets/images/cannonball.png'
      }
    }
  });
  cannonBallAOrigin = { x: cannonBallA.position.x, y: cannonBallA.position.y };

  cannonBallB = Bodies.circle(playerTwoPosition, render.options.height - (5 + 16 + groundHeight), 16, {
    label: "cannonBallB",
    friction: 1,
    frictionAir: 0,
    restitution: 0,
    mass: 1.9444530819999999,
    collisionFilter: {
      mask: defaultCategory | playerOne | neutralPlatform
    },
    render: {
      fillStyle: playerOneColor,
      sprite: {
        texture: './assets/images/cannonball.png'
      }
    }
  });
  cannonBallBOrigin = { x: cannonBallB.position.x, y: cannonBallB.position.y };

  ground = Bodies.rectangle(render.options.width * .5, render.options.height, render.options.width * 5, groundHeight * 2, {
    isStatic: true,
    label: "ground",
    friction: 1,
    collisionFilter: {
      category: defaultCategory
    },
    render: {
      fillStyle: 'transparent',
      visible: true
    }
  });

  // add all of the bodies to the world
  World.add(engine.world, [cannonA, cannonB, launchPlatformA, launchPlatformB, cannonBallA, cannonBallB, ground]);
  //}


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

  Events.on(engine, 'afterTick', function () {
    if (cannonBallA.position.x > world.bounds.max.x || cannonBallA.position.x < world.bounds.min.x)
      resetBallA();
    if (cannonBallB.position.x > world.bounds.max.x || cannonBallB.position.x < world.bounds.min.x)
      resetBallB();
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
  }
  aRange2.oninput = function () {
    angle2 = this.value;
    a_output2.innerHTML = angle2;
    Matter.Body.setAngle(cannonB, toRadians(angle2));
  }
});

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

function launchCannonBall(angle, power) {
  var dampener = .003;
  var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  var launchVector2 = Matter.Vector.create(-Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  if (gameInfo.player === "playerOne") {
    console.log("playerOne fired");
    if (gameInfo.wind) {
      engine.world.gravity.x = newGravity;
    }
    Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
  } else {
    console.log("playerTwo fired");
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
    console.log("playerOne fired");
    if (gameInfo.wind) {
      engine.world.gravity.x = newGravity;
    }
    Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
  } else {
    console.log("playerTwo fired");
    if (gameInfo.wind) {
      engine.world.gravity.x = newGravity;
    }
    Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
  }
}
