var appID = "&appid=cd2537336bd5be95e114a46e97d3ceef";
var cityName = "Chicago";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + appID;
var windSpeed;

function getWindSpeed() {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        windSpeed = response.wind.speed;
        newGravity = windSpeed * .15;
        setGravityAndBg();
        firebaseBot.updateWindInfo(window.gameInfo);
    });
}

function setGravityAndBg() {
  newGravity = windSpeed * .15;
  if (direction === "west") {
      if (newGravity !== 0) {
          newGravity = -Math.abs(newGravity);
      }
      canvasbg = "./assets/images/canvasbgwestwind.jpg";
      render.options.background = canvasbg;
  } else {
      canvasbg = "./assets/images/canvasbgeastwind.jpg";
      render.options.background = canvasbg;
  }
}
 
function setWindFlag (value) {
  window.gameInfo.wind = value;
}

function getWind() {
  return gameInfo.wind;
}

function setWallFlag (value) {
  window.gameInfo.wall = value;
}

function getWall() {
  return gameInfo.wall;
}
