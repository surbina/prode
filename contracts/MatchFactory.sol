// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// import './Mathch.sol';
import '../node_modules/@openzeppelin/upgrades/contracts/upgradeability/ProxyFactory.sol';

contract MatchFactory is ProxyFactory {
  address public matchImplementation;

  constructor (address _matchImplementation) public {
    matchImplementation = _matchImplementation;
  }

  function createMatch(bytes memory _data) public returns (address) {
    address newMatchProxy = deployMinimal(matchImplementation, _data);

    return newMatchProxy;
  }
}
