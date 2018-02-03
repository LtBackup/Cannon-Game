describe("startGame", function() {
  it("should correctly set the values of window.gameInfo", function () {
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

describe("startGame", function() {
  it("should correctly set the values of window.gameInfo", function () {
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
