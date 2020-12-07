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
    bool payed;
    MatchResult result;
    uint listPointer;
  }
  mapping (address => Bet) betsMap;
  address[] gamblers;

  string public homeTeamId;
  string public awayTeamId;
  uint public matchStartDate; // Unix timestamp depicting start date

  uint public jackpot = 0;
  uint public prizeAmount = 0; // Calculated after the final result is know, hold the amount of ether each winner will get

  // TODO: Temporaly store match result
  MatchResult public finalResult;

  /////////////////////
  //     Modifiers    //
  /////////////////////


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
    require(
      block.timestamp > (matchStartDate + 4 hours),
      'Bet cannot be collected yet'
    );
    require(
      finalResult.homeTeamScore > -1 && finalResult.awayTeamScore > -1,
      'Final result has not been loaded yet'
    );
    _;
  }

  modifier userHasPlacedBet() {
    // Validates a user has actually placed a bet for this match
    require(
      hasPlacedBet(msg.sender),
      'User has not placed any bet'
    );
    _;
  }

  // initialize function replaces constructor
  // check the Initializable contract for further information
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

  /////////////////////
  //  User functions //
  /////////////////////


  function placeBet(
    int16 homeTeamScore,
    int16 awayTeamScore
  ) public payable betsAreOpen {
    require(
      homeTeamScore > -1 && awayTeamScore > -1,
      'Score must be greater than or equal to 0'
    );

    if(hasPlacedBet(msg.sender)) {
      // If the user already placed a bet, override current result
      betsMap[msg.sender].result = MatchResult({
        homeTeamScore: homeTeamScore,
        awayTeamScore: awayTeamScore
      });
    } else {
      // If the users has not placed a bet, create and store a new bet
      gamblers.push(msg.sender);
      uint index = gamblers.length - 1;

      betsMap[msg.sender] = Bet({
        payed: false,
        result: MatchResult({
          homeTeamScore: homeTeamScore,
          awayTeamScore: awayTeamScore
        }),
        listPointer: index
      });
    }

    jackpot = jackpot + msg.value;
  }

  function hasPlacedBet(address user) public view returns(bool isIndeed) {
    if(gamblers.length == 0) return false;
    return (gamblers[betsMap[user].listPointer] == user);
  }

  function isBetSuccessful(
    int16 homeTeamScore,
    int16 awayTeamScore
  ) public view canCollectPrizes returns(bool isIndeed) {
    return finalResult.homeTeamScore == homeTeamScore && finalResult.awayTeamScore == awayTeamScore;
  }

  function claimBet() public canCollectPrizes userHasPlacedBet returns(bool) {
    Bet memory bet = betsMap[msg.sender];

    // If bet has not been paid yet and is successful
    if(
      !bet.payed &&
      isBetSuccessful(bet.result.homeTeamScore, bet.result.awayTeamScore)
    ) {
      // Mark bet as payed
      bet.payed = true;
      // Attemp sending money
      if(!msg.sender.send(prizeAmount)) {
        bet.payed = false;
        return false;
      }
    }

    return true;
  }

  /////////////////////
  // Admin functions //
  /////////////////////

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

    // Calculate amount to pay
    uint winnersCount = 0;

    for(uint i = 0; i < gamblers.length; i++) {
      // Count all the bets that were winning bets
      Bet memory currentBet = betsMap[gamblers[i]];
      if (isBetSuccessful(currentBet.result.homeTeamScore, currentBet.result.awayTeamScore)) {
        winnersCount = winnersCount + 1;
      }
    }

    // Validate there is at least one winner
    if(winnersCount > 0) {
      // uint division will round down the result
      prizeAmount = jackpot / winnersCount;
    }
  }
}
