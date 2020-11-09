// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import './CloneFactory.sol';
import './Match.sol';

contract Prode is CloneFactory, Ownable {
  Match[] public matchAddresses;

  address public matchImplementationContractAddress;

  constructor(address _matchImplementationContractAddress) public {
    matchImplementationContractAddress = _matchImplementationContractAddress;
  }

  function createMatch(string calldata _homeTeamId, string calldata _awayTeamId) external {
    Match newMatch = Match(
      createClone(matchImplementationContractAddress)
    );
    newMatch.initialize(_homeTeamId, _awayTeamId);

    matchAddresses.push(newMatch);
  }

  function getMatches() external view returns (Match[] memory) {
    return matchAddresses;
  }
}
