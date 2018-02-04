window.gameInfo = {
  player: "playerOne",
  gameId: 1,
  opponent: "playerTwo",
};

var angle;
var power;

function joinGame(newGameId, db) {
    db.ref("games/" + newGameId).once("value").then(function (snap) {
        if (snap.val()) {
            window.gameInfo = {
                player: "playerTwo",
                gameId: newGameId,
                opponent: "playerOne",
            };
            // TODO: close modal
            $(".overlay").addClass("hidden");
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
    $(".overlay").addClass("hidden");
}

var fireCannon = function (gameInfo) {
    var currentPlayer = gameInfo.player;
    var gameId = gameInfo.gameId;
    var angleInput = Number($("#" + currentPlayer + "-angle").val());
    var powerInput = Number($("#" + currentPlayer + "-power").val());


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
