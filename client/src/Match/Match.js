import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

import MatchContractData from '../contracts/Match.json';
import {
  useLoadContract,
  useCacheCall,
  useCacheSend,
  useDrizzleState,
  useDrizzle,
} from '../drizzleHooks';

import './styles.css';

const getCurrentBet = (homeTeamName, awayTeamName, currentBet) => {
  if (
    !currentBet ||
    (currentBet.homeTeamScore === '-1' && currentBet.awayTeamScore === '-1')
  ) {
    return 'Todavía no has realizado apuestas en este partido';
  }

  return `${homeTeamName} ${currentBet.homeTeamScore} - ${awayTeamName} ${currentBet.awayTeamScore}`;
};

const getFinalResult = (homeTeamName, awayTeamName, currentBet) => {
  if (
    !currentBet ||
    (currentBet.homeTeamScore === '-1' && currentBet.awayTeamScore === '-1')
  ) {
    return 'El resultado final no está listo todavía';
  }

  return `${homeTeamName} ${currentBet.homeTeamScore} - ${awayTeamName} ${currentBet.awayTeamScore}`;
};

function Match() {
  const { matchAddress } = useParams();
  const formRef = React.useRef(null);

  useLoadContract(MatchContractData, matchAddress);

  const { drizzle } = useDrizzle();
  const account = useDrizzleState(({ accounts }) => accounts[0]);
  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');
  const { value: jackpot } = useCacheCall(matchAddress, 'jackpot');
  const { value: matchStartDate } = useCacheCall(
    matchAddress,
    'matchStartDate'
  );
  const { value: currentBet } = useCacheCall(matchAddress, 'getCurrentBet');
  const { value: finalResult } = useCacheCall(matchAddress, 'finalResult');
  const { send: placeBet } = useCacheSend(matchAddress, 'placeBet');
  const { send: claimBet } = useCacheSend(matchAddress, 'claimBet');

  const startDate = fromUnixTime(parseInt(matchStartDate || 0, 10));

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
      <h3>Detalle de partido</h3>
      <div>Equipo local: {homeTeamName}</div>
      <div>Equipo visitante: {awayTeamName}</div>
      <div>
        Fecha y hora:{' '}
        {format(startDate, "d 'de' MMMM yyyy '-' HH:mm 'hr'", { locale: es })}
      </div>
      <div>Pozo: {drizzle.web3.utils.fromWei(`${jackpot || 0}`)} ether</div>
      <div>
        Última apuesta: {getCurrentBet(homeTeamName, awayTeamName, currentBet)}
      </div>
      <div>
        Resultado final:{' '}
        {getFinalResult(homeTeamName, awayTeamName, finalResult)}
      </div>
      <div>
        <button type="button" onClick={handleClaimBet}>
          Reclamar apuesta
        </button>
      </div>

      <h4>Realizar apuesta</h4>
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

        <input className="button" value="Apostar" type="submit" />
      </form>
      <Link to="/matches">Volver a la lista de partidos</Link>
    </div>
  );
}

export default Match;
