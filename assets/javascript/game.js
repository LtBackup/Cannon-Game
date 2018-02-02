var fireCannon = function () {
  var curentPlayer = $(this).attr("data-player");
  var gameId = $(this).attr("data-gameId");
  var angleInput = $(currentPlayer + "-angle").val();
  var powerInput = $(currentPlayer + "-power").val();

  // set db stats
  updateAnglePower(gameId, currentPlayer, angleInput, powerInput);

  // Firebase listeners

  var playerAngleRef = database.ref("games/" + gameId + "/" + currentPlayer + "/angle");
  var playerPowerRef = database.ref("games/" + gameId + "/" + currentPlayer + "/power");

  playerAngleRef.on("value", function(snapshot) {
    console.log(snapshot.val());
  });

  starCountRef.on("value", function(snapshot) {
    // do something
  });

  // physics
  
  var shotsFired = readStat(gameId, currentPlayer, shotsFired);
  shotsFired++;
  updateShotsFired(gameId, currentPlayer, shotsFired);
  
}

$("fireButton").on("click", fireCannon);