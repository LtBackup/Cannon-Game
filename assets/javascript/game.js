var fireCannon = function () {
  var curentPlayer = $(this).attr("data-player");
  var gameId = $(this).attr("data-gameId");
  var angle = $(currentPlayer + "-angle").val();
  var power = $(currentPlayer + "-power").val();

  // set db stats
  setPlayerStats(gameId, currentPlayer, angle, power);

  // Firebase listeners

  var playerAngleRef = database.ref("games/" + gameId + "/" + currentPlayer + "/angle");
  var playerPowerRef = firebase.database().ref("games/" + gameId + "/" + currentPlayer + "/power");

  playerAngleRef.on("value", function(snapshot) {
    console.log(snapshot.val());
  });

  starCountRef.on("value", function(snapshot) {
    // do something
  });
}

// $("fireButton").on("click", fireCannon);
var ref = fireCannon();