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
        newGravity = windSpeed;
        // decides direction of wind
        //direction = dirs[Math.floor(Math.random() * dirs.length)];
        // IF WESTWIND
        // convert number to a negative number and set the appropriate background
        /* if (direction === "west") { */
        /*     if (newGravity !== 0) { */
        /*         newGravity = -Math.abs(newGravity); */
        /*     } */
        /*     canvasbg = "./assets/images/canvasbgwestwind.jpg"; */
        /*     render.options.background = canvasbg; */
        /* } */
        /* // IF EASTWIND */
        /* // set the appropriate background */
        /* else { */
        /*     canvasbg = "./assets/images/canvasbgeastwind.jpg"; */
        /*     render.options.background = canvasbg; */
        /* } */
        setGravityAndBg();
        updateWindInfo(window.gameInfo);
        console.log("the wind direction is: " + direction);
    });
}

function setGravityAndBg() {
  newGravity = windSpeed;
  if (direction === "west") {
      if (newGravity !== 0) {
          newGravity = -Math.abs(newGravity);
      }
      canvasbg = "./assets/images/canvasbgwestwind.jpg";
      render.options.background = canvasbg;
  }
  // IF EASTWIND
  // set the appropriate background
  else {
      canvasbg = "./assets/images/canvasbgeastwind.jpg";
      render.options.background = canvasbg;
  }
}

