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
        if (direction === "west") {
            if (newGravity !== 0) {
                newGravity = -Math.abs(newGravity);
            }
        }
        updateWindInfo(window.gameInfo);
        console.log(newGravity + " from wind.js");
    });
}

