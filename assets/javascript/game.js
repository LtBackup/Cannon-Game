var cannonBallA,
    Body;

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
    var engine = Engine.create(),
        world = engine.world;

    //create the canvas dimensions
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.className = "canvas";
    var element = document.getElementsByClassName("mainRow");

    // canvas.width = 2000;
    // canvas.height = 1500;
    // console.log(canvas);
    // document.body.appendChild(canvas);
    $(".mainRow").append(canvas);

    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        canvas: canvas,
        options: {
            width: 1140,
            height: 500,
            showAngleIndicator: true,
            showWireframes: true
        }
    });

    console.log(render);

    //function createObjects(){
    var cannonA = Bodies.rectangle(90, 360, 75, 64, { isStatic: true });
    cannonA.label = "cannonA";
    var cannonB = Bodies.rectangle(1000, 360, 75, 64, { isStatic: true });
    cannonB.label = "cannonB";
    var cannonBallA = Bodies.circle(90, 260, 16);
    cannonBallA.label = "cannonBallA";
    cannonBallA.friction = 1;
    cannonBallA.restitution = 0;
    cannonBallA.mass = 1.9444530819999999;
    var cannonBallAOrigin = { x: cannonBallA.position.x, y: cannonBallA.position.y };
    var cannonBallB = Bodies.circle(1000, 250, 16);
    cannonBallB.label = "cannonBallB";
    cannonBallB.friction = 1;
    cannonBallB.restitution = 0;
    cannonBallB.mass = 1.9444530819999999;
    var cannonBallBOrigin = { x: cannonBallB.position.x, y: cannonBallB.position.y };
    var ground = Bodies.rectangle(570, 442, 1140, 100, { isStatic: true });
    ground.label = "ground";
    ground.friction = 1;

    console.log(cannonBallA);

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
        console.log("Power: ", power);
    }
    aRange.oninput = function () {
        angle = this.value;
        a_output.innerHTML = angle;
        console.log("Angle: ", angle);
        Matter.Body.setAngle(cannonA, toRadians(angle));
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
        Matter.Body.setAngle(cannonB, toRadians(angle));
    }
    //__________________________________________________

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

    //distance equation is ([velocity]^2*sin(2*angle))/grav

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

});
