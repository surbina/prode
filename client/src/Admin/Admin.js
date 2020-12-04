import * as React from 'react';

import MatchItem from './MatchItem';
import { useCacheCall, useCacheSend, useDrizzle } from '../drizzleHooks';

function Admin() {
  const [homeTeamName, setHomeTeamName] = React.useState('river');
  const [awayTeamName, setAwayTeamName] = React.useState('boca');

  const { drizzleState } = useDrizzle();

  const account = drizzleState.accounts[0];

  const { send } = useCacheSend('Prode', 'createMatch');
  const { value: matchesIds } = useCacheCall('Prode', 'getMatches');

  const createMatch = () => {
    send(homeTeamName, awayTeamName, {
      from: account,
      gas: 300000,
    });
  };

  return (
    <div>
      <h3>Admin page</h3>
      <div>
        <div>
          <span>Home team name</span>
          <input
            type="text"
            value={homeTeamName}
            onChange={({ target: { value } }) => setHomeTeamName(value)}
          />
        </div>
        <div>
          <span>Away team name</span>
          <input
            type="text"
            value={awayTeamName}
            onChange={({ target: { value } }) => setAwayTeamName(value)}
          />
        </div>
        <input type="button" onClick={createMatch} value="Create match" />
      </div>
      <div>
        <h4>List of matches</h4>
        {(matchesIds || []).map((matchAddress) => (
          <MatchItem key={matchAddress} matchAddress={matchAddress} />
        ))}
      </div>
    </div>
  );
}

export default Admin;
