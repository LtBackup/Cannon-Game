$(document).ready(function () {

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;
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
    console.log(render);
    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var cannonBall = Bodies.circle(200, 585, 25);
    cannonBall.friction = 1;
    cannonBall.restitution = 0;
    var launchVector = Matter.Vector.create(100, 0);
    launchVector = Matter.Vector.rotate(launchVector, .8);

    var ground = Bodies.rectangle(1000, 610, 810, 60, { isStatic: true });
    ground.friction = 1;

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, cannonBall, ground]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);


    var launchVector = Matter.Vector.create(Math.cos(.785398) * .045, -Math.sin(0.785398) * .045);

    //console.log(Matter.Vector.angle(launchVector,new Matter.Vector.create(100,0)));

    Body.applyForce(cannonBall, { x: cannonBall.position.x, y: cannonBall.position.y }, launchVector);
});