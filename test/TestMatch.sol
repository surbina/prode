pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Match.sol";

contract TestMatch {

  function testItStoresAValue() public {
    Mathc match = Match(DeployedAddresses.Match());

    match.set(89);

    uint expected = 89;

    Assert.equal(match.get(), expected, "It should store the value 89.");
  }

}
