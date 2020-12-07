// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '../node_modules/@openzeppelin/contracts/proxy/Initializable.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract Match is Initializable, Ownable {
  struct MatchResult {
    int16 homeTeamScore;
    int16 awayTeamScore;
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

  function initialize(string memory _homeTeamId, string memory _awayTeamId) public initializer {
    homeTeamId = _homeTeamId;
    awayTeamId = _awayTeamId;

    // Init final result with negatives values
    finalResult = MatchResult({
      homeTeamScore: -1,
      awayTeamScore: -1
    });
  }

  function placeBet(int16 homeTeamScore, int16 awayTeamScore) public payable {
    require(homeTeamScore > -1, "Home Team Score must be greater than or equal to 0");
    require(awayTeamScore > -1, "Away Team Score must be greater than or equal to 0");

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

  function setFinalResult(int16 homeTeamScore, int16 awayTeamScore) public {
    require(homeTeamScore > -1, "Home Team Score must be greater than or equal to 0");
    require(awayTeamScore > -1, "Away Team Score must be greater than or equal to 0");
  
    finalResult = MatchResult({
      homeTeamScore: homeTeamScore,
      awayTeamScore: awayTeamScore
    });
  }
}
