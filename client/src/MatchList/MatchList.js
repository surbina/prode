import * as React from 'react';

import { useCacheCall } from '../drizzleHooks';
import MatchRow from './MatchRow';
import './styles.css';

function MatchList() {
  const { value } = useCacheCall('Prode', 'getMatches') || [];

  const matchesAddress = value || [];

  return (
    <div className="match-list">
      <h3>Welcome to the board of matches</h3>
      <table>
        <thead>
          <tr>
            <th>Match Address</th>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matchesAddress.map((matchAddress) => (
            <MatchRow key={matchAddress} matchAddress={matchAddress} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchList;
