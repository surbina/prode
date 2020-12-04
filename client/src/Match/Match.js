import * as React from 'react';
import { useParams } from 'react-router-dom';

import MatchContractData from '../contracts/Match.json';
import {
  useLoadContract,
  useCacheCall,
  useCacheSend,
  useDrizzleState,
} from '../drizzleHooks';

import './styles.css';

function Match() {
  const { matchAddress } = useParams();
  const formRef = React.useRef(null);

  useLoadContract(MatchContractData, matchAddress);

  const account = useDrizzleState(({ accounts }) => accounts[0]);
  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');
  const { value: jackpot } = useCacheCall(matchAddress, 'jackpot');
  const { value: finalResult } = useCacheCall(matchAddress, 'finalResult');
  const { send: placeBet } = useCacheSend(matchAddress, 'placeBet');

  console.log({ finalResult });

  const handlePlaceBet = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    // console.log({
    //   formData,
    //   home: formData.get('homeTeamScore'),
    //   away: formData.get('awayTeamScore'),
    // });

    placeBet(formData.get('homeTeamScore'), formData.get('awayTeamScore'), {
      from: account,
      gas: 300000,
    });
  };

  return (
    <div className="match">
      <h3>Match detail page</h3>
      <div>Home Team: {homeTeamName}</div>
      <div>Away Team: {awayTeamName}</div>
      <div>Jackpot: {jackpot}</div>
      <div>Final Result: {JSON.stringify(finalResult)}</div>

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

        <input name="Place Bet" type="submit" />
      </form>
    </div>
  );
}

export default Match;
