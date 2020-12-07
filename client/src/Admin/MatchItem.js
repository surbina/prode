import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

import Match from '../contracts/Match.json';
import { useCacheCall, useLoadContract } from '../drizzleHooks';
function MatchItem({ matchAddress }) {
  useLoadContract(Match, matchAddress);

  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');
  const { value: matchStartDate } = useCacheCall(
    matchAddress,
    'matchStartDate'
  );
  const { value: finalResult, isLoading: isLoadingFinalResult } = useCacheCall(
    matchAddress,
    'finalResult'
  );

  const homeTeamFinalScore =
    isLoadingFinalResult || finalResult.homeTeamScore === '-1'
      ? '-'
      : finalResult.homeTeamScore;
  const awayTeamFinalScore =
    isLoadingFinalResult || finalResult.awayTeamScore === '-1'
      ? '-'
      : finalResult.awayTeamScore;

  const startDate = fromUnixTime(parseInt(matchStartDate || 0, 10));

  return (
    <div className="match-item">
      <div className="match-data">
        <div>Match Address: {matchAddress}</div>
        <div>Home Team: {homeTeamName}</div>
        <div>Away Team: {awayTeamName}</div>
        <div>
          Date:{' '}
          {format(startDate, "d 'de' MMMM yyyy '-' HH:mm 'hr'", { locale: es })}
        </div>
        <div>
          Final result: {homeTeamName} {homeTeamFinalScore} / {awayTeamName}{' '}
          {awayTeamFinalScore}{' '}
        </div>
        <Link to={`/admin/${matchAddress}`}>Set Final Score</Link>
      </div>
    </div>
  );
}

MatchItem.propTypes = {
  matchAddress: PropTypes.string.isRequired,
};

export default MatchItem;
