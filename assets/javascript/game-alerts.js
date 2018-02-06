function alertPOneMiss(gameInfo) {
  if (gameInfo.player === "playerOne") {
    $(".info").text("You missed!")
  } else {
    $(".info").text("Player One missed!")
  }
}

function alertPTwoMiss(gameInfo) {
  if (gameInfo.player === "playerTwo") {
    $(".info").text("You missed!")
  } else {
    $(".info").text("Player Two missed!")
  }
}

function alertPOneWin(gameInfo) {
  if (gameInfo.player === "playerOne") {
    $(".info").text("You WIN!")
  } else {
    $(".info").text("You LOSE...")
  }
}

function alertPTwoWin(gameInfo) {
  if (gameInfo.player === "playerTwo") {
    $(".info").text("You WIN!")
  } else {
    $(".info").text("You LOSE...")
  }
}
