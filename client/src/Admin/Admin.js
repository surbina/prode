import * as React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import getUnixTime from 'date-fns/getUnixTime';
import { Link } from 'react-router-dom';

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
      <h3>Página de administración</h3>
      <div>
        <div>
          <span className="label">Equipo local</span>
          <input
            type="text"
            value={homeTeamName}
            onChange={({ target: { value } }) => setHomeTeamName(value)}
          />
        </div>
        <div>
          <span className="label">Equipo visitante</span>
          <input
            type="text"
            value={awayTeamName}
            onChange={({ target: { value } }) => setAwayTeamName(value)}
          />
        </div>
        <div>
          <span className="label">Fecha y Hora</span>
          <DatePicker
            selected={startDateTime}
            onChange={setStartDateTime}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={5}
            locale="es"
          />
        </div>
        <input type="button" onClick={createMatch} value="Crear partido" />
      </div>
      <div>
        <h4>Lista de partidos</h4>
        {(matchesIds || []).map((matchAddress) => (
          <MatchItem key={matchAddress} matchAddress={matchAddress} />
        ))}
      </div>
      <Link to="/">Volver a la pantalla inicial</Link>
    </div>
  );
}

export default Admin;
