import * as React from 'react';

import { useCacheCall } from '../drizzleHooks';
import MatchRow from './MatchRow';
import './styles.css';

function MatchList() {
  const { value } = useCacheCall('Prode', 'getMatches') || [];

  const matchesAddress = value || [];

  return (
    <div className="match-list">
      <h3>Bienvenido al tablero de partidos</h3>
      <table>
        <thead>
          <tr>
            <th>Id del partido</th>
            <th>Equipo local</th>
            <th>Equipo visitante</th>
            <th>Fecha y hora</th>
            <th>Acciones</th>
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
