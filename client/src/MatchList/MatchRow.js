import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Match from '../contracts/Match.json';
import { useCacheCall, useLoadContract } from '../drizzleHooks';

function MatchRow({ matchAddress }) {
  useLoadContract(Match, matchAddress);

  const { value: homeTeamName } = useCacheCall(matchAddress, 'homeTeamId');
  const { value: awayTeamName } = useCacheCall(matchAddress, 'awayTeamId');

  return (
    <tr>
      <td>{matchAddress}</td>
      <td>{homeTeamName}</td>
      <td>{awayTeamName}</td>
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
