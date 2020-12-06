import * as React from 'react';
import { useParams, Link } from 'react-router-dom';

import MatchContractData from '../contracts/Match.json';
import {
  useLoadContract,
  useCacheCall,
  useCacheSend,
  useDrizzleState,
  useDrizzle,
} from '../drizzleHooks';

import './styles.css';

function Match() {
  const { matchAddress } = useParams();
  const formRef = React.useRef(null);

  useLoadContract(MatchContractData, matchAddress);

  const { drizzle } = useDrizzle();
  const account = useDrizzleState(({ accounts }) => accounts[0]);
  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');
  const { value: jackpot } = useCacheCall(matchAddress, 'jackpot');
  const { value: finalResult, isLoading: isLoadingFinalResult } = useCacheCall(
    matchAddress,
    'finalResult'
  );
  const { send: placeBet } = useCacheSend(matchAddress, 'placeBet');
  const { send: claimBet } = useCacheSend(matchAddress, 'claimBet');

  const homeTeamFinalScore =
    isLoadingFinalResult || finalResult.homeTeamScore === '-1'
      ? '-'
      : finalResult.homeTeamScore;
  const awayTeamFinalScore =
    isLoadingFinalResult || finalResult.awayTeamScore === '-1'
      ? '-'
      : finalResult.awayTeamScore;

  const handlePlaceBet = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    placeBet(formData.get('homeTeamScore'), formData.get('awayTeamScore'), {
      from: account,
      value: drizzle.web3.utils.toWei('1', 'ether'),
      gas: 300000,
    });
  };

  const handleClaimBet = (e) => {
    e.preventDefault();

    claimBet({
      from: account,
      gas: 300000,
    });
  };

  return (
    <div className="match">
      <h3>Match detail page</h3>
      <div>Home Team: {homeTeamName}</div>
      <div>Away Team: {awayTeamName}</div>
      <div>Jackpot: {drizzle.web3.utils.fromWei(`${jackpot || 0}`)} ether</div>
      <div>
        Final result: {homeTeamName} {homeTeamFinalScore} / {awayTeamName}{' '}
        {awayTeamFinalScore}{' '}
      </div>
      <div>
        <button type="button" onClick={handleClaimBet}>
          Claim bet
        </button>
      </div>

      <h4>Place bet</h4>
      <form ref={formRef} onSubmit={handlePlaceBet}>
        <label htmlFor="homeTeamScore">{homeTeamName}</label>
        <input
          id="homeTeamScore"
          name="homeTeamScore"
          type="number"
          defaultValue="0"
        />

        <label htmlFor="awayTeamScore">{awayTeamName}</label>
        <input
          id="awayTeamScore"
          name="awayTeamScore"
          type="number"
          defaultValue="0"
        />

        <input className="button" value="Place Bet" type="submit" />
      </form>
      <Link to="/matches">Go back to matches list</Link>
    </div>
  );
}

export default Match;
