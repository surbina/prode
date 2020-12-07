import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

import Match from '../contracts/Match.json';
import { useCacheCall, useLoadContract } from '../drizzleHooks';

function MatchRow({ matchAddress }) {
  useLoadContract(Match, matchAddress);

  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');
  const { value: matchStartDate } = useCacheCall(
    matchAddress,
    'matchStartDate'
  );

  const startDate = fromUnixTime(parseInt(matchStartDate || 0, 10));

  return (
    <tr>
      <td>{matchAddress}</td>
      <td>{homeTeamName}</td>
      <td>{awayTeamName}</td>
      <td>
        {format(startDate, "d 'de' MMMM yyyy '-' HH:mm 'hr'", { locale: es })}
      </td>
      <td>
        <Link to={`/matches/${matchAddress}`}>Place bet</Link>
      </td>
    </tr>
  );
}

MatchRow.propTypes = {
  matchAddress: PropTypes.string.isRequired,
};

export default MatchRow;
