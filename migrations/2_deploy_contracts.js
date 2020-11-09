var Match = artifacts.require("./Match.sol");
var Prode = artifacts.require("./Prode.sol");

module.exports = function(deployer) {
  deployer
    // Star by deploying the implementation contract
    .deploy(Match)
    .then(() => {
      // Once the implementation contract has been deployed we need to deploy the factory
      return deployer.deploy(Prode, Match.address);
    });
};
