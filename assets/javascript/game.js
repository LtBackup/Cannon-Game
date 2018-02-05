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
  $("#start-game").on("click", startGame);
  $("#join-game").on("click", function () {
    var newGameId = Number($("#game-id-field").val());
    joinGame(newGameId, database);
  });
  $("#fireButton").on("click", function () {
    fireCannon(window.gameInfo);
  });

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
        canvas: canvas,
        options: {
            width: 1140,
            height: 500,
            showAngleIndicator: true,
            wireframes: false,
            background: './assets/images/canvasbg.jpg'
        }
    });

    // define our categories (as bit fields, there are up to 32 available)
    var defaultCategory = 0x0001,
        playerOne = 0x0002,
        playerTwo = 0x0004,
        neutralPlatform = 0x0008;

    var playerOneColor = '#C44D58',
        playerTwoColor = '#4ECDC4';

    //function createObjects(){
    cannonA = Bodies.rectangle(90, 355, 75, 70, {
        isStatic: true,
        label: "cannonA",
        collisionFilter: {
            category: playerOne
        },
        render: {
            fillStyle: playerOneColor
        }
    });

    launchPlatformA = Bodies.rectangle(90, 400, 60, 60, {
        isStatic: true,
        label: "launchPlatform",
        friction: 1,
        collisionFilter: {
            category: neutralPlatform
        }
    });

    cannonB = Bodies.rectangle(1000, 355, 75, 70, {
        isStatic: true,
        label: "cannonB",
        collisionFilter: {
            category: playerTwo
        },
        render: {
            fillStyle: playerTwoColor
        }
    });

    launchPlatformB = Bodies.rectangle(1000, 400, 60, 60, {
        isStatic: true,
        label: "launchPlatform",
        friction: 1,
        collisionFilter: {
            category: neutralPlatform
        },
    });

    cannonBallA = Bodies.circle(90, 260, 16, {
        label: "cannonBallA",
        friction: 1,
        restitution: 0,
        mass: 1.9444530819999999,
        collisionFilter: {
            mask: defaultCategory | playerTwo | neutralPlatform
        },
        render: {
            fillStyle: playerOneColor
        }
    });
    cannonBallAOrigin = { x: cannonBallA.position.x, y: cannonBallA.position.y };

    cannonBallB = Bodies.circle(1000, 250, 16, {
        label: "cannonBallB",
        friction: 1,
        restitution: 0,
        mass: 1.9444530819999999,
        collisionFilter: {
            mask: defaultCategory | playerOne | neutralPlatform
        },
        render: {
            fillStyle: playerOneColor
        }
    });
    cannonBallBOrigin = { x: cannonBallB.position.x, y: cannonBallB.position.y };

    ground = Bodies.rectangle(570, 442, 1140, 100, {
        isStatic: true,
        label: "ground",
        friction: 1,
        collisionFilter: {
            category: defaultCategory
        }
    });

    // add all of the bodies to the world
    World.add(engine.world, [cannonA, cannonB, launchPlatformA, launchPlatformB, cannonBallA, cannonBallB, ground]);
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
            //stops rolling motion if on launch platform
            if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "launchPlatform") || (pair.bodyA.label === "launchPlatform" && pair.bodyB.label === "cannonBallA")) {
                Body.setVelocity(cannonBallA, { x: 0, y: 0 });
                Body.setAngularVelocity(cannonBallA, 0);
            }
            if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "launchPlatform") || (pair.bodyA.label === "launchPlatform" && pair.bodyB.label === "cannonBallB")) {
                Body.setVelocity(cannonBallB, { x: 0, y: 0 });
                Body.setAngularVelocity(cannonBallB, 0);
            }
            //checks for impact with enemy cannons and ground
            if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "cannonB") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "cannonB")) {
                //TODO trigger explosion
                resetBallA();
                console.log("Player 1 wins");
            }
            if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "cannonA") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "cannonA")) {
                //TODO trigger explosion
                resetBallB();
                console.log("Player 2 wins");
            }
            if ((pair.bodyA.label === "cannonBallA" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallA" && pair.bodyA.label === "ground")) {
                resetBallA();
                console.log("miss");
            }
            if ((pair.bodyA.label === "cannonBallB" && pair.bodyB.label === "ground") || (pair.bodyB.label === "cannonBallB" && pair.bodyA.label === "ground")) {
                resetBallB();
                console.log("miss");
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
  var dampener = .002;
  var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  var launchVector2 = Matter.Vector.create(-Math.sin(toRadians(angle)) * (power * dampener), -Math.cos(toRadians(angle)) * (power * dampener));
  if (gameInfo.player === "playerOne") {
    console.log("playerOne fired");
    Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
  } else {
    console.log("playerTwo fired");
    Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
  }
}

function launchOpponentCannonBall(angle, power) {
  var dampener = .002;
  var launchVector = Matter.Vector.create(Math.cos(toRadians(angle)) * (power * dampener), -Math.sin(toRadians(angle)) * (power * dampener));
  var launchVector2 = Matter.Vector.create(-Math.sin(toRadians(angle)) * (power * dampener), -Math.cos(toRadians(angle)) * (power * dampener));
  if (gameInfo.opponent === "playerOne") {
    console.log("playerOne fired");
    Body.applyForce(cannonBallA, { x: cannonBallA.position.x, y: cannonBallA.position.y }, launchVector);
  } else {
    console.log("playerTwo fired");
    Body.applyForce(cannonBallB, { x: cannonBallB.position.x, y: cannonBallB.position.y }, launchVector2);
  }
}
