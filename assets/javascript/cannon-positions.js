/**
* This function creates all the game-relevant objects to interact with and readies them for their starting positions.
* @param {obj} playerOnePosition - a Vector that specifies the location of Player 1's position.
* @param {obj} playerTwoPosition - a Vector that specifies the location of Player 2's position.
* @return {undefined}
*/
function createObjects(playerOnePosition, playerTwoPosition) {
  //these are the collision filter definitions so that only certain objects collide with others.
  var defaultCategory = 0x0001,
    playerOne = 0x0002,
    playerTwo = 0x0004,
    neutralPlatform = 0x0008;

  var playerOneColor = '#C44D58',
      playerTwoColor = '#4ECDC4';
    
  //player 1's cannonball origin
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
  //neutral platform for the cannonball to rest
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
  //player 2's cannonball origin
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
  //neutral platform for the cannonball to rest
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
  //player 1's projectile
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
      sprite: {
        texture: './assets/images/cannonball.png'
      }
    }
  });
  //for resetting the cannonball position
  cannonBallAOrigin = { x: cannonBallA.position.x, y: cannonBallA.position.y };

  //player 2's projectile
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
      sprite: {
        texture: './assets/images/cannonball.png'
      }
    }
  });
  //for resetting the cannonball position
  cannonBallBOrigin = { x: cannonBallB.position.x, y: cannonBallB.position.y };

  //this is an optional game object that is placed halfway between the two cannons. Forces higher-angle gameplay.
  wall = Bodies.rectangle(cannonB.position.x - (cannonB.position.x - cannonA.position.x) / 2, groundPosition - ((render.options.height / 4) / 2), 50, render.options.height / 4, {
    isStatic: true,
    label: "wall",
    friction: 0,
    collisionFilter: {
      category: defaultCategory
    },
    render: {
      fillStyle: 'red',
      strokeStyle: 'black',
      lineWidth: 3,
      sprite: {
        texture: './assets/images/wall.png',
      }
    }
  });
  //creates our ground that cannonballs can hit with to register a miss
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
//adds all created objects to our world to interact with them
  World.add(engine.world, [cannonA, cannonB, launchPlatformA, launchPlatformB, cannonBallA, cannonBallB, ground]);
}
