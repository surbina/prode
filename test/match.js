const Match = artifacts.require("./Match.sol");

contract("Match", accounts => {
  it("...should store the value 89.", async () => {
    const matchInstance = await Match.deployed();

    // Set value of 89
    await matchInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await matchInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
