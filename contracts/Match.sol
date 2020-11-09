// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '../node_modules/@openzeppelin/contracts/proxy/Initializable.sol';

contract Match is Initializable {
  struct MatchResult {
    uint16 homeTeamScore;
    uint16 awayTeamScore;
  }

  struct Bet {
    address payable author;
    bool payed;
    MatchResult result;
  }

  string public homeTeamId;
  string public awayTeamId;
  // uint public matchStartDate; // Unix timestamp depicting start date
  // uint public matchEndDate; // Unix timestamp depicting end date
  Bet[] bets; // Using a list allows for a user to make multiple bets
  uint public jackpot = 0;

  // TODO: Temporaly store match result
  MatchResult public finalResult;

  // TODO: implement modifiers!
  // modifier matchHasNotStarted() { require(block.timestamp < time); _; }
  // modifier matchHasEnded() { require(block.timestamp > time); _; }

  // constructor(string _homeTeamId, string _awayTeamId, uint _matchStartDate, uint _matchEndDate) {
  // constructor(string memory _homeTeamId, string memory _awayTeamId) public {
  //   homeTeamId = _homeTeamId;
  //   awayTeamId = _awayTeamId;
  //   // matchStartDate = _matchStartDate;
  //   // matchEndDate = _matchEndDate;
  // }

  function initialize(string memory _homeTeamId, string memory _awayTeamId) public initializer {
    homeTeamId = _homeTeamId;
    awayTeamId = _awayTeamId;
  }

  function placeBet(uint16 homeTeamScore, uint16 awayTeamScore) public payable {
    bets.push(Bet({
      result: MatchResult({
        homeTeamScore: homeTeamScore,
        awayTeamScore: awayTeamScore
      }),
      author: msg.sender,
      payed: false
    }));

    jackpot = jackpot + msg.value;
  }

  function claimBet() public returns(bool) {
    // TODO: require match end
  
    uint selectedBetIndex = 0;
    bool found = false;

    for(uint i = 0; i < bets.length; i++) {
      // Find bet
      // - author === to sender
      // - bet result === finalResult
      // - not payed
      Bet storage currentBet = bets[i];
      if (
        currentBet.author == msg.sender &&
        currentBet.result.homeTeamScore == finalResult.homeTeamScore &&
        currentBet.result.awayTeamScore == finalResult.awayTeamScore &&
        !currentBet.payed
      ) {
        found = true;
        selectedBetIndex = i;
        break;
      }
    }

    // If a bet was found
    if(found) {
      Bet storage selectedBet = bets[selectedBetIndex];

      // Mark bet as payed
      selectedBet.payed = true;

      if(!msg.sender.send(jackpot)) {
        selectedBet.payed = false;
        return false;
      }
    }

    return true;
  }

  function setFinalResult(uint16 homeTeamScore, uint16 awayTeamScore) public {
    // test
    finalResult = MatchResult({
      homeTeamScore: homeTeamScore,
      awayTeamScore: awayTeamScore
    });
  }
}
