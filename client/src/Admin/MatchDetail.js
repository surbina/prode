import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

import MatchContractData from '../contracts/Match.json';
import {
  useDrizzle,
  useLoadContract,
  useCacheCall,
  useCacheSend,
  useDrizzleState,
} from '../drizzleHooks';

import './matchDetail.css';

function MatchDetail() {
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
  const { send: setFinalResult } = useCacheSend(matchAddress, 'setFinalResult');

  const startDate = fromUnixTime(parseInt(matchStartDate || 0, 10));

  const handleSetFinalResult = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    setFinalResult(
      formData.get('homeTeamScore'),
      formData.get('awayTeamScore'),
      {
        from: account,
        gas: 300000,
      }
    );
  };

  return (
    <div className="match-detail">
      <h3>Detalle de partido</h3>
      <div>Equipo local: {homeTeamName}</div>
      <div>Equipo visitante: {awayTeamName}</div>
      <div>
        Fecha y hora:{' '}
        {format(startDate, "d 'de' MMMM yyyy '-' HH:mm 'hr'", { locale: es })}
      </div>
      <div>Pozo: {drizzle.web3.utils.fromWei(`${jackpot || 0}`)} ether</div>

      <h4>Configurar resultado final</h4>
      <form ref={formRef} onSubmit={handleSetFinalResult}>
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

        <input value="Set final result" type="submit" />
      </form>
      <Link to="/admin">Volver a la pantalla de administración</Link>
    </div>
  );
}

export default MatchDetail;
