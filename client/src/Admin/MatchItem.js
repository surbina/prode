import * as React from 'react';
import PropTypes from 'prop-types';
import Match from '../contracts/Match.json';
import { useCacheCall, useLoadContract } from '../drizzleHooks';

function MatchItem({ matchAddress }) {
  useLoadContract(Match, matchAddress);

  const homeTeamName = useCacheCall(matchAddress, 'homeTeamId');
  const awayTeamName = useCacheCall(matchAddress, 'awayTeamId');

  return (
    <div>
      <div>match address: {matchAddress}</div>
      <div>home team: {homeTeamName}</div>
      <div>away team: {awayTeamName}</div>
    </div>
  );
}

MatchItem.propTypes = {
  matchAddress: PropTypes.string.isRequired,
};

export default MatchItem;
