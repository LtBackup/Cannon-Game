describe("startGame", function() {
  it("should correctly set the values of window.gameInfo whena new game is created", function () {
    startGame();
    expect(window.gameInfo.player).toBe("playerOne");
    expect(window.gameInfo.opponent).toBe("playerTwo");
    expect(typeof window.gameInfo.gameId).toBe("number");
  });


  it("should only change gameId from default values", function () {
    startGame();
    expect(window.gameInfo.player).toBe("playerOne");
    expect(window.gameInfo.opponent).toBe("playerTwo");
    expect(window.gameInfo.gameId === 1).toBeFalsy();
  });
})

describe("joinGame", function() {
  beforeEach(function(done) {
    var newGameId = 1;
    joinGame(newGameId, database);
    setTimeout(function() {
      done();
    }, 2000);
  });
  it("should correctly set the values of window.gameInfo when joining an existing game", function () {
    expect(window.gameInfo.player).toBe("playerTwo");
    expect(window.gameInfo.opponent).toBe("playerOne");
    expect(typeof window.gameInfo.gameId).toBe("number");
  });
})
