window.gameInfo = {
    player: "playerOne",
    gameId: "1",
    opponent: "playerTwo",
    angle: 0
};

$(document).ready(function () {
    var angle;
    var power;

    function joinGame() {
        var newGameId = parseInt($("#game-id-field").val());

        database.ref("games/" + newGameId).once("value").then(function (snap) {
            if (snap.val()) {
                window.gameInfo = {
                    player: "playerTwo",
                    gameId: newGameId,
                    opponent: "playerOne",
                };
                // TODO: close modal
            } else {
                alert("Please enter a valid id or start a new game");
                // TODO: goes back to modal 
            };
        });
    }

    function startGame() {
        var newGameId = Math.floor(Date.now() / 1000);
        window.gameInfo = {
            player: "playerOne",
            gameId: newGameId,
            opponent: "playerTwo",
        };
        createNewGame(newGameId);
        // TODO: close modal
    }

    // adds click listener on join and start new game buttons in modal
    $("#start-game").on("click", startGame);
    $("#join-game").on("click", joinGame);

    var fireCannon = function (gameInfo) {
        var currentPlayer = gameInfo.player;
        var gameId = parseInt(gameInfo.gameId);
        var angleInput = parseInt($("#" + currentPlayer + "-angle").val());
        var powerInput = parseInt($("#" + currentPlayer + "-power").val());


        updateAnglePower(gameId, currentPlayer, angleInput, powerInput);

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

    $("#fireButton").on("click", function () {
        fireCannon(window.gameInfo);
    });

    // TODO: add firebase listeners on opponent player's data change

    //begin matter.js logic

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events;

    // create an engine
    var engine = Engine.create();

    //create the canvas dimensions
    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");

    canvas.width = 2000;
    canvas.height = 1500;

    document.body.appendChild(canvas);
    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 2000,
            height: 1500,
            showAngleIndicator: true,
            showWireframes: true
        }
    });

    console.log(render);

    //function createObjects(){
    var cannonA = Bodies.rectangle(200, 550, 100, 60, { isStatic: true });
    cannonA.label = "cannonA";
    var cannonB = Bodies.rectangle(1500, 550, 100, 60, { isStatic: true });
    cannonB.label = "cannonB";
    var cannonBallA = Bodies.circle(200, 450, 25);
    cannonBallA.label = "cannonBallA";
    cannonBallA.friction = 1;
    cannonBallA.restitution = 0;
    var cannonBallAOrigin = { x: cannonBallA.position.x, y: cannonBallA.position.y };
    var cannonBallB = Bodies.circle(1500, 450, 25);
    cannonBallB.label = "cannonBallB";
    cannonBallB.friction = 1;
    cannonBallB.restitution = 0;
    var cannonBallBOrigin = { x: cannonBallB.position.x, y: cannonBallB.position.y };
    var launchVector = Matter.Vector.create(100, 0);
    launchVector = Matter.Vector.rotate(launchVector, .8);
    var ground = Bodies.rectangle(600, 610, 4000, 60, { isStatic: true });
    ground.label = "ground";
    ground.friction = 1;

    // add all of the bodies to the world
    World.add(engine.world, [cannonA, cannonB, cannonBallA, cannonBallB, ground]);
    //}


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

    function resetBallA() {
        console.log("reset cannonball");
        Body.setPosition(cannonBallA, cannonBallAOrigin);
        //Body.setAngularVelocity(cannonBallA, 0);
        //Body.setVelocity(cannonBallA, { x: 0, y: 0});
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

    // Checks to see if the active collision involves the cannonball and stops it from spinning if so

    Events.on(engine, "collisionActive", function (event) {
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.bodyA.label === "cannonBallA" || pair.bodyB.label === "cannonBallA") {
                Body.setVelocity(cannonBallA, { x: 0, y: 0});
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

    //distance equation is ([velocity]^2*sin(2*angle))/grav
}); 
