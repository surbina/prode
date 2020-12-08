import * as React from 'react';
import { Link } from 'react-router-dom';

import './splash-screen.css';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <h2>Sistema de apuestas - Prueba de concepto</h2>
      <div className="tiles">
        <div className="tile admin-tile">
          <Link to="/admin">Panel de administración</Link>
          <p>Desde este panel podrá:</p>
          <ul>
            <li>Crear partidos</li>
            <li>Acceder a un listado de partidos creados</li>
            <li>Configurar el resultado final de un partido</li>
          </ul>
        </div>
        <div className="tile">
          <Link to="/matches">Vista de usuario</Link>
          <p>Desde esta pantalla podrá</p>
          <ul>
            <li>Acceder al listado de partidos creados</li>
            <li>Colocar apuestas para cada partido</li>
            <li>Reclamar apuestas ganadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
