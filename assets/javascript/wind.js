var appID = "&appid=cd2537336bd5be95e114a46e97d3ceef";
var cityName = "Chicago";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + appID;
var windSpeed;

/** 
 * getWindSpeed
 * queries the OpenWeatherMap API for weather data at a predefined location and 
 * retrieves just the wind speed represented in Beaufort scale. Sets this wind speed
 * to a global variable after making it a more manageable number for Matter.js physics. 
 * Also updates the database with the wind info.
 * @returns {undefined}
 * 
*/
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

/** 
 * setGravityAndBg
 * Based on the direction set, it sets either a negative value or a positive value
 * for gravity and sets the appropriate canvas background
 * @returns {undefined}
*/
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
 
/**
 * setWindFlag
 * setter for wind flag
 * @param {boolean} value 
 * @returns {undefined}
 */
function setWindFlag (value) {
  window.gameInfo.wind = value;
}

/**
 * setLGFlag
 * setter for low gravity flag as well as the gravity value
 * @param {boolean} value 
 * @returns {undefined}
 */
function setLGFlag(value) { 
    newGravity = 0.04;
    window.gameInfo.lowgravity = value;
    setLGBG();
}

/** 
 * setLGBG
 * Sets the background for low gravity games
 * @returns {undefined}
*/
function setLGBG() {
    canvasbg = "./assets/images/moonbg.png";
    render.options.background = canvasbg;
    firebaseBot.updateLowGravityInfo(window.gameInfo);
}

/**
 * setHGFlag
 * setter for high gravity flag as well as the gravity value
 * @param {boolean} value 
 * @returns {undefined}
 */
function setHGFlag(value) {
    newGravity = 3;
    window.gameInfo.highgravity = value;
    setHGBG();
}

/** 
 * setHGBG
 * Sets the background for high gravity games
 * @returns {undefined}
*/
function setHGBG() {
    canvasbg = "./assets/images/highgravity.jpg";
    render.options.background = canvasbg;
    firebaseBot.updateHighGravityInfo(window.gameInfo);
}

/** 
 * getWind
 * Getter for the wind flag. Returns the wind flag defined within window.gameInfo in game-data
 * @returns {boolean} wind
*/
function getWind() {
  return gameInfo.wind;
}

/**
 * setWallFlag
 * sets the wall flag within window.gameInfo in game-data
 * @param {boolean} value 
 * @returns {undefined}
 */
function setWallFlag (value) {
  window.gameInfo.wall = value;
}

/** 
 * getWall
 * Getter for the wall flag. Returns the wall flag defined within window.gameInfo in game-data
 * @returns {boolean} wall
*/
function getWall() {
  return gameInfo.wall;
}
