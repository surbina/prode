// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '../node_modules/@openzeppelin/contracts/proxy/Initializable.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract Match is Initializable, Ownable {
  // TODO: add contract status in case a Match is suspended
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
  uint public matchStartDate; // Unix timestamp depicting start date

  Bet[] bets; // Using a list allows for a user to make multiple bets
  uint public jackpot = 0;

  // TODO: Temporaly store match result
  MatchResult public finalResult;

  modifier betsAreOpen() {
    // Users can place bet up to one hour before the match starts
    // This is because when creating a block a node can select as timestamp a value that's up to 15 minutes in the future
    require(
      block.timestamp < (matchStartDate - 1 hours),
      'Bets are closed'
    );
    _;
  }

  modifier canCollectPrizes() {
    // Users can claim bets 4 hours after the match hast started
    // This is because the time a match ends is not know in advance and because
    // When creating a block a node can select as timestamp a value that's up to 15 minutes in the future
    require(block.timestamp > (matchStartDate + 4 hours));
    require(
      finalResult.homeTeamScore > -1 && finalResult.awayTeamScore > -1,
      'Final result has not been loaded yet'
    );
    _;
  }

  function initialize(
    string memory _homeTeamId,
    string memory _awayTeamId,
    uint _matchStartDate
  ) public onlyOwner initializer {
    require(_matchStartDate > 0, 'Match start date must be greater than 0');

    homeTeamId = _homeTeamId;
    awayTeamId = _awayTeamId;
    matchStartDate = _matchStartDate;

    // Init final result with negatives values
    finalResult = MatchResult({
      homeTeamScore: -1,
      awayTeamScore: -1
    });
  }

  function placeBet(
    int16 homeTeamScore,
    int16 awayTeamScore
  ) public payable betsAreOpen {
    require(
      homeTeamScore > -1 && awayTeamScore > -1,
      'Score must be greater than or equal to 0'
    );

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

  function claimBet() public canCollectPrizes returns(bool) {
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

  function setFinalResult(
    int16 homeTeamScore,
    int16 awayTeamScore
  ) public onlyOwner {
    require(
      homeTeamScore > -1 && awayTeamScore > -1,
      "Score must be greater than or equal to 0"
    );
  
    finalResult = MatchResult({
      homeTeamScore: homeTeamScore,
      awayTeamScore: awayTeamScore
    });
  }
}
