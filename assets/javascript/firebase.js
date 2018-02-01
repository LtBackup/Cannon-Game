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

function createNewGame(timeStamp, playerOne, playerTwo) {
  firebase.database().ref('games/' + timeStamp).set({
    playerOne: playerOne,
    playerTwo: playerTwo
  });
}

var currentTime = 1517506801;
// Math.floor(Date.now() / 1000);

// createNewGame(currentTime, "JimBob", "Mina");