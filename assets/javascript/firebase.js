// Initialize Firebase
var config = {
  apiKey: "AIzaSyD5Ev0o5EoYJiOBuHUVePoe22x-Nssfqd0",
  authDomain: "cannon-game.firebaseapp.com",
  databaseURL: "https://cannon-game.firebaseio.com",
  projectId: "cannon-game",
  storageBucket: "",
  messagingSenderId: "500614387480"
};
firebase.initializeApp(config);

var database = firebase.database();

function createNewGame(timeStamp) {
  database.ref('games/' + timeStamp).set({
    playerOne: {angle: 0,
                power: 0,
                shotsFired: 0},
    playerTwo: {angle: 0,
                power: 0,
                shotsFired: 0}
  });
}

function setPlayerStats(timeStamp, player, angle, power) {
  database.ref('games/' + timeStamp + "/" + player).set({
    angle: angle,
    power: power,
    shotsFired: 0 
  });
}

var currentTime = 1517506801;
// Math.floor(Date.now() / 1000);

// createNewGame(currentTime);

setPlayerStats(currentTime, "playerOne", 45, 70);