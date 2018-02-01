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

function createNewGame(gameId) {
  database.ref('games/' + gameId).set({
    playerOne: {angle: 0,
                power: 0,
                shotsFired: 0},
    playerTwo: {angle: 0,
                power: 0,
                shotsFired: 0}
  });
}

function setPlayerStats(gameId, player, angle, power) {
  database.ref('games/' + timeStamp + "/" + player).set({
    angle: angle,
    power: power,
    shotsFired: 0 
  });
}
