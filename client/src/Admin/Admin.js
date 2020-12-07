import * as React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import getUnixTime from 'date-fns/getUnixTime';

import MatchItem from './MatchItem';
import { useCacheCall, useCacheSend, useDrizzle } from '../drizzleHooks';

import 'react-datepicker/dist/react-datepicker.css';
import './admin.css';

registerLocale('es', es);

function Admin() {
  const [homeTeamName, setHomeTeamName] = React.useState('river');
  const [awayTeamName, setAwayTeamName] = React.useState('boca');
  const [startDateTime, setStartDateTime] = React.useState(new Date());

  const { drizzleState } = useDrizzle();

  const account = drizzleState.accounts[0];

  const { send } = useCacheSend('Prode', 'createMatch');
  const { value: matchesIds } = useCacheCall('Prode', 'getMatches');

  const createMatch = () => {
    send(homeTeamName, awayTeamName, getUnixTime(startDateTime), {
      from: account,
      gas: 300000,
    });
  };

  return (
    <div className="admin">
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
        <div>
          <span>Date and time:</span>
          <DatePicker
            selected={startDateTime}
            onChange={setStartDateTime}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={5}
            locale="es"
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
