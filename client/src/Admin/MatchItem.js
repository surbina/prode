import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

import Match from '../contracts/Match.json';
import { useCacheCall, useLoadContract } from '../drizzleHooks';

const getFinalResult = (homeTeamName, awayTeamName, currentBet) => {
  if (
    !currentBet ||
    (currentBet.homeTeamScore === '-1' && currentBet.awayTeamScore === '-1')
  ) {
    return 'El resultado final no está listo todavía';
  }

  return `${homeTeamName} ${currentBet.homeTeamScore} - ${awayTeamName} ${currentBet.awayTeamScore}`;
};
function MatchItem({ matchAddress }) {
  useLoadContract(Match, matchAddress);

  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');
  const { value: matchStartDate } = useCacheCall(
    matchAddress,
    'matchStartDate'
  );
  const { value: finalResult } = useCacheCall(matchAddress, 'finalResult');

  const startDate = fromUnixTime(parseInt(matchStartDate || 0, 10));

  return (
    <div className="match-item">
      <div className="match-data">
        <div>Id del partido: {matchAddress}</div>
        <div>Equipo local: {homeTeamName}</div>
        <div>Equipo visitante: {awayTeamName}</div>
        <div>
          Fecha y hora:{' '}
          {format(startDate, "d 'de' MMMM yyyy '-' HH:mm 'hr'", { locale: es })}
        </div>
        <div>
          Resultado final:{' '}
          {getFinalResult(homeTeamName, awayTeamName, finalResult)}
        </div>
        <Link to={`/admin/${matchAddress}`}>Completar resultado final</Link>
      </div>
    </div>
  );
}

MatchItem.propTypes = {
  matchAddress: PropTypes.string.isRequired,
};

export default MatchItem;
