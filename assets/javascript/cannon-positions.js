function createObjects(playerOnePostion, playerTwoPosition) {
  var defaultCategory = 0x0001,
    playerOne = 0x0002,
    playerTwo = 0x0004,
    neutralPlatform = 0x0008;

  var playerOneColor = '#C44D58',
    playerTwoColor = '#4ECDC4';

  cannonA = Bodies.rectangle(playerOnePosition, groundPosition - 20, 75, 70, {
    isStatic: true,
    isSensor: true,
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
      visible: false
    }
  });

  cannonB = Bodies.rectangle(playerTwoPosition, groundPosition - 20, 75, 70, {
    isStatic: true,
    isSensor: true,
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
      visible: false
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

  console.log("I am wall")
  wall = Bodies.rectangle(cannonB.position.x - (cannonB.position.x - cannonA.position.x) / 2, groundPosition - ((render.options.height / 4) / 2), 50, render.options.height / 4, {
    isStatic: true,
    label: "wall",
    friction: 0,
    collisionFilter: {
      category: defaultCategory
    },
    render: {
      fillStyle: 'red',
      strokeStyle: 'blue',
      lineWidth: 3,
      sprite: {
        texture: './assets/images/wall.png',
      }
    }
  });

  ground = Bodies.rectangle(render.options.width * .5, render.options.height, render.options.width * 2, groundHeight * 2, {
    isStatic: true,
    isSensor: true,
    label: "ground",
    friction: 1,
    collisionFilter: {
      category: defaultCategory
    },
    render: {
      fillStyle: 'transparent',
      visible: false
    }
  });

  World.add(engine.world, [cannonA, cannonB, launchPlatformA, launchPlatformB, cannonBallA, cannonBallB, ground]);
}
